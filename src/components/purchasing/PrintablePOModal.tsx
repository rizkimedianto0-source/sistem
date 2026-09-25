import React from 'react';
import { PurchaseOrder } from '../../types';
import { formatIDR } from '../../utils/formatters';
import { Printer, X, TreePine } from 'lucide-react';

interface PrintablePOModalProps {
  purchaseOrder: PurchaseOrder;
  onClose: () => void;
}

export const PrintablePOModal: React.FC<PrintablePOModalProps> = ({
  purchaseOrder,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white text-neutral-900 rounded-lg max-w-3xl w-full p-8 shadow-2xl relative my-8 print:p-0 print:m-0 print:border-none print:shadow-none">
        {/* Print Action Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-200 no-print">
          <span className="font-semibold text-neutral-800 text-sm">
            Pratinjau Cetak Purchase Order (PO Bahan Baku Mebel)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Purchase Order</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE PO DOCUMENT */}
        <div className="space-y-6 text-xs text-neutral-800 font-sans">
          {/* Header */}
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
                  Divisi Logistik & Pengadaan Bahan Baku Kayu Mebel
                </p>
                <p className="text-[10px] text-neutral-500">
                  Kawasan Industri Tahunan KM 4.5, Jepara, Jawa Tengah
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-neutral-900 text-white font-mono font-bold text-xs uppercase tracking-wider rounded">
                PURCHASE ORDER
              </span>
              <div className="mt-1 font-mono font-bold text-sm text-neutral-900">
                {purchaseOrder.poNumber}
              </div>
              <div className="text-[10px] text-neutral-500">
                Tanggal: {purchaseOrder.orderDate}
              </div>
            </div>
          </div>

          {/* Supplier & Delivery Info */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-neutral-50 border border-neutral-200 rounded">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">
                Vendor / Supplier Penerima PO:
              </span>
              <div className="font-bold text-neutral-900 text-sm mt-0.5">
                {purchaseOrder.supplierName}
              </div>
              <div className="text-[11px] text-neutral-600 mt-1">
                Kondisi Pembayaran: <span className="font-semibold text-neutral-900">{purchaseOrder.paymentStatus}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">
                Instruksi Pengiriman Pabrik:
              </span>
              <div className="text-[11px] text-neutral-700 mt-0.5">
                Gudang Bahan Baku Utama PT Kayu Craft (Bongkar Muat Pintu Timur)
              </div>
              <div className="text-[11px] text-neutral-600 mt-1">
                Estimasi Tiba: <span className="font-bold text-red-700">{purchaseOrder.expectedDate}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs border border-neutral-300 border-collapse">
            <thead>
              <tr className="bg-neutral-100 text-neutral-700 border-b border-neutral-300">
                <th className="p-2 text-left w-10">No</th>
                <th className="p-2 text-left">Kode Bahan</th>
                <th className="p-2 text-left">Deskripsi Bahan Baku & Spesifikasi Kayu</th>
                <th className="p-2 text-right">Jumlah Order</th>
                <th className="p-2 text-right">Harga Satuan (IDR)</th>
                <th className="p-2 text-right">Total Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {purchaseOrder.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="p-2 text-neutral-500 text-center">{idx + 1}</td>
                  <td className="p-2 font-mono text-[11px] text-neutral-600">{item.materialCode}</td>
                  <td className="p-2 font-medium text-neutral-900">{item.materialName}</td>
                  <td className="p-2 text-right font-mono font-bold text-neutral-900">
                    {item.orderedQty} {item.unit}
                  </td>
                  <td className="p-2 text-right font-mono text-neutral-700">
                    {formatIDR(item.unitPrice)}
                  </td>
                  <td className="p-2 text-right font-mono font-bold text-neutral-900">
                    {formatIDR(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-neutral-50 font-bold border-t-2 border-neutral-300">
              <tr>
                <td colSpan={5} className="p-2.5 text-right text-neutral-700 uppercase">
                  Total Nilai Pengadaan PO:
                </td>
                <td className="p-2.5 text-right font-mono text-sm text-neutral-900">
                  {formatIDR(purchaseOrder.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>

          {purchaseOrder.notes && (
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded text-neutral-600 text-[11px]">
              <span className="font-semibold text-neutral-800">Catatan Pengadaan: </span>
              {purchaseOrder.notes}
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs">
            <div>
              <p className="text-neutral-500">Dipesan Oleh (Logistik),</p>
              <div className="h-16" />
              <p className="font-bold text-neutral-900 border-t border-neutral-300 pt-1">Supervisor Gudang</p>
            </div>
            <div>
              <p className="text-neutral-500">Disetujui Oleh (Keuangan),</p>
              <div className="h-16" />
              <p className="font-bold text-neutral-900 border-t border-neutral-300 pt-1">Direktur Keuangan</p>
            </div>
            <div>
              <p className="text-neutral-500">Dikonfirmasi Oleh Vendor,</p>
              <div className="h-16" />
              <p className="font-bold text-neutral-900 border-t border-neutral-300 pt-1">{purchaseOrder.supplierName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
