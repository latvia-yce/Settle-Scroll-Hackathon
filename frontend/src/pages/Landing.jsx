// pages/Landing.jsx
import React, { useState } from 'react';
import ConnectWalletModal from '../components/ConnectWalletModal';

function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="dark">
      <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-200">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
            <div className="layout-container flex h-full grow flex-col">
              <div className="w-full flex justify-center">
                <div className="layout-content-container flex w-full max-w-[1280px] items-center justify-between px-4 py-4 md:px-10">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>bolt</span>
                    </div>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Gasless</h2>
                  </div>
                  <nav className="hidden md:flex items-center gap-8">
                    <a className="text-gray-400 hover:text-white text-sm font-medium transition-colors" href="#">
                      How it works
                    </a>
                    <a className="text-gray-400 hover:text-white text-sm font-medium transition-colors" href="#">
                      FAQ
                    </a>
                    <a className="text-gray-400 hover:text-white text-sm font-medium transition-colors" href="#">
                      Docs
                    </a>
                  </nav>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="hidden md:flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/5 transition-colors"
                    >
                      Connect Wallet
                    </button>
                    <button className="md:hidden text-white">
                      <span className="material-symbols-outlined">menu</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative flex flex-col items-center justify-center px-4 py-20 md:px-10 lg:py-32 overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary/15 blur-[120px]"></div>
            <div className="pointer-events-none absolute -left-20 -top-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[128px]"></div>
            <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-blue-600/10 blur-[128px]"></div>
            
            <div className="relative z-10 max-w-[1280px] w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Column */}
              <div className="flex flex-col gap-8">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>verified_user</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-white">Secured by Scroll ZKP</span>
                </div>
                
                <div className="flex flex-col gap-4">
                  <h1 className="text-5xl font-black leading-tight tracking-tighter text-white sm:text-6xl md:text-7xl">
                    Send USDC Invoices. <span className="text-primary">Pay Zero Gas.</span>
                  </h1>
                  <p className="max-w-xl text-lg text-gray-400 font-light leading-relaxed">
                    The first gasless invoicing protocol built on Scroll. Experience instant finality, audited security, and completely free transactions.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-bold text-black transition-transform hover:scale-105 hover:shadow-[0_0_20px_rgba(15,184,71,0.4)]"
                  >
                    <span>Launch App</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                  </button>
                  <button className="flex h-12 items-center justify-center rounded-lg border border-white/20 bg-transparent px-6 text-base font-bold text-white hover:bg-white/5 transition-colors">
                    Read Documentation
                  </button>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-4">
                  <div className="flex -space-x-2">
                    <div 
                      className="h-8 w-8 rounded-full bg-gray-800 border-2 border-background-dark bg-cover bg-center" 
                      style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-oa3iQu-TiVs2KAJu22PWRn7SsjQQlH-8iVjVm1yjTQOVe-EW7fQoaWotyspjjTuuTXiYEb3GUv50yykGchjO6Qx76QvKLCWL-hYKRSkaFPMeaBTKl0W_xHXB71KER1Oxq4JACthICgmOT9oO4y7ytrlggXSjDcl-6ZDMbftr9M_8l57wzU9uT5XkW5I_oyW8645uawoWdB_vlnMqVsdC-r7jHL5Xj5mKhvOWgnYT2Teh_cuyXXnmz7CcYfpljGb1Ut9d-BdxWmsN')` }}
                    ></div>
                    <div 
                      className="h-8 w-8 rounded-full bg-gray-700 border-2 border-background-dark bg-cover bg-center" 
                      style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDa_jRUD00M-Ht2wxUSdlTlTNYcDT5GucKgdqm_TdvaPhP1SwWrCI_gi7POm9oCNIIig8kh0BEmRE2_z0xr3qrsrf2TyziQtQFqXJALkE8PMZ1T2r6H8j3GbvpxvQHhRnwBmDm9SF156T6Gsow0q0Hjn4Y2lmEkaFlV4Dmtxqw0IpuU6ZGwpL_cK079xrZQTCPjEvqljD9bKvImFmCqK_L8FMDsxijgLFR3jb62bR0L-uW2eM5KDjWRTqDFF780Qd4xSZteVRDaTt-N')` }}
                    ></div>
                    <div 
                      className="h-8 w-8 rounded-full bg-gray-600 border-2 border-background-dark bg-cover bg-center" 
                      style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAb0IGbpmNOLje6NNs4I4di6F7-pwKCO6naISPBacn4VbBZqwC6eSANcV13jWlsUHnDm81pYl1aEFdbVgrR-NxRm6W3OGikRl8_WdHySLpv0DfM52sCt3MkGDL4dAfqRhcEMYydg5MKZ_jM4P1ss0FDX-WhgV78mzraKu3U1LWsaN4znBLt9R8QaEszY1umG5LzQtof5A8HdGDXeB_MMTvfpCPAD1ZKEwa0FPO5nHxbagRRykT8-_RFUjyM6eUf4sD_28toNIOkHK0z')` }}
                    ></div>
                  </div>
                  <p>Trusted by 10,000+ users</p>
                </div>
              </div>
              
              {/* Right Column - Demo Card */}
              <div className="relative w-full aspect-square md:aspect-[4/3] lg:h-auto rounded-2xl border border-white/10 bg-card-dark/50 p-2 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
                <div className="relative h-full w-full rounded-xl bg-background-dark overflow-hidden flex items-center justify-center">
                  <div 
                    className="absolute inset-0 opacity-30" 
                    style={{ 
                      backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', 
                      backgroundSize: '20px 20px' 
                    }}
                  ></div>
                  
                  <div className="relative z-10 w-3/4 flex flex-col gap-3 rounded-xl border border-white/10 bg-[#111] p-6 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-3 w-20 rounded-full bg-gray-700"></div>
                      <div className="h-6 w-16 rounded bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">SENT</div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">2,450.00</span>
                      <span className="text-lg font-medium text-gray-400">USDC</span>
                    </div>
                    <div className="mt-2 h-[1px] w-full bg-gray-800"></div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Gas Fee</span>
                      <span className="text-primary font-bold">0.00 USDC</span>
                    </div>
                  </div>
                  
                  <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-primary/20 blur-[100px]"></div>
                  <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="relative w-full bg-background-dark py-20">
            <div className="layout-container flex justify-center">
              <div className="layout-content-container flex w-full max-w-[1280px] flex-col gap-16 px-4 md:px-10">
                <div className="flex flex-col gap-4 text-center md:text-left">
                  <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl md:max-w-2xl">
                    Why choose <span className="text-primary">Gasless</span>?
                  </h2>
                  <p className="text-lg font-light text-gray-400 md:max-w-2xl">
                    Experience the future of payments with our secured Scroll ZKP infrastructure. No hidden fees, no delays.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Feature 1 */}
                  <div className="group relative flex flex-col gap-4 rounded-xl border border-white/10 bg-card-dark p-8 transition-all hover:border-primary/50 hover:bg-card-dark/80">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>currency_exchange</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-white">No ETH Needed</h3>
                      <p className="text-gray-400 leading-relaxed">Pay only what you owe in USDC without worrying about holding ETH for gas fees.</p>
                    </div>
                  </div>
                  
                  {/* Feature 2 */}
                  <div className="group relative flex flex-col gap-4 rounded-xl border border-white/10 bg-card-dark p-8 transition-all hover:border-primary/50 hover:bg-card-dark/80">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>flash_on</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-white">Instant Finality</h3>
                      <p className="text-gray-400 leading-relaxed">Lightning-fast settlement times on Scroll ensure immediate access to your funds.</p>
                    </div>
                  </div>
                  
                  {/* Feature 3 */}
                  <div className="group relative flex flex-col gap-4 rounded-xl border border-white/10 bg-card-dark p-8 transition-all hover:border-primary/50 hover:bg-card-dark/80">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>shield_lock</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-white">Audited Security</h3>
                      <p className="text-gray-400 leading-relaxed">Smart contracts verified for safety and reliability, secured by Scroll's zkEVM technology.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative w-full py-24 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
            <div className="layout-container flex justify-center relative z-10">
              <div className="layout-content-container flex w-full max-w-[960px] flex-col items-center gap-8 rounded-3xl border border-white/10 bg-[#0a0f0c] p-10 text-center md:p-20 shadow-2xl shadow-primary/5">
                <div className="flex flex-col gap-4 items-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>rocket_launch</span>
                  </div>
                  <h2 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
                    Ready to start invoicing?
                  </h2>
                  <p className="max-w-xl text-lg text-gray-400">
                    Join thousands of freelancers and DAOs saving on gas fees today. It takes less than 30 seconds to send your first invoice.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex h-12 w-full min-w-[200px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-bold text-black transition-transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 sm:w-auto"
                  >
                    Launch App
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="w-full border-t border-white/5 bg-background-dark py-12">
            <div className="layout-container flex justify-center px-4">
              <div className="layout-content-container flex w-full max-w-[1280px] flex-col gap-8 md:flex-row md:justify-between md:items-center">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    <span className="text-lg font-bold">Gasless</span>
                  </div>
                  <p className="text-sm text-gray-500 max-w-xs">
                    The future of crypto invoicing. Built for speed, security, and zero friction.
                  </p>
                </div>
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
                  <div className="flex gap-6">
                    <a className="text-sm text-gray-400 hover:text-primary transition-colors" href="#">
                      Terms of Service
                    </a>
                    <a className="text-sm text-gray-400 hover:text-primary transition-colors" href="#">
                      Privacy Policy
                    </a>
                    <a className="text-sm text-gray-400 hover:text-primary transition-colors" href="#">
                      Docs
                    </a>
                  </div>
                  <div className="flex gap-4">
                    <a className="text-gray-500 hover:text-white transition-colors" href="#">
                      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>flutter_dash</span>
                    </a>
                    <a className="text-gray-500 hover:text-white transition-colors" href="#">
                      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>forum</span>
                    </a>
                    <a className="text-gray-500 hover:text-white transition-colors" href="#">
                      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>code</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <p className="text-xs text-gray-600">© 2024 Gasless Invoicing. All rights reserved.</p>
            </div>
          </footer>

          {/* Connect Wallet Modal */}
          <ConnectWalletModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      </div>
    </div>
  );
}

export default Landing;