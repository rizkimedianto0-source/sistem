import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobOrderCosting } from '../../types';
import { formatIDR } from '../../utils/formatters';
import { 
  Calculator, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Edit3, 
  Coins, 
  Layers,
  X,
  PieChart
} from 'lucide-react';

export const CostingView: React.FC = () => {
  const { costings, updateCosting } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingCosting, setEditingCosting] = useState<JobOrderCosting | null>(null);

  // Profit Margin Calculator Simulator
  const [simBaseHPP, setSimBaseHPP] = useState<number>(4500000);
  const [simDesiredMargin, setSimDesiredMargin] = useState<number>(40);

  // Edit Costing Form State
  const [formActualMat, setFormActualMat] = useState<number>(0);
  const [formActualLabor, setFormActualLabor] = useState<number>(0);
  const [formActualOverhead, setFormActualOverhead] = useState<number>(0);

  const openEditModal = (c: JobOrderCosting) => {
    setEditingCosting(c);
    setFormActualMat(c.actualMaterialCost);
    setFormActualLabor(c.actualLaborCost);
    setFormActualOverhead(c.actualOverheadCost);
  };

  const handleSaveCosting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCosting) return;

    updateCosting(editingCosting.id, {
      actualMaterialCost: formActualMat,
      actualLaborCost: formActualLabor,
      actualOverheadCost: formActualOverhead
    });

    setEditingCosting(null);
  };

  // Calculations for Simulator
  // Selling Price = HPP / (1 - (margin / 100))
  const calculatedSellingPrice = simDesiredMargin < 100 
    ? Math.round(simBaseHPP / (1 - (simDesiredMargin / 100))) 
    : 0;
  const calculatedProfitPerUnit = calculatedSellingPrice - simBaseHPP;

  const filteredCostings = costings.filter(c =>
    c.woNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Kalkulasi Biaya Produksi (Job Order Costing Mebel)
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Penetapan HPP per pesanan mebel: Bahan Baku Langsung, Upah Tukang Kayu (BTKL), dan Biaya Overhead Pabrik (BOP).
          </p>
        </div>
      </div>

      {/* PRICING & MARGIN SIMULATOR CARD */}
      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
          <Coins className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-neutral-200">
            Simulator Penetapan Harga Jual Berdasarkan Margin Laba
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-neutral-400 block mb-1">Total HPP per Unit (Rp)</label>
            <input
              type="number"
              value={simBaseHPP}
              onChange={(e) => setSimBaseHPP(parseInt(e.target.value) || 0)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-100 font-mono font-bold focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Target Margin Kotor (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={90}
                value={simDesiredMargin}
                onChange={(e) => setSimDesiredMargin(Math.min(90, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-amber-400 font-mono font-bold focus:outline-hidden focus:border-amber-500"
              />
              <span className="text-neutral-400 font-mono">%</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded flex flex-col justify-center">
            <span className="text-[10px] text-neutral-500 block">Rekomendasi Harga Jual Buyer:</span>
            <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
              {formatIDR(calculatedSellingPrice)}
            </span>
          </div>

          <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded flex flex-col justify-center">
            <span className="text-[10px] text-neutral-500 block">Proyeksi Laba Bersih per Unit:</span>
            <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
              +{formatIDR(calculatedProfitPerUnit)}
            </span>
          </div>
        </div>
      </div>

      {/* JOB ORDER COSTING BREAKDOWN TABLE */}
      <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-neutral-200">
              Daftar HPP Pesanan SPK Berjalan
            </h3>
            <span className="text-xs text-neutral-500">
              Komparasi Biaya Standar vs Biaya Aktual Terjadi
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari SPK atau produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-neutral-200 placeholder-neutral-500 focus:outline-hidden focus:border-amber-500 w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3">No. SPK & Pesanan</th>
                <th className="p-3 text-right">Biaya Bahan (Aktual)</th>
                <th className="p-3 text-right">Biaya Tenaga Kerja (BTKL)</th>
                <th className="p-3 text-right">Biaya Overhead (BOP)</th>
                <th className="p-3 text-right">Total HPP Aktual</th>
                <th className="p-3 text-right">HPP Standar BOM</th>
                <th className="p-3 text-right">Selisih Varian</th>
                <th className="p-3 text-right">Total Penjualan</th>
                <th className="p-3 text-right">Margin Laba</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
              {filteredCostings.map(c => {
                const isOverBudget = c.varianceCost > 0;

                return (
                  <tr key={c.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-3">
                      <span className="font-mono text-amber-400 font-bold text-[11px] block">{c.woNumber}</span>
                      <span className="font-semibold text-neutral-100">{c.productName}</span>
                      <span className="text-[10px] text-neutral-500 block">Batch {c.quantity} unit</span>
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-300">
                      {formatIDR(c.actualMaterialCost)}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-300">
                      {formatIDR(c.actualLaborCost)}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-300">
                      {formatIDR(c.actualOverheadCost)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-neutral-100 tabular-nums">
                      {formatIDR(c.totalActualCost)}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-400">
                      {formatIDR(c.totalStandardCost)}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">
                      {isOverBudget ? (
                        <span className="text-rose-400">+{formatIDR(c.varianceCost)}</span>
                      ) : (
                        <span className="text-emerald-400">{formatIDR(c.varianceCost)} (Hemat)</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-semibold text-amber-400">
                      {formatIDR(c.totalRevenue)}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-emerald-400 font-bold">
                      {c.marginPercentage}%
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors"
                        title="Sesuaikan Biaya Aktual"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT ACTUAL COSTS MODAL */}
      {editingCosting && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div>
                <h3 className="font-bold text-neutral-100 text-sm">
                  Penyesuaian Biaya Aktual Produksi
                </h3>
                <span className="font-mono text-xs text-amber-400">{editingCosting.woNumber}</span>
              </div>
              <button
                onClick={() => setEditingCosting(null)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCosting} className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Biaya Bahan Baku Aktual Terpakai (Rp)</label>
                <input
                  type="number"
                  required
                  value={formActualMat}
                  onChange={(e) => setFormActualMat(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Biaya Upah Tukang / Tenaga Kerja Langsung (Rp)</label>
                <input
                  type="number"
                  required
                  value={formActualLabor}
                  onChange={(e) => setFormActualLabor(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Biaya Overhead Pabrik (Listrik, Thinner, Amplas) (Rp)</label>
                <input
                  type="number"
                  required
                  value={formActualOverhead}
                  onChange={(e) => setFormActualOverhead(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingCosting(null)}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium rounded transition-colors"
                >
                  Simpan Perubahan Biaya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
