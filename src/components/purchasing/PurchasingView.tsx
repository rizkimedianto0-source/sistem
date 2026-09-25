import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PurchaseOrder, POItem, POStatus } from '../../types';
import { formatIDR, getStatusBadgeClass } from '../../utils/formatters';
import { PrintablePOModal } from './PrintablePOModal';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Printer, 
  CheckCircle, 
  Clock, 
  PackageCheck, 
  Truck,
  Trash2,
  X
} from 'lucide-react';

export const PurchasingView: React.FC = () => {
  const { 
    purchaseOrders, 
    suppliers, 
    materials, 
    addPurchaseOrder, 
    receivePurchaseOrder, 
    updatePOStatus 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPOForPrint, setSelectedPOForPrint] = useState<PurchaseOrder | null>(null);

  // New PO form
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [expectedDate, setExpectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().substring(0, 10);
  });
  const [paymentStatus, setPaymentStatus] = useState<PurchaseOrder['paymentStatus']>('Uang Muka 50%');
  const [poNotes, setPoNotes] = useState('');
  const [poItems, setPoItems] = useState<Array<{ materialId: string; orderedQty: number }>>([
    { materialId: materials[0]?.id || '', orderedQty: 5 }
  ]);

  const handleAddItemRow = () => {
    setPoItems([...poItems, { materialId: materials[0]?.id || '', orderedQty: 1 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setPoItems(poItems.filter((_, i) => i !== index));
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === supplierId);
    if (!sup) return;

    let totalAmount = 0;
    const items: POItem[] = poItems.map((item, idx) => {
      const mat = materials.find(m => m.id === item.materialId);
      const unitPrice = mat ? mat.pricePerUnit : 0;
      const subtotal = item.orderedQty * unitPrice;
      totalAmount += subtotal;

      return {
        id: `poi-${Date.now()}-${idx}`,
        materialId: item.materialId,
        materialName: mat ? mat.name : '',
        materialCode: mat ? mat.code : '',
        orderedQty: item.orderedQty,
        receivedQty: 0,
        unit: mat ? mat.unit : 'unit',
        unitPrice,
        subtotal
      };
    });

    addPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      orderDate: new Date().toISOString().substring(0, 10),
      expectedDate,
      status: 'Dipesan',
      paymentStatus,
      totalAmount,
      items,
      notes: poNotes
    });

    setShowCreateModal(false);
    setPoNotes('');
  };

  const filteredOrders = purchaseOrders.filter(po => {
    const matchSearch = po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Pembelian Bahan Baku (Purchase Order)
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Pengadaan kayu jati, papan mahoni, bahan kimia coating finishing, dan rel fitting mebel langsung dari supplier.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat PO Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-md border border-neutral-800">
          {[
            { id: 'all', label: `Semua (${purchaseOrders.length})` },
            { id: 'Dipesan', label: 'Dipesan' },
            { id: 'Diterima Lengkap', label: 'Diterima' },
            { id: 'Draft', label: 'Draft' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                statusFilter === tab.id
                  ? 'bg-neutral-800 text-amber-300 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Cari nomor PO atau nama supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-neutral-200 placeholder-neutral-500 focus:outline-hidden focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3">No. PO</th>
                <th className="p-3">Vendor / Supplier</th>
                <th className="p-3">Tanggal Pesan</th>
                <th className="p-3">Estimasi Tiba</th>
                <th className="p-3">Rincian Item</th>
                <th className="p-3 text-right">Total Nilai Tagihan</th>
                <th className="p-3 text-center">Pembayaran</th>
                <th className="p-3 text-center">Status PO</th>
                <th className="p-3 text-right">Aksi Penerimaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
              {filteredOrders.map(po => {
                const isReceived = po.status === 'Diterima Lengkap';

                return (
                  <tr key={po.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-400 text-[11px]">
                      {po.poNumber}
                    </td>
                    <td className="p-3 font-semibold text-neutral-100 max-w-[180px] truncate">
                      {po.supplierName}
                    </td>
                    <td className="p-3 font-mono text-neutral-400 tabular-nums">
                      {po.orderDate}
                    </td>
                    <td className="p-3 font-mono tabular-nums text-neutral-300">
                      {po.expectedDate}
                    </td>
                    <td className="p-3 max-w-[200px]">
                      <div className="text-[11px] text-neutral-300 truncate">
                        {po.items.map(i => `${i.orderedQty} ${i.unit} ${i.materialName}`).join(', ')}
                      </div>
                      <span className="text-[10px] text-neutral-500">
                        {po.items.length} macam bahan baku
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-semibold text-amber-300 tabular-nums">
                      {formatIDR(po.totalAmount)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${getStatusBadgeClass(po.paymentStatus)}`}>
                        {po.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${getStatusBadgeClass(po.status)}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {/* Print PO Button */}
                      <button
                        onClick={() => setSelectedPOForPrint(po)}
                        className="p-1.5 text-neutral-300 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors"
                        title="Cetak Purchase Order"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {/* Receive Goods Button */}
                      {!isReceived && (
                        <button
                          onClick={() => {
                            if (confirm(`Terima seluruh bahan baku dari ${po.supplierName}? Stok gudang akan otomatis bertambah.`)) {
                              receivePurchaseOrder(po.id);
                            }
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <PackageCheck className="w-3 h-3" />
                          <span>Terima Barang</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PO MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-neutral-100 text-sm">
                Penerbitan Purchase Order (PO) Bahan Baku Baru
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Vendor / Supplier</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Estimasi Tanggal Tiba</label>
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Syarat Ketentuan Pembayaran</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="Uang Muka 50%">Uang Muka 50% (Sisa Saat Bongkar)</option>
                  <option value="Lunas">Lunas Dimuka</option>
                  <option value="Belum Dibayar">Tempo 30 Hari (Invoicing)</option>
                </select>
              </div>

              {/* Items Table */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 font-semibold">Daftar Bahan Baku Yang Dipesan</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {poItems.map((item, idx) => {
                    const mat = materials.find(m => m.id === item.materialId);

                    return (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-neutral-950 rounded border border-neutral-800">
                        <div className="flex-1">
                          <select
                            value={item.materialId}
                            onChange={(e) => {
                              const updated = [...poItems];
                              updated[idx].materialId = e.target.value;
                              setPoItems(updated);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                          >
                            {materials.map(m => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({formatIDR(m.pricePerUnit)}/{m.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-24">
                          <input
                            type="number"
                            step="any"
                            min={0.1}
                            placeholder="Qty"
                            value={item.orderedQty}
                            onChange={(e) => {
                              const updated = [...poItems];
                              updated[idx].orderedQty = parseFloat(e.target.value) || 0;
                              setPoItems(updated);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                          />
                        </div>

                        <div className="text-[11px] font-mono text-neutral-400 w-12 truncate">
                          {mat?.unit}
                        </div>

                        {poItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1 text-neutral-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Catatan Tambahan untuk Vendor</label>
                <textarea
                  rows={2}
                  placeholder="Kadar air wajib diuji sebelum dikirim, sertifikat SVLK..."
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium rounded transition-colors"
                >
                  Terbitkan Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PO MODAL */}
      {selectedPOForPrint && (
        <PrintablePOModal
          purchaseOrder={selectedPOForPrint}
          onClose={() => setSelectedPOForPrint(null)}
        />
      )}
    </div>
  );
};
