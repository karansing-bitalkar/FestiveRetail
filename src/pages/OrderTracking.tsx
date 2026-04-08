import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import { MdCheckCircle, MdLocalShipping, MdInventory, MdHome, MdStore } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';

const TRACK_STAGES = [
  { id: 'placed', label: 'Order Placed', icon: FiPackage, desc: 'Your order has been received and confirmed', color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'confirmed', label: 'Confirmed', icon: MdCheckCircle, desc: 'Seller has confirmed your order', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'packed', label: 'Packed', icon: MdInventory, desc: 'Your items are packed and ready', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'shipped', label: 'Shipped', icon: MdLocalShipping, desc: 'On its way to you', color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'delivered', label: 'Delivered', icon: MdHome, desc: 'Order delivered successfully', color: 'text-green-500', bg: 'bg-green-50' },
];

const DELIVERY_UPDATES = [
  { time: '10:30 AM', date: 'Nov 2, 2024', message: 'Out for delivery — Pune delivery hub', location: 'Pune Logistics Hub' },
  { time: '08:15 AM', date: 'Nov 2, 2024', message: 'Package arrived at local delivery hub', location: 'Pune City Center' },
  { time: '06:00 PM', date: 'Nov 1, 2024', message: 'Package dispatched from warehouse', location: 'Mumbai Warehouse' },
  { time: '02:00 PM', date: 'Nov 1, 2024', message: 'Order packed and ready for dispatch', location: 'Mumbai Warehouse' },
  { time: '11:30 AM', date: 'Oct 31, 2024', message: 'Order confirmed by seller', location: 'FestiveRetail Partner' },
  { time: '10:15 AM', date: 'Oct 31, 2024', message: 'Order placed successfully', location: 'Online' },
];

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const currentStage = 'shipped'; // mock current stage
  const currentIdx = TRACK_STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/home" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 shadow-sm hover:text-orange-500 transition-colors border border-gray-100">
          <FiArrowLeft />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Track Order</h1>
          <p className="text-sm text-gray-500">Order #{orderId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Progress + Updates */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Progress bar */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-gray-900">Delivery Progress</h2>
              <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full uppercase">In Transit</span>
            </div>

            {/* Vertical timeline */}
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />
              <div
                className="absolute left-5 top-0 w-0.5 fest-gradient transition-all duration-1000"
                style={{ height: `${(currentIdx / (TRACK_STAGES.length - 1)) * 100}%` }}
              />
              <div className="flex flex-col gap-6">
                {TRACK_STAGES.map((stage, i) => {
                  const isDone = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  const StageIcon = stage.icon as any;
                  return (
                    <motion.div key={stage.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 pl-1"
                    >
                      <div className={`relative z-10 w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${isDone ? (isCurrent ? 'fest-gradient shadow-md scale-110' : 'bg-green-500') : 'bg-white border-2 border-gray-200'}`}>
                        <StageIcon className={`text-lg ${isDone ? 'text-white' : 'text-gray-300'}`} />
                        {isCurrent && (
                          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 rounded-2xl fest-gradient" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-sm ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>{stage.label}</span>
                          {isCurrent && <span className="text-xs text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-full">Current</span>}
                          {isDone && !isCurrent && <MdCheckCircle className="text-green-500 text-lg" />}
                        </div>
                        <p className={`text-xs mt-0.5 ${isDone ? 'text-gray-500' : 'text-gray-300'}`}>{stage.desc}</p>
                        {i < TRACK_STAGES.length - 1 && !isDone && (
                          <p className="text-[10px] text-gray-300 mt-0.5">Estimated: {i === currentIdx + 1 ? 'Today by 6 PM' : `${i - currentIdx} days`}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Delivery updates */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-black text-gray-900 mb-5">Delivery Updates</h2>
            <div className="flex flex-col gap-4">
              {DELIVERY_UPDATES.map((u, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className={`flex gap-4 ${i === 0 ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${i === 0 ? 'bg-orange-500' : 'bg-gray-300'}`} />
                    {i < DELIVERY_UPDATES.length - 1 && <div className="w-0.5 bg-gray-100 flex-1 mt-1" style={{ minHeight: 20 }} />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-sm font-semibold text-gray-900">{u.message}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400">{u.time} · {u.date}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><MdStore className="text-gray-400" />{u.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order info */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2"><HiSparkles className="text-orange-400" /> Order Info</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-bold text-orange-500">#{orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ordered</span>
                <span className="font-medium text-gray-900">Oct 31, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Est. Delivery</span>
                <span className="font-bold text-green-600">Nov 3, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-black text-gray-900">₹3,697</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 mb-3">Items Ordered</h3>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Diwali Puja Thali Set', qty: 2, price: 1198, img: 'https://images.unsplash.com/photo-1605197584847-12af0e3c0f15?w=200&q=80' },
                { name: 'Ultimate Diwali Hamper', qty: 1, price: 2499, img: 'https://images.unsplash.com/photo-1605197584847-12af0e3c0f15?w=200&q=80' },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-bold text-orange-500">₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 rounded-3xl p-5 border border-orange-100">
            <h3 className="font-black text-gray-900 mb-3 text-sm">Deliver To</h3>
            <p className="text-sm font-semibold text-gray-800">Home Address</p>
            <p className="text-xs text-gray-500 mt-1">123, MG Road, Pune,<br />Maharashtra – 411001</p>
          </div>

          <Link to="/shop" className="block text-center py-3 bg-white border-2 border-orange-200 text-orange-500 rounded-2xl font-bold hover:bg-orange-50 transition-all text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
