import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductionStep, ProductionStage } from '../../types';
import { formatDuration, getStatusBadgeClass } from '../../utils/formatters';
import { 
  Hammer, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  Building,
  Filter,
  CheckCircle,
  X,
  FileCheck
} from 'lucide-react';

export const ProductionProcessView: React.FC = () => {
  const { 
    workOrders, 
    productionSteps, 
    toggleStepTimer, 
    completeProductionStep, 
    updateProductionStepStatus,
    currentUser 
  } = useApp();

  const [selectedWOId, setSelectedWOId] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [completingStep, setCompletingStep] = useState<ProductionStep | null>(null);

  // Completion modal form
  const [goodQty, setGoodQty] = useState<number>(0);
  const [defectQty, setDefectQty] = useState<number>(0);
  const [actualHours, setActualHours] = useState<number>(0);
  const [completionNotes, setCompletionNotes] = useState<string>('');

  const openCompleteModal = (step: ProductionStep) => {
    const parentWO = workOrders.find(w => w.id === step.woId);
    const targetQty = parentWO ? parentWO.quantity : 1;
    setCompletingStep(step);
    setGoodQty(targetQty);
    setDefectQty(0);
    setActualHours(step.timerSeconds ? +(step.timerSeconds / 3600).toFixed(1) : step.plannedHours);
    setCompletionNotes('');
  };

  const handleConfirmCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingStep) return;

    completeProductionStep(
      completingStep.id,
      goodQty,
      defectQty,
      actualHours,
      completionNotes
    );

    setCompletingStep(null);
  };

  // Filtered steps
  const filteredSteps = productionSteps.filter(s => {
    const matchWO = selectedWOId === 'all' || s.woId === selectedWOId;
    const matchStage = selectedStage === 'all' || s.stage === selectedStage;
    return matchWO && matchStage;
  });

  const stagesList: ProductionStage[] = [
    'Pemotongan Kayu',
    'Perakitan Komponen',
    'Pengamplasan',
    'Finishing & Pewarnaan',
    'Pemasangan Jok & Aksesoris',
    'Packing & Siap Kirim'
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Pelacakan Alur & Proses Produksi Mebel (Shop Floor)
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Tracking stasiun kerja, timer pengerjaan pengrajin kayu, pencatatan hasil lolos / cacat (scrap), dan serah terima antartahap.
          </p>
        </div>

        {/* Live Active Timer Count */}
        <div className="flex items-center gap-3">
          <div className="p-2 px-3 bg-neutral-900 border border-neutral-800 rounded-md flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-neutral-400">Stasiun Beroperasi:</span>
            <span className="font-mono font-bold text-neutral-100 tabular-nums">
              {productionSteps.filter(s => s.status === 'Sedang Berjalan').length} Stasiun
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* SPK Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 font-medium">Filter SPK:</span>
            <select
              value={selectedWOId}
              onChange={(e) => setSelectedWOId(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-neutral-200 focus:outline-hidden focus:border-amber-500"
            >
              <option value="all">Semua Surat Perintah Kerja (SPK)</option>
              {workOrders.map(wo => (
                <option key={wo.id} value={wo.id}>
                  [{wo.woNumber}] {wo.productName} ({wo.quantity} unit)
                </option>
              ))}
            </select>
          </div>

          {/* Stage Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 font-medium">Tahapan:</span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-neutral-200 focus:outline-hidden focus:border-amber-500"
            >
              <option value="all">Semua 6 Tahapan Routing</option>
              {stagesList.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-neutral-500 text-[11px]">
          Menampilkan <span className="text-neutral-300 font-mono font-bold">{filteredSteps.length}</span> kartu pengerjaan
        </div>
      </div>

      {/* STAGE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSteps.map(step => {
          const isRunning = step.timerRunning;
          const isDone = step.status === 'Selesai';
          const isPending = step.status === 'Menunggu';

          return (
            <div
              key={step.id}
              className={`p-4 bg-neutral-900 border rounded-lg space-y-3 transition-all ${
                isRunning
                  ? 'border-amber-500 shadow-md ring-1 ring-amber-500/20'
                  : isDone
                  ? 'border-neutral-800/80 bg-neutral-900/60'
                  : 'border-neutral-800'
              }`}
            >
              {/* Header: Stage name & Status */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] text-amber-500 font-bold block">
                    {step.woNumber}
                  </span>
                  <h3 className="font-bold text-neutral-100 text-xs">
                    {step.stage}
                  </h3>
                </div>

                <span className={`px-2 py-0.5 text-[10px] rounded font-semibold ${getStatusBadgeClass(step.status)}`}>
                  {step.status}
                </span>
              </div>

              {/* Workstation & Operator Assignment */}
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{step.workstationName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="text-neutral-300 truncate">Operator: {step.assignedOperator}</span>
                </div>
              </div>

              {/* Time Tracking Section */}
              <div className="p-2.5 bg-neutral-950/70 border border-neutral-800/80 rounded flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Waktu Berjalan (Timer)</span>
                  <div className="flex items-center gap-1 font-mono text-sm font-bold text-neutral-100 tabular-nums">
                    <Clock className={`w-3.5 h-3.5 ${isRunning ? 'text-amber-400 animate-spin' : 'text-neutral-500'}`} />
                    <span>{formatDuration(step.timerSeconds || 0)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">Target Standar</span>
                  <span className="font-mono text-xs text-neutral-300 tabular-nums">
                    {step.plannedHours} Jam
                  </span>
                </div>
              </div>

              {/* Notes / Technical Guide */}
              {step.notes && (
                <p className="text-[11px] text-neutral-400 bg-neutral-950/40 p-2 rounded border border-neutral-800/40 line-clamp-2">
                  {step.notes}
                </p>
              )}

              {/* Result Summary if Completed */}
              {isDone && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800 text-neutral-400">
                  <span className="text-emerald-400 font-medium">Lolos: {step.goodQty} unit</span>
                  {step.defectQty > 0 ? (
                    <span className="text-rose-400 font-medium">Cacat/Scrap: {step.defectQty}</span>
                  ) : (
                    <span className="text-neutral-500">Nir-Cacat (0)</span>
                  )}
                  <span className="font-mono text-[11px]">{step.actualHours} jam</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                {!isDone && (
                  <>
                    <button
                      onClick={() => toggleStepTimer(step.id)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isRunning
                          ? 'bg-amber-600 text-white hover:bg-amber-500'
                          : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Jeda</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Mulai</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => openCompleteModal(step)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesaikan</span>
                    </button>
                  </>
                )}

                {isDone && (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium py-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Tahap Selesai ({step.completedAt?.split(' ')[0]})</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPLETION MODAL */}
      {completingStep && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div>
                <h3 className="font-bold text-neutral-100 text-sm">
                  Penyelesaian Tahap {completingStep.stage}
                </h3>
                <span className="font-mono text-xs text-amber-400">{completingStep.woNumber}</span>
              </div>
              <button
                onClick={() => setCompletingStep(null)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCompletion} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Jumlah Unit Lolos (Good)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={goodQty}
                    onChange={(e) => setGoodQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-emerald-400 font-mono font-bold focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Jumlah Cacat / Scrap</label>
                  <input
                    type="number"
                    min={0}
                    value={defectQty}
                    onChange={(e) => setDefectQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-rose-400 font-mono font-bold focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Total Jam Pengerjaan Aktual</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={actualHours}
                  onChange={(e) => setActualHours(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Catatan Pengerjaan / Kendala Mesin</label>
                <textarea
                  rows={2}
                  placeholder="Kondisi kayu, penggantian amplas, atau penyesuaian nozzle spray..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {completingStep.stage === 'Packing & Siap Kirim' && (
                <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded text-amber-300 text-[11px] flex items-start gap-2">
                  <FileCheck className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-semibold">Penyelesaian Akhir: </span>
                    Menyelesaikan tahap ini akan otomatis memasukkan {goodQty} unit mebel ke persediaan produk jadi di gudang.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setCompletingStep(null)}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded transition-colors"
                >
                  Konfirmasi Selesai & Lanjut Tahap Berikutnya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
