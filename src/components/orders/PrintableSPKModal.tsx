import React from 'react';
import { WorkOrder, BOM, Material } from '../../types';
import { formatIDR, getPriorityClass } from '../../utils/formatters';
import { Printer, X, TreePine } from 'lucide-react';

interface PrintableSPKModalProps {
  workOrder: WorkOrder;
  bom?: BOM;
  materials: Material[];
  onClose: () => void;
}

export const PrintableSPKModal: React.FC<PrintableSPKModalProps> = ({
  workOrder,
  bom,
  materials,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white text-neutral-900 rounded-lg max-w-3xl w-full p-8 shadow-2xl relative my-8 print:p-0 print:m-0 print:border-none print:shadow-none">
        {/* Floating Print Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-200 no-print">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800 text-sm">Pratinjau Cetak Surat Perintah Kerja (SPK)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen SPK</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="space-y-6 text-xs text-neutral-800 font-sans">
          {/* Company Header */}
          <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center rounded">
                <TreePine className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-neutral-900">
                  PT KAYU CRAFT INDONESIA
                </h1>
                <p className="text-[11px] text-neutral-600">
                  Pabrik Pengolahan Kayu Mebel Solid & Furnitur Ekspor Jepara
                </p>
                <p className="text-[10px] text-neutral-500">
                  Jl. Pemuda Industri Kayu KM 6.5, Jepara, Jawa Tengah · Telp: (0291) 591234
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-neutral-900 text-white font-mono font-bold text-xs uppercase tracking-wider rounded">
                SURAT PERINTAH KERJA
              </span>
              <div className="mt-1 font-mono font-bold text-sm text-neutral-900">
                {workOrder.woNumber}
              </div>
              <div className="text-[10px] text-neutral-500">
                Batch: {workOrder.batchCode}
              </div>
            </div>
          </div>

          {/* SPK Overview Metadata */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-neutral-50 border border-neutral-200 rounded">
            <div className="space-y-1">
              <div className="flex">
                <span className="w-28 text-neutral-500">Pemesan / Buyer:</span>
                <span className="font-semibold text-neutral-900">{workOrder.customerName}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-neutral-500">Tanggal Order:</span>
                <span className="font-mono text-neutral-800">{workOrder.orderDate}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-neutral-500">Tingkat Prioritas:</span>
                <span className="font-bold text-neutral-900 uppercase">{workOrder.priority}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex">
                <span className="w-28 text-neutral-500">Mulai Produksi:</span>
                <span className="font-mono text-neutral-800">{workOrder.startDate}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-neutral-500">Deadline Target:</span>
                <span className="font-mono font-bold text-red-700">{workOrder.dueDate}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-neutral-500">Disetujui Oleh:</span>
                <span className="font-semibold text-neutral-900">{workOrder.approvedBy || 'Manajer Produksi'}</span>
              </div>
            </div>
          </div>

          {/* Ordered Furniture Specification */}
          <div className="space-y-2">
            <h2 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
              1. Spesifikasi Produk Mebel Yang Dikerjakan
            </h2>
            <table className="w-full text-xs border border-neutral-300 border-collapse">
              <thead>
                <tr className="bg-neutral-100 text-neutral-700 border-b border-neutral-300">
                  <th className="p-2 text-left">Kode Produk</th>
                  <th className="p-2 text-left">Nama Produk Mebel</th>
                  <th className="p-2 text-center">Jumlah Pesanan</th>
                  <th className="p-2 text-left">Instruksi Khusus Finishing / Custom</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 font-mono font-bold text-neutral-900">{workOrder.productCode}</td>
                  <td className="p-2 font-medium text-neutral-900">{workOrder.productName}</td>
                  <td className="p-2 text-center font-bold text-sm text-neutral-900">{workOrder.quantity} Unit</td>
                  <td className="p-2 text-neutral-600">{workOrder.notes || 'Sesuai standar spesifikasi gambar kerja.'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BOM Material Allocation Table */}
          {bom && (
            <div className="space-y-2">
              <h2 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
                2. Lembar Bon Penarikan Bahan Baku Gudang (Sesuai BOM {bom.code})
              </h2>
              <table className="w-full text-xs border border-neutral-300 border-collapse">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-700 border-b border-neutral-300">
                    <th className="p-2 text-left">Kode</th>
                    <th className="p-2 text-left">Nama Bahan Baku</th>
                    <th className="p-2 text-right">Per Unit</th>
                    <th className="p-2 text-right">Total Kebutuhan ({workOrder.quantity} Unit)</th>
                    <th className="p-2 text-center">Checklist Gudang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {bom.items.map(item => (
                    <tr key={item.id}>
                      <td className="p-2 font-mono text-[11px] text-neutral-600">{item.materialCode}</td>
                      <td className="p-2 font-medium text-neutral-900">{item.materialName}</td>
                      <td className="p-2 text-right font-mono">{item.quantity} {item.unit}</td>
                      <td className="p-2 text-right font-mono font-bold text-neutral-900">
                        {+(item.quantity * workOrder.quantity).toFixed(2)} {item.unit}
                      </td>
                      <td className="p-2 text-center">
                        <span className="inline-block w-4 h-4 border border-neutral-400 rounded-xs" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Routing Stage Verification Table */}
          <div className="space-y-2">
            <h2 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
              3. Verifikasi Alur Stasiun Kerja (Workstation Routing Sheet)
            </h2>
            <table className="w-full text-xs border border-neutral-300 border-collapse">
              <thead>
                <tr className="bg-neutral-100 text-neutral-700 border-b border-neutral-300">
                  <th className="p-2 text-left">Tahapan Stasiun</th>
                  <th className="p-2 text-left">Target Pekerjaan</th>
                  <th className="p-2 text-center">Tgl Selesai</th>
                  <th className="p-2 text-center">Jumlah OK</th>
                  <th className="p-2 text-center">Defek</th>
                  <th className="p-2 text-center">Paraf Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {[
                  '1. Pemotongan & Pembelahan Kayu (Bandsaw)',
                  '2. Perakitan Komponen & Purus Tenon',
                  '3. Pengamplasan Kasar & Halus (Grit 120-240)',
                  '4. Finishing Sanding Sealer & Top Coat Doff',
                  '5. Pemasangan Aksesoris, Jok Busa & Hardware',
                  '6. QC Final & Packing Dus Single Face'
                ].map((stage, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-medium text-neutral-900">{stage}</td>
                    <td className="p-2 text-neutral-600">Sesuai toleransi ukuran ±1mm</td>
                    <td className="p-2 text-center text-neutral-400 font-mono">____ / ____</td>
                    <td className="p-2 text-center font-mono">_____</td>
                    <td className="p-2 text-center font-mono">_____</td>
                    <td className="p-2 text-center font-mono">________</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-4 gap-4 pt-6 text-center text-xs">
            <div>
              <p className="text-neutral-500">Dibuat Oleh,</p>
              <div className="h-16" />
              <p className="font-bold text-neutral-900 border-t border-neutral-300 pt-1">PPIC Mebel</p>
            </div>
            <div>
              <p className="text-neutral-500">Disetujui Oleh,</p>
              <div className="h-16" />
              <p className="font-bold text-neutral-900 border-t border-neutral-300 pt-1">Manajer Pabrik</p>
            </div>
            <div>
              <p className="text-neutral-500">Gudang Bahan Baku,</p>
              <div className="h-16" />
              <p className="font-bold text-neutral-900 border-t border-neutral-300 pt-1">Spv. Logistik</p>
            </div>
            <div>
              <p className="text-neutral-500">Quality Control,</p>
              <div className="h-16" />
              <p className="font-bold text-neutral-900 border-t border-neutral-300 pt-1">Kepala QC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
