import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatIDR, formatNumber } from '../../utils/formatters';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Boxes, 
  ShieldCheck,
  TreePine
} from 'lucide-react';

type ReportType = 'production' | 'inventory' | 'costing' | 'qc';

export const ReportsView: React.FC = () => {
  const { workOrders, materials, products, costings, qcInspections } = useApp();

  const [activeReport, setActiveReport] = useState<ReportType>('production');
  const [period, setPeriod] = useState<string>('Bulan Ini (September 2026)');

  // Print Report
  const handlePrintReport = () => {
    window.print();
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeReport === 'production') {
      csvContent += "No SPK,Produk,Pemesan,Jumlah,Target Selesai,Status,Progres (%)\n";
      workOrders.forEach(w => {
        csvContent += `"${w.woNumber}","${w.productName}","${w.customerName}",${w.quantity},"${w.dueDate}","${w.status}",${w.progressPercent}\n`;
      });
    } else if (activeReport === 'inventory') {
      csvContent += "Kode,Nama Bahan,Kategori,Lokasi,Stok,Satuan,Harga Satuan,Nilai Persediaan\n";
      materials.forEach(m => {
        csvContent += `"${m.code}","${m.name}","${m.category}","${m.location}",${m.stock},"${m.unit}",${m.pricePerUnit},${m.stock * m.pricePerUnit}\n`;
      });
    } else if (activeReport === 'costing') {
      csvContent += "No SPK,Produk,Jumlah,Biaya Bahan,Biaya Tenaga Kerja,Biaya Overhead,Total HPP Aktual,Total Penjualan,Margin (%)\n";
      costings.forEach(c => {
        csvContent += `"${c.woNumber}","${c.productName}",${c.quantity},${c.actualMaterialCost},${c.actualLaborCost},${c.actualOverheadCost},${c.totalActualCost},${c.totalRevenue},${c.marginPercentage}\n`;
      });
    } else {
      csvContent += "Kode QC,Tipe Inspeksi,Nama Item,Referensi,Sampel,Lolos,Cacat,Hasil,Inspektur\n";
      qcInspections.forEach(q => {
        csvContent += `"${q.inspectionCode}","${q.inspectionType}","${q.itemName}","${q.referenceNo}",${q.sampleQty},${q.passedQty},${q.defectQty},"${q.result}","${q.inspectorName}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_${activeReport}_KayuCraft_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregated totals
  const totalRevenue = costings.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalActualCost = costings.reduce((sum, c) => sum + c.totalActualCost, 0);
  const totalGrossProfit = totalRevenue - totalActualCost;
  const avgMargin = totalRevenue > 0 ? ((totalGrossProfit / totalRevenue) * 100).toFixed(1) : '0';

  const totalInventoryValue = materials.reduce((sum, m) => sum + (m.stock * m.pricePerUnit), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800 no-print">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Laporan Manajerial & Rekapitulasi Produksi Mebel
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Ekspor rekapitulasi Surat Perintah Kerja (SPK), mutasi nilai stok bahan baku kayu, Job Order Costing, dan matriks mutu QC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-medium border border-neutral-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV / Excel</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Switcher & Period Selector */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-wrap gap-3 no-print">
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-md border border-neutral-800">
          {[
            { id: 'production' as ReportType, label: 'Laporan Produksi (SPK)' },
            { id: 'inventory' as ReportType, label: 'Laporan Stok & Gudang' },
            { id: 'costing' as ReportType, label: 'Laporan HPP & Laba Rugi' },
            { id: 'qc' as ReportType, label: 'Laporan Pengendalian Mutu (QC)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeReport === tab.id
                  ? 'bg-neutral-800 text-amber-300 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-400">Periode:</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-neutral-200 focus:outline-hidden focus:border-amber-500"
          >
            <option value="Bulan Ini (September 2026)">Bulan Ini (September 2026)</option>
            <option value="Kuartal 3 (Q3 2026)">Kuartal 3 (Q3 2026)</option>
            <option value="Tahun Berjalan 2026">Tahun Berjalan 2026</option>
          </select>
        </div>
      </div>

      {/* PRINTABLE REPORT CONTAINER */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-6 print:bg-white print:text-neutral-900 print:border-none print:p-0">
        {/* Document Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-800 print:border-neutral-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600/20 text-amber-400 border border-amber-500/40 flex items-center justify-center rounded print:bg-neutral-900 print:text-amber-500">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-100 print:text-neutral-900 uppercase tracking-tight">
                PT KAYU CRAFT INDONESIA · LAPORAN MANAJEMEN
              </h2>
              <p className="text-xs text-neutral-400 print:text-neutral-600">
                {activeReport === 'production' && 'Rekapitulasi Produksi & Surat Perintah Kerja (SPK)'}
                {activeReport === 'inventory' && 'Laporan Valuasi & Ketersediaan Stok Bahan Baku Mebel'}
                {activeReport === 'costing' && 'Laporan Job Order Costing, HPP Mebel, & Analisis Margin Laba'}
                {activeReport === 'qc' && 'Laporan Kinerja Pengujian Kualitas & Tingkat Cacat (Reject Rate)'}
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-mono text-neutral-400 print:text-neutral-600">
              Periode: {period}
            </div>
            <div className="text-[10px] text-neutral-500">
              Dicetak: {new Date().toISOString().substring(0, 10)} WIB
            </div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-neutral-950/60 print:bg-neutral-50 border border-neutral-800 print:border-neutral-200 rounded">
            <span className="text-neutral-500 block text-[10px]">Total Pesanan SPK</span>
            <span className="font-mono font-bold text-base text-neutral-100 print:text-neutral-900 tabular-nums">
              {workOrders.length} SPK
            </span>
          </div>
          <div className="p-3 bg-neutral-950/60 print:bg-neutral-50 border border-neutral-800 print:border-neutral-200 rounded">
            <span className="text-neutral-500 block text-[10px]">Nilai Valuasi Bahan Gudang</span>
            <span className="font-mono font-bold text-base text-neutral-100 print:text-neutral-900 tabular-nums">
              {formatIDR(totalInventoryValue)}
            </span>
          </div>
          <div className="p-3 bg-neutral-950/60 print:bg-neutral-50 border border-neutral-800 print:border-neutral-200 rounded">
            <span className="text-neutral-500 block text-[10px]">Total Revenue Pesanan</span>
            <span className="font-mono font-bold text-base text-neutral-100 print:text-neutral-900 tabular-nums">
              {formatIDR(totalRevenue)}
            </span>
          </div>
          <div className="p-3 bg-neutral-950/60 print:bg-neutral-50 border border-neutral-800 print:border-neutral-200 rounded">
            <span className="text-neutral-500 block text-[10px]">Margin Kotor Rata-rata</span>
            <span className="font-mono font-bold text-base text-emerald-400 print:text-emerald-700 tabular-nums">
              {avgMargin}%
            </span>
          </div>
        </div>

        {/* 1. PRODUCTION REPORT TABLE */}
        {activeReport === 'production' && (
          <div className="border border-neutral-800 print:border-neutral-300 rounded overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-neutral-950 print:bg-neutral-100 text-neutral-400 print:text-neutral-700 border-b border-neutral-800 print:border-neutral-300">
                <tr>
                  <th className="p-2.5">No. SPK</th>
                  <th className="p-2.5">Produk Mebel</th>
                  <th className="p-2.5">Pemesan / Proyek</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5">Mulai</th>
                  <th className="p-2.5">Deadline</th>
                  <th className="p-2.5">Tahap Alur</th>
                  <th className="p-2.5 text-right">Progres</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70 print:divide-neutral-200 text-neutral-300 print:text-neutral-800">
                {workOrders.map(wo => (
                  <tr key={wo.id}>
                    <td className="p-2.5 font-mono font-bold text-amber-400 print:text-neutral-900">{wo.woNumber}</td>
                    <td className="p-2.5 font-medium">{wo.productName}</td>
                    <td className="p-2.5 truncate max-w-xs">{wo.customerName}</td>
                    <td className="p-2.5 text-center font-mono font-bold">{wo.quantity} unit</td>
                    <td className="p-2.5 font-mono">{wo.startDate}</td>
                    <td className="p-2.5 font-mono font-bold">{wo.dueDate}</td>
                    <td className="p-2.5">{wo.currentStage}</td>
                    <td className="p-2.5 text-right font-mono tabular-nums">{wo.progressPercent}%</td>
                    <td className="p-2.5 text-center font-medium">{wo.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. INVENTORY REPORT TABLE */}
        {activeReport === 'inventory' && (
          <div className="border border-neutral-800 print:border-neutral-300 rounded overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-neutral-950 print:bg-neutral-100 text-neutral-400 print:text-neutral-700 border-b border-neutral-800 print:border-neutral-300">
                <tr>
                  <th className="p-2.5">Kode Bahan</th>
                  <th className="p-2.5">Deskripsi Bahan Baku</th>
                  <th className="p-2.5">Kategori</th>
                  <th className="p-2.5">Lokasi Rak</th>
                  <th className="p-2.5 text-right">Stok Fisik</th>
                  <th className="p-2.5 text-right">Safety Stock</th>
                  <th className="p-2.5 text-right">Harga Satuan</th>
                  <th className="p-2.5 text-right">Total Valuasi Persediaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70 print:divide-neutral-200 text-neutral-300 print:text-neutral-800">
                {materials.map(m => (
                  <tr key={m.id}>
                    <td className="p-2.5 font-mono text-amber-400 print:text-neutral-900">{m.code}</td>
                    <td className="p-2.5 font-medium">{m.name}</td>
                    <td className="p-2.5">{m.category}</td>
                    <td className="p-2.5">{m.location}</td>
                    <td className="p-2.5 text-right font-mono font-bold">{m.stock} {m.unit}</td>
                    <td className="p-2.5 text-right font-mono">{m.minStock} {m.unit}</td>
                    <td className="p-2.5 text-right font-mono">{formatIDR(m.pricePerUnit)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-300 print:text-neutral-900">
                      {formatIDR(m.stock * m.pricePerUnit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. COSTING REPORT TABLE */}
        {activeReport === 'costing' && (
          <div className="border border-neutral-800 print:border-neutral-300 rounded overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-neutral-950 print:bg-neutral-100 text-neutral-400 print:text-neutral-700 border-b border-neutral-800 print:border-neutral-300">
                <tr>
                  <th className="p-2.5">No. SPK</th>
                  <th className="p-2.5">Pesanan Mebel</th>
                  <th className="p-2.5 text-right">Bahan Baku (Aktual)</th>
                  <th className="p-2.5 text-right">Upah Kerja (BTKL)</th>
                  <th className="p-2.5 text-right">Overhead (BOP)</th>
                  <th className="p-2.5 text-right">Total HPP Aktual</th>
                  <th className="p-2.5 text-right">Nilai Jual</th>
                  <th className="p-2.5 text-right">Laba Kotor</th>
                  <th className="p-2.5 text-right">Margin (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70 print:divide-neutral-200 text-neutral-300 print:text-neutral-800">
                {costings.map(c => (
                  <tr key={c.id}>
                    <td className="p-2.5 font-mono font-bold text-amber-400 print:text-neutral-900">{c.woNumber}</td>
                    <td className="p-2.5 font-medium">{c.productName} ({c.quantity} unit)</td>
                    <td className="p-2.5 text-right font-mono">{formatIDR(c.actualMaterialCost)}</td>
                    <td className="p-2.5 text-right font-mono">{formatIDR(c.actualLaborCost)}</td>
                    <td className="p-2.5 text-right font-mono">{formatIDR(c.actualOverheadCost)}</td>
                    <td className="p-2.5 text-right font-mono font-bold">{formatIDR(c.totalActualCost)}</td>
                    <td className="p-2.5 text-right font-mono text-amber-300 print:text-neutral-900">{formatIDR(c.totalRevenue)}</td>
                    <td className="p-2.5 text-right font-mono text-emerald-400 print:text-emerald-700 font-bold">{formatIDR(c.grossProfit)}</td>
                    <td className="p-2.5 text-right font-mono font-bold">{c.marginPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. QC REPORT TABLE */}
        {activeReport === 'qc' && (
          <div className="border border-neutral-800 print:border-neutral-300 rounded overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-neutral-950 print:bg-neutral-100 text-neutral-400 print:text-neutral-700 border-b border-neutral-800 print:border-neutral-300">
                <tr>
                  <th className="p-2.5">Kode QC</th>
                  <th className="p-2.5">Tahap Uji</th>
                  <th className="p-2.5">Nama Komponen / Mebel</th>
                  <th className="p-2.5">No. Ref</th>
                  <th className="p-2.5 text-center">Sampel</th>
                  <th className="p-2.5 text-center">Lolos</th>
                  <th className="p-2.5 text-center">Cacat</th>
                  <th className="p-2.5">Hasil Akhir</th>
                  <th className="p-2.5">Inspektur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70 print:divide-neutral-200 text-neutral-300 print:text-neutral-800">
                {qcInspections.map(q => (
                  <tr key={q.id}>
                    <td className="p-2.5 font-mono text-amber-400 print:text-neutral-900">{q.inspectionCode}</td>
                    <td className="p-2.5">{q.inspectionType}</td>
                    <td className="p-2.5 font-medium">{q.itemName}</td>
                    <td className="p-2.5 font-mono">{q.referenceNo}</td>
                    <td className="p-2.5 text-center font-mono">{q.sampleQty}</td>
                    <td className="p-2.5 text-center font-mono text-emerald-400 print:text-emerald-700 font-bold">{q.passedQty}</td>
                    <td className="p-2.5 text-center font-mono text-rose-400 print:text-rose-700 font-bold">{q.defectQty}</td>
                    <td className="p-2.5 font-semibold">{q.result}</td>
                    <td className="p-2.5">{q.inspectorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report Signatures */}
        <div className="grid grid-cols-3 gap-6 pt-8 text-center text-xs print:text-neutral-900 border-t border-neutral-800 print:border-neutral-300">
          <div>
            <p className="text-neutral-500">Disiapkan Oleh (PPIC),</p>
            <div className="h-14" />
            <p className="font-bold border-t border-neutral-800 print:border-neutral-300 pt-1 text-neutral-200 print:text-neutral-900">
              Staff Administrasi Pabrik
            </p>
          </div>
          <div>
            <p className="text-neutral-500">Diperiksa Oleh,</p>
            <div className="h-14" />
            <p className="font-bold border-t border-neutral-800 print:border-neutral-300 pt-1 text-neutral-200 print:text-neutral-900">
              Manajer Produksi & Pabrik
            </p>
          </div>
          <div>
            <p className="text-neutral-500">Mengetahui & Menyetujui,</p>
            <div className="h-14" />
            <p className="font-bold border-t border-neutral-800 print:border-neutral-300 pt-1 text-neutral-200 print:text-neutral-900">
              Direktur Utama
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
