import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QCInspection, DefectType } from '../../types';
import { getStatusBadgeClass } from '../../utils/formatters';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  CheckSquare,
  Square,
  X
} from 'lucide-react';

export const QualityControlView: React.FC = () => {
  const { qcInspections, addQCInspection, workOrders, purchaseOrders, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [inspectionType, setInspectionType] = useState<QCInspection['inspectionType']>('In-Process Produksi');
  const [referenceNo, setReferenceNo] = useState(workOrders[0]?.woNumber || 'SPK-2026-041');
  const [itemName, setItemName] = useState('Komponen Meja Makan Jati - Tahap Perakitan');
  const [sampleQty, setSampleQty] = useState(8);
  const [passedQty, setPassedQty] = useState(8);
  const [defectQty, setDefectQty] = useState(0);
  const [defectType, setDefectType] = useState<DefectType>('Serat Kasar / Gores');
  const [defectSeverity, setDefectSeverity] = useState<QCInspection['defectSeverity']>('Minor');
  const [result, setResult] = useState<QCInspection['result']>('Lolos Sempurna');
  const [qcNotes, setQcNotes] = useState('');
  const [checklist, setChecklist] = useState<Array<{ item: string; passed: boolean }>>([
    { item: 'Uji Kadar Air Kayu (MC < 14%)', passed: true },
    { item: 'Presisi Sudut Siku 90 Derajat', passed: true },
    { item: 'Kekuatan Alur Purus Mortise & Tenon', passed: true },
    { item: 'Bebas Retak Susut & Mata Kayu Busuk', passed: true }
  ]);

  const toggleChecklistItem = (index: number) => {
    const updated = [...checklist];
    updated[index].passed = !updated[index].passed;
    setChecklist(updated);
  };

  const handleCreateQC = (e: React.FormEvent) => {
    e.preventDefault();

    addQCInspection({
      inspectionType,
      referenceNo,
      itemName,
      sampleQty,
      passedQty,
      defectQty,
      defectType: defectQty > 0 ? defectType : undefined,
      defectSeverity: defectQty > 0 ? defectSeverity : undefined,
      result,
      inspectorName: currentUser.name,
      inspectionDate: new Date().toISOString().substring(0, 10),
      notes: qcNotes,
      checklist
    });

    setShowAddModal(false);
    setQcNotes('');
  };

  const filteredInspections = qcInspections.filter(q => {
    const matchSearch = q.inspectionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'all' || q.inspectionType === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Quality Control & Jaminan Mutu Mebel (QC)
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Inspeksi bahan baku kayu masuk (moisture content), pengawasan in-process perakitan & finishing, serta final QC produk siap kirim.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Input Inspeksi QC</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-md border border-neutral-800">
          {[
            { id: 'all', label: `Semua (${qcInspections.length})` },
            { id: 'Bahan Baku Masuk', label: 'Bahan Masuk' },
            { id: 'In-Process Produksi', label: 'In-Process' },
            { id: 'Produk Jadi (FQC)', label: 'Final (FQC)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                filterType === tab.id
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
            placeholder="Cari kode QC, referensi, defek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-neutral-200 placeholder-neutral-500 focus:outline-hidden focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* QC INSPECTIONS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInspections.map(qc => {
          const isRework = qc.result === 'Rework (Perbaikan)';
          const isReject = qc.result === 'Reject (Ditolak)';
          const isPerfect = qc.result === 'Lolos Sempurna';

          return (
            <div
              key={qc.id}
              className={`p-4 bg-neutral-900 border rounded-lg space-y-3 ${
                isRework
                  ? 'border-amber-700/80 bg-amber-950/10'
                  : isReject
                  ? 'border-rose-700/80 bg-rose-950/10'
                  : 'border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{qc.inspectionCode}</span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-xs text-neutral-400">{qc.inspectionType}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-100 text-xs mt-0.5">
                    {qc.itemName}
                  </h3>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${getStatusBadgeClass(qc.result)}`}>
                  {qc.result}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-neutral-400">
                <div>
                  <span className="text-neutral-500 block text-[10px]">No. Referensi:</span>
                  <span className="font-mono text-neutral-300">{qc.referenceNo}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Inspektur:</span>
                  <span className="text-neutral-300 truncate block">{qc.inspectorName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Tanggal Uji:</span>
                  <span className="font-mono text-neutral-300 tabular-nums">{qc.inspectionDate}</span>
                </div>
              </div>

              {/* Sample Counts */}
              <div className="p-2.5 bg-neutral-950/60 border border-neutral-800/80 rounded flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Sampel Diuji:</span>
                  <span className="font-bold text-neutral-200">{qc.sampleQty} Unit</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-500 block">Lolos (Passed):</span>
                  <span className="font-bold text-emerald-400">{qc.passedQty} Unit</span>
                </div>
                <div>
                  <span className="text-[10px] text-rose-500 block">Cacat (Defects):</span>
                  <span className={`font-bold ${qc.defectQty > 0 ? 'text-rose-400' : 'text-neutral-500'}`}>
                    {qc.defectQty} Unit
                  </span>
                </div>
              </div>

              {/* Defect details if any */}
              {qc.defectType && (
                <div className="p-2 bg-rose-950/30 border border-rose-900/40 rounded text-xs text-rose-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Jenis Cacat: <strong className="font-medium text-rose-200">{qc.defectType}</strong></span>
                  </div>
                  <span className="text-[10px] uppercase font-mono bg-rose-900/60 px-1.5 py-0.2 rounded">
                    Tingkat: {qc.defectSeverity}
                  </span>
                </div>
              )}

              {/* Inspection Checklist */}
              {qc.checklist && qc.checklist.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">
                    Parameter Uji Kualitas:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {qc.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-neutral-300">
                        {item.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span className="truncate">{item.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {qc.notes && (
                <p className="text-[11px] text-neutral-400 bg-neutral-950/40 p-2 rounded border border-neutral-800/40">
                  <strong className="text-neutral-300">Catatan QC: </strong>
                  {qc.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* INPUT QC MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-neutral-100 text-sm">
                Catat Laporan Inspeksi Quality Control (QC)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQC} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Tipe Inspeksi Mutu</label>
                  <select
                    value={inspectionType}
                    onChange={(e) => setInspectionType(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="Bahan Baku Masuk">Bahan Baku Masuk (Incoming Material)</option>
                    <option value="In-Process Produksi">In-Process Produksi (Perakitan & Finishing)</option>
                    <option value="Produk Jadi (FQC)">Produk Jadi (Final Quality Control)</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">No. Referensi (SPK / PO)</label>
                  <input
                    type="text"
                    required
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Nama Komponen / Mebel Diuji</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Jumlah Sampel</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={sampleQty}
                    onChange={(e) => {
                      const sq = parseInt(e.target.value) || 1;
                      setSampleQty(sq);
                      setPassedQty(Math.max(0, sq - defectQty));
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Jumlah Lolos (OK)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={passedQty}
                    onChange={(e) => {
                      const pq = parseInt(e.target.value) || 0;
                      setPassedQty(pq);
                      setDefectQty(Math.max(0, sampleQty - pq));
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Jumlah Cacat (Defect)</label>
                  <input
                    type="number"
                    min={0}
                    value={defectQty}
                    onChange={(e) => {
                      const dq = parseInt(e.target.value) || 0;
                      setDefectQty(dq);
                      setPassedQty(Math.max(0, sampleQty - dq));
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-rose-400 font-mono font-bold"
                  />
                </div>
              </div>

              {defectQty > 0 && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-950 rounded border border-neutral-800">
                  <div>
                    <label className="text-neutral-400 block mb-1">Jenis Cacat Dominan</label>
                    <select
                      value={defectType}
                      onChange={(e) => setDefectType(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200"
                    >
                      <option value="Retak Kayu / Susut">Retak Kayu / Susut</option>
                      <option value="Warping / Melengkung">Warping / Melengkung</option>
                      <option value="Serat Kasar / Gores">Serat Kasar / Gores</option>
                      <option value="Sambungan Dowel Kendor">Sambungan Dowel Kendor</option>
                      <option value="Finishing Belang / Bleeding">Finishing Belang / Bleeding</option>
                      <option value="Finishing Kasar / Kulit Jeruk">Finishing Kasar / Kulit Jeruk</option>
                      <option value="Jok Miring / Busa Kempes">Jok Miring / Busa Kempes</option>
                      <option value="Aksesoris Rusak">Aksesoris Rusak</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Tingkat Keparahan Cacat</label>
                    <select
                      value={defectSeverity}
                      onChange={(e) => setDefectSeverity(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200"
                    >
                      <option value="Minor">Minor (Dapat Diperbaiki Cepat)</option>
                      <option value="Major">Major (Perlu Rework Pembongkaran)</option>
                      <option value="Critical">Critical (Total Reject / Rusak)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-neutral-400 block mb-1">Keputusan Akhir QC</label>
                <select
                  value={result}
                  onChange={(e) => setResult(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500 font-semibold"
                >
                  <option value="Lolos Sempurna">Lolos Sempurna (Pass 100%)</option>
                  <option value="Lolos Bersyarat">Lolos Bersyarat (Toleransi Minor)</option>
                  <option value="Rework (Perbaikan)">Rework (Perbaikan Ulang di Stasiun Kerja)</option>
                  <option value="Reject (Ditolak)">Reject (Barang Ditolak / Dibuang)</option>
                </select>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                <label className="text-neutral-300 font-semibold block">Checklist Verifikasi Standar Mebel</label>
                <div className="space-y-1.5">
                  {checklist.map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleChecklistItem(idx)}
                      className="flex items-center gap-2 p-2 bg-neutral-950 rounded border border-neutral-800/80 cursor-pointer hover:border-neutral-700"
                    >
                      {c.passed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-500 shrink-0" />
                      )}
                      <span className={`text-xs ${c.passed ? 'text-neutral-200' : 'text-neutral-400'}`}>
                        {c.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Catatan Tindakan Koreksi</label>
                <textarea
                  rows={2}
                  placeholder="Instruksi perbaikan untuk kepala stasiun..."
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium rounded transition-colors"
                >
                  Simpan Laporan QC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
