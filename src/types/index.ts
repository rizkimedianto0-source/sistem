export type UserRole = 
  | 'super_admin' 
  | 'manajer_produksi' 
  | 'supervisor_gudang' 
  | 'kepala_qc' 
  | 'operator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  avatar?: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface Material {
  id: string;
  code: string;
  name: string;
  category: 'Kayu Log & Papan' | 'Finishing & Cat' | 'Aksesoris & Hardware' | 'Busa & Jok' | 'Perekat & Kimia' | 'Kemasan';
  unit: string; // m3, lembar, kaleng, kg, pcs, meter, roll
  stock: number;
  minStock: number;
  pricePerUnit: number;
  supplierId: string;
  supplierName: string;
  location: string; // e.g. "Gudang Kayu A-1", "Rak Kimia B-3"
  moistureContent?: string; // e.g. "12% - 14% (KD Standard)"
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: 'Meja' | 'Kursi' | 'Lemari & Storage' | 'Sofa & Lounge' | 'Tempat Tidur';
  dimensions: string; // P x L x T (cm)
  woodType: string; // Kayu Jati Perhutani, Mahoni Grade A, Sungkai, etc.
  finishType: string; // Melamic Doff, Natural Teak Oil, Duco Satin, etc.
  targetSellingPrice: number;
  estimatedHPP: number;
  bomId?: string;
  stockQty: number;
  image: string;
  status: 'Aktif' | 'Discontinue';
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  leadTimeDays: number;
  rating: number; // 1-5
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  address: string;
  type: 'Retail / Domestik' | 'Proyek Hotel / Cafe' | 'Buyer Ekspor';
}

export interface Workstation {
  id: string;
  code: string;
  name: string;
  section: 'Pemotongan' | 'Perakitan' | 'Pengamplasan' | 'Finishing' | 'Jok & Aksesoris' | 'Packing';
  capacityPerDay: number; // unit/hari
  hourlyRate: number; // Rp/jam
  activeOperators: number;
  status: 'Optimal' | 'Perawatan' | 'Kapasitas Penuh';
}

export interface BOMItem {
  id: string;
  materialId: string;
  materialName: string;
  materialCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  wastagePercent: number; // faktor scrap susut kayu/bahan misal 5% - 10%
}

export interface BOM {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  code: string;
  version: string;
  items: BOMItem[];
  directLaborHours: number;
  directLaborRatePerHour: number;
  overheadCost: number;
  totalDirectMaterialCost: number;
  totalDirectLaborCost: number;
  totalEstimatedHPP: number;
  notes?: string;
  updatedAt: string;
}

export type WOStatus = 'Draft' | 'Disetujui' | 'Dalam Proses' | 'Selesai' | 'Dibatalkan';
export type WOPriority = 'Rendah' | 'Sedang' | 'Tinggi' | 'Urgent';

export interface WorkOrder {
  id: string;
  woNumber: string; // SPK-2026-001
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  orderDate: string;
  startDate: string;
  dueDate: string;
  priority: WOPriority;
  status: WOStatus;
  progressPercent: number;
  currentStage: string;
  batchCode: string;
  targetSellingPrice: number;
  notes?: string;
  approvedBy?: string;
}

export type ProductionStage = 
  | 'Pemotongan Kayu' 
  | 'Perakitan Komponen' 
  | 'Pengamplasan' 
  | 'Finishing & Pewarnaan' 
  | 'Pemasangan Jok & Aksesoris' 
  | 'Packing & Siap Kirim';

export type StepStatus = 'Menunggu' | 'Sedang Berjalan' | 'Selesai' | 'Tertunda';

export interface ProductionStep {
  id: string;
  woId: string;
  woNumber: string;
  stage: ProductionStage;
  workstationName: string;
  assignedOperator: string;
  plannedHours: number;
  actualHours: number;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  goodQty: number;
  defectQty: number;
  notes?: string;
  timerRunning?: boolean;
  timerSeconds?: number;
}

export interface StockMovement {
  id: string;
  date: string;
  itemType: 'Bahan Baku' | 'Produk Jadi';
  itemId: string;
  itemName: string;
  itemCode: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  unit: string;
  referenceNo: string; // No PO, No SPK, or No Opname
  notes: string;
  performedBy: string;
}

export type POStatus = 'Draft' | 'Dipesan' | 'Diterima Sebagian' | 'Diterima Lengkap' | 'Dibatalkan';

export interface POItem {
  id: string;
  materialId: string;
  materialName: string;
  materialCode: string;
  orderedQty: number;
  receivedQty: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // PO-BB-2026-001
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  receivedDate?: string;
  status: POStatus;
  items: POItem[];
  totalAmount: number;
  paymentStatus: 'Belum Dibayar' | 'Uang Muka 50%' | 'Lunas';
  notes?: string;
}

export interface JobOrderCosting {
  id: string;
  woId: string;
  woNumber: string;
  productName: string;
  quantity: number;
  standardMaterialCost: number;
  actualMaterialCost: number;
  standardLaborCost: number;
  actualLaborCost: number;
  standardOverheadCost: number;
  actualOverheadCost: number;
  totalStandardCost: number;
  totalActualCost: number;
  sellingPricePerUnit: number;
  totalRevenue: number;
  grossProfit: number;
  marginPercentage: number;
  varianceCost: number; // Selisih Aktual - Standar
  status: 'Dalam Pengerjaan' | 'Selesai Terhitung';
}

export type DefectType = 
  | 'Retak Kayu / Susut' 
  | 'Warping / Melengkung' 
  | 'Serat Kasar / Gores' 
  | 'Sambungan Dowel Kendor' 
  | 'Finishing Belang / Bleeding' 
  | 'Finishing Kasar / Kulit Jeruk' 
  | 'Jok Miring / Busa Kempes' 
  | 'Aksesoris Rusak' 
  | 'Lainnya';

export interface QCInspection {
  id: string;
  inspectionCode: string; // QC-2026-081
  inspectionType: 'Bahan Baku Masuk' | 'In-Process Produksi' | 'Produk Jadi (FQC)';
  referenceNo: string; // No PO atau No SPK
  itemName: string;
  sampleQty: number;
  passedQty: number;
  defectQty: number;
  defectType?: DefectType;
  defectSeverity?: 'Minor' | 'Major' | 'Critical';
  result: 'Lolos Sempurna' | 'Lolos Bersyarat' | 'Rework (Perbaikan)' | 'Reject (Ditolak)';
  inspectorName: string;
  inspectionDate: string;
  notes: string;
  checklist: {
    item: string;
    passed: boolean;
  }[];
}
