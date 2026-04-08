import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, FiEdit2 } from 'react-icons/fi';
import { MdBlock, MdCheckCircle, MdPending } from 'react-icons/md';
import ConfirmModal from '@/components/features/ConfirmModal';
import Modal from '@/components/features/Modal';
import { toast } from 'sonner';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'vendor' | 'admin';
  status: 'active' | 'blocked' | 'pending';
  phone: string;
  orders: number;
  joinedAt: string;
}

const INITIAL_USERS: ManagedUser[] = [
  { id: 'u1', name: 'Priya Sharma', email: 'customer@festiveretail.com', password: 'customer123', role: 'customer', status: 'active', phone: '+91 98765 43210', orders: 3, joinedAt: '2024-01-15' },
  { id: 'u2', name: 'Raj Enterprises', email: 'vendor@festiveretail.com', password: 'vendor123', role: 'vendor', status: 'active', phone: '+91 87654 32109', orders: 0, joinedAt: '2023-11-20' },
  { id: 'u4', name: 'Amit Patel', email: 'amit@example.com', password: 'amit123', role: 'customer', status: 'active', phone: '+91 87654 32100', orders: 7, joinedAt: '2024-02-20' },
  { id: 'u5', name: 'Sneha Kulkarni', email: 'sneha@example.com', password: 'sneha123', role: 'customer', status: 'blocked', phone: '+91 76543 21000', orders: 1, joinedAt: '2024-03-10' },
  { id: 'u6', name: 'Raj Mehta', email: 'raj@example.com', password: 'raj123', role: 'customer', status: 'active', phone: '+91 65432 10900', orders: 12, joinedAt: '2024-04-05' },
  { id: 'u7', name: 'Pooja Singh', email: 'pooja@example.com', password: 'pooja123', role: 'customer', status: 'active', phone: '+91 54321 09800', orders: 5, joinedAt: '2024-05-18' },
  { id: 'u8', name: 'Festive Creations', email: 'festive@example.com', password: 'festive123', role: 'vendor', status: 'active', phone: '+91 44321 09800', orders: 0, joinedAt: '2024-06-01' },
  { id: 'u9', name: 'Wedding Wonders', email: 'wedding@example.com', password: 'wedding123', role: 'vendor', status: 'pending', phone: '+91 34321 09800', orders: 0, joinedAt: '2024-07-01' },
  { id: 'u10', name: 'Kiran Shah', email: 'kiran@example.com', password: 'kiran123', role: 'customer', status: 'active', phone: '+91 24321 09800', orders: 2, joinedAt: '2024-08-01' },
  { id: 'u11', name: 'Deepa Nair', email: 'deepa@example.com', password: 'deepa123', role: 'customer', status: 'active', phone: '+91 14321 09800', orders: 4, joinedAt: '2024-09-01' },
  { id: 'u12', name: 'Suresh Kumar', email: 'suresh@example.com', password: 'suresh123', role: 'customer', status: 'pending', phone: '+91 04321 09800', orders: 0, joinedAt: '2024-10-01' },
  { id: 'u13', name: 'Meena Iyer', email: 'meena@example.com', password: 'meena123', role: 'customer', status: 'active', phone: '+91 94321 09800', orders: 8, joinedAt: '2024-11-01' },
];

const PAGE_SIZE = 10;

const BLANK_FORM = { name: '', email: '', password: '', role: 'customer' as ManagedUser['role'], phone: '' };

export default function UsersManagement() {
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [formError, setFormError] = useState('');

  // Confirm modals
  const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'block' | 'unblock' | 'delete'; userId: string } | null>(null);

  // Persist to localStorage so login hook can read new users
  useEffect(() => {
    localStorage.setItem('festive_user_store', JSON.stringify(users));
  }, [users]);

  const filtered = users.filter((u) => {
    if (filterStatus !== 'all' && u.status !== filterStatus) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleFilterStatus = (v: string) => { setFilterStatus(v); setPage(1); };

  // Add user
  const handleAddUser = () => {
    if (!form.name || !form.email || !form.password) { setFormError('Name, email, and password are required.'); return; }
    if (users.find((u) => u.email === form.email)) { setFormError('Email already exists.'); return; }
    const newUser: ManagedUser = {
      id: Date.now().toString(),
      ...form,
      status: 'active',
      orders: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setUsers((us) => [...us, newUser]);
    toast.success(`User "${form.name}" added! They can now login.`);
    setAddModal(false);
    setForm(BLANK_FORM);
    setFormError('');
  };

  // Confirm action
  const executeAction = () => {
    if (!pendingAction) return;
    const { type, userId } = pendingAction;
    if (type === 'delete') {
      setUsers((us) => us.filter((u) => u.id !== userId));
      toast.success('User deleted successfully.');
    } else if (type === 'approve') {
      setUsers((us) => us.map((u) => u.id === userId ? { ...u, status: 'active' } : u));
      toast.success('User approved successfully.');
    } else if (type === 'block') {
      setUsers((us) => us.map((u) => u.id === userId ? { ...u, status: 'blocked' } : u));
      toast.success('User blocked.');
    } else if (type === 'unblock') {
      setUsers((us) => us.map((u) => u.id === userId ? { ...u, status: 'active' } : u));
      toast.success('User unblocked.');
    }
    setPendingAction(null);
  };

  const confirmMessages: Record<string, string> = {
    approve: 'Approve this user account? They will be able to login.',
    block: 'Block this user? They will not be able to login.',
    unblock: 'Unblock this user? They will regain access.',
    delete: 'Permanently delete this user? This action cannot be undone.',
  };

  const confirmBtnTexts: Record<string, string> = {
    approve: 'Approve User',
    block: 'Block User',
    unblock: 'Unblock User',
    delete: 'Delete User',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Users Management</h2>
          <p className="text-gray-500 text-sm">{users.length} total users · {users.filter((u) => u.status === 'pending').length} pending</p>
        </div>
        <button
          onClick={() => { setForm(BLANK_FORM); setFormError(''); setAddModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 fest-gradient text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md"
        >
          <FiPlus /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: 'Total', v: users.length, color: 'bg-blue-50 text-blue-700' },
          { l: 'Active', v: users.filter((u) => u.status === 'active').length, color: 'bg-green-50 text-green-700' },
          { l: 'Pending', v: users.filter((u) => u.status === 'pending').length, color: 'bg-yellow-50 text-yellow-700' },
          { l: 'Blocked', v: users.filter((u) => u.status === 'blocked').length, color: 'bg-red-50 text-red-700' },
        ].map((s) => (
          <div key={s.l} className={`${s.color} rounded-2xl p-4 text-center`}>
            <div className="text-3xl font-black mb-0.5">{s.v}</div>
            <div className="text-sm font-medium">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'blocked'].map((s) => (
            <button
              key={s}
              onClick={() => handleFilterStatus(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all border ${filterStatus === s ? 'fest-gradient text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'User', 'Email', 'Role', 'Phone', 'Orders', 'Joined', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-400 text-sm">No users found</td></tr>
              ) : paginated.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-4 text-xs text-gray-400">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 fest-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{u.name.charAt(0)}</div>
                      <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'vendor' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{u.phone}</td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-900">{u.orders}</td>
                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{u.joinedAt}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${u.status === 'active' ? 'bg-green-100 text-green-700' : u.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      {u.status === 'pending' && (
                        <button onClick={() => setPendingAction({ type: 'approve', userId: u.id })}
                          className="p-1.5 bg-green-50 text-green-500 rounded-lg hover:bg-green-100 transition-all" title="Approve">
                          <MdCheckCircle className="text-sm" />
                        </button>
                      )}
                      {u.status === 'active' && (
                        <button onClick={() => setPendingAction({ type: 'block', userId: u.id })}
                          className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-all" title="Block">
                          <MdBlock className="text-sm" />
                        </button>
                      )}
                      {u.status === 'blocked' && (
                        <button onClick={() => setPendingAction({ type: 'unblock', userId: u.id })}
                          className="p-1.5 bg-green-50 text-green-500 rounded-lg hover:bg-green-100 transition-all" title="Unblock">
                          <MdCheckCircle className="text-sm" />
                        </button>
                      )}
                      <button onClick={() => setPendingAction({ type: 'delete', userId: u.id })}
                        className="p-1.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-400 transition-all" title="Delete">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <FiChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${page === p ? 'fest-gradient text-white' : 'border border-gray-200 text-gray-600 hover:border-orange-400'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New User">
        <div className="flex flex-col gap-4">
          {formError && <div className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">{formError}</div>}
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Enter full name' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'email@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Set a password' },
            { label: 'Phone Number', key: 'phone', type: 'text', placeholder: '+91 XXXXX XXXXX' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={(form as any)[f.key]}
                onChange={(e) => setForm((x) => ({ ...x, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((x) => ({ ...x, role: e.target.value as ManagedUser['role'] }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white"
            >
              <option value="customer">Customer (Buyer)</option>
              <option value="vendor">Vendor (Seller)</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-xs text-orange-600">
            The user can login using the email and password you set above.
          </div>
          <button onClick={handleAddUser} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
            Add User
          </button>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!pendingAction}
        title={pendingAction ? { approve: 'Approve User', block: 'Block User', unblock: 'Unblock User', delete: 'Delete User' }[pendingAction.type] : ''}
        message={pendingAction ? confirmMessages[pendingAction.type] : ''}
        confirmText={pendingAction ? confirmBtnTexts[pendingAction.type] : ''}
        onConfirm={executeAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
