/**
 * Global Product Store using React context + localStorage
 * No extra dependencies needed.
 */
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types';
import { PRODUCTS, COMBO_PRODUCTS } from '@/constants/data';

interface ProductStore {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductStore>({
  products: [...PRODUCTS, ...COMBO_PRODUCTS],
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
});

let _globalProducts: Product[] = [...PRODUCTS, ...COMBO_PRODUCTS];
let _listeners: Array<() => void> = [];

function notifyListeners() {
  _listeners.forEach((fn) => fn());
}

export function useProductStore(): ProductStore {
  const [, forceRender] = useState(0);

  const rerender = () => forceRender((n) => n + 1);

  // Subscribe once
  if (!_listeners.includes(rerender)) {
    _listeners.push(rerender);
  }

  return {
    products: _globalProducts,
    addProduct: (p) => {
      _globalProducts = [..._globalProducts, p];
      notifyListeners();
    },
    updateProduct: (p) => {
      _globalProducts = _globalProducts.map((x) => (x.id === p.id ? p : x));
      notifyListeners();
    },
    deleteProduct: (id) => {
      _globalProducts = _globalProducts.filter((x) => x.id !== id);
      notifyListeners();
    },
  };
}
