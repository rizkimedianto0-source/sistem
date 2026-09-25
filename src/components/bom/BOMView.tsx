import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BOM, BOMItem } from '../../types';
import { formatIDR, formatNumber } from '../../utils/formatters';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Calculator, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';

export const BOMView: React.FC = () => {
  const { boms, products, materials, addBOM, updateBOM, deleteBOM } = useApp();

  const [selectedBOMId, setSelectedBOMId] = useState<string>(boms[0]?.id || '');
  const [simulationQty, setSimulationQty] = useState<number>(10);
  const [showAddBOMModal, setShowAddBOMModal] = useState(false);

  // Selected BOM
  const selectedBOM = boms.find(b => b.id === selectedBOMId) || boms[0];

  // New BOM form
  const [newBOMProductId, setNewBOMProductId] = useState<string>(products[0]?.id || '');
  const [newBOMCode, setNewBOMCode] = useState<string>('BOM-NEW-01');
  const [newBOMVersion, setNewBOMVersion] = useState<string>('1.0');
  const [newBOMLaborHours, setNewBOMLaborHours] = useState<number>(8);
  const [newBOMLaborRate, setNewBOMLaborRate] = useState<number>(45000);
  const [newBOMOverhead, setNewBOMOverhead] = useState<number>(250000);
  const [newBOMItems, setNewBOMItems] = useState<Array<{ materialId: string; quantity: number; wastagePercent: number }>>([
    { materialId: materials[0]?.id || '', quantity: 0.1, wastagePercent: 10 }
  ]);

  const handleAddItemToForm = () => {
    setNewBOMItems([...newBOMItems, { materialId: materials[0]?.id || '', quantity: 1, wastagePercent: 5 }]);
  };

  const handleRemoveItemFromForm = (index: number) => {
    setNewBOMItems(newBOMItems.filter((_, i) => i !== index));
  };

  const handleSaveBOM = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === newBOMProductId);
    if (!prod) return;

    // Calculate item costs
    let totalMat = 0;
    const items: BOMItem[] = newBOMItems.map((item, idx) => {
      const mat = materials.find(m => m.id === item.materialId);
      const unitPrice = mat ? mat.pricePerUnit : 0;
      const subtotal = item.quantity * unitPrice;
      totalMat += subtotal;

      return {
        id: `bi-${Date.now()}-${idx}`,
        materialId: item.materialId,
        materialName: mat ? mat.name : '',
        materialCode: mat ? mat.code : '',
        quantity: item.quantity,
        unit: mat ? mat.unit : 'pcs',
        unitPrice,
        subtotal,
        wastagePercent: item.wastagePercent
      };
    });

    const totalLabor = newBOMLaborHours * newBOMLaborRate;
    const totalHPP = totalMat + totalLabor + newBOMOverhead;

    addBOM({
      productId: prod.id,
      productName: prod.name,
      productCode: prod.code,
      code: newBOMCode,
      version: newBOMVersion,
      items,
      directLaborHours: newBOMLaborHours,
      directLaborRatePerHour: newBOMLaborRate,
      overheadCost: newBOMOverhead,
      totalDirectMaterialCost: totalMat,
      totalDirectLaborCost: totalLabor,
      totalEstimatedHPP: totalHPP,
      notes: 'BOM standar pabrik mebel'
    });

    setShowAddBOMModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Bill of Materials (BOM) & Standar Resep Mebel
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Struktur kebutuhan bahan baku mebel kayu, rasio susut (scrap wastage), estimasi jam kerja, dan kalkulasi HPP.
          </p>
        </div>

        <button
          onClick={() => setShowAddBOMModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Struktur BOM Baru</span>
        </button>
      </div>

      {/* Main Layout: List of BOMs on left, Detail on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: BOM Selector Cards */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
            Daftar Resep Produk ({boms.length})
          </div>

          <div className="space-y-2">
            {boms.map(bom => {
              const isSelected = selectedBOM?.id === bom.id;
              const product = products.find(p => p.id === bom.productId);

              return (
                <div
                  key={bom.id}
                  onClick={() => setSelectedBOMId(bom.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-neutral-800/90 border-amber-500/80 shadow-md'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-amber-400">{bom.code}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">v{bom.version}</span>
                  </div>

                  <h3 className="font-semibold text-neutral-200 text-xs mt-1 line-clamp-1">
                    {bom.productName}
                  </h3>

                  <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 text-[11px]">{bom.items.length} Komponen</span>
                    <span className="font-mono font-semibold text-neutral-100 tabular-nums">
                      {formatIDR(bom.totalEstimatedHPP)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed BOM breakdown & Material Simulator */}
        {selectedBOM && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{selectedBOM.code}</span>
                    <span className="text-xs text-neutral-500">·</span>
                    <span className="text-xs text-neutral-400">Revisi Versi {selectedBOM.version}</span>
                    <span className="text-xs text-neutral-500">·</span>
                    <span className="text-xs text-neutral-500 tabular-nums">Update: {selectedBOM.updatedAt}</span>
                  </div>
                  <h2 className="text-base font-bold text-neutral-100 mt-1">
                    {selectedBOM.productName}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">Total Estimasi HPP / Unit</span>
                  <span className="font-mono text-lg font-bold text-amber-400 tabular-nums">
                    {formatIDR(selectedBOM.totalEstimatedHPP)}
                  </span>
                </div>
              </div>

              {/* Cost Summary Pills (clean unboxed text) */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-neutral-950/60 rounded border border-neutral-800/80 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Bahan Baku Langsung</span>
                  <span className="font-mono font-semibold text-neutral-200 tabular-nums">
                    {formatIDR(selectedBOM.totalDirectMaterialCost)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Tenaga Kerja ({selectedBOM.directLaborHours} Jam)</span>
                  <span className="font-mono font-semibold text-neutral-200 tabular-nums">
                    {formatIDR(selectedBOM.totalDirectLaborCost)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Overhead Pabrik (BOP)</span>
                  <span className="font-mono font-semibold text-neutral-200 tabular-nums">
                    {formatIDR(selectedBOM.overheadCost)}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-neutral-300">
                    Rincian Kebutuhan Bahan Baku (Per 1 Unit)
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Sudah termasuk toleransi susut kayu/waste
                  </span>
                </div>

                <div className="border border-neutral-800 rounded-md overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-2.5">Komponen Bahan Baku</th>
                        <th className="p-2.5 text-right">Kebutuhan Netto</th>
                        <th className="p-2.5 text-center">Susut (Waste)</th>
                        <th className="p-2.5 text-right">Harga Satuan</th>
                        <th className="p-2.5 text-right">Subtotal Biaya</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                      {selectedBOM.items.map(item => (
                        <tr key={item.id} className="hover:bg-neutral-800/30">
                          <td className="p-2.5">
                            <span className="font-medium text-neutral-200">{item.materialName}</span>
                            <span className="font-mono text-[10px] text-neutral-500 block">{item.materialCode}</span>
                          </td>
                          <td className="p-2.5 text-right font-mono tabular-nums font-medium text-neutral-100">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="p-2.5 text-center font-mono tabular-nums text-neutral-400">
                            {item.wastagePercent}%
                          </td>
                          <td className="p-2.5 text-right font-mono tabular-nums text-neutral-400">
                            {formatIDR(item.unitPrice)}
                          </td>
                          <td className="p-2.5 text-right font-mono tabular-nums font-semibold text-amber-300">
                            {formatIDR(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedBOM.notes && (
                <div className="p-3 bg-neutral-950/40 border border-neutral-800/60 rounded text-xs text-neutral-400">
                  <span className="font-semibold text-neutral-300">Instruksi Teknis Standar: </span>
                  {selectedBOM.notes}
                </div>
              )}
            </div>

            {/* MATERIAL REQUIREMENT SIMULATOR (MRP Lite) */}
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-neutral-200">
                    Kalkulator Simulasi Kebutuhan Bahan (MRP Batch)
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Jumlah Pesanan Rencana:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      value={simulationQty}
                      onChange={(e) => setSimulationQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-center text-amber-400 font-mono font-bold focus:outline-hidden focus:border-amber-500"
                    />
                    <span className="text-xs text-neutral-400">unit</span>
                  </div>
                </div>
              </div>

              {/* Simulation Output Table */}
              <div className="border border-neutral-800 rounded-md overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="p-2.5">Bahan Baku</th>
                      <th className="p-2.5 text-right">Kebutuhan Total ({simulationQty} unit)</th>
                      <th className="p-2.5 text-right">Stok Gudang Saat Ini</th>
                      <th className="p-2.5 text-center">Status Stok</th>
                      <th className="p-2.5 text-right">Total Estimasi Biaya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                    {selectedBOM.items.map(item => {
                      const mat = materials.find(m => m.id === item.materialId);
                      const currentStock = mat ? mat.stock : 0;
                      const neededQty = item.quantity * simulationQty;
                      const isStockSufficient = currentStock >= neededQty;
                      const totalBatchCost = item.subtotal * simulationQty;

                      return (
                        <tr key={item.id} className="hover:bg-neutral-800/30">
                          <td className="p-2.5 font-medium text-neutral-200">
                            {item.materialName}
                          </td>
                          <td className="p-2.5 text-right font-mono tabular-nums font-semibold text-neutral-100">
                            {formatNumber(neededQty, 2)} {item.unit}
                          </td>
                          <td className="p-2.5 text-right font-mono tabular-nums text-neutral-300">
                            {currentStock} {item.unit}
                          </td>
                          <td className="p-2.5 text-center">
                            {isStockSufficient ? (
                              <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded">
                                Cukup
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/60 rounded">
                                Kurang {formatNumber(neededQty - currentStock, 2)} {item.unit}
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-right font-mono tabular-nums font-semibold text-amber-300">
                            {formatIDR(totalBatchCost)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-neutral-950 font-medium text-xs border-t border-neutral-800">
                    <tr>
                      <td colSpan={4} className="p-2.5 text-right text-neutral-400">
                        Total Biaya Bahan Baku untuk {simulationQty} Unit:
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-amber-400 tabular-nums">
                        {formatIDR(selectedBOM.totalDirectMaterialCost * simulationQty)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: TAMBAH STRUKTUR BOM BARU */}
      {showAddBOMModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-2xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-neutral-100 text-sm">
                Buat Struktur BOM (Bill of Materials) Baru
              </h3>
              <button
                onClick={() => setShowAddBOMModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBOM} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-neutral-400 block mb-1">Pilih Produk Mebel</label>
                  <select
                    value={newBOMProductId}
                    onChange={(e) => setNewBOMProductId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>[{p.code}] {p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Kode BOM</label>
                  <input
                    type="text"
                    required
                    value={newBOMCode}
                    onChange={(e) => setNewBOMCode(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Versi Revisi</label>
                  <input
                    type="text"
                    required
                    value={newBOMVersion}
                    onChange={(e) => setNewBOMVersion(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Jam Kerja Langsung (BTKL)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newBOMLaborHours}
                    onChange={(e) => setNewBOMLaborHours(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Biaya BOP Overhead (Rp)</label>
                  <input
                    type="number"
                    required
                    value={newBOMOverhead}
                    onChange={(e) => setNewBOMOverhead(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Dynamic Items Builder */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 font-semibold">Komposisi Bahan Baku Mebel</label>
                  <button
                    type="button"
                    onClick={handleAddItemToForm}
                    className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Baris Bahan</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {newBOMItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-neutral-950 rounded border border-neutral-800">
                      <div className="flex-1">
                        <select
                          value={item.materialId}
                          onChange={(e) => {
                            const updated = [...newBOMItems];
                            updated[idx].materialId = e.target.value;
                            setNewBOMItems(updated);
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
                          step="0.01"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...newBOMItems];
                            updated[idx].quantity = parseFloat(e.target.value) || 0;
                            setNewBOMItems(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                        />
                      </div>

                      <div className="w-20">
                        <input
                          type="number"
                          placeholder="Waste %"
                          value={item.wastagePercent}
                          onChange={(e) => {
                            const updated = [...newBOMItems];
                            updated[idx].wastagePercent = parseInt(e.target.value) || 0;
                            setNewBOMItems(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                        />
                      </div>

                      {newBOMItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemFromForm(idx)}
                          className="p-1 text-neutral-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddBOMModal(false)}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium rounded transition-colors"
                >
                  Simpan Struktur BOM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
