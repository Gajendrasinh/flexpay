import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  ShoppingBag, 
  Store,
  Smartphone,
  CreditCard,
  Globe,
  Star,
  ArrowUpRight,
  TrendingUp,
  Users,
  Lock,
  LayoutGrid
} from 'lucide-react';

export default function LandingPage() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-[#FAFAFA] text-[#1A1A1A] selection:bg-black selection:text-white font-sans antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-black/[0.03]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Wallet className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-black">FlexPay</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {['How it works', 'For Merchants', 'Security'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-[13px] font-medium text-black/60 hover:text-black transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[13px] font-semibold text-black/80 hover:text-black transition-colors">Log In</Link>
              <Link to="/login" className="bg-black text-white px-5 py-2 rounded-full font-semibold text-[13px] hover:bg-black/80 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.05] mb-8"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">Now available in 20+ countries</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-tight text-black max-w-4xl mb-8"
            >
              Shop now, <br />
              <span className="text-black/40">pay at your own pace.</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-black/50 leading-relaxed max-w-xl font-medium mb-10"
            >
              FlexPay gives you the freedom to split any purchase into simple, interest-free installments. No hidden fees, ever.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-20"
            >
              <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold text-base hover:bg-black/90 transition-all group">
                Start Shopping
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black border border-black/10 rounded-full font-bold text-base hover:bg-black/5 transition-all">
                For Merchants
              </Link>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div 
              variants={itemVariants}
              className="relative w-full max-w-5xl mx-auto"
            >
              <div className="relative z-10 bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-black/[0.03] p-4 md:p-8 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Card & Balance */}
                  <div className="flex-1 space-y-8 text-left">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                          <Smartphone className="text-white w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black">FlexPay Mobile</p>
                          <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">Active Account</p>
                        </div>
                      </div>
                      <Badge variant="emerald">Verified</Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[10px] text-black/40 font-bold uppercase tracking-[0.2em]">Available Credit</p>
                      <p className="text-5xl font-bold text-black tracking-tight">$12,450.00</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#F8F8F8] rounded-2xl p-4 space-y-1">
                        <p className="text-[10px] font-bold text-black/40 uppercase">Spent this month</p>
                        <p className="text-lg font-bold text-black">$1,240.50</p>
                      </div>
                      <div className="bg-black text-white rounded-2xl p-4 space-y-1">
                        <p className="text-[10px] font-bold text-white/40 uppercase">Next Payment</p>
                        <p className="text-lg font-bold text-white">$245.00</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Transactions */}
                  <div className="flex-1 space-y-4 text-left">
                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Recent Activity</p>
                    <div className="space-y-2">
                      {[
                        { name: 'Apple Store', item: 'iPhone 15 Pro', price: '$999.00', status: 'Active', icon: '' },
                        { name: 'Nike', item: 'Air Jordan 1', price: '$180.00', status: 'Paid', icon: '👟' },
                        { name: 'Zara', item: 'Wool Coat', price: '$240.00', status: 'Active', icon: '🧥' }
                      ].map((order, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-black/[0.03] rounded-2xl hover:bg-black/[0.01] transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#F8F8F8] rounded-lg flex items-center justify-center text-lg">{order.icon}</div>
                            <div>
                              <p className="text-sm font-bold text-black">{order.name}</p>
                              <p className="text-[10px] text-black/40 font-medium">{order.item}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-black">{order.price}</p>
                            <p className={`text-[9px] font-bold uppercase ${order.status === 'Paid' ? 'text-emerald-500' : 'text-black/40'}`}>{order.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-black/[0.02] rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-black/[0.02] rounded-full blur-3xl -z-10" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-black/[0.03] bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-20 grayscale">
            {['APPLE', 'NIKE', 'ZARA', 'SAMSUNG', 'IKEA', 'ADIDAS'].map(brand => (
              <span key={brand} className="text-2xl font-bold tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="how-it-works" className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight text-black mb-4">Payments, reimagined.</h2>
            <p className="text-lg text-black/50 font-medium">Everything you need to manage your spending, all in one beautiful interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Bento Item */}
            <div className="md:col-span-2 bg-white rounded-[32px] border border-black/[0.03] p-10 flex flex-col justify-between overflow-hidden relative group">
              <div className="max-w-md relative z-10">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="text-white w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Instant Approval</h3>
                <p className="text-black/50 font-medium leading-relaxed">
                  Get a decision in seconds. No long forms, no hard credit checks, and no waiting. Just seamless shopping.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full bg-black/[0.01] border-l border-black/[0.03] translate-y-20 group-hover:translate-y-10 transition-transform duration-700 p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-white rounded-xl border border-black/[0.03] shadow-sm" />
                  ))}
                </div>
              </div>
            </div>

            {/* Small Bento Item */}
            <div className="bg-black text-white rounded-[32px] p-10 flex flex-col justify-between">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Secure by Design</h3>
                <p className="text-white/50 font-medium leading-relaxed">
                  Bank-level encryption and advanced fraud protection.
                </p>
              </div>
            </div>

            {/* Small Bento Item */}
            <div className="bg-[#F2F2F2] rounded-[32px] p-10 flex flex-col justify-between">
              <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="text-black w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">Smart Budgeting</h3>
                <p className="text-black/50 font-medium leading-relaxed">
                  Track your spending and manage installments with ease.
                </p>
              </div>
            </div>

            {/* Large Bento Item */}
            <div className="md:col-span-2 bg-white rounded-[32px] border border-black/[0.03] p-10 flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="text-white w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Shop Anywhere</h3>
                <p className="text-black/50 font-medium leading-relaxed">
                  Use FlexPay at thousands of online and physical stores worldwide. One account, infinite possibilities.
                </p>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-[#F8F8F8] rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="text-black/10 w-8 h-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Merchant Section */}
      <section id="for-merchants" className="py-32 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">For Business</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
                Grow your business <br />
                <span className="text-white/40">with FlexPay.</span>
              </h2>
              <p className="text-lg text-white/50 leading-relaxed font-medium max-w-lg">
                Increase your average order value by 30% and conversion rates by 20% by offering flexible payment options.
              </p>
              
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-4xl font-bold tracking-tight">+30%</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Avg. Order Value</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold tracking-tight">+20%</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Conversion Rate</p>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-base hover:bg-white/90 transition-all group">
                  Become a Partner
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 space-y-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg" />
                    <div className="space-y-1">
                      <div className="h-2 w-20 bg-white/20 rounded-full" />
                      <div className="h-1.5 w-12 bg-white/10 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/10" />)}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-white/5 rounded-2xl border border-white/5" />
                    ))}
                  </div>
                  <div className="h-32 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-end p-4">
                      <div className="flex items-end gap-1 w-full h-full">
                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                          <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-white/20 rounded-t-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 rounded-full blur-[120px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-8">Ready to flex?</h2>
          <p className="text-lg text-black/50 font-medium mb-12">Join over 2 million shoppers who are already using FlexPay to shop smarter.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login" className="px-10 py-5 bg-black text-white rounded-full font-bold text-lg hover:bg-black/90 transition-all">
              Get Started for Free
            </Link>
            <Link to="/login" className="px-10 py-5 bg-white text-black border border-black/10 rounded-full font-bold text-lg hover:bg-black/5 transition-all">
              Download the App
            </Link>
          </div>
          <p className="mt-8 text-[10px] font-bold text-black/30 uppercase tracking-[0.3em]">No hidden fees • No hard credit checks</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F8F8F8] py-20 border-t border-black/[0.03]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Wallet className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-black">FlexPay</span>
              </div>
              <p className="text-sm text-black/40 font-medium leading-relaxed">
                The modern way to pay. Transparent, flexible, and fair.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">Product</h4>
              <ul className="space-y-3 text-[13px] text-black/50 font-semibold">
                <li><a href="#" className="hover:text-black transition-colors">How it works</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-black transition-colors">For Merchants</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Security</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">Company</h4>
              <ul className="space-y-3 text-[13px] text-black/50 font-semibold">
                <li><a href="#" className="hover:text-black transition-colors">About</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">Legal</h4>
              <ul className="space-y-3 text-[13px] text-black/50 font-semibold">
                <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-black/[0.03] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">© 2026 FlexPay Inc. All rights reserved.</p>
            <div className="flex gap-6">
              {['Twitter', 'Instagram', 'LinkedIn'].map(social => (
                <a key={social} href="#" className="text-[10px] font-bold text-black/30 uppercase tracking-widest hover:text-black transition-colors">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, variant = 'indigo' }: any) {
  const variants: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${variants[variant]}`}>
      {children}
    </span>
  );
}
