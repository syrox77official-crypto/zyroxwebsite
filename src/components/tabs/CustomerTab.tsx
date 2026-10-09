import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  UserPlus,
  X,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  SlidersHorizontal,
} from 'lucide-react';
import { CustomerRecord } from '../../types';
import { formatIDR } from '../../data/initialData';

interface CustomerTabProps {
  customers: CustomerRecord[];
  compactTable: boolean;
  isAddModalOpen: boolean;
  onSetAddModalOpen: (open: boolean) => void;
  onAddCustomer: (newCustomer: Omit<CustomerRecord, 'id' | 'lastInteraction' | 'joinedAt'>) => void;
  onUpdateCustomer: (updated: CustomerRecord) => void;
  onDeleteCustomer: (id: string) => void;
}

type StatusFilter = 'Semua' | 'Prioritas' | 'Aktif' | 'Prospek' | 'Nonaktif';

export const CustomerTab: React.FC<CustomerTabProps> = ({
  customers,
  compactTable,
  isAddModalOpen,
  onSetAddModalOpen,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Semua');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Add Customer Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+62 ');
  const [segment, setSegment] = useState('Enterprise Cloud');
  const [status, setStatus] = useState<CustomerRecord['status']>('Aktif');
  const [contractValue, setContractValue] = useState<number>(75000000);
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const matchesStatus = statusFilter === 'Semua' || c.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.segment.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const totalFilteredValue = filteredCustomers.reduce((acc, c) => acc + c.contractValue, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;
    onAddCustomer({
      name: name.trim(),
      company: company.trim(),
      email: email.trim() || 'kontak@perusahaan.co.id',
      phone: phone.trim() || '+62 811-0000-000',
      status,
      segment: segment.trim() || 'Korporat',
      contractValue: Number(contractValue) || 0,
      notes: notes.trim() || 'Akun pelanggan baru ditambahkan melalui direktori Zyroxx.',
    });
    setName('');
    setCompany('');
    setEmail('');
    setPhone('+62 ');
    setContractValue(75000000);
    setNotes('');
    onSetAddModalOpen(false);
  };

  const renderStatusText = (st: CustomerRecord['status']) => {
    if (st === 'Prioritas') {
      return (
        <span className="inline-flex items-center gap-1.5 text-violet-300 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <span>Prioritas</span>
        </span>
      );
    }
    if (st === 'Aktif') {
      return (
        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Aktif</span>
        </span>
      );
    }
    if (st === 'Prospek') {
      return (
        <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Prospek</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Nonaktif</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Direktori Customer & Relasi Klien
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kelola portofolio akun pelanggan korporat, status kontrak, dan catatan tindak lanjut.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSetAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-violet-600/25 transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Customer Baru</span>
        </button>
      </div>

      {/* Filter Bar & Live Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama klien, perusahaan, email, atau segmen..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#10101A] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Interactive Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#10101A] border border-white/[0.08]">
          {(['Semua', 'Prioritas', 'Aktif', 'Prospek', 'Nonaktif'] as StatusFilter[]).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Summary Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#10101A] border border-white/[0.08] text-xs">
        <div className="text-slate-300">
          Menampilkan <span className="font-mono font-semibold text-white">{filteredCustomers.length}</span> dari{' '}
          <span className="font-mono font-semibold text-white">{customers.length}</span> akun pelanggan
        </div>
        <div className="text-slate-300">
          Total Nilai Kontrak Terfilter:{' '}
          <span className="font-mono tabular-nums font-bold text-violet-300">
            {formatIDR(totalFilteredValue)}
          </span>
        </div>
      </div>

      {/* Main High-Density Data Table */}
      <div className="rounded-2xl bg-[#10101A] border border-white/[0.08] overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="text-sm font-semibold text-white">
              Tidak ada data customer yang cocok dengan pencarian Anda
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Coba ubah kata kunci pencarian atau reset filter status, atau tambahkan data pelanggan baru.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('Semua');
              }}
              className="px-4 py-2 rounded-xl bg-violet-600 text-xs font-semibold text-white cursor-pointer"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0B0B13] text-[11px] font-semibold text-slate-400">
                  <th className="py-3.5 px-4">Pelanggan & Perusahaan</th>
                  <th className="py-3.5 px-4">Segmen & Kontak</th>
                  <th className="py-3.5 px-4">Status Relasi</th>
                  <th className="py-3.5 px-4 text-right">Nilai Kontrak</th>
                  <th className="py-3.5 px-4 text-right">Interaksi Terakhir</th>
                  <th className="py-3.5 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {filteredCustomers.map((cust) => {
                  const rowPadding = compactTable ? 'py-2.5 px-4' : 'py-3.5 px-4';
                  return (
                    <tr
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className="hover:bg-violet-950/20 transition-colors cursor-pointer group"
                    >
                      <td className={rowPadding}>
                        <div className="font-semibold text-white group-hover:text-violet-200">
                          {cust.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {cust.company} · <span className="font-mono">{cust.id}</span>
                        </div>
                      </td>

                      <td className={rowPadding}>
                        <div className="text-slate-200">{cust.segment}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{cust.email}</div>
                      </td>

                      <td className={rowPadding}>{renderStatusText(cust.status)}</td>

                      <td className={`${rowPadding} text-right font-mono tabular-nums font-semibold text-white`}>
                        {formatIDR(cust.contractValue)}
                      </td>

                      <td className={`${rowPadding} text-right font-mono tabular-nums text-slate-400`}>
                        {cust.lastInteraction}
                      </td>

                      <td
                        className={`${rowPadding} text-right`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#171726] hover:bg-violet-600 text-[11px] font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
                          >
                            Detail
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteCustomer(cust.id)}
                            aria-label={`Hapus ${cust.name}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail & Edit Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative z-10 w-full max-w-lg rounded-2xl bg-[#10101A] border border-white/[0.1] p-6 shadow-2xl shadow-black space-y-5"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="text-xs font-mono text-violet-400">
                    {selectedCustomer.id} · Bergabung {selectedCustomer.joinedAt}
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mt-0.5">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-300">{selectedCustomer.company}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="w-8 h-8 rounded-lg bg-[#181828] flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#09090F] border border-white/[0.06]">
                  <div className="text-slate-400">Email Klien</div>
                  <div className="font-medium text-white mt-0.5 truncate">
                    {selectedCustomer.email}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#09090F] border border-white/[0.06]">
                  <div className="text-slate-400">Telepon</div>
                  <div className="font-mono tabular-nums font-medium text-white mt-0.5">
                    {selectedCustomer.phone}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Ubah Status Relasi Pelanggan
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Prioritas', 'Aktif', 'Prospek', 'Nonaktif'] as CustomerRecord['status'][]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          const updated = { ...selectedCustomer, status: st };
                          setSelectedCustomer(updated);
                          onUpdateCustomer(updated);
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          selectedCustomer.status === st
                            ? 'bg-violet-600 border-violet-400 text-white'
                            : 'bg-[#09090F] border-white/[0.08] text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Catatan Akun & Tindak Lanjut
                </label>
                <textarea
                  rows={3}
                  value={selectedCustomer.notes}
                  onChange={(e) => {
                    const updated = { ...selectedCustomer, notes: e.target.value };
                    setSelectedCustomer(updated);
                    onUpdateCustomer(updated);
                  }}
                  className="w-full p-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                <div className="font-mono tabular-nums text-sm font-bold text-violet-300">
                  {formatIDR(selectedCustomer.contractValue)}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white cursor-pointer"
                >
                  Selesai & Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Customer Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onSetAddModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.form
              onSubmit={handleCreateSubmit}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative z-10 w-full max-w-lg rounded-2xl bg-[#10101A] border border-white/[0.1] p-6 shadow-2xl shadow-black space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-display text-lg font-bold text-white">
                  Tambah Data Customer Baru
                </h3>
                <button
                  type="button"
                  onClick={() => onSetAddModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#181828] flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Nama Lengkap PIC *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Hendra Wijaya"
                    className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Nama Perusahaan *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="PT Sinergi Nusantara"
                    className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Email Korporat
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hendra@sinergi.co.id"
                    className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] font-mono text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Segmen Industri
                  </label>
                  <input
                    type="text"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Nilai Kontrak (IDR)
                  </label>
                  <input
                    type="number"
                    value={contractValue}
                    onChange={(e) => setContractValue(Number(e.target.value) || 0)}
                    className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] font-mono tabular-nums text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Status Awal
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Prioritas', 'Aktif', 'Prospek', 'Nonaktif'] as CustomerRecord['status'][]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(st)}
                        className={`py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                          status === st
                            ? 'bg-violet-600 border-violet-400 text-white'
                            : 'bg-[#09090F] border-white/[0.08] text-slate-400'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Catatan Kebutuhan Klien
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tulis rincian lisensi atau jadwal implementasi..."
                  className="w-full p-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onSetAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#181828] text-xs font-medium text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white cursor-pointer"
                >
                  Simpan Customer
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
