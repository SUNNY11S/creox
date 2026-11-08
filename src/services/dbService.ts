import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Order, Category } from '../types';
import { initialProducts, initialCategories, initialOrders } from '../data/initialData';

// --- PRODUCTS ---

export const getFirestoreProducts = async (): Promise<Product[]> => {
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (!snap.empty) {
      const list: Product[] = [];
      snap.forEach((d) => list.push(d.data() as Product));
      return list;
    }

    // Auto-seed initial products to Firestore on first launch
    for (const prod of initialProducts) {
      await setDoc(doc(db, 'products', prod.id), prod);
    }
    return initialProducts;
  } catch (err) {
    console.error('Firestore getProducts error, falling back to local storage:', err);
    try {
      const saved = localStorage.getItem('creox_saved_products');
      return saved ? JSON.parse(saved) : initialProducts;
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
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((d) => list.push(d.data() as Product));
          callback(list);
        } else {
          // If empty in Firestore, trigger initial seed
          getFirestoreProducts().then(callback);
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
  // Always update local cache for offline/instant speed
  try {
    const saved = localStorage.getItem('creox_saved_products');
    const list: Product[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((p) => p.id === product.id);
    if (idx !== -1) {
      list[idx] = product;
    } else {
      list.unshift(product);
    }
    localStorage.setItem('creox_saved_products', JSON.stringify(list));
  } catch {
    // ignore
  }

  // Cloud Firestore permanent sync
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch (err) {
    console.error('Failed to save product to Firestore:', err);
  }
};

export const deleteFirestoreProduct = async (productId: string): Promise<void> => {
  // Always update local cache
  try {
    const saved = localStorage.getItem('creox_saved_products');
    if (saved) {
      const list: Product[] = JSON.parse(saved);
      const remaining = list.filter((p) => p.id !== productId);
      localStorage.setItem('creox_saved_products', JSON.stringify(remaining));
    }
  } catch {
    // ignore
  }

  // Cloud Firestore permanent delete
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
  }
};

// --- ORDERS ---

export const getFirestoreOrders = async (): Promise<Order[]> => {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    if (!snap.empty) {
      const list: Order[] = [];
      snap.forEach((d) => list.push(d.data() as Order));
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    }

    // If empty in Firestore, check if localStorage has orders
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
        if (!snapshot.empty) {
          const list: Order[] = [];
          snapshot.forEach((d) => list.push(d.data() as Order));
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          callback(list);
        }
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
  // Local cache
  try {
    const saved = localStorage.getItem('creox_saved_orders');
    const list: Order[] = saved ? JSON.parse(saved) : [];
    localStorage.setItem('creox_saved_orders', JSON.stringify([order, ...list.filter((o) => o.id !== order.id)]));
  } catch {
    // ignore
  }

  // Cloud Firestore
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (err) {
    console.error('Failed to save order to Firestore:', err);
  }
};

export const deleteFirestoreOrder = async (orderId: string): Promise<void> => {
  // Local cache
  try {
    const saved = localStorage.getItem('creox_saved_orders');
    if (saved) {
      const list: Order[] = JSON.parse(saved);
      const remaining = list.filter((o) => o.id !== orderId && o.orderNumber !== orderId);
      localStorage.setItem('creox_saved_orders', JSON.stringify(remaining));
    }
  } catch {
    // ignore
  }

  // Cloud Firestore
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
  try {
    localStorage.setItem('creox_bkash_config', JSON.stringify(config));
  } catch {}

  try {
    await setDoc(doc(db, 'settings', 'bkash'), config);
  } catch (err) {
    console.error('Failed to save bkash config to Firestore:', err);
  }
};
