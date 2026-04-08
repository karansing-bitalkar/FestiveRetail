import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingCart, Tag } from 'lucide-react';
import { PRODUCTS, COMBO_PRODUCTS } from '@/constants/data';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';
import { CartItem } from '@/types';

const INITIAL_CART: CartItem[] = [
  { product: PRODUCTS[0], qty: 2 },
  { product: COMBO_PRODUCTS[0], qty: 1 },
  { product: PRODUCTS[4], qty: 1 },
];

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [removeItem, setRemoveItem] = useState<string | null>(null);

  const updateQty = (productId: string, delta: number) => {
    setCart(c => c.map(item => item.product.id === productId ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };
  const handleRemove = () => {
    setCart(c => c.filter(item => item.product.id !== removeItem));
    toast.success('Item removed from cart');
    setRemoveItem(null);
  };
  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'FESTIVE20') { setCouponApplied(true); toast.success('Coupon FESTIVE20 applied! 20% off'); }
    else toast.error('Invalid coupon code');
  };

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.2) : 0;
  const shipping = subtotal > 999 ? 0 : 79;
  const total = subtotal - discount + shipping;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Shopping Cart</h2>
        <p className="text-gray-500 text-sm">{cart.length} items in your cart</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <ShoppingCart size={40} className="text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 mb-2">Your cart is empty</h3>
          <p className="text-gray-400 text-sm">Add festive products to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {cart.map((item, i) => (
              <motion.div key={item.product.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-orange-500 font-medium mb-0.5">{item.product.festival}</div>
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">{item.product.name}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(item.product.id, -1)} className="p-1.5 hover:bg-orange-50 transition-all"><Minus size={12} className="text-gray-600" /></button>
                      <span className="text-sm font-bold text-gray-900 w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id, 1)} className="p-1.5 hover:bg-orange-50 transition-all"><Plus size={12} className="text-gray-600" /></button>
                    </div>
                    <span className="font-black text-orange-500">₹{(item.product.price * item.qty).toLocaleString()}</span>
                    <button onClick={() => setRemoveItem(item.product.id)} className="w-8 h-8 bg-red-50 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Tag size={16} className="text-orange-500" /> Apply Coupon</h4>
              <div className="flex gap-2">
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter coupon code" disabled={couponApplied}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 disabled:bg-gray-50" />
                <button onClick={applyCoupon} disabled={couponApplied}
                  className="px-4 py-2.5 fest-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60">
                  Apply
                </button>
              </div>
              {!couponApplied && <p className="text-xs text-gray-400 mt-2">Try: <span className="font-bold text-orange-400">FESTIVE20</span></p>}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">Order Summary</h4>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
                {couponApplied && <div className="flex justify-between text-green-600"><span>Discount (20%)</span><span>-₹{discount.toLocaleString()}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                {shipping === 0 && <p className="text-xs text-green-600">🎉 You qualify for free shipping!</p>}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-base">
                  <span>Total</span><span className="text-orange-500">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => toast.success('Order placed successfully! 🎉')} className="w-full mt-4 py-4 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!removeItem} title="Remove Item" message="Remove this item from your cart?"
        confirmText="Remove" onConfirm={handleRemove} onCancel={() => setRemoveItem(null)} />
    </div>
  );
}
