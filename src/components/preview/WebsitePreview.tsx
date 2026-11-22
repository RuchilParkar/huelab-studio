import React from 'react';
import { useHueStore, PreviewMode } from '../../store/useHueStore';
import {
  Laptop,
  LayoutDashboard,
  ShoppingBag,
  Smartphone,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Star,
  Users,
  Search,
  Component,
  Sun,
  Moon,
  Check,
  AlertCircle,
  Bell,
  Sliders,
} from 'lucide-react';
import { getContrastRatio, getIdealTextColor } from '../../engine/colorAccessibility';

export const WebsitePreview: React.FC = () => {
  const {
    currentPalette,
    previewMode,
    setPreviewMode,
    previewTheme,
    setPreviewTheme,
    setFocusedColorIndex,
  } = useHueStore();

  const colors = currentPalette.colors;

  // Intelligently find colors by their semantic role, with resilient fallbacks
  const primary = colors.find((c) => c.role === 'primary')?.hex || colors[0]?.hex || '#7C5CFC';
  const secondary = colors.find((c) => c.role === 'secondary')?.hex || colors[1]?.hex || '#6366F1';
  const accent = colors.find((c) => c.role === 'accent')?.hex || colors[2]?.hex || '#EC4899';

  // Dynamic surface & background depending on previewTheme toggle
  const defaultDarkBg = colors.find((c) => c.role === 'background')?.hex || '#0B0C10';
  const defaultDarkSurface = colors.find((c) => c.role === 'surface')?.hex || '#171A22';

  const bg = previewTheme === 'dark' ? defaultDarkBg : '#F8FAFC';
  const surface = previewTheme === 'dark' ? defaultDarkSurface : '#FFFFFF';
  const textPrimary = colors.find((c) => c.role === 'text')?.hex || (previewTheme === 'dark' ? '#F4F5F7' : '#0F172A');
  const textMuted = colors.find((c) => c.role === 'muted')?.hex || (previewTheme === 'dark' ? '#9298A6' : '#64748B');
  const borderCol = previewTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  // Contrast evaluations for inspector
  const primaryOnBgRatio = getContrastRatio(primary, bg);
  const textOnBgRatio = getContrastRatio(textPrimary, bg);
  const textOnSurfaceRatio = getContrastRatio(textPrimary, surface);

  const modes: { id: PreviewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'saas', label: 'SaaS Platform', icon: Laptop },
    { id: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { id: 'ecommerce', label: 'Storefront', icon: ShoppingBag },
    { id: 'mobile', label: 'Mobile App', icon: Smartphone },
    { id: 'components', label: 'Component System', icon: Component },
  ];

  return (
    <div className="w-full bg-[#111319] border border-[#272B36] rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Top Preview Controls Bar */}
      <div className="p-3.5 sm:p-4 border-b border-[#272B36] flex flex-wrap items-center justify-between gap-3 bg-[#171A22]/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#A78BFA]" />
          <h3 className="text-xs font-semibold text-[#F4F5F7]">Live UI Simulation</h3>
          <span className="text-[10px] text-[#626A78] hidden sm:inline">
            • Reactive design tokens mapped across real components
          </span>
        </div>

        {/* Mode Selector & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher: Dark vs Light UI Context */}
          <div className="flex items-center p-0.5 bg-[#0B0C10] border border-[#272B36] rounded-xl">
            <button
              onClick={() => setPreviewTheme('dark')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                previewTheme === 'dark' ? 'bg-[#171A22] text-[#A78BFA] shadow-sm' : 'text-[#626A78] hover:text-[#9298A6]'
              }`}
              title="Simulate Dark UI Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewTheme('light')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                previewTheme === 'light' ? 'bg-[#171A22] text-[#A78BFA] shadow-sm' : 'text-[#626A78] hover:text-[#9298A6]'
              }`}
              title="Simulate Light UI Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Archetype Modes */}
          <div className="flex items-center gap-1 p-1 bg-[#0B0C10] border border-[#272B36] rounded-xl overflow-x-auto">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = previewMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setPreviewMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#7C5CFC] text-white shadow-sm'
                      : 'text-[#9298A6] hover:text-[#F4F5F7]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Simulated Preview Container */}
      <div className="p-4 sm:p-8 bg-[#0B0C10]/80 flex justify-center items-center min-h-[460px] overflow-x-auto">
        {/* 1. SAAS MODE */}
        {previewMode === 'saas' && (
          <div
            style={{ backgroundColor: bg }}
            className="w-full max-w-4xl rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all duration-300"
          >
            {/* SaaS Navbar */}
            <div
              style={{ backgroundColor: `${surface}ee`, borderColor: borderCol }}
              className="px-5 py-3 rounded-xl border flex items-center justify-between backdrop-blur-md mb-8 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div style={{ backgroundColor: primary }} className="w-6 h-6 rounded-lg shadow-md" />
                <span style={{ color: textPrimary }} className="font-bold text-sm tracking-tight">
                  Apex Cloud
                </span>
              </div>
              <div style={{ color: textMuted }} className="hidden sm:flex items-center gap-5 text-xs">
                <span className="hover:opacity-100 cursor-pointer">Product</span>
                <span className="hover:opacity-100 cursor-pointer">Solutions</span>
                <span className="hover:opacity-100 cursor-pointer">Pricing</span>
              </div>
              <button
                style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-transform hover:scale-105"
              >
                Get Started
              </button>
            </div>

            {/* SaaS Hero Section */}
            <div className="text-center max-w-xl mx-auto py-6">
              <span
                style={{ backgroundColor: `${accent}20`, color: accent, borderColor: `${accent}40` }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-4"
              >
                <Sparkles className="w-3 h-3" />
                <span>Next-Gen Cloud Intelligence</span>
              </span>
              <h2 style={{ color: textPrimary }} className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                Orchestrate your workflow with absolute confidence.
              </h2>
              <p style={{ color: textMuted }} className="text-xs sm:text-sm mb-6 leading-relaxed">
                Empower your engineering teams with unified deployment insights, real-time telemetry, and resilient microservices.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  style={{ backgroundColor: surface, borderColor: borderCol, color: textPrimary }}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all hover:opacity-90"
                >
                  Book Demo
                </button>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div style={{ borderColor: borderCol }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t">
              {[
                { title: 'Zero Latency', icon: TrendingUp, text: 'Edge routing with sub-5ms packet turnaround.' },
                { title: 'Verified Security', icon: ShieldCheck, text: 'End-to-end encryption with SOC2 compliance.' },
                { title: 'Team Sync', icon: Users, text: 'Real-time collaborative canvas for developer squads.' },
              ].map((card, i) => {
                const Icon = card.icon;
                const col = i === 0 ? primary : i === 1 ? secondary : accent;
                return (
                  <div
                    key={card.title}
                    style={{ backgroundColor: surface, borderColor: borderCol }}
                    className="p-4 rounded-xl border transition-all hover:scale-[1.02] shadow-sm"
                  >
                    <div
                      style={{ backgroundColor: `${col}20` }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    >
                      <Icon style={{ color: col }} className="w-4 h-4" />
                    </div>
                    <h4 style={{ color: textPrimary }} className="text-xs font-semibold mb-1">{card.title}</h4>
                    <p style={{ color: textMuted }} className="text-[11px] leading-relaxed">{card.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. DASHBOARD MODE */}
        {previewMode === 'dashboard' && (
          <div
            style={{ backgroundColor: bg }}
            className="w-full max-w-4xl rounded-2xl border p-6 shadow-2xl flex flex-col gap-5 transition-all duration-300"
          >
            {/* Header */}
            <div style={{ borderColor: borderCol }} className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 style={{ color: textPrimary }} className="text-base font-bold">System Analytics Overview</h3>
                <p style={{ color: textMuted }} className="text-xs">Real-time throughput metrics</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  style={{ backgroundColor: surface, borderColor: borderCol, color: textPrimary }}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium"
                >
                  Last 24 Hours
                </button>
                <button
                  style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md"
                >
                  Generate Report
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { label: 'Active Sessions', val: '48,290', change: '+14.2%', col: primary },
                { label: 'Avg Latency', val: '18.4 ms', change: '-4.1%', col: secondary },
                { label: 'Conversion Rate', val: '6.42%', change: '+0.8%', col: accent },
                { label: 'Revenue Yield', val: '$128,490', change: '+22.5%', col: primary },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  style={{ backgroundColor: surface, borderColor: borderCol }}
                  className="p-4 rounded-xl border flex flex-col justify-between shadow-sm"
                >
                  <span style={{ color: textMuted }} className="text-[11px] font-medium">{kpi.label}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span style={{ color: textPrimary }} className="text-lg font-bold font-mono">{kpi.val}</span>
                    <span style={{ color: kpi.col }} className="text-xs font-semibold">
                      {kpi.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Utilization Bar */}
            <div style={{ backgroundColor: surface, borderColor: borderCol }} className="p-4 rounded-xl border shadow-sm">
              <div className="flex justify-between text-xs mb-2 font-medium">
                <span style={{ color: textPrimary }}>Cluster Utilization</span>
                <span style={{ color: textMuted }} className="font-mono">78%</span>
              </div>
              <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden flex">
                <div style={{ backgroundColor: primary, width: '45%' }} className="h-full" />
                <div style={{ backgroundColor: secondary, width: '20%' }} className="h-full" />
                <div style={{ backgroundColor: accent, width: '13%' }} className="h-full" />
              </div>
            </div>
          </div>
        )}

        {/* 3. E-COMMERCE STOREFRONT MODE */}
        {previewMode === 'ecommerce' && (
          <div
            style={{ backgroundColor: bg }}
            className="w-full max-w-4xl rounded-2xl border p-6 shadow-2xl transition-all duration-300"
          >
            {/* Hero Storefront Banner */}
            <div
              style={{
                background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                color: getIdealTextColor(primary),
              }}
              className="p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-lg"
            >
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase bg-black/20 px-2.5 py-1 rounded-full">
                  Curated Collection
                </span>
                <h3 className="text-xl font-bold mt-2">Nordic Titanium Chronograph</h3>
                <p className="text-xs opacity-90 mt-1">Precision milled aerospace titanium timepiece.</p>
              </div>
              <button
                style={{ backgroundColor: '#FFFFFF', color: '#0B0C10' }}
                className="px-5 py-2 rounded-xl text-xs font-bold shadow-lg transition-transform hover:scale-105 shrink-0"
              >
                Shop Now • $340
              </button>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Onyx Wireless ANC', price: '$220', rating: 4.9, col: primary },
                { name: 'Mechanical Sculpt Keyboard', price: '$180', rating: 4.8, col: secondary },
                { name: 'Minimalist Leather Desk Pad', price: '$85', rating: 4.9, col: accent },
              ].map((prod) => (
                <div
                  key={prod.name}
                  style={{ backgroundColor: surface, borderColor: borderCol }}
                  className="p-4 rounded-xl border flex flex-col justify-between shadow-sm"
                >
                  <div
                    style={{ backgroundColor: `${prod.col}18` }}
                    className="h-28 rounded-lg mb-3 flex items-center justify-center border border-black/5"
                  >
                    <ShoppingBag style={{ color: prod.col }} className="w-8 h-8 opacity-75" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 mb-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{prod.rating}</span>
                    </div>
                    <h5 style={{ color: textPrimary }} className="text-xs font-semibold">{prod.name}</h5>
                  </div>
                  <div style={{ borderColor: borderCol }} className="flex items-center justify-between mt-4 pt-3 border-t">
                    <span style={{ color: textPrimary }} className="text-sm font-bold font-mono">{prod.price}</span>
                    <button
                      style={{ backgroundColor: prod.col, color: getIdealTextColor(prod.col) }}
                      className="px-3 py-1 rounded-lg text-[11px] font-semibold shadow-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MOBILE APPLICATION MODE */}
        {previewMode === 'mobile' && (
          <div
            style={{ backgroundColor: bg }}
            className="w-72 rounded-[32px] border-4 border-[#272B36] p-4 shadow-2xl flex flex-col gap-4 transition-all duration-300"
          >
            <div className="w-24 h-4 bg-[#272B36] rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <div>
                <span style={{ color: textMuted }} className="text-[10px] block">Welcome back,</span>
                <span style={{ color: textPrimary }} className="text-sm font-bold">Alex Morgan</span>
              </div>
              <div
                style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow"
              >
                AM
              </div>
            </div>

            <div
              style={{
                background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                color: getIdealTextColor(primary),
              }}
              className="p-4 rounded-2xl shadow-lg"
            >
              <span className="text-[10px] opacity-80 block">Total Balance</span>
              <span className="text-xl font-bold font-mono block mt-1">$24,850.40</span>
              <div className="flex justify-between items-center mt-4 text-[10px]">
                <span className="font-mono">•••• 4829</span>
                <span className="bg-black/20 px-2 py-0.5 rounded-full">Active</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Transfer', col: primary },
                { label: 'Analytics', col: secondary },
                { label: 'Rewards', col: accent },
              ].map((act) => (
                <div
                  key={act.label}
                  style={{ backgroundColor: surface, borderColor: borderCol }}
                  className="p-2.5 rounded-xl border flex flex-col items-center gap-1.5 shadow-sm"
                >
                  <div style={{ backgroundColor: `${act.col}25` }} className="w-6 h-6 rounded-lg flex items-center justify-center">
                    <TrendingUp style={{ color: act.col }} className="w-3.5 h-3.5" />
                  </div>
                  <span style={{ color: textPrimary }} className="text-[10px] font-medium">{act.label}</span>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: surface, borderColor: borderCol }} className="mt-2 p-2 rounded-xl flex justify-around border shadow-sm">
              <div style={{ color: primary }} className="p-1">
                <Laptop className="w-4 h-4" />
              </div>
              <div style={{ color: textMuted }} className="p-1">
                <Search className="w-4 h-4" />
              </div>
              <div style={{ color: textMuted }} className="p-1">
                <Users className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* 5. DESIGN SYSTEM & COMPONENT LIBRARY MODE */}
        {previewMode === 'components' && (
          <div
            style={{ backgroundColor: bg }}
            className="w-full max-w-4xl rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all duration-300 space-y-6"
          >
            <div style={{ borderColor: borderCol }} className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 style={{ color: textPrimary }} className="text-base font-bold">Design System Token Preview</h3>
                <p style={{ color: textMuted }} className="text-xs">Live component variants mapped to your palette tokens</p>
              </div>
              <span
                style={{ backgroundColor: `${primary}20`, color: primary, borderColor: `${primary}40` }}
                className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold border"
              >
                Tokens Active
              </span>
            </div>

            {/* Buttons Row */}
            <div className="space-y-2">
              <span style={{ color: textMuted }} className="text-xs font-medium block">Interactive Buttons</span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-transform hover:scale-105"
                >
                  Primary CTA
                </button>
                <button
                  style={{ backgroundColor: secondary, color: getIdealTextColor(secondary) }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-transform hover:scale-105"
                >
                  Secondary Action
                </button>
                <button
                  style={{ backgroundColor: `${accent}25`, color: accent, borderColor: `${accent}40` }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-90"
                >
                  Accent Soft
                </button>
                <button
                  style={{ backgroundColor: surface, borderColor: borderCol, color: textPrimary }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                >
                  Outline Neutral
                </button>
              </div>
            </div>

            {/* Form Controls & Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div style={{ backgroundColor: surface, borderColor: borderCol }} className="p-4 rounded-xl border space-y-3">
                <span style={{ color: textPrimary }} className="text-xs font-semibold block">Form Inputs & Focus Glow</span>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="hello@huelab.studio"
                    style={{
                      backgroundColor: bg,
                      color: textPrimary,
                      borderColor: primary,
                      boxShadow: `0 0 0 2px ${primary}33`,
                    }}
                    className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none"
                  />
                  <Check style={{ color: primary }} className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div style={{ backgroundColor: surface, borderColor: borderCol }} className="p-4 rounded-xl border space-y-3">
                <span style={{ color: textPrimary }} className="text-xs font-semibold block">Status & Category Chips</span>
                <div className="flex flex-wrap gap-2">
                  <span style={{ backgroundColor: `${primary}20`, color: primary }} className="px-2.5 py-1 rounded-md text-[11px] font-medium">
                    --color-primary
                  </span>
                  <span style={{ backgroundColor: `${secondary}20`, color: secondary }} className="px-2.5 py-1 rounded-md text-[11px] font-medium">
                    --color-secondary
                  </span>
                  <span style={{ backgroundColor: `${accent}20`, color: accent }} className="px-2.5 py-1 rounded-md text-[11px] font-medium">
                    --color-accent
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Token Inspector Ribbon */}
      <div className="p-3 bg-[#0B0C10] border-t border-[#272B36] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[#626A78] font-mono text-[11px]">ACTIVE TOKENS:</span>
          <div className="flex items-center gap-1.5">
            <span style={{ backgroundColor: primary }} className="w-2.5 h-2.5 rounded-full" />
            <span className="text-[#F4F5F7] font-mono text-[11px]">Primary ({primary})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ backgroundColor: secondary }} className="w-2.5 h-2.5 rounded-full" />
            <span className="text-[#F4F5F7] font-mono text-[11px]">Secondary ({secondary})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ backgroundColor: accent }} className="w-2.5 h-2.5 rounded-full" />
            <span className="text-[#F4F5F7] font-mono text-[11px]">Accent ({accent})</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-[#626A78]">Text vs BG:</span>
          <span className="text-emerald-400 font-semibold">{textOnBgRatio}:1</span>
          <span className="text-[#626A78]">Text vs Surface:</span>
          <span className="text-emerald-400 font-semibold">{textOnSurfaceRatio}:1</span>
        </div>
      </div>
    </div>
  );
};
