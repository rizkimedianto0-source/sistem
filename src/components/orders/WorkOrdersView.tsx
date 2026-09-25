import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkOrder, WOStatus, WOPriority } from '../../types';
import { formatIDR, getPriorityClass, getStatusBadgeClass } from '../../utils/formatters';
import { PrintableSPKModal } from './PrintableSPKModal';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Printer, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Play,
  XCircle,
  X
} from 'lucide-react';

export const WorkOrdersView: React.FC = () => {
  const { 
    workOrders, 
    products, 
    customers, 
    materials, 
    boms, 
    addWorkOrder, 
    updateWorkOrderStatus, 
    deleteWorkOrder 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWOForPrint, setSelectedWOForPrint] = useState<WorkOrder | null>(null);

  // Form State for new SPK
  const [formCustomerId, setFormCustomerId] = useState(customers[0]?.id || '');
  const [formProductId, setFormProductId] = useState(products[0]?.id || '');
  const [formQuantity, setFormQuantity] = useState(10);
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [formDueDate, setFormDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 20);
    return d.toISOString().substring(0, 10);
  });
  const [formPriority, setFormPriority] = useState<WOPriority>('Sedang');
  const [formBatchCode, setFormBatchCode] = useState('BATCH-2026-X');
  const [formNotes, setFormNotes] = useState('');

  // Selected Product & BOM check for live material availability
  const selectedProduct = products.find(p => p.id === formProductId);
  const selectedBOM = boms.find(b => b.productId === formProductId);

  // Calculate material shortages for the requested batch
  const materialShortages = selectedBOM ? selectedBOM.items.map(item => {
    const mat = materials.find(m => m.id === item.materialId);
    const available = mat ? mat.stock : 0;
    const required = item.quantity * formQuantity;
    return {
      name: item.materialName,
      unit: item.unit,
      required,
      available,
      shortage: Math.max(0, required - available)
    };
  }).filter(item => item.shortage > 0) : [];

  const handleCreateSPK = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formCustomerId);
    const product = products.find(p => p.id === formProductId);

    if (!customer || !product) return;

    addWorkOrder({
      customerId: customer.id,
      customerName: customer.company ? `${customer.company} (${customer.name})` : customer.name,
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      quantity: formQuantity,
      orderDate: new Date().toISOString().substring(0, 10),
      startDate: formStartDate,
      dueDate: formDueDate,
      priority: formPriority,
      status: 'Disetujui',
      batchCode: formBatchCode,
      targetSellingPrice: product.targetSellingPrice,
      notes: formNotes,
      approvedBy: 'Budi Raharjo, S.T.'
    });

    setShowCreateModal(false);
    setFormNotes('');
  };

  // Filtered orders
  const filteredOrders = workOrders.filter(wo => {
    const matchSearch = 
      wo.woNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.batchCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || wo.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Pesanan Produksi & Surat Perintah Kerja (SPK)
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Penerbitan SPK mebel, alokasi batch pengerjaan, pengecekan ketersediaan bahan baku, dan monitoring progres.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Terbitkan SPK Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-wrap gap-3">
        {/* Status Segmented Control */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-md border border-neutral-800">
          {[
            { id: 'all', label: `Semua (${workOrders.length})` },
            { id: 'Disetujui', label: 'Disetujui' },
            { id: 'Dalam Proses', label: 'Dalam Proses' },
            { id: 'Selesai', label: 'Selesai' },
            { id: 'Dibatalkan', label: 'Dibatalkan' }
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

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Cari no SPK, nama pemesan, produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-neutral-200 placeholder-neutral-500 focus:outline-hidden focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3">No. SPK & Batch</th>
                <th className="p-3">Buyer / Proyek</th>
                <th className="p-3">Produk Mebel</th>
                <th className="p-3 text-center">Jumlah</th>
                <th className="p-3">Target Deadline</th>
                <th className="p-3">Tahap Berjalan</th>
                <th className="p-3">Progres</th>
                <th className="p-3 text-center">Prioritas</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-neutral-500">
                    Tidak ada pesanan produksi yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(wo => (
                  <tr key={wo.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-amber-400 text-[11px]">{wo.woNumber}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{wo.batchCode}</div>
                    </td>
                    <td className="p-3 max-w-[160px]">
                      <span className="font-medium text-neutral-200 block truncate">{wo.customerName}</span>
                      <span className="text-[10px] text-neutral-500">{wo.orderDate}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-neutral-100">{wo.productName}</span>
                      <span className="text-[10px] font-mono text-neutral-500 block">{wo.productCode}</span>
                    </td>
                    <td className="p-3 text-center font-mono font-semibold text-neutral-100 tabular-nums">
                      {wo.quantity} unit
                    </td>
                    <td className="p-3 font-mono tabular-nums text-neutral-300">
                      {wo.dueDate}
                    </td>
                    <td className="p-3">
                      <span className="text-amber-300/90 font-medium">{wo.currentStage}</span>
                    </td>
                    <td className="p-3 w-28">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-neutral-400">{wo.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-1.5 rounded-full"
                            style={{ width: `${wo.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${getPriorityClass(wo.priority)}`}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${getStatusBadgeClass(wo.status)}`}>
                        {wo.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {/* Print SPK button */}
                      <button
                        onClick={() => setSelectedWOForPrint(wo)}
                        className="p-1.5 text-neutral-300 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors"
                        title="Cetak SPK Resmi Pabrik"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {/* State transitions */}
                      {wo.status === 'Disetujui' && (
                        <button
                          onClick={() => updateWorkOrderStatus(wo.id, 'Dalam Proses')}
                          className="p-1.5 text-neutral-300 hover:text-emerald-400 hover:bg-neutral-800 rounded transition-colors"
                          title="Mulai Pengerjaan Workshop"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {wo.status === 'Dalam Proses' && (
                        <button
                          onClick={() => updateWorkOrderStatus(wo.id, 'Selesai')}
                          className="p-1.5 text-neutral-300 hover:text-emerald-400 hover:bg-neutral-800 rounded transition-colors"
                          title="Tandai Seluruh SPK Selesai"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: TERBITKAN SPK BARU */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-neutral-100 text-sm">
                Penerbitan Surat Perintah Kerja (SPK) Baru
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSPK} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Pelanggan / Pemesan Proyek</label>
                  <select
                    value={formCustomerId}
                    onChange={(e) => setFormCustomerId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.company ? `${c.company} - ${c.name}` : c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Pilih Produk Mebel</label>
                  <select
                    value={formProductId}
                    onChange={(e) => setFormProductId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>[{p.code}] {p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Jumlah Pesanan (Unit)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Kode Batch Pabrik</label>
                  <input
                    type="text"
                    required
                    value={formBatchCode}
                    onChange={(e) => setFormBatchCode(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Tingkat Prioritas</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Tanggal Mulai Pengerjaan</label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Batas Waktu Selesai (Due Date)</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* LIVE MATERIAL AVAILABILITY CHECK BOX */}
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-200">
                    Pengecekan Ketersediaan Bahan Baku Gudang (BOM {selectedBOM?.code || 'Standar'})
                  </span>
                  {materialShortages.length === 0 ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-medium text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Semua Stok Bahan Tersedia
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-medium text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {materialShortages.length} Bahan Kurang
                    </span>
                  )}
                </div>

                {materialShortages.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {materialShortages.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-rose-300">
                        <span>• {item.name}:</span>
                        <span>
                          Dibutuhkan {item.required} {item.unit} (Kurang {item.shortage} {item.unit})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Catatan Tambahan & Petunjuk Khusus</label>
                <textarea
                  rows={2}
                  placeholder="Instruksi warna finishing khusus atau packaging ekspor..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
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
                  Terbitkan SPK & Buat Alur Routing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE SPK MODAL */}
      {selectedWOForPrint && (
        <PrintableSPKModal
          workOrder={selectedWOForPrint}
          bom={boms.find(b => b.productId === selectedWOForPrint.productId)}
          materials={materials}
          onClose={() => setSelectedWOForPrint(null)}
        />
      )}
    </div>
  );
};
