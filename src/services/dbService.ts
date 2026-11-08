import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Order } from '../types';
import { initialProducts, initialOrders } from '../data/initialData';

// Helper to remove any undefined fields recursively so Firestore setDoc never throws
export function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.filter((item) => item !== undefined).map(cleanForFirestore);
  }
  if (typeof obj === 'object') {
    const res: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        // Guard against Firestore 1MB document limit: omit massive strings (e.g. huge base64 raw binary)
        if (typeof value === 'string' && value.length > 500000) {
          if (key === 'fileData') {
            continue; // Skip inline binary file to keep doc size small
          }
          if (key === 'imageUrl') {
            // Keep fallback image if data URI is absurdly large
            res[key] = '/assets/images/creox_hero_showcase_1793972157432.jpg';
            continue;
          }
        }
        res[key] = cleanForFirestore(value);
      }
    }
    return res;
  }
  return obj;
}

// --- PRODUCTS ---

export const getFirestoreProducts = async (): Promise<Product[]> => {
  try {
    // Check if system initial seed flag has been recorded
    const initDoc = await getDoc(doc(db, 'settings', 'system_init'));
    const isSeeded = initDoc.exists() && initDoc.data()?.seeded;

    const snap = await getDocs(collection(db, 'products'));
    const list: Product[] = [];
    snap.forEach((d) => list.push(d.data() as Product));

    if (list.length > 0) {
      if (!isSeeded) {
        // Ensure flag is saved so subsequent complete deletions are respected
        setDoc(doc(db, 'settings', 'system_init'), { seeded: true, seededAt: new Date().toISOString() }, { merge: true }).catch(() => {});
      }
      return list;
    }

    // List is currently empty in Firestore:
    // Only seed on the very first visit if NEVER initialized before
    const localSaved = localStorage.getItem('creox_saved_products');
    const hasLocalKey = localSaved !== null;

    if (!isSeeded && !hasLocalKey) {
      for (const prod of initialProducts) {
        await setDoc(doc(db, 'products', prod.id), cleanForFirestore(prod));
      }
      await setDoc(doc(db, 'settings', 'system_init'), {
        seeded: true,
        seededAt: new Date().toISOString(),
      });
      try {
        localStorage.setItem('creox_saved_products', JSON.stringify(initialProducts));
      } catch {}
      return initialProducts;
    }

    // User explicitly deleted products or system already seeded — do NOT auto-reseed!
    return [];
  } catch (err) {
    console.warn('Firestore getProducts error, falling back to local cache:', err);
    try {
      const saved = localStorage.getItem('creox_saved_products');
      return saved !== null ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  }
};

export const subscribeFirestoreProducts = (callback: (products: Product[]) => void) => {
  try {
    return onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const list: Product[] = [];
        snapshot.forEach((d) => list.push(d.data() as Product));

        if (list.length === 0) {
          getDoc(doc(db, 'settings', 'system_init')).then((initDoc) => {
            const isSeeded = initDoc.exists() && initDoc.data()?.seeded;
            const hasLocalKey = localStorage.getItem('creox_saved_products') !== null;
            if (!isSeeded && !hasLocalKey) {
              getFirestoreProducts().then(callback);
            } else {
              // Deliberately empty catalog after deletions
              try {
                localStorage.setItem('creox_saved_products', JSON.stringify([]));
              } catch {}
              callback([]);
            }
          }).catch(() => {
            callback([]);
          });
        } else {
          try {
            localStorage.setItem('creox_saved_products', JSON.stringify(list));
          } catch {}
          callback(list);
        }
      },
      (err) => {
        console.warn('Products onSnapshot error:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to products:', err);
    return () => {};
  }
};

export const saveFirestoreProduct = async (product: Product): Promise<void> => {
  const cleaned = cleanForFirestore(product);

  // Update local cache immediately
  try {
    const saved = localStorage.getItem('creox_saved_products');
    const list: Product[] = saved !== null ? JSON.parse(saved) : [];
    const idx = list.findIndex((p) => p.id === product.id);
    if (idx !== -1) {
      list[idx] = product;
    } else {
      list.unshift(product);
    }
    localStorage.setItem('creox_saved_products', JSON.stringify(list));
  } catch {}

  // Mark system_init as permanently seeded
  try {
    await setDoc(doc(db, 'settings', 'system_init'), { seeded: true, updatedAt: new Date().toISOString() }, { merge: true });
  } catch {}

  // Cloud Firestore permanent write
  try {
    await setDoc(doc(db, 'products', product.id), cleaned);
  } catch (err) {
    console.error('Failed to save product to Firestore:', err);
    throw err;
  }
};

export const deleteFirestoreProduct = async (productId: string): Promise<void> => {
  // Update local cache immediately
  try {
    const saved = localStorage.getItem('creox_saved_products');
    if (saved !== null) {
      const list: Product[] = JSON.parse(saved);
      const remaining = list.filter((p) => p.id !== productId);
      localStorage.setItem('creox_saved_products', JSON.stringify(remaining));
    }
  } catch {}

  // Mark system_init as permanently seeded so empty list never resurrects initialProducts
  try {
    await setDoc(doc(db, 'settings', 'system_init'), { seeded: true, updatedAt: new Date().toISOString() }, { merge: true });
  } catch {}

  // Cloud Firestore permanent delete
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
    throw err;
  }
};

// --- ORDERS ---

export const getFirestoreOrders = async (): Promise<Order[]> => {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    if (!snap.empty) {
      const list: Order[] = [];
      snap.forEach((d) => list.push(d.data() as Order));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    }

    const saved = localStorage.getItem('creox_saved_orders');
    return saved !== null ? JSON.parse(saved) : initialOrders;
  } catch (err) {
    console.warn('Firestore getOrders error:', err);
    try {
      const saved = localStorage.getItem('creox_saved_orders');
      return saved !== null ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  }
};

export const subscribeFirestoreOrders = (callback: (orders: Order[]) => void) => {
  try {
    return onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const list: Order[] = [];
        snapshot.forEach((d) => list.push(d.data() as Order));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(list);
      },
      (err) => {
        console.warn('Orders onSnapshot error:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to orders:', err);
    return () => {};
  }
};

export const saveFirestoreOrder = async (order: Order): Promise<void> => {
  const cleaned = cleanForFirestore(order);

  try {
    const saved = localStorage.getItem('creox_saved_orders');
    const list: Order[] = saved ? JSON.parse(saved) : [];
    localStorage.setItem('creox_saved_orders', JSON.stringify([order, ...list.filter((o) => o.id !== order.id)]));
  } catch {}

  try {
    await setDoc(doc(db, 'orders', order.id), cleaned);
  } catch (err) {
    console.error('Failed to save order to Firestore:', err);
  }
};

export const deleteFirestoreOrder = async (orderId: string): Promise<void> => {
  try {
    const saved = localStorage.getItem('creox_saved_orders');
    if (saved) {
      const list: Order[] = JSON.parse(saved);
      const remaining = list.filter((p) => p.id !== orderId && p.orderNumber !== orderId);
      localStorage.setItem('creox_saved_orders', JSON.stringify(remaining));
    }
  } catch {}

  try {
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (err) {
    console.error('Failed to delete order from Firestore:', err);
  }
};

// --- SETTINGS (bKash Configuration) ---

export const getFirestoreBkashConfig = async (): Promise<any> => {
  try {
    const snap = await getDoc(doc(db, 'settings', 'bkash'));
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('Firestore bkash config error:', err);
  }

  try {
    const saved = localStorage.getItem('creox_bkash_config');
    if (saved) return JSON.parse(saved);
  } catch {}

  return {
    receiverNumber: '01988123793',
    accountType: 'personal',
    merchantName: 'CREOX DIGITAL LIMITED',
    instructions: 'Send Money to 01988123793 and enter your Transaction ID (TrxID) below for instant automated product delivery.',
  };
};

export const saveFirestoreBkashConfig = async (config: any): Promise<void> => {
  const cleaned = cleanForFirestore(config);
  try {
    localStorage.setItem('creox_bkash_config', JSON.stringify(config));
  } catch {}

  try {
    await setDoc(doc(db, 'settings', 'bkash'), cleaned);
  } catch (err) {
    console.error('Failed to save bkash config to Firestore:', err);
  }
};
