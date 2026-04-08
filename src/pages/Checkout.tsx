import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight, MapPin, CreditCard, ShoppingBag, Tag, X, Sparkles, Truck, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Review', icon: ShoppingBag },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Confirmed', icon: Check },
];

const SAVED_ADDRESSES = [
  { id: 'a1', label: 'Home', street: '123, MG Road', city: 'Pune', state: 'Maharashtra', pincode: '411001', isDefault: true },
  { id: 'a2', label: 'Office', street: '456, FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411004', isDefault: false },
];

const CART_ITEMS = [
  { id: 'c1', name: 'Diwali Puja Thali Set', price: 599, qty: 2, image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=200&h=200&fit=crop&q=80' },
  { id: 'c2', name: 'Ultimate Diwali Hamper', price: 2499, qty: 1, image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=200&h=200&fit=crop&q=80' },
];

const COUPONS: Record<string, { type: 'percent' | 'flat' | 'shipping'; value: number; label: string }> = {
  FESTIVE20: { type: 'percent', value: 20, label: '20% off on order' },
  DIWALI50: { type: 'flat', value: 50, label: '₹50 off on order' },
  FREESHIP: { type: 'shipping', value: 0, label: 'Free shipping' },
};

function Confetti() {
  const colors = ['#f97316', '#ec4899', '#8b5cf6', '#fbbf24', '#10b981', '#3b82f6'];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div key={i}
          initial={{ y: -20, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800), opacity: 1, rotate: 0 }}
          animate={{ y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50, opacity: 0, rotate: Math.random() * 720 - 360, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800) }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1.5, ease: 'easeIn' }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: colors[Math.floor(Math.random() * colors.length)] }}
        />
      ))}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedAddr, setSelectedAddr] = useState('a1');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [orderId] = useState(`ORD${Date.now().toString().slice(-6)}`);
  const [showConfetti, setShowConfetti] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; type: 'percent' | 'flat' | 'shipping'; value: number; label: string }>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const baseShipping = subtotal >= 999 ? 0 : 79;
  const autoDiscount = Math.floor(subtotal * 0.1);

  let couponDiscount = 0;
  let shippingAfterCoupon = baseShipping;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') couponDiscount = Math.floor(subtotal * appliedCoupon.value / 100);
    else if (appliedCoupon.type === 'flat') couponDiscount = appliedCoupon.value;
    else if (appliedCoupon.type === 'shipping') shippingAfterCoupon = 0;
  }

  const totalSavings = autoDiscount + couponDiscount + (baseShipping - shippingAfterCoupon);
  const total = subtotal + shippingAfterCoupon - autoDiscount - couponDiscount;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError('Please enter a coupon code.'); return; }
    setCouponLoading(true); setCouponError('');
    setTimeout(() => {
      setCouponLoading(false);
      const coupon = COUPONS[code];
      if (!coupon) { setCouponError('Invalid coupon code. Try FESTIVE20, DIWALI50, or FREESHIP.'); return; }
      if (appliedCoupon?.code === code) { setCouponError('This coupon is already applied.'); return; }
      setAppliedCoupon({ code, ...coupon });
      setCouponInput('');
      toast.success(`Coupon "${code}" applied! ${coupon.label}.`);
    }, 600);
  };

  const handleRemoveCoupon = () => { setAppliedCoupon(null); setCouponError(''); toast.info('Coupon removed.'); };

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false); setShowConfetti(true); setStep(4);
      setTimeout(() => setShowConfetti(false), 4000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 py-8">
      {showConfetti && <Confetti />}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/shop" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 shadow-sm hover:text-orange-500 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500">Secure and encrypted payment</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${step > s.id ? 'bg-green-500 text-white' : step === s.id ? 'fest-gradient text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                  {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
                </div>
                <span className={`text-xs mt-1 font-medium ${step >= s.id ? 'text-orange-500' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* Step 1: Address */}
              {step === 1 && (
                <motion.div key="addr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 mb-5">Select Delivery Address</h2>
                    <div className="flex flex-col gap-3 mb-5">
                      {SAVED_ADDRESSES.map((addr) => (
                        <label key={addr.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddr === addr.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                          <input type="radio" name="address" value={addr.id} checked={selectedAddr === addr.id} onChange={() => setSelectedAddr(addr.id)} className="mt-1 accent-orange-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900 text-sm">{addr.label}</span>
                              {addr.isDefault && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
                            </div>
                            <p className="text-sm text-gray-600">{addr.street}, {addr.city}</p>
                            <p className="text-xs text-gray-400">{addr.state} – {addr.pincode}</p>
                          </div>
                          <MapPin size={18} className={`mt-1 ${selectedAddr === addr.id ? 'text-orange-500' : 'text-gray-300'}`} />
                        </label>
                      ))}
                    </div>
                    <button className="text-sm text-orange-500 font-semibold hover:text-orange-600 transition-colors">+ Add New Address</button>
                    <button onClick={() => setStep(2)} className="w-full mt-5 py-4 fest-gradient text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                      Continue to Order Review <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 mb-5">Review Your Order</h2>
                    <div className="flex flex-col gap-3 mb-5">
                      {CART_ITEMS.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Qty: {item.qty}</p>
                          </div>
                          <span className="font-bold text-orange-500">₹{(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-4 mb-5">
                      <p className="text-xs font-bold text-blue-700 uppercase mb-1">Delivery to</p>
                      {(() => { const a = SAVED_ADDRESSES.find((x) => x.id === selectedAddr); return <p className="text-sm text-blue-900 font-medium">{a?.street}, {a?.city}, {a?.state} – {a?.pincode}</p>; })()}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button onClick={() => setStep(3)} className="flex-1 py-3 fest-gradient text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        Choose Payment <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 mb-5">Payment Method</h2>
                    <div className="flex flex-col gap-3 mb-5">
                      {[
                        { id: 'upi', label: 'UPI / QR Code', sub: 'Pay using any UPI app', icon: Phone },
                        { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: CreditCard },
                        { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive', icon: Truck },
                      ].map((m) => (
                        <label key={m.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === m.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                          <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} className="accent-orange-500" />
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === m.id ? 'fest-gradient text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <m.icon size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{m.label}</p>
                            <p className="text-xs text-gray-500">{m.sub}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {paymentMethod === 'upi' && (
                      <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">UPI ID</label>
                        <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
                      </div>
                    )}
                    {paymentMethod === 'card' && (
                      <div className="mb-5 grid grid-cols-2 gap-3">
                        <div className="col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1">Card Number</label>
                          <input placeholder="1234 5678 9012 3456" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Expiry</label>
                          <input placeholder="MM/YY" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">CVV</label>
                          <input placeholder="..." type="password" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" /></div>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button onClick={handlePlaceOrder} disabled={processing}
                        className="flex-[2] px-8 py-3 fest-gradient text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                        {processing ? (
                          <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> Processing...</>
                        ) : (
                          <><CreditCard size={18} /> Place Order · ₹{total.toLocaleString()}</>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmed */}
              {step === 4 && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 size={44} className="text-green-500" />
                    </motion.div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Order Placed!</h2>
                    <p className="text-gray-500 mb-4">Your festive order is confirmed</p>
                    {appliedCoupon && (
                      <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-2 mb-4 inline-flex items-center gap-2 text-green-700 text-sm font-medium">
                        <Tag size={14} /> Coupon {appliedCoupon.code} saved you ₹{(appliedCoupon.type === 'percent' ? Math.floor(subtotal * appliedCoupon.value / 100) : appliedCoupon.type === 'flat' ? appliedCoupon.value : baseShipping).toLocaleString()}!
                      </div>
                    )}
                    <div className="bg-orange-50 rounded-2xl px-6 py-4 mb-6 inline-block">
                      <p className="text-xs text-orange-600 font-medium">Order ID</p>
                      <p className="text-xl font-black text-orange-500">#{orderId}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Estimated delivery: <strong className="text-gray-800">3–5 business days</strong>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link to={`/track/${orderId}`} className="px-6 py-3 fest-gradient text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <Truck size={16} /> Track Order
                      </Link>
                      <Link to="/shop" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                        <ShoppingBag size={16} /> Continue Shopping
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          {step < 4 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2"><Sparkles size={16} className="text-orange-500" /> Order Summary</h3>
                <div className="flex flex-col gap-2 mb-4">
                  {CART_ITEMS.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 line-clamp-1 flex-1">{item.name} ×{item.qty}</span>
                      <span className="font-semibold text-gray-900 ml-2">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon Input */}
                <div className="mb-4 border-t border-gray-100 pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <Tag size={14} className="text-orange-400" /> Coupon Code
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-green-700">{appliedCoupon.code}</p>
                          <p className="text-xs text-green-600">{appliedCoupon.label}</p>
                        </div>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-green-500 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          value={couponInput}
                          onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                          onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="e.g. FESTIVE20"
                          className={`flex-1 px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-orange-400 uppercase ${couponError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        />
                        <button onClick={handleApplyCoupon} disabled={couponLoading}
                          className="px-4 py-2.5 fest-gradient text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-60 whitespace-nowrap">
                          {couponLoading ? '...' : 'Apply'}
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-red-500 mt-1.5 font-medium">{couponError}</p>}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {Object.keys(COUPONS).map(c => (
                          <button key={c} onClick={() => { setCouponInput(c); setCouponError(''); }}
                            className="text-[10px] text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-semibold hover:bg-orange-100 transition-all">
                            {c}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span>
                    <span className={shippingAfterCoupon === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                      {shippingAfterCoupon === 0 ? 'FREE' : `₹${shippingAfterCoupon}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Auto Discount (10%)</span><span className="text-green-600 font-medium">–₹{autoDiscount.toLocaleString()}</span></div>
                  {appliedCoupon && appliedCoupon.type !== 'shipping' && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between text-sm">
                      <span className="text-green-600 flex items-center gap-1"><Tag size={11} /> Coupon ({appliedCoupon.code})</span>
                      <span className="text-green-600 font-bold">–₹{couponDiscount.toLocaleString()}</span>
                    </motion.div>
                  )}
                  <div className="flex justify-between text-lg font-black border-t border-gray-100 pt-3 mt-1">
                    <span className="text-gray-900">Total</span>
                    <motion.span key={total} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="text-orange-500">
                      ₹{total.toLocaleString()}
                    </motion.span>
                  </div>
                </div>
                {totalSavings > 0 && (
                  <motion.div key={totalSavings} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 bg-green-50 rounded-xl px-4 py-3 text-xs text-green-700 text-center font-medium">
                    You save ₹{totalSavings.toLocaleString()} on this order!
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
