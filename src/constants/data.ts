import { Product, Order, Notification, Address } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Diwali Puja Thali Set', price: 599, originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop&q=80',
    category: 'Puja Items', festival: 'Diwali', rating: 4.8, reviews: 234, stock: 50, vendorId: 'v1',
    description: 'Beautiful handcrafted puja thali with diyas, incense, and sindoor box.', tags: ['diwali', 'puja', 'thali']
  },
  {
    id: 'p2', name: 'Premium Dry Fruits Gift Box', price: 1299, originalPrice: 1799,
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=400&fit=crop&q=80',
    category: 'Gift Hampers', festival: 'Diwali', rating: 4.7, reviews: 189, stock: 30, vendorId: 'v1',
    description: 'Assorted premium dry fruits in a luxurious gift box.', tags: ['gift', 'diwali', 'dryfruits']
  },
  {
    id: 'p3', name: 'Holi Color Powder Pack', price: 349, originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1576185850277-2e8f85c4dce1?w=400&h=400&fit=crop&q=80',
    category: 'Holi Special', festival: 'Holi', rating: 4.9, reviews: 456, stock: 100, vendorId: 'v1',
    description: 'Eco-friendly organic Holi colors, 10 vibrant shades.', tags: ['holi', 'colors', 'eco']
  },
  {
    id: 'p4', name: 'Wedding Shagun Envelope Set', price: 299, originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&q=80',
    category: 'Wedding', festival: 'Wedding', rating: 4.5, reviews: 123, stock: 200, vendorId: 'v1',
    description: 'Pack of 50 elegant shagun envelopes with golden embossing.', tags: ['wedding', 'shagun', 'gift']
  },
  {
    id: 'p5', name: 'Decorative LED Diya String', price: 499, originalPrice: 749,
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop&q=80',
    category: 'Decoration', festival: 'Diwali', rating: 4.6, reviews: 312, stock: 75, vendorId: 'v1',
    description: '10m LED diya string lights for festive decoration.', tags: ['diwali', 'lights', 'decor']
  },
  {
    id: 'p6', name: 'Organic Gulal Colors Box', price: 449, originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1543877087-ebf71fde2be1?w=400&h=400&fit=crop&q=80',
    category: 'Holi Special', festival: 'Holi', rating: 4.8, reviews: 278, stock: 60, vendorId: 'v1',
    description: 'Premium organic gulal in 8 beautiful colors.', tags: ['holi', 'gulal', 'organic']
  },
  {
    id: 'p7', name: 'Silver Ganesh Idol', price: 2499, originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop&q=80',
    category: 'Idols', festival: 'Ganesh Chaturthi', rating: 4.9, reviews: 167, stock: 20, vendorId: 'v1',
    description: 'Pure silver plated Ganesh idol, 6 inch height.', tags: ['ganesh', 'idol', 'silver']
  },
  {
    id: 'p8', name: 'Birthday Decoration Kit', price: 799, originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop&q=80',
    category: 'Birthday', festival: 'Birthday', rating: 4.4, reviews: 89, stock: 45, vendorId: 'v1',
    description: 'Complete birthday decoration kit with balloons, banners, and more.', tags: ['birthday', 'decoration', 'party']
  },
  {
    id: 'p9', name: 'Navratri Garba Dress Set', price: 1899, originalPrice: 2799,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&q=80',
    category: 'Apparel', festival: 'Navratri', rating: 4.7, reviews: 198, stock: 35, vendorId: 'v1',
    description: 'Vibrant chaniya choli set perfect for Navratri garba celebrations.', tags: ['navratri', 'garba', 'dress']
  },
  {
    id: 'p10', name: 'Christmas Tree Decoration Set', price: 1299, originalPrice: 1899,
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop&q=80',
    category: 'Decoration', festival: 'Christmas', rating: 4.6, reviews: 142, stock: 60, vendorId: 'v1',
    description: 'Complete Christmas tree ornaments and decoration set.', tags: ['christmas', 'tree', 'decoration']
  },
];

export const COMBO_PRODUCTS: Product[] = [
  {
    id: 'c1', name: 'Ultimate Diwali Hamper', price: 2499, originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=400&fit=crop&q=80',
    category: 'Combo', festival: 'Diwali', rating: 4.9, reviews: 567, stock: 25, vendorId: 'v1',
    description: 'Puja thali + dry fruits + LED diyas + sweets box + greeting card.', isCombo: true, tags: ['combo', 'diwali', 'hamper']
  },
  {
    id: 'c2', name: 'Holi Festival Combo', price: 899, originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1543877087-ebf71fde2be1?w=400&h=400&fit=crop&q=80',
    category: 'Combo', festival: 'Holi', rating: 4.8, reviews: 345, stock: 40, vendorId: 'v1',
    description: '10 colors + water gun + white kurta + pichkari + gulal.', isCombo: true, tags: ['combo', 'holi', 'festival']
  },
  {
    id: 'c3', name: 'Wedding Gift Mega Bundle', price: 3999, originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&q=80',
    category: 'Combo', festival: 'Wedding', rating: 4.7, reviews: 234, stock: 15, vendorId: 'v1',
    description: 'Complete wedding gift set including shagun envelopes, dry fruits, sweets, and decorations.', isCombo: true, tags: ['combo', 'wedding', 'gift']
  },
];

export const ORDERS: Order[] = [
  { id: 'ORD001', customerId: 'c1', customerName: 'Priya Sharma', products: [{ productId: 'p1', name: 'Diwali Puja Thali Set', qty: 2, price: 599 }], total: 1198, status: 'delivered', createdAt: '2024-10-20', address: '123, MG Road, Pune, Maharashtra 411001' },
  { id: 'ORD002', customerId: 'c1', customerName: 'Priya Sharma', products: [{ productId: 'c1', name: 'Ultimate Diwali Hamper', qty: 1, price: 2499 }], total: 2499, status: 'shipped', createdAt: '2024-10-25', address: '123, MG Road, Pune, Maharashtra 411001' },
  { id: 'ORD003', customerId: 'c1', customerName: 'Priya Sharma', products: [{ productId: 'p3', name: 'Holi Color Powder Pack', qty: 3, price: 349 }], total: 1047, status: 'pending', createdAt: '2024-11-01', address: '456, FC Road, Pune, Maharashtra 411004' },
  { id: 'ORD004', customerId: 'c2', customerName: 'Amit Patel', products: [{ productId: 'p7', name: 'Silver Ganesh Idol', qty: 1, price: 2499 }], total: 2499, status: 'processing', createdAt: '2024-10-28', address: '789, Koregaon Park, Pune' },
  { id: 'ORD005', customerId: 'c3', customerName: 'Sneha Kulkarni', products: [{ productId: 'c2', name: 'Holi Festival Combo', qty: 2, price: 899 }], total: 1798, status: 'delivered', createdAt: '2024-10-18', address: '321, Shivajinagar, Pune' },
  { id: 'ORD006', customerId: 'c4', customerName: 'Raj Mehta', products: [{ productId: 'p9', name: 'Navratri Garba Dress Set', qty: 1, price: 1899 }], total: 1899, status: 'shipped', createdAt: '2024-11-02', address: 'Delhi NCR' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Order Shipped!', message: 'Your order ORD002 has been shipped and will arrive in 2-3 days.', read: false, createdAt: '2024-10-25', type: 'order' },
  { id: 'n2', title: 'Diwali Mega Sale!', message: 'Get up to 50% off on all festive products. Limited time offer!', read: false, createdAt: '2024-10-22', type: 'offer' },
  { id: 'n3', title: 'Order Delivered', message: 'Your order ORD001 has been delivered successfully.', read: true, createdAt: '2024-10-20', type: 'order' },
  { id: 'n4', title: 'New Combo Available', message: 'Check out our new Wedding Mega Bundle combo!', read: true, createdAt: '2024-10-18', type: 'offer' },
];

export const ADDRESSES: Address[] = [
  { id: 'addr1', label: 'Home', street: '123, MG Road', city: 'Pune', state: 'Maharashtra', pincode: '411001', isDefault: true },
  { id: 'addr2', label: 'Office', street: '456, FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411004', isDefault: false },
];

export const FESTIVALS = ['Diwali', 'Holi', 'Wedding', 'Birthday', 'Ganesh Chaturthi', 'Navratri', 'Christmas', 'Eid'];
export const CATEGORIES = ['Puja Items', 'Gift Hampers', 'Decoration', 'Holi Special', 'Wedding', 'Idols', 'Birthday', 'Combo'];
