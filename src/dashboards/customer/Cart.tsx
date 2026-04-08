import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/constants/data';

const INITIAL_CART = [
  { product: PRODUCTS[0], qty: 2 },
  { product: PRODUCTS[1], qty: 1 },
  { product: PRODUCTS[4], qty: 1 },
];

export default function Cart() {
  const [items, setItems] = useState(INITIAL_CART);
  const [coupon, setCoupon] = useState('');

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.product.id !== id));

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 79;
  const discount = Math.floor(subtotal * 0.1);
  const total = subtotal + shipping - discount;

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-black text-gray-900">Shopping Cart</h2>
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={28} className="text-orange-400" />
          </div>
          <h3 className="font-black text-gray-900 text-xl mb-2">Your Cart is Empty</h3>
          <p className="text-gray-500 mb-6">Add some festive items to get started!</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">Shopping Cart</h2>
        <span className="text-sm text-gray-500">{items.length} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item, i) => (
            <motion.div key={item.product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`} className="font-bold text-gray-900 text-sm line-clamp-1 hover:text-orange-500 transition-colors">
                  {item.product.name}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">{item.product.festival}</p>
                <p className="font-black text-orange-500 mt-1">₹{(item.product.price * item.qty).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                  <button onClick={() => updateQty(item.product.id, -1)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm w-5 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.product.id, 1)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.product.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="font-black text-gray-900 mb-4">Order Summary</h3>
          <div className="flex items-center gap-2 mb-4">
            <Tag size={14} className="text-orange-400" />
            <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code" className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
          </div>
          <div className="flex flex-col gap-2 mb-4 text-sm border-t border-gray-100 pt-4">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Discount (10%)</span><span className="text-green-600 font-medium">–₹{discount.toLocaleString()}</span></div>
            <div className="flex justify-between text-base font-black border-t border-gray-100 pt-2 mt-1">
              <span>Total</span><span className="text-orange-500">₹{total.toLocaleString()}</span>
            </div>
          </div>
          <Link to="/checkout" className="w-full py-3 fest-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm">
            Proceed to Checkout <ArrowRight size={14} />
          </Link>
          {subtotal < 999 && (
            <p className="text-xs text-center text-gray-400 mt-3">Add ₹{(999 - subtotal).toLocaleString()} more for free shipping</p>
          )}
        </div>
      </div>
    </div>
  );
}
