import React, { useState } from 'react';
import {
  Calculator,
  FileText,
  Code2,
  Link2,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { formatIDR } from '../../data/initialData';

interface ToolsTabProps {
  onLogActivity: (action: string, target: string, amount?: string) => void;
}

type ToolId = 'roi' | 'invoice' | 'converter' | 'utm';

export const ToolsTab: React.FC<ToolsTabProps> = ({ onLogActivity }) => {
  const [activeTool, setActiveTool] = useState<ToolId>('roi');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Tool 1: ROI & Margin Calculator State
  const [investmentCost, setInvestmentCost] = useState<number>(45000000);
  const [monthlyOperational, setMonthlyOperational] = useState<number>(8500000);
  const [unitPrice, setUnitPrice] = useState<number>(3500000);
  const [projectedUnits, setProjectedUnits] = useState<number>(28);

  const grossRevenue = unitPrice * projectedUnits;
  const totalCost = investmentCost + monthlyOperational;
  const netProfit = grossRevenue - totalCost;
  const roiPercentage = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : '0.0';
  const netMarginPercentage =
    grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  // Tool 2: Quick Invoice & Tax Generator State
  const [clientName, setClientName] = useState('PT Vortech Digital Nusantara');
  const [serviceDesc, setServiceDesc] = useState('Implementasi Lisensi Enterprise Zyroxx & Integrasi API');
  const [subtotalAmount, setSubtotalAmount] = useState<number>(125000000);
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [includePpn, setIncludePpn] = useState<boolean>(true);

  const discountValue = Math.round(subtotalAmount * (discountPercent / 100));
  const afterDiscount = subtotalAmount - discountValue;
  const ppnValue = includePpn ? Math.round(afterDiscount * 0.11) : 0;
  const grandTotalInvoice = afterDiscount + ppnValue;

  // Tool 3: Developer Text / JSON / Base64 / Slug Utility
  const [rawInput, setRawInput] = useState(
    '{"workspace":"Zyroxx","plan":"Enterprise","activeUsers":128,"region":"Asia-Southeast"}'
  );
  const [transformMode, setTransformMode] = useState<'json' | 'base64_enc' | 'slug'>('json');

  const getTransformedOutput = (): string => {
    if (!rawInput.trim()) return '';
    if (transformMode === 'json') {
      try {
        const parsed = JSON.parse(rawInput);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return 'Format JSON tidak valid. Pastikan tanda kutip dan kurung kurawal sesuai.';
      }
    }
    if (transformMode === 'base64_enc') {
      try {
        return btoa(unescape(encodeURIComponent(rawInput)));
      } catch {
        return 'Gagal mengenkode teks ke Base64.';
      }
    }
    // slug
    return rawInput
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  // Tool 4: Campaign UTM Link Builder
  const [baseUrl, setBaseUrl] = useState('https://zyroxx.id/enterprise');
  const [utmSource, setUtmSource] = useState('linkedin');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('peluncuran_q4_2026');

  const generatedUtmUrl = `${baseUrl.replace(/\/$/, '')}/?utm_source=${encodeURIComponent(
    utmSource
  )}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(
    utmCampaign
  )}`;

  const handleCopy = (text: string, key: string, logDesc?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (logDesc) {
      onLogActivity('Menyalin hasil modul Tools:', logDesc);
    }
    setTimeout(() => setCopiedKey(null), 2200);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tool Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Zyroxx Tools & Peralatan Kerja
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Peralatan interaktif instan untuk simulasi profit proyek, pembuatan draf faktur, dan utilitas teknis.
          </p>
        </div>

        {/* Interactive Tool Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#10101A] border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveTool('roi')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTool === 'roi'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator ROI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('invoice')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTool === 'invoice'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generator Invoice</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('converter')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTool === 'converter'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Format JSON & Slug</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('utm')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTool === 'utm'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>UTM Builder</span>
          </button>
        </div>
      </div>

      {/* TOOL 1: ROI & Margin Calculator */}
      {activeTool === 'roi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">
                Parameter Biaya & Proyeksi Penjualan
              </h2>
              <button
                type="button"
                onClick={() => {
                  setInvestmentCost(45000000);
                  setMonthlyOperational(8500000);
                  setUnitPrice(3500000);
                  setProjectedUnits(28);
                }}
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Modal Awal Proyek (IDR)
                </label>
                <input
                  type="number"
                  value={investmentCost}
                  onChange={(e) => setInvestmentCost(Number(e.target.value) || 0)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#09090F] border border-white/[0.08] font-mono tabular-nums text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Biaya Operasional Bulanan (IDR)
                </label>
                <input
                  type="number"
                  value={monthlyOperational}
                  onChange={(e) => setMonthlyOperational(Number(e.target.value) || 0)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#09090F] border border-white/[0.08] font-mono tabular-nums text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Harga Jual per Paket / Lisensi (IDR)
                </label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value) || 0)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#09090F] border border-white/[0.08] font-mono tabular-nums text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Jumlah Klien ({projectedUnits} Unit)
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={projectedUnits}
                  onChange={(e) => setProjectedUnits(Number(e.target.value))}
                  className="w-full h-11 accent-violet-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-violet-950/50 via-[#10101A] to-[#0C0C14] border border-violet-500/30 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-medium text-violet-300">
                Hasil Simulasi Finansial Zyroxx
              </div>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                Estimasi Laba Bersih
              </h3>
              <div
                className={`font-mono tabular-nums text-2xl sm:text-3xl font-bold mt-3 ${
                  netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {formatIDR(netProfit)}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/[0.08] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pendapatan Kotor (Gross)</span>
                <span className="font-mono tabular-nums font-semibold text-white">
                  {formatIDR(grossRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Beban & Modal</span>
                <span className="font-mono tabular-nums font-semibold text-slate-200">
                  {formatIDR(totalCost)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Return on Investment (ROI)</span>
                <span className="font-mono tabular-nums font-semibold text-violet-300">
                  {roiPercentage}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Margin Laba Bersih</span>
                <span className="font-mono tabular-nums font-semibold text-violet-300">
                  {netMarginPercentage}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  `Simulasi ROI Zyroxx\nPendapatan: ${formatIDR(grossRevenue)}\nTotal Biaya: ${formatIDR(
                    totalCost
                  )}\nLaba Bersih: ${formatIDR(netProfit)} (ROI: ${roiPercentage}%)`,
                  'roi_copy',
                  `Simulasi ROI (${roiPercentage}%)`
                )
              }
              className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedKey === 'roi_copy' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ringkasan ROI Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Ringkasan Perhitungan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TOOL 2: Quick Invoice & PPN Generator */}
      {activeTool === 'invoice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] space-y-4">
            <h2 className="font-display text-lg font-bold text-white">
              Penyusun Estimasi Invoice Klien
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nama Perusahaan / Klien Tujuan
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Deskripsi Layanan / Lisensi
              </label>
              <input
                type="text"
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nilai Subtotal (IDR)
                </label>
                <input
                  type="number"
                  value={subtotalAmount}
                  onChange={(e) => setSubtotalAmount(Number(e.target.value) || 0)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#09090F] border border-white/[0.08] font-mono tabular-nums text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Diskon Korporat (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={90}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#09090F] border border-white/[0.08] font-mono tabular-nums text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={includePpn}
                onChange={(e) => setIncludePpn(e.target.checked)}
                className="w-4 h-4 rounded accent-violet-600"
              />
              <span>Sertakan Pajak Pertambahan Nilai (PPN 11%)</span>
            </label>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/[0.06]">
                <span className="font-mono">INV-ZX-202610</span>
                <span>Draf Resmi Zyroxx</span>
              </div>
              <div className="mt-4">
                <div className="text-xs text-slate-400">Ditagihkan Kepada:</div>
                <div className="text-base font-bold text-white mt-0.5">{clientName}</div>
                <div className="text-xs text-slate-300 mt-1">{serviceDesc}</div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/[0.06] text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-mono tabular-nums text-white">
                  {formatIDR(subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Diskon ({discountPercent}%)</span>
                <span className="font-mono tabular-nums text-emerald-400">
                  -{formatIDR(discountValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PPN (11%)</span>
                <span className="font-mono tabular-nums text-slate-200">
                  {formatIDR(ppnValue)}
                </span>
              </div>
              <div className="pt-2.5 border-t border-white/[0.08] flex justify-between items-baseline">
                <span className="font-semibold text-white">Total Tagihan Akhir</span>
                <span className="font-mono tabular-nums text-lg font-bold text-violet-300">
                  {formatIDR(grandTotalInvoice)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  `INVOICE ZYROXX (INV-ZX-202610)\nKlien: ${clientName}\nLayanan: ${serviceDesc}\nTotal Akhir: ${formatIDR(
                    grandTotalInvoice
                  )}`,
                  'inv_copy',
                  clientName
                )
              }
              className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedKey === 'inv_copy' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Teks Invoice Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Draf Invoice</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TOOL 3: JSON Formatter / Base64 / Slug */}
      {activeTool === 'converter' && (
        <div className="p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Konverter Data & Formatter Teknis
              </h2>
              <p className="text-xs text-slate-400">
                Rapikan payload JSON API, enkode string ke Base64, atau buat URL slug bersih.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[#09090F] rounded-xl border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setTransformMode('json')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  transformMode === 'json'
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Prettify JSON
              </button>
              <button
                type="button"
                onClick={() => setTransformMode('base64_enc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  transformMode === 'base64_enc'
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Encode Base64
              </button>
              <button
                type="button"
                onClick={() => setTransformMode('slug')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  transformMode === 'slug'
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                URL Slug
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Input Mentah
              </label>
              <textarea
                rows={7}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#09090F] border border-white/[0.08] font-mono text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Hasil Transformasi
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(getTransformedOutput(), 'conv_copy', 'Utilitas Konverter')
                  }
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'conv_copy' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Output</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="w-full h-[166px] p-3.5 rounded-xl bg-[#07070B] border border-white/[0.08] font-mono text-xs text-violet-200 overflow-auto">
                {getTransformedOutput()}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: UTM Campaign Link Builder */}
      {activeTool === 'utm' && (
        <div className="p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] space-y-5">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              Generator Tautan Kampanye UTM
            </h2>
            <p className="text-xs text-slate-400">
              Susun URL pelacakan kampanye akuisisi pelanggan dengan parameter standar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                URL Halaman Tujuan
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Sumber (utm_source)
              </label>
              <input
                type="text"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Media (utm_medium)
              </label>
              <input
                type="text"
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nama Kampanye (utm_campaign)
              </label>
              <input
                type="text"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#09090F] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="font-mono text-xs text-violet-300 break-all">
              {generatedUtmUrl}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(generatedUtmUrl, 'utm_copy', utmCampaign)}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
            >
              {copiedKey === 'utm_copy' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>URL Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin URL UTM</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
