import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatIDR, getPriorityClass, getStatusBadgeClass } from '../../utils/formatters';
import { 
  ClipboardList, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Hammer,
  Clock,
  Boxes,
  Truck,
  Plus
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    workOrders, 
    materials, 
    products, 
    productionSteps, 
    workstations, 
    qcInspections, 
    costings,
    stockMovements 
  } = useApp();

  const activeOrders = workOrders.filter(w => w.status === 'Dalam Proses' || w.status === 'Disetujui');
  const lowStockMaterials = materials.filter(m => m.stock <= m.minStock);
  const totalRevenueEstimate = workOrders
    .filter(w => w.status !== 'Dibatalkan')
    .reduce((sum, w) => sum + (w.targetSellingPrice * w.quantity), 0);

  const completedOrders = workOrders.filter(w => w.status === 'Selesai');
  const activeSteps = productionSteps.filter(s => s.status === 'Sedang Berjalan');

  // QC Pass calculations
  const totalQCSamples = qcInspections.reduce((sum, q) => sum + q.sampleQty, 0);
  const totalQCPassed = qcInspections.reduce((sum, q) => sum + q.passedQty, 0);
  const qcPassRate = totalQCSamples > 0 ? ((totalQCPassed / totalQCSamples) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Dashboard Produksi Mebel
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Monitoring Surat Perintah Kerja (SPK), Utilisasi Stasiun Kerja, dan Manajemen Biaya Bahan Baku Mebel Jepara.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('work_orders')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat SPK Baru</span>
          </button>
          <button
            onClick={() => onNavigate('purchase_orders')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-medium border border-neutral-700 transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Beli Bahan Baku</span>
          </button>
          <button
            onClick={() => onNavigate('qc')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-medium border border-neutral-700 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Input QC</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards (Single-Elevation, Tabular figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">SPK Aktif di Workshop</span>
            <ClipboardList className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-neutral-100 tabular-nums">
              {activeOrders.length}
            </span>
            <span className="text-[11px] text-neutral-400 tabular-nums">
              {completedOrders.length} SPK telah tuntas
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{activeSteps.length} stasiun sedang beroperasi aktif</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Nilai Order SPK Aktif</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-neutral-100 tabular-nums">
              {formatIDR(totalRevenueEstimate)}
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Estimasi Margin Kotor Rata-rata 39.8%</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Peringatan Stok Menipis</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockMaterials.length > 0 ? 'text-rose-500' : 'text-neutral-500'}`} />
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-bold tabular-nums ${lowStockMaterials.length > 0 ? 'text-rose-400' : 'text-neutral-100'}`}>
              {lowStockMaterials.length}
            </span>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-[11px] text-amber-400 hover:underline"
            >
              Lihat Bahan →
            </button>
          </div>
          <div className="text-[11px] text-neutral-500">
            {lowStockMaterials.length > 0 
              ? `${lowStockMaterials.map(m => m.name.split(' ')[0]).join(', ')} di bawah safety level` 
              : 'Seluruh stok di atas batas minimum'}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Tingkat Kelolosan QC</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-neutral-100 tabular-nums">
              {qcPassRate}%
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-0.5">
              Target &gt; 95%
            </span>
          </div>
          <div className="text-[11px] text-neutral-500">
            Total {totalQCSamples} sampel komponen mebel diuji
          </div>
        </div>
      </div>

      {/* Main Grid: Active Work Orders & Workstation Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Work Orders (2 Columns) */}
        <div className="lg:col-span-2 p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-200">
                Surat Perintah Kerja (SPK) Berjalan
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Monitoring tahapan routing produksi furniture real-time
              </p>
            </div>
            <button
              onClick={() => onNavigate('work_orders')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Lihat Semua SPK ({workOrders.length})
            </button>
          </div>

          <div className="space-y-3">
            {activeOrders.map(wo => {
              const product = products.find(p => p.id === wo.productId);
              return (
                <div
                  key={wo.id}
                  className="p-3.5 bg-neutral-950/60 border border-neutral-800/80 rounded-md hover:border-neutral-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-900">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{wo.woNumber}</span>
                      <span className="text-xs text-neutral-600">·</span>
                      <span className="text-xs font-medium text-neutral-200">{wo.productName}</span>
                      <span className="text-xs text-neutral-400">({wo.quantity} unit)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${getPriorityClass(wo.priority)}`}>
                        {wo.priority}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${getStatusBadgeClass(wo.status)}`}>
                        {wo.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-400">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Pelanggan / Proyek:</span>
                      <span className="text-neutral-300 truncate block">{wo.customerName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Tahap Saat Ini:</span>
                      <span className="text-amber-300 font-medium">{wo.currentStage}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Target Selesai:</span>
                      <span className="tabular-nums text-neutral-300">{wo.dueDate}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">Progres Routing</span>
                      <span className="font-mono text-neutral-300 tabular-nums">{wo.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${wo.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workstation Utilizations (1 Column) */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-200">
                Stasiun Kerja Workshop
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Kapasitas harian dan operator aktif
              </p>
            </div>
            <button
              onClick={() => onNavigate('production_process')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Tracking Live →
            </button>
          </div>

          <div className="space-y-3">
            {workstations.map(ws => (
              <div
                key={ws.id}
                className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-md space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-amber-500 font-semibold">{ws.code}</span>
                    <span className="text-xs font-medium text-neutral-200 truncate max-w-[150px]">{ws.name}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${getStatusBadgeClass(ws.status)}`}>
                    {ws.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Kapasitas: <span className="tabular-nums text-neutral-300">{ws.capacityPerDay} unit/hari</span></span>
                  <span>Operator: <span className="tabular-nums text-neutral-300">{ws.activeOperators} orang</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Grid: Costing Breakdown & Recent Stock Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Costing Summary Card */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-200">
                Struktur Biaya Produksi (HPP Mebel)
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Job Order Costing: Bahan Baku, Tenaga Kerja Langsung, & BOP
              </p>
            </div>
            <button
              onClick={() => onNavigate('costing')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Analisis HPP →
            </button>
          </div>

          {/* Visual Ratio Bar */}
          <div className="space-y-2">
            <div className="flex h-3 w-full rounded-sm overflow-hidden bg-neutral-800">
              <div className="bg-amber-600" style={{ width: '58%' }} title="Bahan Baku Kayu & Kimia: 58%" />
              <div className="bg-sky-600" style={{ width: '24%' }} title="Tenaga Kerja Langsung (BTKL): 24%" />
              <div className="bg-emerald-600" style={{ width: '18%' }} title="BOP Listrik & Mesin: 18%" />
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-600 rounded-xs" />
                <span>Bahan Baku (58%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-sky-600 rounded-xs" />
                <span>Tenaga Kerja / BTKL (24%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs" />
                <span>Overhead / BOP (18%)</span>
              </div>
            </div>
          </div>

          {/* Costing sample table */}
          <div className="border border-neutral-800 rounded-md overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="p-2.5">No SPK</th>
                  <th className="p-2.5">Produk Mebel</th>
                  <th className="p-2.5 text-right">Biaya Aktual</th>
                  <th className="p-2.5 text-right">Margin Kotor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {costings.slice(0, 3).map(c => (
                  <tr key={c.id} className="hover:bg-neutral-800/40">
                    <td className="p-2.5 font-mono text-amber-400">{c.woNumber}</td>
                    <td className="p-2.5 truncate max-w-[140px]">{c.productName}</td>
                    <td className="p-2.5 text-right font-mono tabular-nums">{formatIDR(c.totalActualCost)}</td>
                    <td className="p-2.5 text-right font-mono tabular-nums text-emerald-400">{c.marginPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Stock Movement Log */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-200">
                Aktivitas Mutasi Gudang Terkini
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Penerimaan PO bahan baku & alokasi ke SPK pengerjaan
              </p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Lihat Stok →
            </button>
          </div>

          <div className="space-y-2.5">
            {stockMovements.slice(0, 4).map(sm => (
              <div
                key={sm.id}
                className="p-2.5 bg-neutral-950/60 border border-neutral-800/80 rounded-md flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 text-[10px] font-mono font-bold rounded ${
                      sm.type === 'IN' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' :
                      sm.type === 'OUT' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' :
                      'bg-sky-950/60 text-sky-400 border border-sky-800'
                    }`}>
                      {sm.type}
                    </span>
                    <span className="font-medium text-neutral-200 truncate">{sm.itemName}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate">
                    Ref: {sm.referenceNo} · {sm.notes}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-semibold tabular-nums text-neutral-200">
                    {sm.type === 'OUT' ? '-' : '+'}{sm.quantity} {sm.unit}
                  </div>
                  <div className="text-[10px] text-neutral-500 tabular-nums">
                    {sm.date.split(' ')[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
