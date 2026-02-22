import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Wallet, 
  CheckCircle2, 
  Calendar,
  ChevronRight,
  ArrowRight,
  X,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { Button, Card, Badge, formatCurrency } from '../../shared/ui-lib';

export default function ConsumerApp({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'plan' | 'confirm' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<number>(1);

  useEffect(() => {
    fetch('/api/consumer/products').then(res => res.json()).then(setProducts);
    fetch(`/api/consumer/dashboard/${user.id}`).then(res => res.json()).then(setDashboard);
  }, [user.id]);

  const handleCheckout = async () => {
    const res = await fetch('/api/consumer/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consumerId: user.id,
        productId: selectedProduct.id,
        merchantId: selectedProduct.merchant_id,
        amount: selectedProduct.price,
        planId: selectedPlan
      })
    });
    if (res.ok) {
      setCheckoutStep('success');
      fetch(`/api/consumer/dashboard/${user.id}`).then(res => res.json()).then(setDashboard);
    }
  };

  return (
    <div className="pb-20">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><Wallet className="text-white w-5 h-5" /></div>
            <span className="text-xl font-bold text-indigo-900">FlexPay</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-indigo-600">Shop</Link>
            <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-indigo-600">Dashboard</Link>
            <Button variant="ghost" onClick={onLogout} className="text-red-500">Logout</Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <div className="space-y-8">
              <header><h1 className="text-3xl font-bold">Shop</h1></header>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(p => (
                  <Card key={p.id} padding="p-0" className="group">
                    <div className="aspect-square bg-gray-50 overflow-hidden">
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-all" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <Badge variant="indigo">{p.business_name}</Badge>
                        <h3 className="font-semibold truncate mt-1">{p.name}</h3>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="text-lg font-bold">{formatCurrency(p.price)}</p>
                        <Button onClick={() => { setSelectedProduct(p); setIsCheckoutOpen(true); setCheckoutStep('plan'); }}><ShoppingBag size={20} /></Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          } />

          <Route path="/dashboard" element={
            <div className="space-y-8">
              <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Card padding="p-4" className="flex items-center gap-4">
                  <ShieldCheck className="text-indigo-600" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Limit</p>
                    <p className="text-lg font-bold">{formatCurrency(dashboard?.creditLimit || 0)}</p>
                  </div>
                </Card>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card padding="p-0">
                    <div className="p-6 border-b border-gray-50 font-bold flex items-center gap-2"><Calendar size={20} className="text-indigo-600" /> Upcoming</div>
                    <div className="divide-y divide-gray-50">
                      {dashboard?.upcomingPayments?.map((p: any) => (
                        <div key={p.id} className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CreditCard className="text-gray-400" />
                            <div><p className="font-semibold">{p.product_name}</p><p className="text-sm text-gray-500">{p.due_date}</p></div>
                          </div>
                          <p className="font-bold">{formatCurrency(p.amount)}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
                <Card padding="p-0">
                  <div className="p-6 border-b border-gray-50 font-bold">Recent</div>
                  <div className="p-4 space-y-4">
                    {dashboard?.orders?.map((o: any) => (
                      <div key={o.id} className="flex gap-4 p-2 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
                        <img src={o.product_image} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate text-sm">{o.product_name}</p>
                          <p className="font-bold text-indigo-600 text-sm">{formatCurrency(o.total_amount)}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 self-center" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <AnimatePresence>
        {isCheckoutOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCheckoutOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden p-8 space-y-8">
              <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X size={20} className="text-gray-400" /></button>
              
              {checkoutStep === 'plan' && (
                <>
                  <div className="flex gap-6 items-start">
                    <img src={selectedProduct.image} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                    <div><h2 className="text-xl font-bold">{selectedProduct.name}</h2><p className="text-lg font-bold text-indigo-600">{formatCurrency(selectedProduct.price)}</p></div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase">Choose Plan</p>
                    <div className="grid gap-3">
                      {[1, 2, 3].map(id => (
                        <button key={id} onClick={() => setSelectedPlan(id)} className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedPlan === id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100'}`}>
                          <p className="font-bold">Pay in {id === 1 ? '3' : id === 2 ? '6' : '12'}</p>
                          <p className="text-xs text-gray-500">{id === 1 ? 'Interest-free' : 'Low interest'}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => setCheckoutStep('confirm')} className="w-full py-4 text-lg">Continue <ArrowRight size={20} /></Button>
                </>
              )}

              {checkoutStep === 'confirm' && (
                <>
                  <h2 className="text-2xl font-bold text-center">Confirm Order</h2>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between text-sm"><span>Total</span><span className="font-bold">{formatCurrency(selectedProduct.price)}</span></div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between font-bold text-lg"><span>Due Today</span><span>{formatCurrency(selectedProduct.price / (selectedPlan === 1 ? 3 : selectedPlan === 2 ? 6 : 12))}</span></div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="secondary" onClick={() => setCheckoutStep('plan')} className="flex-1">Back</Button>
                    <Button onClick={handleCheckout} className="flex-[2] text-lg">Confirm & Pay</Button>
                  </div>
                </>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center space-y-8 py-4">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="text-emerald-600 w-10 h-10" /></div>
                  <h2 className="text-3xl font-bold">Success!</h2>
                  <Button onClick={() => { setIsCheckoutOpen(false); window.location.href = '/dashboard'; }} className="w-full py-4">View Dashboard</Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
