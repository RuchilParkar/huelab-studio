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
    <div className="w-full bg-[#0E1015] border border-[#222632] rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Top Preview Controls Bar */}
      <div className="p-3 sm:px-4 sm:py-3 border-b border-[#222632] flex flex-wrap items-center justify-between gap-2.5 bg-[#141720]/70">
        <div className="flex items-center gap-2">
          <Component className="w-4 h-4 text-[#8E95A5]" />
          <h3 className="text-xs font-semibold text-[#F1F3F7]">Interface simulation</h3>
          <span className="text-[11px] text-[#64748B] hidden sm:inline">
            • Live token mappings across production archetypes
          </span>
        </div>

        {/* Mode Selector & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher: Dark vs Light UI Context */}
          <div className="flex items-center p-0.5 bg-[#0B0C10] border border-[#222632] rounded-lg">
            <button
              onClick={() => setPreviewTheme('dark')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                previewTheme === 'dark' ? 'bg-[#181B24] text-[#F1F3F7] shadow-sm' : 'text-[#64748B] hover:text-[#9CA3AF]'
              }`}
              title="Simulate dark background"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewTheme('light')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                previewTheme === 'light' ? 'bg-[#181B24] text-[#F1F3F7] shadow-sm' : 'text-[#64748B] hover:text-[#9CA3AF]'
              }`}
              title="Simulate light background"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Archetype Modes */}
          <div className="flex items-center gap-0.5 p-0.5 bg-[#0B0C10] border border-[#222632] rounded-lg overflow-x-auto">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = previewMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setPreviewMode(m.id)}
                  className={`flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#181B24] text-[#F1F3F7] border border-[#2B303F] shadow-sm'
                      : 'text-[#8E95A5] hover:text-[#F1F3F7]'
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
      <div className="p-4 sm:p-6 bg-[#08090C] flex justify-center items-center min-h-[440px] overflow-x-auto">
        {/* 1. SAAS PLATFORM MODE */}
        {previewMode === 'saas' && (
          <div
            style={{ backgroundColor: bg }}
            className="w-full max-w-4xl rounded-xl border p-5 sm:p-7 shadow-lg transition-colors duration-200"
          >
            {/* SaaS Navbar */}
            <div
              style={{ backgroundColor: `${surface}`, borderColor: borderCol }}
              className="px-4 py-2.5 rounded-lg border flex items-center justify-between mb-6 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div style={{ backgroundColor: primary }} className="w-5 h-5 rounded-md" />
                <span style={{ color: textPrimary }} className="font-semibold text-xs tracking-tight">
                  Orbit Telemetry
                </span>
              </div>
              <div style={{ color: textMuted }} className="hidden sm:flex items-center gap-4 text-xs font-medium">
                <span className="hover:opacity-100 cursor-pointer">Telemetry</span>
                <span className="hover:opacity-100 cursor-pointer">Pipelines</span>
                <span className="hover:opacity-100 cursor-pointer">Clusters</span>
              </div>
              <button
                style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                Deploy cluster
              </button>
            </div>

            {/* SaaS Hero Section */}
            <div className="text-center max-w-lg mx-auto py-4">
              <span
                style={{ backgroundColor: `${accent}18`, color: accent, borderColor: `${accent}30` }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono border mb-3"
              >
                <span>Cluster v2.4 • Active</span>
              </span>
              <h2 style={{ color: textPrimary }} className="text-xl sm:text-2xl font-semibold tracking-tight mb-2">
                Distributed telemetry across edge clusters
              </h2>
              <p style={{ color: textMuted }} className="text-xs sm:text-sm mb-5 leading-relaxed max-w-md mx-auto">
                Continuous trace aggregation, latency histograms, and automated anomaly detection across active regions.
              </p>
              <div className="flex items-center justify-center gap-2.5">
                <button
                  style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>Connect provider</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  style={{ backgroundColor: surface, borderColor: borderCol, color: textPrimary }}
                  className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:opacity-90"
                >
                  Documentation
                </button>
              </div>
            </div>

            {/* Feature Metrics Grid */}
            <div style={{ borderColor: borderCol }} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t">
              {[
                { title: 'Ingestion rate', icon: TrendingUp, text: 'Sub-4ms p99 packet propagation turnaround.' },
                { title: 'Access control', icon: ShieldCheck, text: 'Mutual TLS verification with role-based policies.' },
                { title: 'Cluster sync', icon: Users, text: 'Synchronized raft consensus across 8 availability zones.' },
              ].map((card, i) => {
                const Icon = card.icon;
                const col = i === 0 ? primary : i === 1 ? secondary : accent;
                return (
                  <div
                    key={card.title}
                    style={{ backgroundColor: surface, borderColor: borderCol }}
                    className="p-3.5 rounded-lg border transition-colors shadow-sm"
                  >
                    <div
                      style={{ backgroundColor: `${col}18` }}
                      className="w-7 h-7 rounded-md flex items-center justify-center mb-2.5"
                    >
                      <Icon style={{ color: col }} className="w-3.5 h-3.5" />
                    </div>
                    <h4 style={{ color: textPrimary }} className="text-xs font-semibold mb-0.5">{card.title}</h4>
                    <p style={{ color: textMuted }} className="text-[11px] leading-relaxed">{card.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ANALYTICS DASHBOARD MODE */}
        {previewMode === 'dashboard' && (
          <div
            style={{ backgroundColor: bg }}
            className="w-full max-w-4xl rounded-xl border p-5 shadow-lg flex flex-col gap-4 transition-colors duration-200"
          >
            {/* Header */}
            <div style={{ borderColor: borderCol }} className="flex items-center justify-between pb-3.5 border-b">
              <div>
                <h3 style={{ color: textPrimary }} className="text-sm font-semibold">Cluster telemetry overview</h3>
                <p style={{ color: textMuted }} className="text-xs font-normal">Real-time throughput metrics</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  style={{ backgroundColor: surface, borderColor: borderCol, color: textPrimary }}
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-medium"
                >
                  Last 24 hours
                </button>
                <button
                  style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
                >
                  Export report
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'Active instances', val: '48,290', change: '+14.2% vs yesterday', col: primary },
                { label: 'p99 Latency', val: '18.4 ms', change: '-4.1% vs avg', col: secondary },
                { label: 'Cache hit ratio', val: '99.4%', change: '+0.2% vs baseline', col: accent },
                { label: 'Throughput', val: '1.24 GB/s', change: '+8.5% peak', col: primary },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  style={{ backgroundColor: surface, borderColor: borderCol }}
                  className="p-3.5 rounded-lg border flex flex-col justify-between shadow-sm"
                >
                  <span style={{ color: textMuted }} className="text-[11px] font-medium">{kpi.label}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span style={{ color: textPrimary }} className="text-base font-bold font-mono tabular-nums">{kpi.val}</span>
                    <span style={{ color: kpi.col }} className="text-[11px] font-mono font-medium">
                      {kpi.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Utilization Bar */}
            <div style={{ backgroundColor: surface, borderColor: borderCol }} className="p-3.5 rounded-lg border shadow-sm">
              <div className="flex justify-between text-xs mb-2 font-medium">
                <span style={{ color: textPrimary }}>Cluster allocation</span>
                <span style={{ color: textMuted }} className="font-mono tabular-nums">78%</span>
              </div>
              <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden flex">
                <div style={{ backgroundColor: primary, width: '45%' }} className="h-full" />
                <div style={{ backgroundColor: secondary, width: '20%' }} className="h-full" />
                <div style={{ backgroundColor: accent, width: '13%' }} className="h-full" />
              </div>
            </div>
          </div>
        )}

        {/* 3. STOREFRONT MODE */}
        {previewMode === 'ecommerce' && (
          <div
            style={{ backgroundColor: bg }}
            className="w-full max-w-4xl rounded-xl border p-5 shadow-lg transition-colors duration-200"
          >
            {/* Storefront Banner */}
            <div
              style={{
                backgroundColor: surface,
                borderColor: borderCol,
                color: textPrimary,
              }}
              className="p-5 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 shadow-sm"
            >
              <div>
                <span style={{ color: primary }} className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                  Hardware Studio
                </span>
                <h3 className="text-base font-semibold mt-1">Titanium Precision Caliper</h3>
                <p style={{ color: textMuted }} className="text-xs mt-0.5">Milled aerospace titanium reference gauge.</p>
              </div>
              <button
                style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                className="px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors shrink-0"
              >
                Inspect specs • $340
              </button>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Acoustic Reference Headset', price: '$220', rating: 4.9, col: primary },
                { name: 'Mechanical Grid Keyboard', price: '$180', rating: 4.8, col: secondary },
                { name: 'Anodized Desk Organiser', price: '$85', rating: 4.9, col: accent },
              ].map((prod) => (
                <div
                  key={prod.name}
                  style={{ backgroundColor: surface, borderColor: borderCol }}
                  className="p-3.5 rounded-lg border flex flex-col justify-between shadow-sm"
                >
                  <div
                    style={{ backgroundColor: `${prod.col}14` }}
                    className="h-24 rounded-md mb-3 flex items-center justify-center border border-black/5"
                  >
                    <ShoppingBag style={{ color: prod.col }} className="w-6 h-6 opacity-80" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 mb-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-mono tabular-nums">{prod.rating}</span>
                    </div>
                    <h5 style={{ color: textPrimary }} className="text-xs font-semibold">{prod.name}</h5>
                  </div>
                  <div style={{ borderColor: borderCol }} className="flex items-center justify-between mt-3 pt-2.5 border-t">
                    <span style={{ color: textPrimary }} className="text-xs font-bold font-mono tabular-nums">{prod.price}</span>
                    <button
                      style={{ backgroundColor: prod.col, color: getIdealTextColor(prod.col) }}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium shadow-sm"
                    >
                      Add
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
            className="w-72 rounded-2xl border-2 border-[#222632] p-4 shadow-xl flex flex-col gap-3.5 transition-colors duration-200"
          >
            <div className="w-16 h-1 bg-[#222632] rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <div>
                <span style={{ color: textMuted }} className="text-[10px] block">Oct 2026</span>
                <span style={{ color: textPrimary }} className="text-xs font-semibold">Production Node</span>
              </div>
              <div
                style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold font-mono"
              >
                PN
              </div>
            </div>

            <div
              style={{
                backgroundColor: surface,
                borderColor: borderCol,
                color: textPrimary,
              }}
              className="p-3.5 rounded-xl border shadow-sm"
            >
              <span style={{ color: textMuted }} className="text-[10px] block font-mono">Allocation balance</span>
              <span className="text-lg font-bold font-mono tabular-nums block mt-0.5">$24,850.40</span>
              <div className="flex justify-between items-center mt-3 text-[10px]">
                <span style={{ color: textMuted }} className="font-mono">us-east-1a</span>
                <span style={{ color: primary }} className="font-mono font-medium">99.98% online</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Metrics', col: primary },
                { label: 'Traces', col: secondary },
                { label: 'Alerts', col: accent },
              ].map((act) => (
                <div
                  key={act.label}
                  style={{ backgroundColor: surface, borderColor: borderCol }}
                  className="p-2 rounded-lg border flex flex-col items-center gap-1 shadow-sm"
                >
                  <div style={{ backgroundColor: `${act.col}20` }} className="w-6 h-6 rounded-md flex items-center justify-center">
                    <TrendingUp style={{ color: act.col }} className="w-3 h-3" />
                  </div>
                  <span style={{ color: textPrimary }} className="text-[10px] font-medium">{act.label}</span>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: surface, borderColor: borderCol }} className="mt-1 p-2 rounded-lg flex justify-around border shadow-sm">
              <div style={{ color: primary }} className="p-1">
                <Laptop className="w-3.5 h-3.5" />
              </div>
              <div style={{ color: textMuted }} className="p-1">
                <Search className="w-3.5 h-3.5" />
              </div>
              <div style={{ color: textMuted }} className="p-1">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* 5. DESIGN SYSTEM & COMPONENT LIBRARY MODE */}
        {previewMode === 'components' && (
          <div
            style={{ backgroundColor: bg }}
            className="w-full max-w-4xl rounded-xl border p-5 sm:p-7 shadow-lg transition-colors duration-200 space-y-5"
          >
            <div style={{ borderColor: borderCol }} className="flex items-center justify-between pb-3.5 border-b">
              <div>
                <h3 style={{ color: textPrimary }} className="text-sm font-semibold">Design token preview</h3>
                <p style={{ color: textMuted }} className="text-xs">Live component variants mapped to your palette tokens</p>
              </div>
              <span
                style={{ backgroundColor: `${primary}18`, color: primary, borderColor: `${primary}30` }}
                className="px-2 py-0.5 rounded text-[11px] font-mono font-medium border"
              >
                Tokens Active
              </span>
            </div>

            {/* Buttons Row */}
            <div className="space-y-2">
              <span style={{ color: textMuted }} className="text-xs font-medium block">Interactive controls</span>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  style={{ backgroundColor: primary, color: getIdealTextColor(primary) }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Primary CTA
                </button>
                <button
                  style={{ backgroundColor: secondary, color: getIdealTextColor(secondary) }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Secondary action
                </button>
                <button
                  style={{ backgroundColor: `${accent}20`, color: accent, borderColor: `${accent}35` }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-90"
                >
                  Accent soft
                </button>
                <button
                  style={{ backgroundColor: surface, borderColor: borderCol, color: textPrimary }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium border"
                >
                  Outline neutral
                </button>
              </div>
            </div>

            {/* Form Controls & Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div style={{ backgroundColor: surface, borderColor: borderCol }} className="p-3.5 rounded-lg border space-y-2">
                <span style={{ color: textPrimary }} className="text-xs font-semibold block">Input field state</span>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="tokens@huelabstudio.com"
                    style={{
                      backgroundColor: bg,
                      color: textPrimary,
                      borderColor: primary,
                    }}
                    className="w-full px-3 py-1.5 rounded-md text-xs border focus:outline-none font-mono"
                  />
                  <Check style={{ color: primary }} className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div style={{ backgroundColor: surface, borderColor: borderCol }} className="p-3.5 rounded-lg border space-y-2">
                <span style={{ color: textPrimary }} className="text-xs font-semibold block">Semantic token chips</span>
                <div className="flex flex-wrap gap-2">
                  <span style={{ backgroundColor: `${primary}20`, color: primary }} className="px-2 py-0.5 rounded text-[11px] font-mono">
                    --color-primary
                  </span>
                  <span style={{ backgroundColor: `${secondary}20`, color: secondary }} className="px-2 py-0.5 rounded text-[11px] font-mono">
                    --color-secondary
                  </span>
                  <span style={{ backgroundColor: `${accent}20`, color: accent }} className="px-2 py-0.5 rounded text-[11px] font-mono">
                    --color-accent
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Token Inspector Ribbon */}
      <div className="px-4 py-2.5 bg-[#0A0B0E] border-t border-[#222632] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[#64748B] font-mono text-[11px]">ACTIVE TOKENS:</span>
          <div className="flex items-center gap-1.5">
            <span style={{ backgroundColor: primary }} className="w-2.5 h-2.5 rounded-sm" />
            <span className="text-[#F1F3F7] font-mono text-[11px]">Primary ({primary})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ backgroundColor: secondary }} className="w-2.5 h-2.5 rounded-sm" />
            <span className="text-[#F1F3F7] font-mono text-[11px]">Secondary ({secondary})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ backgroundColor: accent }} className="w-2.5 h-2.5 rounded-sm" />
            <span className="text-[#F1F3F7] font-mono text-[11px]">Accent ({accent})</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums">
          <span className="text-[#64748B]">Text vs BG:</span>
          <span className="text-emerald-400 font-semibold">{textOnBgRatio}:1</span>
          <span className="text-[#64748B]">Text vs Surface:</span>
          <span className="text-emerald-400 font-semibold">{textOnSurfaceRatio}:1</span>
        </div>
      </div>
    </div>
  );
};
