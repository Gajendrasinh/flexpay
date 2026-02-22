import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Plus,
  Store,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { Button, Card, Badge, formatCurrency } from '../../shared/ui-lib';

export default function MerchantApp({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [data, setData] = useState<any>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '' });

  useEffect(() => {
    if (user.merchant) {
      fetch(`/api/merchant/dashboard/${user.merchant.id}`).then(res => res.json()).then(setData);
    }
  }, [user.merchant]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/merchant/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newProduct, merchantId: user.merchant.id, price: parseFloat(newProduct.price) })
    });
    if (res.ok) {
      setIsAddProductOpen(false);
      fetch(`/api/merchant/dashboard/${user.merchant.id}`).then(res => res.json()).then(setData);
    }
  };

  if (!user.merchant) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <aside className="w-64 bg-slate-900 text-white p-6 space-y-8 hidden md:block">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center"><Store className="text-white w-5 h-5" /></div>
          <span className="text-xl font-bold">Merchant</span>
        </div>
        <nav className="space-y-2">
          <Link to="/merchant" className="flex items-center gap-3 p-3 rounded-xl bg-indigo-600 text-white font-medium"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/merchant/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400"><Package size={20} /> Products</Link>
          <Link to="/merchant/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400"><Settings size={20} /> Settings</Link>
        </nav>
        <div className="pt-20">
          <Button variant="ghost" onClick={onLogout} className="text-red-400 w-full justify-start"><LogOut size={20} /> Logout</Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div><h1 className="text-2xl font-bold">{user.merchant.business_name}</h1><p className="text-slate-500 text-sm">FlexPay Merchant Dashboard</p></div>
          <Button onClick={() => setIsAddProductOpen(true)}><Plus size={20} /> Add Product</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="flex flex-col gap-2">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 w-fit"><TrendingUp size={24} /></div>
            <p className="text-slate-400 text-xs font-bold uppercase">Volume</p>
            <p className="text-3xl font-bold">{formatCurrency(data?.stats?.total_volume || 0)}</p>
          </Card>
          <Card className="flex flex-col gap-2">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 w-fit"><Package size={24} /></div>
            <p className="text-slate-400 text-xs font-bold uppercase">Orders</p>
            <p className="text-3xl font-bold">{data?.stats?.total_orders || 0}</p>
          </Card>
          <Card className="flex flex-col gap-2">
            <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 w-fit"><DollarSign size={24} /></div>
            <p className="text-slate-400 text-xs font-bold uppercase">Pending</p>
            <p className="text-3xl font-bold">{formatCurrency(data?.payouts?.filter((p:any) => p.status === 'scheduled').reduce((acc:number, p:any) => acc + p.amount, 0) || 0)}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card padding="p-0">
            <div className="p-6 border-b border-slate-100 font-bold">Products</div>
            <div className="divide-y divide-slate-50">
              {data?.products?.map((p: any) => (
                <div key={p.id} className="p-4 flex items-center gap-4">
                  <img src={p.image} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1"><p className="font-semibold">{p.name}</p><p className="text-xs text-slate-400">{p.category}</p></div>
                  <p className="font-bold">{formatCurrency(p.price)}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card padding="p-0">
            <div className="p-6 border-b border-slate-100 font-bold">Payouts</div>
            <div className="divide-y divide-slate-50">
              {data?.payouts?.map((p: any) => (
                <div key={p.id} className="p-4 flex items-center justify-between">
                  <div><p className="font-semibold">{formatCurrency(p.amount)}</p><p className="text-xs text-slate-400">{p.scheduled_date}</p></div>
                  <Badge variant={p.status === 'completed' ? 'emerald' : 'amber'}>{p.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Add Product</h2><button onClick={() => setIsAddProductOpen(false)}><X size={20} /></button></div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input required placeholder="Name" className="w-full p-4 bg-slate-50 rounded-2xl" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <input required type="number" step="0.01" placeholder="Price" className="w-full p-4 bg-slate-50 rounded-2xl" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              <input required placeholder="Category" className="w-full p-4 bg-slate-50 rounded-2xl" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
              <input required placeholder="Image URL" className="w-full p-4 bg-slate-50 rounded-2xl" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
              <Button type="submit" className="w-full py-4 text-lg">Create Product</Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
