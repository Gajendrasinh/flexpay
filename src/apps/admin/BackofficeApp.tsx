import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  Activity, 
  TrendingUp,
  CheckCircle2,
  XCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button, Card, Badge, formatCurrency } from '../../shared/ui-lib';

export default function BackofficeApp({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard').then(res => res.json()).then(setData);
  }, []);

  const handleApprove = async (merchantId: number, action: 'approved' | 'rejected') => {
    const res = await fetch('/api/admin/approve-merchant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchantId, action })
    });
    if (res.ok) {
      fetch('/api/admin/dashboard').then(res => res.json()).then(setData);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-64 bg-slate-950 text-white p-6 space-y-8 hidden md:block">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center"><ShieldCheck className="text-white w-5 h-5" /></div>
          <span className="text-xl font-bold">FlexAdmin</span>
        </div>
        <nav className="space-y-1">
          <Link to="/admin" className="flex items-center gap-3 p-3 rounded-xl bg-emerald-600/10 text-emerald-400 font-medium"><Activity size={20} /> Overview</Link>
          <Link to="/admin/merchants" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 text-slate-400"><Store size={20} /> Merchants</Link>
          <Link to="/admin/consumers" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 text-slate-400"><Users size={20} /> Consumers</Link>
        </nav>
        <div className="pt-20">
          <Button variant="ghost" onClick={onLogout} className="text-red-400 w-full justify-start"><LogOut size={20} /> Logout</Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Backoffice</h1>
          <p className="text-slate-500 text-sm">Platform Command Center</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'GMV', val: formatCurrency(data?.stats?.total_gmv || 0), icon: TrendingUp, color: 'emerald' },
            { label: 'Orders', val: data?.stats?.total_orders || 0, icon: Activity, color: 'blue' },
            { label: 'Merchants', val: data?.stats?.total_merchants || 0, icon: Store, color: 'indigo' },
            { label: 'Consumers', val: data?.stats?.total_consumers || 0, icon: Users, color: 'purple' }
          ].map((stat, i) => (
            <Card key={i} className="flex flex-col gap-2">
              <div className={`w-10 h-10 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center mb-2`}><stat.icon size={20} /></div>
              <p className="text-slate-400 text-xs font-bold uppercase">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.val}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card padding="p-0" className="lg:col-span-2">
            <div className="p-6 border-b border-slate-100 font-bold">Pending Merchants</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <tr><th className="px-6 py-4">Business</th><th className="px-6 py-4">Email</th><th className="px-6 py-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data?.pendingMerchants?.map((m: any) => (
                    <tr key={m.id}>
                      <td className="px-6 py-4 font-semibold">{m.business_name}</td>
                      <td className="px-6 py-4 text-slate-500">{m.email}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="emerald" onClick={() => handleApprove(m.id, 'approved')}><CheckCircle2 size={18} /></Button>
                        <Button variant="danger" onClick={() => handleApprove(m.id, 'rejected')}><XCircle size={18} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card padding="p-0">
            <div className="p-6 border-b border-slate-100 font-bold">Activity</div>
            <div className="p-4 space-y-4">
              {data?.activity?.map((a: any) => (
                <div key={a.id} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0"><Activity size={20} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{a.consumer_email}</p>
                    <p className="text-xs text-slate-400">Purchased from <span className="text-emerald-600">{a.business_name}</span></p>
                    <p className="text-xs font-bold mt-1">{formatCurrency(a.total_amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
