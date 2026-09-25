import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Material, Product, StockMovement } from '../../types';
import { formatIDR } from '../../utils/formatters';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  SlidersHorizontal, 
  ArrowUpRight, 
  ArrowDownRight, 
  RotateCw,
  X,
  Plus
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { materials, products, stockMovements, adjustStock } = useApp();

  const [activeTab, setActiveTab] = useState<'materials' | 'products' | 'movements'>('materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAlertOnly, setFilterAlertOnly] = useState(false);

  // Adjustment Modal
  const [adjustingItem, setAdjustingItem] = useState<{
    id: string;
    name: string;
    type: 'Bahan Baku' | 'Produk Jadi';
    currentStock: number;
    unit: string;
  } | null>(null);

  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Stock Opname Fisik Akhir Bulan');

  const handleOpenAdjustment = (id: string, name: string, type: 'Bahan Baku' | 'Produk Jadi', currentStock: number, unit: string) => {
    setAdjustingItem({ id, name, type, currentStock, unit });
    setNewStockValue(currentStock);
    setAdjustReason('Stock Opname Fisik Rutin Gudang');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;

    adjustStock(
      adjustingItem.id,
      adjustingItem.type,
      newStockValue,
      adjustReason
    );

    setAdjustingItem(null);
  };

  // Filtered materials
  const filteredMaterials = materials.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAlert = filterAlertOnly ? m.stock <= m.minStock : true;
    return matchSearch && matchAlert;
  });

  // Filtered products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered movements
  const filteredMovements = stockMovements.filter(sm =>
    sm.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sm.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sm.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Persediaan & Manajemen Stok Gudang
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Monitoring stok kayu solid, bahan kimia finishing, aksesoris, barang jadi, serta kartu mutasi stok real-time.
          </p>
        </div>

        {/* Quick low stock alert badge */}
        <div className="flex items-center gap-2">
          {materials.some(m => m.stock <= m.minStock) && (
            <button
              onClick={() => {
                setActiveTab('materials');
                setFilterAlertOnly(!filterAlertOnly);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors border ${
                filterAlertOnly
                  ? 'bg-rose-950 text-rose-300 border-rose-700'
                  : 'bg-neutral-900 text-rose-400 border-neutral-800 hover:border-rose-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{materials.filter(m => m.stock <= m.minStock).length} Bahan Menipis</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-md border border-neutral-800">
          <button
            onClick={() => {
              setActiveTab('materials');
              setFilterAlertOnly(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'materials'
                ? 'bg-neutral-800 text-amber-300 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Stok Bahan Baku ({materials.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'products'
                ? 'bg-neutral-800 text-amber-300 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Produk Mebel Jadi ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'movements'
                ? 'bg-neutral-800 text-amber-300 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Buku Mutasi Stok ({stockMovements.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama barang, rak, kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-neutral-200 placeholder-neutral-500 focus:outline-hidden focus:border-amber-500 w-60"
          />
        </div>
      </div>

      {/* TAB 1: BAHAN BAKU */}
      {activeTab === 'materials' && (
        <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="p-3">Kode & Nama Bahan</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Rak / Lokasi Gudang</th>
                  <th className="p-3 text-right">Harga Satuan</th>
                  <th className="p-3 text-right">Stok Fisik</th>
                  <th className="p-3 text-right">Batas Min (Safety)</th>
                  <th className="p-3 text-right">Total Nilai Persediaan</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Opname</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
                {filteredMaterials.map(m => {
                  const isLow = m.stock <= m.minStock;
                  const totalValue = m.stock * m.pricePerUnit;

                  return (
                    <tr key={m.id} className="hover:bg-neutral-800/40">
                      <td className="p-3">
                        <div className="font-mono text-amber-400 text-[11px] font-medium">{m.code}</div>
                        <div className="font-semibold text-neutral-100">{m.name}</div>
                        <div className="text-[10px] text-neutral-500">{m.supplierName}</div>
                      </td>
                      <td className="p-3 text-neutral-300">{m.category}</td>
                      <td className="p-3 text-neutral-400">{m.location}</td>
                      <td className="p-3 text-right font-mono tabular-nums text-neutral-400">
                        {formatIDR(m.pricePerUnit)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-neutral-100 tabular-nums text-sm">
                        {m.stock} {m.unit}
                      </td>
                      <td className="p-3 text-right font-mono text-neutral-400 tabular-nums">
                        {m.minStock} {m.unit}
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-amber-300 tabular-nums">
                        {formatIDR(totalValue)}
                      </td>
                      <td className="p-3 text-center">
                        {isLow ? (
                          <span className="px-2 py-0.5 text-[10px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/60 rounded">
                            Reorder!
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenAdjustment(m.id, m.name, 'Bahan Baku', m.stock, m.unit)}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-medium border border-neutral-700 transition-colors"
                          title="Koreksi / Penyesuaian Stok Fisik"
                        >
                          Koreksi
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUK JADI */}
      {activeTab === 'products' && (
        <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="p-3">Produk Mebel</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Material & Dimensi</th>
                  <th className="p-3 text-right">Estimasi HPP</th>
                  <th className="p-3 text-right">Harga Jual</th>
                  <th className="p-3 text-right">Stok Gudang Siap Kirim</th>
                  <th className="p-3 text-right">Total Nilai Produk (HPP)</th>
                  <th className="p-3 text-right">Opname</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
                {filteredProducts.map(p => {
                  const totalHPPValue = p.stockQty * p.estimatedHPP;

                  return (
                    <tr key={p.id} className="hover:bg-neutral-800/40">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded bg-neutral-950 shrink-0"
                          />
                          <div>
                            <span className="font-mono text-[10px] text-amber-400 block">{p.code}</span>
                            <span className="font-semibold text-neutral-100">{p.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-neutral-300">{p.category}</td>
                      <td className="p-3 text-neutral-400 text-[11px]">
                        <div>{p.woodType}</div>
                        <div className="text-neutral-500 font-mono">{p.dimensions}</div>
                      </td>
                      <td className="p-3 text-right font-mono tabular-nums text-neutral-400">
                        {formatIDR(p.estimatedHPP)}
                      </td>
                      <td className="p-3 text-right font-mono tabular-nums text-amber-400 font-semibold">
                        {formatIDR(p.targetSellingPrice)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-neutral-100 tabular-nums text-sm">
                        {p.stockQty} unit
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-emerald-400 tabular-nums">
                        {formatIDR(totalHPPValue)}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenAdjustment(p.id, p.name, 'Produk Jadi', p.stockQty, 'unit')}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-medium border border-neutral-700 transition-colors"
                        >
                          Koreksi
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BUKU MUTASI STOK */}
      {activeTab === 'movements' && (
        <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3">Waktu Transaksi</th>
                <th className="p-3">Jenis Barang</th>
                <th className="p-3">Nama Barang</th>
                <th className="p-3 text-center">Tipe Mutasi</th>
                <th className="p-3 text-right">Jumlah</th>
                <th className="p-3">No. Referensi / SPK / PO</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3">Operator Gudang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
              {filteredMovements.map(sm => (
                <tr key={sm.id} className="hover:bg-neutral-800/40">
                  <td className="p-3 font-mono text-neutral-400 tabular-nums">{sm.date}</td>
                  <td className="p-3">
                    <span className="text-[11px] text-neutral-400">{sm.itemType}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-neutral-100">{sm.itemName}</span>
                    <span className="font-mono text-[10px] text-neutral-500 block">{sm.itemCode}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      sm.type === 'IN' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      sm.type === 'OUT' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-sky-950 text-sky-400 border border-sky-800'
                    }`}>
                      {sm.type}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold tabular-nums text-neutral-100">
                    {sm.type === 'OUT' ? '-' : '+'}{sm.quantity} {sm.unit}
                  </td>
                  <td className="p-3 font-mono text-amber-400 font-medium">{sm.referenceNo}</td>
                  <td className="p-3 text-neutral-400 max-w-xs">{sm.notes}</td>
                  <td className="p-3 text-neutral-300 font-medium">{sm.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* STOCK ADJUSTMENT MODAL */}
      {adjustingItem && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-neutral-100 text-sm">
                Penyesuaian (Opname) Stok
              </h3>
              <button
                onClick={() => setAdjustingItem(null)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-3.5 text-xs">
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800">
                <span className="text-neutral-500 block text-[11px]">{adjustingItem.type}</span>
                <span className="font-semibold text-neutral-100 text-sm">{adjustingItem.name}</span>
                <div className="mt-1 text-neutral-400">
                  Stok Tercatat Sistem: <span className="font-mono font-bold text-neutral-200">{adjustingItem.currentStock} {adjustingItem.unit}</span>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Stok Fisik Aktual Hasil Opname</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-amber-400 font-mono font-bold text-base focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Alasan Penyesuaian / Keterangan</label>
                <input
                  type="text"
                  required
                  placeholder="Hasil opname fisik gudang, susut kayu, dll."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium rounded transition-colors"
                >
                  Simpan Koreksi Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
