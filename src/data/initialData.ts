import {
  Material,
  Product,
  Supplier,
  Customer,
  Workstation,
  BOM,
  WorkOrder,
  ProductionStep,
  StockMovement,
  PurchaseOrder,
  JobOrderCosting,
  QCInspection,
  User
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'H. Bambang Soetrisno',
    email: 'bambang.direktur@kayucraft.co.id',
    role: 'super_admin',
    roleTitle: 'Direktur Utama & Super Admin',
    department: 'Direksi & Manajemen Eksekutif',
    status: 'Aktif'
  },
  {
    id: 'usr-2',
    name: 'Budi Raharjo, S.T.',
    email: 'budi.produksi@kayucraft.co.id',
    role: 'manajer_produksi',
    roleTitle: 'Manajer Pabrik & Produksi',
    department: 'Divisi Produksi Mebel',
    status: 'Aktif'
  },
  {
    id: 'usr-3',
    name: 'Siti Rohimah',
    email: 'siti.gudang@kayucraft.co.id',
    role: 'supervisor_gudang',
    roleTitle: 'Supervisor Gudang & Logistik',
    department: 'Divisi Gudang Bahan Baku & Finished Goods',
    status: 'Aktif'
  },
  {
    id: 'usr-4',
    name: 'Agus Purnomo, A.Md.',
    email: 'agus.qc@kayucraft.co.id',
    role: 'kepala_qc',
    roleTitle: 'Kepala Quality Assurance & QC',
    department: 'Divisi Pengendalian Mutu',
    status: 'Aktif'
  },
  {
    id: 'usr-5',
    name: 'Wahyudi Santoso',
    email: 'wahyu.operator@kayucraft.co.id',
    role: 'operator',
    roleTitle: 'Tukang Kayu Senior & Operator Mesin',
    department: 'Stasiun Kerja Perakitan & Finishing',
    status: 'Aktif'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'KPH Perhutani Cepu - Kayu Jati TPK',
    contactPerson: 'Ir. Dwi Suryanto',
    phone: '0812-3456-7890',
    email: 'log.cepu@perhutani.go.id',
    address: 'Jl. Blora - Cepu KM 12, Blora, Jawa Tengah',
    category: 'Kayu Log & Papan Kayu Solid',
    leadTimeDays: 7,
    rating: 5
  },
  {
    id: 'sup-2',
    name: 'CV Jepara Timber Mandiri',
    contactPerson: 'Hj. Anisa Wulandari',
    phone: '0813-8899-1122',
    email: 'sales@jeparatimber.com',
    address: 'Kawasan Sentra Kayu Tahunan No. 45, Jepara',
    category: 'Kayu Mahoni & Plywood Meranti',
    leadTimeDays: 4,
    rating: 4
  },
  {
    id: 'sup-3',
    name: 'PT Propan Raya Wood Coating',
    contactPerson: 'Stefanus Hadi',
    phone: '0811-9234-5500',
    email: 'order.wood@propan.co.id',
    address: 'Kawasan Industri Candi Blok C-8, Semarang',
    category: 'Finishing, Thinner, Melamic Sealer',
    leadTimeDays: 3,
    rating: 5
  },
  {
    id: 'sup-4',
    name: 'Toko Hardware & Fitting Mebel Abadi',
    contactPerson: 'Ko Hendra Wijaya',
    phone: '0857-4122-3344',
    email: 'fitting.abadi@gmail.com',
    address: 'Jl. Pemuda No. 88, Semarang',
    category: 'Engsel, Sekrup, Rel Laci, Handle Kuningan',
    leadTimeDays: 2,
    rating: 4
  },
  {
    id: 'sup-5',
    name: 'PT Royal Foam Indonesia',
    contactPerson: 'Eko Sulistyo',
    phone: '0812-7711-2299',
    email: 'sales@royalfoam.co.id',
    address: 'Kawasan Industri Rungkut, Surabaya',
    category: 'Busa D30 & Kain Pelapis Sofa',
    leadTimeDays: 5,
    rating: 5
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    code: 'CUST-001',
    name: 'PT Grand Asri Hospitality',
    company: 'The Royal Santika Hotel & Resort Bali',
    phone: '0812-9876-5432',
    email: 'procurement@royalsantika.com',
    address: 'Jl. Bypass Ngurah Rai No. 88, Nusa Dua, Bali',
    type: 'Proyek Hotel / Cafe'
  },
  {
    id: 'cust-2',
    code: 'CUST-002',
    name: 'Nordic Living Scandinavia ApS',
    company: 'Nordic Living Corp Copenhagen',
    phone: '+45 20 12 34 56',
    email: 'import@nordicliving.dk',
    address: 'Bredgade 24, 1260 Copenhagen, Denmark',
    type: 'Buyer Ekspor'
  },
  {
    id: 'cust-3',
    code: 'CUST-003',
    name: 'Kopi Kenangan Senja Group',
    company: 'PT Ritel Kuliner Nusantara',
    phone: '0819-3322-1100',
    email: 'project@senjacafe.id',
    address: 'Senopati Suites Tower 2, Jakarta Selatan',
    type: 'Proyek Hotel / Cafe'
  },
  {
    id: 'cust-4',
    code: 'CUST-004',
    name: 'Dr. Hendrawan Kusuma, Sp.A',
    company: 'Residensial Pribadi',
    phone: '0811-2345-6789',
    email: 'hendrawan.md@gmail.com',
    address: 'Bukit Sari Estate Kav. 14, Semarang',
    type: 'Retail / Domestik'
  }
];

export const INITIAL_WORKSTATIONS: Workstation[] = [
  {
    id: 'ws-1',
    code: 'WS-CUT',
    name: 'Bandsaw & Table Saw Cutting Station',
    section: 'Pemotongan',
    capacityPerDay: 25,
    hourlyRate: 45000,
    activeOperators: 3,
    status: 'Optimal'
  },
  {
    id: 'ws-2',
    code: 'WS-ASM',
    name: 'Perakitan & Joinery Bench (Mortise & Tenon)',
    section: 'Perakitan',
    capacityPerDay: 15,
    hourlyRate: 55000,
    activeOperators: 4,
    status: 'Optimal'
  },
  {
    id: 'ws-3',
    code: 'WS-SND',
    name: 'Pengamplasan Manual & Wide-Belt Sanding',
    section: 'Pengamplasan',
    capacityPerDay: 20,
    hourlyRate: 40000,
    activeOperators: 3,
    status: 'Optimal'
  },
  {
    id: 'ws-4',
    code: 'WS-FNS',
    name: 'Spray Booth Melamic & Oven Pengeringan',
    section: 'Finishing',
    capacityPerDay: 12,
    hourlyRate: 65000,
    activeOperators: 3,
    status: 'Optimal'
  },
  {
    id: 'ws-5',
    code: 'WS-UPH',
    name: 'Pemasangan Jok, Busa & Hardware Fitting',
    section: 'Jok & Aksesoris',
    capacityPerDay: 18,
    hourlyRate: 45000,
    activeOperators: 2,
    status: 'Optimal'
  },
  {
    id: 'ws-6',
    code: 'WS-PCK',
    name: 'Pengepakan Single Face & Corner Protection Box',
    section: 'Packing',
    capacityPerDay: 30,
    hourlyRate: 35000,
    activeOperators: 2,
    status: 'Optimal'
  }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    code: 'MAT-WOD-01',
    name: 'Kayu Jati Log TPK Perhutani A3 (Kering Oven MC 12%)',
    category: 'Kayu Log & Papan',
    unit: 'm3',
    stock: 14.5,
    minStock: 8.0,
    pricePerUnit: 18500000,
    supplierId: 'sup-1',
    supplierName: 'KPH Perhutani Cepu - Kayu Jati TPK',
    location: 'Gudang Kayu Utama Blok A-1',
    moistureContent: '12% - 13% (Kiln Dried)'
  },
  {
    id: 'mat-2',
    code: 'MAT-WOD-02',
    name: 'Kayu Mahoni Papan Seleksi Grade A (MC 14%)',
    category: 'Kayu Log & Papan',
    unit: 'm3',
    stock: 6.2,
    minStock: 5.0,
    pricePerUnit: 7800000,
    supplierId: 'sup-2',
    supplierName: 'CV Jepara Timber Mandiri',
    location: 'Gudang Kayu Utama Blok A-3',
    moistureContent: '13% - 14% (Kiln Dried)'
  },
  {
    id: 'mat-3',
    code: 'MAT-PLY-01',
    name: 'Plywood Meranti Core 18mm (122 x 244 cm)',
    category: 'Kayu Log & Papan',
    unit: 'lembar',
    stock: 42,
    minStock: 25,
    pricePerUnit: 245000,
    supplierId: 'sup-2',
    supplierName: 'CV Jepara Timber Mandiri',
    location: 'Rak Papan Sheet Blok B-1'
  },
  {
    id: 'mat-4',
    code: 'MAT-GLU-01',
    name: 'Lem Kayu Aliphatic PVAc Titebond II (Galon 4 Kg)',
    category: 'Perekat & Kimia',
    unit: 'kg',
    stock: 35,
    minStock: 20,
    pricePerUnit: 85000,
    supplierId: 'sup-4',
    supplierName: 'Toko Hardware & Fitting Mebel Abadi',
    location: 'Gudang Kimia & Lem C-1'
  },
  {
    id: 'mat-5',
    code: 'MAT-FNS-01',
    name: 'Propan Melamic Sanding Sealer MSS-123',
    category: 'Finishing & Cat',
    unit: 'kaleng (4L)',
    stock: 18,
    minStock: 15,
    pricePerUnit: 280000,
    supplierId: 'sup-3',
    supplierName: 'PT Propan Raya Wood Coating',
    location: 'Gudang Finishing Rak F-2'
  },
  {
    id: 'mat-6',
    code: 'MAT-FNS-02',
    name: 'Propan Melamic Top Coat Doff/Clear ML-131',
    category: 'Finishing & Cat',
    unit: 'kaleng (4L)',
    stock: 9, // Alert: Low stock!
    minStock: 12,
    pricePerUnit: 310000,
    supplierId: 'sup-3',
    supplierName: 'PT Propan Raya Wood Coating',
    location: 'Gudang Finishing Rak F-3'
  },
  {
    id: 'mat-7',
    code: 'MAT-FNS-03',
    name: 'Thinner Super High Gloss Propan',
    category: 'Finishing & Cat',
    unit: 'drum (20L)',
    stock: 4,
    minStock: 3,
    pricePerUnit: 650000,
    supplierId: 'sup-3',
    supplierName: 'PT Propan Raya Wood Coating',
    location: 'Gudang Finishing Rak F-1'
  },
  {
    id: 'mat-8',
    code: 'MAT-SND-01',
    name: 'Amplas Roll Ekamant Grit 180 & 240',
    category: 'Finishing & Cat',
    unit: 'roll (50m)',
    stock: 12,
    minStock: 6,
    pricePerUnit: 320000,
    supplierId: 'sup-4',
    supplierName: 'Toko Hardware & Fitting Mebel Abadi',
    location: 'Rak Amplas C-4'
  },
  {
    id: 'mat-9',
    code: 'MAT-HRD-01',
    name: 'Handle Kuningan Antik Matte Brass 128mm',
    category: 'Aksesoris & Hardware',
    unit: 'pcs',
    stock: 85,
    minStock: 50,
    pricePerUnit: 48000,
    supplierId: 'sup-4',
    supplierName: 'Toko Hardware & Fitting Mebel Abadi',
    location: 'Bin Komponen D-2'
  },
  {
    id: 'mat-10',
    code: 'MAT-HRD-02',
    name: 'Rel Laci Ball Bearing Slow Motion 45cm',
    category: 'Aksesoris & Hardware',
    unit: 'pasang',
    stock: 14, // Alert: Low stock!
    minStock: 20,
    pricePerUnit: 75000,
    supplierId: 'sup-4',
    supplierName: 'Toko Hardware & Fitting Mebel Abadi',
    location: 'Bin Komponen D-5'
  },
  {
    id: 'mat-11',
    code: 'MAT-UPH-01',
    name: 'Busa Royal Foam Density D30 Tebal 10cm',
    category: 'Busa & Jok',
    unit: 'lembar (200x100)',
    stock: 16,
    minStock: 10,
    pricePerUnit: 385000,
    supplierId: 'sup-5',
    supplierName: 'PT Royal Foam Indonesia',
    location: 'Gudang Jok & Busa E-1'
  },
  {
    id: 'mat-12',
    code: 'MAT-UPH-02',
    name: 'Kain Linen Fabric Warm Oatmeal Texture',
    category: 'Busa & Jok',
    unit: 'meter',
    stock: 65,
    minStock: 40,
    pricePerUnit: 125000,
    supplierId: 'sup-5',
    supplierName: 'PT Royal Foam Indonesia',
    location: 'Gudang Jok & Busa E-2'
  },
  {
    id: 'mat-13',
    code: 'MAT-PCK-01',
    name: 'Single Face Corrugated Paper Roll (150cm)',
    category: 'Kemasan',
    unit: 'roll (50m)',
    stock: 22,
    minStock: 15,
    pricePerUnit: 210000,
    supplierId: 'sup-4',
    supplierName: 'Toko Hardware & Fitting Mebel Abadi',
    location: 'Gudang Kemasan G-1'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd-1',
    code: 'MJ-001',
    name: 'Meja Makan Jati Solid Grand Minimalis (6-8 Kursi)',
    category: 'Meja',
    dimensions: '200 x 95 x 76 cm',
    woodType: 'Kayu Jati Solid TPK Perhutani',
    finishType: 'Natural Matte Polyurethane / Wood Stain Walnut',
    targetSellingPrice: 8500000,
    estimatedHPP: 4625000,
    bomId: 'bom-1',
    stockQty: 4,
    image: '/src/assets/images/furniture_dining_table_1790346986616.jpg',
    status: 'Aktif',
    description: 'Meja makan kayu jati solid pilihan dengan sambungan alur lidah mortise tenon berdaya tahan puluhan tahun, sentuhan akhir doff alami.'
  },
  {
    id: 'prd-2',
    code: 'KC-002',
    name: 'Kursi Cafe Scandinavian Ergonomic Mahoni',
    category: 'Kursi',
    dimensions: '52 x 54 x 78 cm',
    woodType: 'Kayu Mahoni Oven Grade A',
    finishType: 'Bleached Natural Doff Scandinavian',
    targetSellingPrice: 1250000,
    estimatedHPP: 645000,
    bomId: 'bom-2',
    stockQty: 18,
    image: '/src/assets/images/furniture_cafe_chair_1790347000752.jpg',
    status: 'Aktif',
    description: 'Kursi makan/cafe dengan lekuk ergonomis kayu mahoni kering, konstruksi kokoh, bobot ringan, dan finishing halus standar ekspor Eropa.'
  },
  {
    id: 'prd-3',
    code: 'LM-003',
    name: 'Lemari Pakaian Minimalis 3 Pintu Slatted Teak',
    category: 'Lemari & Storage',
    dimensions: '160 x 60 x 205 cm',
    woodType: 'Kayu Jati Kombinasi Plywood Meranti',
    finishType: 'Melamic Satin Teak Wood',
    targetSellingPrice: 14500000,
    estimatedHPP: 7920000,
    bomId: 'bom-3',
    stockQty: 2,
    image: '/src/assets/images/furniture_wood_wardrobe_1790347013395.jpg',
    status: 'Aktif',
    description: 'Lemari pakaian 3 pintu beraksen kisi-kisi louvre jati elegan, dilengkapi 3 laci bawah rel soft-closing, gantungan jas, dan rak luas.'
  },
  {
    id: 'prd-4',
    code: 'SF-004',
    name: 'Sofa 2-Seater Upholstery Linen Jepara Teak Leg',
    category: 'Sofa & Lounge',
    dimensions: '165 x 85 x 82 cm',
    woodType: 'Rangka Mahoni Oven & Kaki Jati Bubut Solid',
    finishType: 'Linen Fabric Warm Gray + Kaki Natural Teak',
    targetSellingPrice: 6200000,
    estimatedHPP: 3340000,
    bomId: 'bom-4',
    stockQty: 5,
    image: '/src/assets/images/furniture_sofa_jepara_1790347025793.jpg',
    status: 'Aktif',
    description: 'Sofa dua dudukan berbusa Royal D30 anti-kempes, pelapis linen berserat mewah, ditopang rangka kayu kokoh dan kaki jati bundar minimalis.'
  }
];

export const INITIAL_BOMS: BOM[] = [
  {
    id: 'bom-1',
    productId: 'prd-1',
    productName: 'Meja Makan Jati Solid Grand Minimalis (6-8 Kursi)',
    productCode: 'MJ-001',
    code: 'BOM-MJ001-REV2',
    version: '2.1',
    items: [
      {
        id: 'bi-1',
        materialId: 'mat-1',
        materialName: 'Kayu Jati Log TPK Perhutani A3',
        materialCode: 'MAT-WOD-01',
        quantity: 0.18,
        unit: 'm3',
        unitPrice: 18500000,
        subtotal: 3330000,
        wastagePercent: 12
      },
      {
        id: 'bi-2',
        materialId: 'mat-4',
        materialName: 'Lem Kayu Aliphatic PVAc Titebond II',
        materialCode: 'MAT-GLU-01',
        quantity: 1.5,
        unit: 'kg',
        unitPrice: 85000,
        subtotal: 127500,
        wastagePercent: 5
      },
      {
        id: 'bi-3',
        materialId: 'mat-5',
        materialName: 'Propan Melamic Sanding Sealer MSS-123',
        materialCode: 'MAT-FNS-01',
        quantity: 0.8,
        unit: 'kaleng (4L)',
        unitPrice: 280000,
        subtotal: 224000,
        wastagePercent: 8
      },
      {
        id: 'bi-4',
        materialId: 'mat-6',
        materialName: 'Propan Melamic Top Coat Doff/Clear ML-131',
        materialCode: 'MAT-FNS-02',
        quantity: 0.6,
        unit: 'kaleng (4L)',
        unitPrice: 310000,
        subtotal: 186000,
        wastagePercent: 6
      },
      {
        id: 'bi-5',
        materialId: 'mat-7',
        materialName: 'Thinner Super High Gloss Propan',
        materialCode: 'MAT-FNS-03',
        quantity: 0.1,
        unit: 'drum (20L)',
        unitPrice: 650000,
        subtotal: 65000,
        wastagePercent: 5
      },
      {
        id: 'bi-6',
        materialId: 'mat-8',
        materialName: 'Amplas Roll Ekamant Grit 180 & 240',
        materialCode: 'MAT-SND-01',
        quantity: 0.25,
        unit: 'roll (50m)',
        unitPrice: 320000,
        subtotal: 80000,
        wastagePercent: 0
      },
      {
        id: 'bi-7',
        materialId: 'mat-13',
        materialName: 'Single Face Corrugated Paper Roll (150cm)',
        materialCode: 'MAT-PCK-01',
        quantity: 0.3,
        unit: 'roll (50m)',
        unitPrice: 210000,
        subtotal: 63000,
        wastagePercent: 0
      }
    ],
    directLaborHours: 12,
    directLaborRatePerHour: 45000,
    overheadCost: 350000, // Listrik oven, penyusutan pisau saw, sewa
    totalDirectMaterialCost: 4075500,
    totalDirectLaborCost: 540000,
    totalEstimatedHPP: 4965500,
    notes: 'Kadar air kayu jati wajib di bawah 14% sebelum masuk proses serut dan pasah.',
    updatedAt: '2026-09-15'
  },
  {
    id: 'bom-2',
    productId: 'prd-2',
    productName: 'Kursi Cafe Scandinavian Ergonomic Mahoni',
    productCode: 'KC-002',
    code: 'BOM-KC002-REV1',
    version: '1.4',
    items: [
      {
        id: 'bi-8',
        materialId: 'mat-2',
        materialName: 'Kayu Mahoni Papan Seleksi Grade A',
        materialCode: 'MAT-WOD-02',
        quantity: 0.045,
        unit: 'm3',
        unitPrice: 7800000,
        subtotal: 351000,
        wastagePercent: 10
      },
      {
        id: 'bi-9',
        materialId: 'mat-4',
        materialName: 'Lem Kayu Aliphatic PVAc Titebond II',
        materialCode: 'MAT-GLU-01',
        quantity: 0.3,
        unit: 'kg',
        unitPrice: 85000,
        subtotal: 25500,
        wastagePercent: 5
      },
      {
        id: 'bi-10',
        materialId: 'mat-5',
        materialName: 'Propan Melamic Sanding Sealer MSS-123',
        materialCode: 'MAT-FNS-01',
        quantity: 0.25,
        unit: 'kaleng (4L)',
        unitPrice: 280000,
        subtotal: 70000,
        wastagePercent: 8
      },
      {
        id: 'bi-11',
        materialId: 'mat-6',
        materialName: 'Propan Melamic Top Coat Doff/Clear ML-131',
        materialCode: 'MAT-FNS-02',
        quantity: 0.2,
        unit: 'kaleng (4L)',
        unitPrice: 310000,
        subtotal: 62000,
        wastagePercent: 5
      },
      {
        id: 'bi-12',
        materialId: 'mat-13',
        materialName: 'Single Face Corrugated Paper Roll (150cm)',
        materialCode: 'MAT-PCK-01',
        quantity: 0.15,
        unit: 'roll (50m)',
        unitPrice: 210000,
        subtotal: 31500,
        wastagePercent: 0
      }
    ],
    directLaborHours: 4,
    directLaborRatePerHour: 40000,
    overheadCost: 65000,
    totalDirectMaterialCost: 540000,
    totalDirectLaborCost: 160000,
    totalEstimatedHPP: 765000,
    notes: 'Finishing natural doff transparan memperlihatkan urat kayu mahoni cerah.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'bom-3',
    productId: 'prd-3',
    productName: 'Lemari Pakaian Minimalis 3 Pintu Slatted Teak',
    productCode: 'LM-003',
    code: 'BOM-LM003-REV1',
    version: '1.0',
    items: [
      {
        id: 'bi-13',
        materialId: 'mat-1',
        materialName: 'Kayu Jati Log TPK Perhutani A3',
        materialCode: 'MAT-WOD-01',
        quantity: 0.26,
        unit: 'm3',
        unitPrice: 18500000,
        subtotal: 4810000,
        wastagePercent: 12
      },
      {
        id: 'bi-14',
        materialId: 'mat-3',
        materialName: 'Plywood Meranti Core 18mm',
        materialCode: 'MAT-PLY-01',
        quantity: 4,
        unit: 'lembar',
        unitPrice: 245000,
        subtotal: 980000,
        wastagePercent: 5
      },
      {
        id: 'bi-15',
        materialId: 'mat-9',
        materialName: 'Handle Kuningan Antik Matte Brass 128mm',
        materialCode: 'MAT-HRD-01',
        quantity: 6,
        unit: 'pcs',
        unitPrice: 48000,
        subtotal: 288000,
        wastagePercent: 0
      },
      {
        id: 'bi-16',
        materialId: 'mat-10',
        materialName: 'Rel Laci Ball Bearing Slow Motion 45cm',
        materialCode: 'MAT-HRD-02',
        quantity: 3,
        unit: 'pasang',
        unitPrice: 75000,
        subtotal: 225000,
        wastagePercent: 0
      },
      {
        id: 'bi-17',
        materialId: 'mat-5',
        materialName: 'Propan Melamic Sanding Sealer MSS-123',
        materialCode: 'MAT-FNS-01',
        quantity: 1.5,
        unit: 'kaleng (4L)',
        unitPrice: 280000,
        subtotal: 420000,
        wastagePercent: 8
      },
      {
        id: 'bi-18',
        materialId: 'mat-6',
        materialName: 'Propan Melamic Top Coat Doff/Clear ML-131',
        materialCode: 'MAT-FNS-02',
        quantity: 1.2,
        unit: 'kaleng (4L)',
        unitPrice: 310000,
        subtotal: 372000,
        wastagePercent: 5
      }
    ],
    directLaborHours: 24,
    directLaborRatePerHour: 50000,
    overheadCost: 650000,
    totalDirectMaterialCost: 7095000,
    totalDirectLaborCost: 1200000,
    totalEstimatedHPP: 8945000,
    notes: 'Presisi jalur kisi-kisi dan rel laci soft closing harus diuji 20 siklus buka tutup.',
    updatedAt: '2026-09-10'
  },
  {
    id: 'bom-4',
    productId: 'prd-4',
    productName: 'Sofa 2-Seater Upholstery Linen Jepara Teak Leg',
    productCode: 'SF-004',
    code: 'BOM-SF004-REV1',
    version: '1.2',
    items: [
      {
        id: 'bi-19',
        materialId: 'mat-2',
        materialName: 'Kayu Mahoni Papan Seleksi Grade A',
        materialCode: 'MAT-WOD-02',
        quantity: 0.08,
        unit: 'm3',
        unitPrice: 7800000,
        subtotal: 624000,
        wastagePercent: 8
      },
      {
        id: 'bi-20',
        materialId: 'mat-11',
        materialName: 'Busa Royal Foam Density D30 Tebal 10cm',
        materialCode: 'MAT-UPH-01',
        quantity: 2.5,
        unit: 'lembar (200x100)',
        unitPrice: 385000,
        subtotal: 962500,
        wastagePercent: 5
      },
      {
        id: 'bi-21',
        materialId: 'mat-12',
        materialName: 'Kain Linen Fabric Warm Oatmeal Texture',
        materialCode: 'MAT-UPH-02',
        quantity: 8.5,
        unit: 'meter',
        unitPrice: 125000,
        subtotal: 1062500,
        wastagePercent: 7
      },
      {
        id: 'bi-22',
        materialId: 'mat-1',
        materialName: 'Kayu Jati Log TPK Perhutani A3 (Kaki Bubut)',
        materialCode: 'MAT-WOD-01',
        quantity: 0.012,
        unit: 'm3',
        unitPrice: 18500000,
        subtotal: 222000,
        wastagePercent: 10
      }
    ],
    directLaborHours: 10,
    directLaborRatePerHour: 45000,
    overheadCost: 250000,
    totalDirectMaterialCost: 2871000,
    totalDirectLaborCost: 450000,
    totalEstimatedHPP: 3571000,
    notes: 'Kerapatan jahitan kain double stitch 5mm, spring zig-zag dilapisi webbing karet.',
    updatedAt: '2026-09-20'
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-1',
    woNumber: 'SPK-2026-041',
    customerId: 'cust-1',
    customerName: 'PT Grand Asri Hospitality (The Royal Santika Hotel)',
    productId: 'prd-1',
    productName: 'Meja Makan Jati Solid Grand Minimalis (6-8 Kursi)',
    productCode: 'MJ-001',
    quantity: 8,
    orderDate: '2026-09-12',
    startDate: '2026-09-14',
    dueDate: '2026-10-05',
    priority: 'Tinggi',
    status: 'Dalam Proses',
    progressPercent: 65,
    currentStage: 'Finishing & Pewarnaan',
    batchCode: 'BATCH-JATI-09A',
    targetSellingPrice: 8500000,
    notes: 'Pesanan untuk Villa VIP Executive Suite. Harus di-finish natural satin tahan air.',
    approvedBy: 'Budi Raharjo, S.T.'
  },
  {
    id: 'wo-2',
    woNumber: 'SPK-2026-042',
    customerId: 'cust-3',
    customerName: 'Kopi Kenangan Senja Group',
    productId: 'prd-2',
    productName: 'Kursi Cafe Scandinavian Ergonomic Mahoni',
    productCode: 'KC-002',
    quantity: 40,
    orderDate: '2026-09-18',
    startDate: '2026-09-20',
    dueDate: '2026-10-12',
    priority: 'Sedang',
    status: 'Dalam Proses',
    progressPercent: 35,
    currentStage: 'Perakitan Komponen',
    batchCode: 'BATCH-MHO-09B',
    targetSellingPrice: 1250000,
    notes: 'Bahan kayu mahoni oven seragam tanpa gubal putih. Logo laser tersembunyi di bawah.',
    approvedBy: 'Budi Raharjo, S.T.'
  },
  {
    id: 'wo-3',
    woNumber: 'SPK-2026-043',
    customerId: 'cust-2',
    customerName: 'Nordic Living Scandinavia ApS (Denmark)',
    productId: 'prd-4',
    productName: 'Sofa 2-Seater Upholstery Linen Jepara Teak Leg',
    productCode: 'SF-004',
    quantity: 12,
    orderDate: '2026-09-05',
    startDate: '2026-09-08',
    dueDate: '2026-09-28',
    priority: 'Urgent',
    status: 'Dalam Proses',
    progressPercent: 90,
    currentStage: 'Packing & Siap Kirim',
    batchCode: 'BATCH-EXP-09C',
    targetSellingPrice: 6200000,
    notes: 'Kontainer ekspor FCL Port Tanjung Emas. Box standar double wall honeycomb.',
    approvedBy: 'H. Bambang Soetrisno'
  },
  {
    id: 'wo-4',
    woNumber: 'SPK-2026-044',
    customerId: 'cust-4',
    customerName: 'Dr. Hendrawan Kusuma, Sp.A',
    productId: 'prd-3',
    productName: 'Lemari Pakaian Minimalis 3 Pintu Slatted Teak',
    productCode: 'LM-003',
    quantity: 2,
    orderDate: '2026-09-22',
    startDate: '2026-09-25',
    dueDate: '2026-10-20',
    priority: 'Sedang',
    status: 'Disetujui',
    progressPercent: 0,
    currentStage: 'Pemotongan Kayu',
    batchCode: 'BATCH-LMR-09D',
    targetSellingPrice: 14500000,
    notes: 'Instalasi knock-down di lantai 2 Semarang. Fitting engsel soft closing.',
    approvedBy: 'Budi Raharjo, S.T.'
  },
  {
    id: 'wo-5',
    woNumber: 'SPK-2026-038',
    customerId: 'cust-1',
    customerName: 'PT Grand Asri Hospitality',
    productId: 'prd-2',
    productName: 'Kursi Cafe Scandinavian Ergonomic Mahoni',
    productCode: 'KC-002',
    quantity: 20,
    orderDate: '2026-08-20',
    startDate: '2026-08-22',
    dueDate: '2026-09-15',
    priority: 'Sedang',
    status: 'Selesai',
    progressPercent: 100,
    currentStage: 'Packing & Siap Kirim',
    batchCode: 'BATCH-MHO-08Z',
    targetSellingPrice: 1250000,
    notes: 'Telah serah terima dan masuk inventaris produk jadi.',
    approvedBy: 'Budi Raharjo, S.T.'
  }
];

export const INITIAL_PRODUCTION_STEPS: ProductionStep[] = [
  // For wo-1 (Meja Makan Jati - SPK-2026-041)
  {
    id: 'step-1-1',
    woId: 'wo-1',
    woNumber: 'SPK-2026-041',
    stage: 'Pemotongan Kayu',
    workstationName: 'Bandsaw & Table Saw Cutting Station',
    assignedOperator: 'Slamet Riyadi & Joko Tarub',
    plannedHours: 16,
    actualHours: 15.5,
    status: 'Selesai',
    startedAt: '2026-09-14 08:00',
    completedAt: '2026-09-16 11:30',
    goodQty: 8,
    defectQty: 0,
    notes: 'Papan meja dipilah urat serat lurus (quarter sawn) tanpa mata kayu rapuh.'
  },
  {
    id: 'step-1-2',
    woId: 'wo-1',
    woNumber: 'SPK-2026-041',
    stage: 'Perakitan Komponen',
    workstationName: 'Perakitan & Joinery Bench (Mortise & Tenon)',
    assignedOperator: 'Wahyudi Santoso',
    plannedHours: 24,
    actualHours: 23,
    status: 'Selesai',
    startedAt: '2026-09-16 13:00',
    completedAt: '2026-09-19 16:00',
    goodQty: 8,
    defectQty: 0,
    notes: 'Sambungan mortise tenon kaki meja diberi lem Titebond II dengan clamp press 24 jam.'
  },
  {
    id: 'step-1-3',
    woId: 'wo-1',
    woNumber: 'SPK-2026-041',
    stage: 'Pengamplasan',
    workstationName: 'Pengamplasan Manual & Wide-Belt Sanding',
    assignedOperator: 'Darto Sugeng',
    plannedHours: 16,
    actualHours: 17,
    status: 'Selesai',
    startedAt: '2026-09-20 08:30',
    completedAt: '2026-09-22 15:00',
    goodQty: 8,
    defectQty: 0,
    notes: 'Pengamplasan bertahap grit 120, 180, sampai 240. Permukaan rata tanpa goresan melintang.'
  },
  {
    id: 'step-1-4',
    woId: 'wo-1',
    woNumber: 'SPK-2026-041',
    stage: 'Finishing & Pewarnaan',
    workstationName: 'Spray Booth Melamic & Oven Pengeringan',
    assignedOperator: 'Teguh Suwarto',
    plannedHours: 20,
    actualHours: 12,
    status: 'Sedang Berjalan',
    startedAt: '2026-09-23 09:00',
    goodQty: 6,
    defectQty: 0,
    notes: 'Proses lapisan kedua Sanding Sealer Propan MSS-123. Sedang menunggu pengeringan di oven.',
    timerRunning: true,
    timerSeconds: 43200 // 12 jam
  },
  {
    id: 'step-1-5',
    woId: 'wo-1',
    woNumber: 'SPK-2026-041',
    stage: 'Pemasangan Jok & Aksesoris',
    workstationName: 'Pemasangan Jok, Busa & Hardware Fitting',
    assignedOperator: 'Wahyudi Santoso',
    plannedHours: 6,
    actualHours: 0,
    status: 'Menunggu',
    goodQty: 0,
    defectQty: 0,
    notes: 'Pemasangan pelindung kaki meja felt pads anti-gores dan plat penguat sudut.'
  },
  {
    id: 'step-1-6',
    woId: 'wo-1',
    woNumber: 'SPK-2026-041',
    stage: 'Packing & Siap Kirim',
    workstationName: 'Pengepakan Single Face & Corner Protection Box',
    assignedOperator: 'Rahmat Hidayat',
    plannedHours: 8,
    actualHours: 0,
    status: 'Menunggu',
    goodQty: 0,
    defectQty: 0,
    notes: 'Packing foam sheet tebal 2mm dilapis kardus single face dan pelindung sudut kayu.'
  },

  // For wo-2 (Kursi Cafe - SPK-2026-042)
  {
    id: 'step-2-1',
    woId: 'wo-2',
    woNumber: 'SPK-2026-042',
    stage: 'Pemotongan Kayu',
    workstationName: 'Bandsaw & Table Saw Cutting Station',
    assignedOperator: 'Slamet Riyadi',
    plannedHours: 20,
    actualHours: 19,
    status: 'Selesai',
    startedAt: '2026-09-20 08:00',
    completedAt: '2026-09-22 17:00',
    goodQty: 40,
    defectQty: 1,
    notes: '1 komponen sandaran bengkok retak saat proses belah, diganti dari cadangan spul.'
  },
  {
    id: 'step-2-2',
    woId: 'wo-2',
    woNumber: 'SPK-2026-042',
    stage: 'Perakitan Komponen',
    workstationName: 'Perakitan & Joinery Bench (Mortise & Tenon)',
    assignedOperator: 'Joko Tarub & Wahyudi',
    plannedHours: 35,
    actualHours: 14,
    status: 'Sedang Berjalan',
    startedAt: '2026-09-23 08:00',
    goodQty: 18,
    defectQty: 0,
    notes: 'Rangka sandaran lengkung dipres dengan jig khusus, 18 kursi telah selesai dirakit.',
    timerRunning: true,
    timerSeconds: 50400
  },
  {
    id: 'step-2-3',
    woId: 'wo-2',
    woNumber: 'SPK-2026-042',
    stage: 'Pengamplasan',
    workstationName: 'Pengamplasan Manual & Wide-Belt Sanding',
    assignedOperator: 'Darto Sugeng',
    plannedHours: 22,
    actualHours: 0,
    status: 'Menunggu',
    goodQty: 0,
    defectQty: 0
  },
  {
    id: 'step-2-4',
    woId: 'wo-2',
    woNumber: 'SPK-2026-042',
    stage: 'Finishing & Pewarnaan',
    workstationName: 'Spray Booth Melamic & Oven Pengeringan',
    assignedOperator: 'Teguh Suwarto',
    plannedHours: 25,
    actualHours: 0,
    status: 'Menunggu',
    goodQty: 0,
    defectQty: 0
  },
  {
    id: 'step-2-5',
    woId: 'wo-2',
    woNumber: 'SPK-2026-042',
    stage: 'Pemasangan Jok & Aksesoris',
    workstationName: 'Pemasangan Jok, Busa & Hardware Fitting',
    assignedOperator: 'Rahmat Hidayat',
    plannedHours: 10,
    actualHours: 0,
    status: 'Menunggu',
    goodQty: 0,
    defectQty: 0
  },
  {
    id: 'step-2-6',
    woId: 'wo-2',
    woNumber: 'SPK-2026-042',
    stage: 'Packing & Siap Kirim',
    workstationName: 'Pengepakan Single Face & Corner Protection Box',
    assignedOperator: 'Rahmat Hidayat',
    plannedHours: 12,
    actualHours: 0,
    status: 'Menunggu',
    goodQty: 0,
    defectQty: 0
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'sm-1',
    date: '2026-09-24 14:30',
    itemType: 'Bahan Baku',
    itemId: 'mat-1',
    itemName: 'Kayu Jati Log TPK Perhutani A3',
    itemCode: 'MAT-WOD-01',
    type: 'OUT',
    quantity: 1.44,
    unit: 'm3',
    referenceNo: 'SPK-2026-041',
    notes: 'Pengeluaran kayu jati untuk produksi 8 unit Meja Makan Solid Grand',
    performedBy: 'Siti Rohimah'
  },
  {
    id: 'sm-2',
    date: '2026-09-22 10:15',
    itemType: 'Bahan Baku',
    itemId: 'mat-2',
    itemName: 'Kayu Mahoni Papan Seleksi Grade A',
    itemCode: 'MAT-WOD-02',
    type: 'OUT',
    quantity: 1.80,
    unit: 'm3',
    referenceNo: 'SPK-2026-042',
    notes: 'Alokasi bahan baku kayu mahoni untuk 40 unit Kursi Cafe Senja',
    performedBy: 'Siti Rohimah'
  },
  {
    id: 'sm-3',
    date: '2026-09-20 09:00',
    itemType: 'Bahan Baku',
    itemId: 'mat-5',
    itemName: 'Propan Melamic Sanding Sealer MSS-123',
    itemCode: 'MAT-FNS-01',
    type: 'IN',
    quantity: 10,
    unit: 'kaleng (4L)',
    referenceNo: 'PO-BB-2026-018',
    notes: 'Penerimaan barang dari PT Propan Raya Semarang',
    performedBy: 'Siti Rohimah'
  },
  {
    id: 'sm-4',
    date: '2026-09-18 16:45',
    itemType: 'Produk Jadi',
    itemId: 'prd-2',
    itemName: 'Kursi Cafe Scandinavian Ergonomic Mahoni',
    itemCode: 'KC-002',
    type: 'IN',
    quantity: 20,
    unit: 'unit',
    referenceNo: 'SPK-2026-038',
    notes: 'Penyelesaian pesanan batch SPK-038 dan masuk ke persediaan gudang jadi',
    performedBy: 'Siti Rohimah'
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-BB-2026-022',
    supplierId: 'sup-3',
    supplierName: 'PT Propan Raya Wood Coating',
    orderDate: '2026-09-23',
    expectedDate: '2026-09-27',
    status: 'Dipesan',
    paymentStatus: 'Uang Muka 50%',
    totalAmount: 6710000,
    notes: 'Pengadaan darurat Top Coat ML-131 karena stok menipis di bawah safety stock.',
    items: [
      {
        id: 'poi-1',
        materialId: 'mat-6',
        materialName: 'Propan Melamic Top Coat Doff/Clear ML-131',
        materialCode: 'MAT-FNS-02',
        orderedQty: 15,
        receivedQty: 0,
        unit: 'kaleng (4L)',
        unitPrice: 310000,
        subtotal: 4650000
      },
      {
        id: 'poi-2',
        materialId: 'mat-7',
        materialName: 'Thinner Super High Gloss Propan',
        materialCode: 'MAT-FNS-03',
        orderedQty: 2,
        receivedQty: 0,
        unit: 'drum (20L)',
        unitPrice: 650000,
        subtotal: 1300000
      },
      {
        id: 'poi-3',
        materialId: 'mat-8',
        materialName: 'Amplas Roll Ekamant Grit 180 & 240',
        materialCode: 'MAT-SND-01',
        orderedQty: 2,
        receivedQty: 0,
        unit: 'roll (50m)',
        unitPrice: 380000,
        subtotal: 760000
      }
    ]
  },
  {
    id: 'po-2',
    poNumber: 'PO-BB-2026-021',
    supplierId: 'sup-4',
    supplierName: 'Toko Hardware & Fitting Mebel Abadi',
    orderDate: '2026-09-19',
    expectedDate: '2026-09-22',
    receivedDate: '2026-09-22',
    status: 'Diterima Lengkap',
    paymentStatus: 'Lunas',
    totalAmount: 3225000,
    notes: 'Barang telah dicek QC masuk dan lolos 100%.',
    items: [
      {
        id: 'poi-4',
        materialId: 'mat-10',
        materialName: 'Rel Laci Ball Bearing Slow Motion 45cm',
        materialCode: 'MAT-HRD-02',
        orderedQty: 25,
        receivedQty: 25,
        unit: 'pasang',
        unitPrice: 75000,
        subtotal: 1875000
      },
      {
        id: 'poi-5',
        materialId: 'mat-9',
        materialName: 'Handle Kuningan Antik Matte Brass 128mm',
        materialCode: 'MAT-HRD-01',
        orderedQty: 25,
        receivedQty: 25,
        unit: 'pcs',
        unitPrice: 48000,
        subtotal: 1200000
      },
      {
        id: 'poi-6',
        materialId: 'mat-4',
        materialName: 'Lem Kayu Aliphatic PVAc Titebond II',
        materialCode: 'MAT-GLU-01',
        orderedQty: 2,
        receivedQty: 2,
        unit: 'kg',
        unitPrice: 75000,
        subtotal: 150000
      }
    ]
  },
  {
    id: 'po-3',
    poNumber: 'PO-BB-2026-020',
    supplierId: 'sup-1',
    supplierName: 'KPH Perhutani Cepu - Kayu Jati TPK',
    orderDate: '2026-09-10',
    expectedDate: '2026-09-17',
    receivedDate: '2026-09-16',
    status: 'Diterima Lengkap',
    paymentStatus: 'Lunas',
    totalAmount: 92500000,
    notes: 'Pengiriman 5 m3 Kayu Jati TPK Log A3 sertifikat legalitas kayu SVLK.',
    items: [
      {
        id: 'poi-7',
        materialId: 'mat-1',
        materialName: 'Kayu Jati Log TPK Perhutani A3',
        materialCode: 'MAT-WOD-01',
        orderedQty: 5,
        receivedQty: 5,
        unit: 'm3',
        unitPrice: 18500000,
        subtotal: 92500000
      }
    ]
  }
];

export const INITIAL_JOB_ORDER_COSTINGS: JobOrderCosting[] = [
  {
    id: 'joc-1',
    woId: 'wo-1',
    woNumber: 'SPK-2026-041',
    productName: 'Meja Makan Jati Solid Grand Minimalis (6-8 Kursi)',
    quantity: 8,
    standardMaterialCost: 32604000,
    actualMaterialCost: 33150000,
    standardLaborCost: 4320000,
    actualLaborCost: 4200000,
    standardOverheadCost: 2800000,
    actualOverheadCost: 2750000,
    totalStandardCost: 39724000,
    totalActualCost: 40100000,
    sellingPricePerUnit: 8500000,
    totalRevenue: 68000000,
    grossProfit: 27900000,
    marginPercentage: 41.0,
    varianceCost: 376000, // Sedikit di atas estimasi karena scrap kayu 12%
    status: 'Dalam Pengerjaan'
  },
  {
    id: 'joc-2',
    woId: 'wo-2',
    woNumber: 'SPK-2026-042',
    productName: 'Kursi Cafe Scandinavian Ergonomic Mahoni',
    quantity: 40,
    standardMaterialCost: 21600000,
    actualMaterialCost: 21750000,
    standardLaborCost: 6400000,
    actualLaborCost: 6100000,
    standardOverheadCost: 2600000,
    actualOverheadCost: 2500000,
    totalStandardCost: 30600000,
    totalActualCost: 30350000,
    sellingPricePerUnit: 1250000,
    totalRevenue: 50000000,
    grossProfit: 19650000,
    marginPercentage: 39.3,
    varianceCost: -250000, // Favorable variance (lebih hemat 250rb)
    status: 'Dalam Pengerjaan'
  },
  {
    id: 'joc-3',
    woId: 'wo-5',
    woNumber: 'SPK-2026-038',
    productName: 'Kursi Cafe Scandinavian Ergonomic Mahoni',
    quantity: 20,
    standardMaterialCost: 10800000,
    actualMaterialCost: 10720000,
    standardLaborCost: 3200000,
    actualLaborCost: 3150000,
    standardOverheadCost: 1300000,
    actualOverheadCost: 1280000,
    totalStandardCost: 15300000,
    totalActualCost: 15150000,
    sellingPricePerUnit: 1250000,
    totalRevenue: 25000000,
    grossProfit: 9850000,
    marginPercentage: 39.4,
    varianceCost: -150000,
    status: 'Selesai Terhitung'
  }
];

export const INITIAL_QC_INSPECTIONS: QCInspection[] = [
  {
    id: 'qc-1',
    inspectionCode: 'QC-2026-088',
    inspectionType: 'In-Process Produksi',
    referenceNo: 'SPK-2026-041',
    itemName: 'Komponen Meja Makan Jati - Tahap Perakitan',
    sampleQty: 8,
    passedQty: 8,
    defectQty: 0,
    result: 'Lolos Sempurna',
    inspectorName: 'Agus Purnomo, A.Md.',
    inspectionDate: '2026-09-19',
    notes: 'Kekuatan purus sambungan kaki dan apron meja memenuhi standar toleransi beban > 150 kg.',
    checklist: [
      { item: 'Uji Kadar Air Kayu (MC < 14%)', passed: true },
      { item: 'Presisi Sudut Siku 90 Derajat', passed: true },
      { item: 'Kekuatan Lem & Daya Rekat Mortise Tenon', passed: true },
      { item: 'Bebas Retak Susut & Mata Kayu Busuk', passed: true }
    ]
  },
  {
    id: 'qc-2',
    inspectionCode: 'QC-2026-087',
    inspectionType: 'In-Process Produksi',
    referenceNo: 'SPK-2026-042',
    itemName: 'Komponen Kaki Belakang Kursi Cafe Mahoni',
    sampleQty: 40,
    passedQty: 38,
    defectQty: 2,
    defectType: 'Warping / Melengkung',
    defectSeverity: 'Minor',
    result: 'Rework (Perbaikan)',
    inspectorName: 'Agus Purnomo, A.Md.',
    inspectionDate: '2026-09-22',
    notes: 'Dua batang komponen mengalami deviasi lengkung 2.5mm saat pengetaman, dikembalikan ke station sanding untuk diratakan ulang.',
    checklist: [
      { item: 'Simetri Lengkung Backrest Sandaran', passed: false },
      { item: 'Kekuatan Alur Dowel Pin', passed: true },
      { item: 'Keseragaman Ketebalan Kayu 28mm', passed: true },
      { item: 'Bebas Jamur Biru (Blue Stain Mahoni)', passed: true }
    ]
  },
  {
    id: 'qc-3',
    inspectionCode: 'QC-2026-086',
    inspectionType: 'Bahan Baku Masuk',
    referenceNo: 'PO-BB-2026-020',
    itemName: 'Kayu Jati Log TPK Perhutani Cepu',
    sampleQty: 10,
    passedQty: 10,
    defectQty: 0,
    result: 'Lolos Sempurna',
    inspectorName: 'Agus Purnomo, A.Md.',
    inspectionDate: '2026-09-16',
    notes: 'Uji moisture meter digital rata-rata 12.8%. Diameter log memenuhi kualifikasi kelas A3, sertifikat SVLK lengkap.',
    checklist: [
      { item: 'Cek Sertifikat SVLK & Dokumen Legalitas Kayu', passed: true },
      { item: 'Pengukuran Kadar Air (Moisture Content 12-14%)', passed: true },
      { item: 'Pemeriksaan Hati Kayu & Retak Ring', passed: true },
      { item: 'Ketebalan Papan Toleransi +/- 1mm', passed: true }
    ]
  },
  {
    id: 'qc-4',
    inspectionCode: 'QC-2026-085',
    inspectionType: 'Produk Jadi (FQC)',
    referenceNo: 'SPK-2026-038',
    itemName: 'Kursi Cafe Scandinavian Mahoni (Batch 20 Unit)',
    sampleQty: 20,
    passedQty: 20,
    defectQty: 0,
    result: 'Lolos Sempurna',
    inspectorName: 'Agus Purnomo, A.Md.',
    inspectionDate: '2026-09-17',
    notes: 'Semua unit lulus uji goyang 4 kaki stabil, kehalusan finishing melamic doff grade ekspor, stiker QC Pass terpasang.',
    checklist: [
      { item: 'Uji Kestabilan 4 Kaki di Lantai Rata (No Wobble)', passed: true },
      { item: 'Kehalusan Sentuhan Finishing (No Orange Peel)', passed: true },
      { item: 'Keseragaman Warna Staining Wood Stain', passed: true },
      { item: 'Kemasan Pelindung Siku & Single Face Rapi', passed: true }
    ]
  }
];
