import React, { createContext, useContext, useState, useEffect } from 'react';
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
  User,
  UserRole,
  WOStatus,
  StepStatus,
  POStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SUPPLIERS,
  INITIAL_CUSTOMERS,
  INITIAL_WORKSTATIONS,
  INITIAL_MATERIALS,
  INITIAL_PRODUCTS,
  INITIAL_BOMS,
  INITIAL_WORK_ORDERS,
  INITIAL_PRODUCTION_STEPS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_JOB_ORDER_COSTINGS,
  INITIAL_QC_INSPECTIONS
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  hasPermission: (module: string) => boolean;

  // Master Data
  materials: Material[];
  products: Product[];
  suppliers: Supplier[];
  customers: Customer[];
  workstations: Workstation[];
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, material: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addWorkstation: (workstation: Omit<Workstation, 'id'>) => void;

  // BOM
  boms: BOM[];
  addBOM: (bom: Omit<BOM, 'id' | 'updatedAt'>) => void;
  updateBOM: (id: string, bom: Partial<BOM>) => void;
  deleteBOM: (id: string) => void;

  // Work Orders (SPK)
  workOrders: WorkOrder[];
  addWorkOrder: (wo: Omit<WorkOrder, 'id' | 'woNumber' | 'progressPercent' | 'currentStage'>) => void;
  updateWorkOrderStatus: (id: string, status: WOStatus) => void;
  deleteWorkOrder: (id: string) => void;

  // Production Steps
  productionSteps: ProductionStep[];
  updateProductionStepStatus: (id: string, status: StepStatus, notes?: string) => void;
  toggleStepTimer: (id: string) => void;
  completeProductionStep: (id: string, goodQty: number, defectQty: number, actualHours: number, notes?: string) => void;

  // Inventory & Stock
  stockMovements: StockMovement[];
  adjustStock: (itemId: string, itemType: 'Bahan Baku' | 'Produk Jadi', newStock: number, reason: string) => void;

  // Purchase Orders
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber'>) => void;
  receivePurchaseOrder: (id: string) => void;
  updatePOStatus: (id: string, status: POStatus) => void;

  // Costing
  costings: JobOrderCosting[];
  updateCosting: (id: string, costing: Partial<JobOrderCosting>) => void;

  // QC
  qcInspections: QCInspection[];
  addQCInspection: (qc: Omit<QCInspection, 'id' | 'inspectionCode'>) => void;

  // System
  resetAllData: () => void;
  lowStockItemsCount: number;
  activeOrdersCount: number;
  pendingQCCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'simpro_users_v1',
  CURRENT_USER: 'simpro_current_user_v1',
  MATERIALS: 'simpro_materials_v1',
  PRODUCTS: 'simpro_products_v1',
  SUPPLIERS: 'simpro_suppliers_v1',
  CUSTOMERS: 'simpro_customers_v1',
  WORKSTATIONS: 'simpro_workstations_v1',
  BOMS: 'simpro_boms_v1',
  WORK_ORDERS: 'simpro_work_orders_v1',
  PRODUCTION_STEPS: 'simpro_production_steps_v1',
  STOCK_MOVEMENTS: 'simpro_stock_movements_v1',
  PURCHASE_ORDERS: 'simpro_purchase_orders_v1',
  COSTINGS: 'simpro_costings_v1',
  QC: 'simpro_qc_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [workstations, setWorkstations] = useState<Workstation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKSTATIONS);
    return saved ? JSON.parse(saved) : INITIAL_WORKSTATIONS;
  });

  const [boms, setBoms] = useState<BOM[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOMS);
    return saved ? JSON.parse(saved) : INITIAL_BOMS;
  });

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORK_ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });

  const [productionSteps, setProductionSteps] = useState<ProductionStep[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTION_STEPS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTION_STEPS;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STOCK_MOVEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  const [costings, setCostings] = useState<JobOrderCosting[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COSTINGS);
    return saved ? JSON.parse(saved) : INITIAL_JOB_ORDER_COSTINGS;
  });

  const [qcInspections, setQcInspections] = useState<QCInspection[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QC);
    return saved ? JSON.parse(saved) : INITIAL_QC_INSPECTIONS;
  });

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOMS, JSON.stringify(boms));
  }, [boms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTION_STEPS, JSON.stringify(productionSteps));
  }, [productionSteps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COSTINGS, JSON.stringify(costings));
  }, [costings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QC, JSON.stringify(qcInspections));
  }, [qcInspections]);

  // Live timer interval for active steps
  useEffect(() => {
    const timer = setInterval(() => {
      setProductionSteps(prev =>
        prev.map(step => {
          if (step.timerRunning) {
            return { ...step, timerSeconds: (step.timerSeconds || 0) + 1 };
          }
          return step;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Permission checking based on active role
  const hasPermission = (module: string): boolean => {
    const role: UserRole = currentUser.role;
    if (role === 'super_admin') return true;

    switch (module) {
      case 'dashboard':
        return true;
      case 'master_data':
        return role === 'manajer_produksi' || role === 'supervisor_gudang';
      case 'bom':
        return role === 'manajer_produksi';
      case 'work_orders':
        return role === 'manajer_produksi' || role === 'operator';
      case 'production_process':
        return role === 'manajer_produksi' || role === 'operator' || role === 'kepala_qc';
      case 'inventory':
        return role === 'supervisor_gudang' || role === 'manajer_produksi';
      case 'purchase_orders':
        return role === 'supervisor_gudang' || role === 'manajer_produksi';
      case 'costing':
        return role === 'manajer_produksi';
      case 'qc':
        return role === 'kepala_qc' || role === 'manajer_produksi';
      case 'reports':
        return role === 'manajer_produksi' || role === 'supervisor_gudang' || role === 'kepala_qc';
      case 'users':
        return false;
      case 'laravel_docs':
        return true;
      default:
        return true;
    }
  };

  // Master Data Handlers
  const addMaterial = (newMat: Omit<Material, 'id'>) => {
    const id = `mat-${Date.now()}`;
    const material: Material = { ...newMat, id };
    setMaterials(prev => [material, ...prev]);

    // Record initial stock movement
    if (material.stock > 0) {
      const movement: StockMovement = {
        id: `sm-${Date.now()}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        itemType: 'Bahan Baku',
        itemId: id,
        itemName: material.name,
        itemCode: material.code,
        type: 'IN',
        quantity: material.stock,
        unit: material.unit,
        referenceNo: 'SALDO-AWAL',
        notes: 'Pencatatan saldo awal bahan baku baru',
        performedBy: currentUser.name
      };
      setStockMovements(prev => [movement, ...prev]);
    }
  };

  const updateMaterial = (id: string, updated: Partial<Material>) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
  };

  const deleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prd-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addSupplier = (sup: Omit<Supplier, 'id'>) => {
    setSuppliers(prev => [{ ...sup, id: `sup-${Date.now()}` }, ...prev]);
  };

  const addCustomer = (cust: Omit<Customer, 'id'>) => {
    setCustomers(prev => [{ ...cust, id: `cust-${Date.now()}` }, ...prev]);
  };

  const addWorkstation = (ws: Omit<Workstation, 'id'>) => {
    setWorkstations(prev => [{ ...ws, id: `ws-${Date.now()}` }, ...prev]);
  };

  // BOM Handlers
  const addBOM = (newBom: Omit<BOM, 'id' | 'updatedAt'>) => {
    const id = `bom-${Date.now()}`;
    const bom: BOM = {
      ...newBom,
      id,
      updatedAt: new Date().toISOString().substring(0, 10)
    };
    setBoms(prev => [bom, ...prev]);

    // Link BOM to product
    setProducts(prev => prev.map(p => p.id === bom.productId ? { ...p, bomId: id, estimatedHPP: bom.totalEstimatedHPP } : p));
  };

  const updateBOM = (id: string, updated: Partial<BOM>) => {
    setBoms(prev => prev.map(b => b.id === id ? {
      ...b,
      ...updated,
      updatedAt: new Date().toISOString().substring(0, 10)
    } : b));
  };

  const deleteBOM = (id: string) => {
    setBoms(prev => prev.filter(b => b.id !== id));
  };

  // Work Order Handlers
  const addWorkOrder = (newWO: Omit<WorkOrder, 'id' | 'woNumber' | 'progressPercent' | 'currentStage'>) => {
    const woIndex = workOrders.length + 45;
    const woNumber = `SPK-2026-${String(woIndex).padStart(3, '0')}`;
    const woId = `wo-${Date.now()}`;
    const defaultStage = 'Pemotongan Kayu';

    const wo: WorkOrder = {
      ...newWO,
      id: woId,
      woNumber,
      progressPercent: 0,
      currentStage: defaultStage,
      status: 'Disetujui'
    };

    setWorkOrders(prev => [wo, ...prev]);

    // Generate production steps for this work order
    const stages: Array<{ stage: any; workstation: string; operator: string; plannedHours: number }> = [
      { stage: 'Pemotongan Kayu', workstation: 'Bandsaw & Table Saw Cutting Station', operator: 'Slamet Riyadi', plannedHours: 16 },
      { stage: 'Perakitan Komponen', workstation: 'Perakitan & Joinery Bench (Mortise & Tenon)', operator: 'Wahyudi Santoso', plannedHours: 24 },
      { stage: 'Pengamplasan', workstation: 'Pengamplasan Manual & Wide-Belt Sanding', operator: 'Darto Sugeng', plannedHours: 16 },
      { stage: 'Finishing & Pewarnaan', workstation: 'Spray Booth Melamic & Oven Pengeringan', operator: 'Teguh Suwarto', plannedHours: 20 },
      { stage: 'Pemasangan Jok & Aksesoris', workstation: 'Pemasangan Jok, Busa & Hardware Fitting', operator: 'Wahyudi Santoso', plannedHours: 8 },
      { stage: 'Packing & Siap Kirim', workstation: 'Pengepakan Single Face & Corner Protection Box', operator: 'Rahmat Hidayat', plannedHours: 8 }
    ];

    const newSteps: ProductionStep[] = stages.map((s, idx) => ({
      id: `step-${woId}-${idx}`,
      woId,
      woNumber,
      stage: s.stage,
      workstationName: s.workstation,
      assignedOperator: s.operator,
      plannedHours: s.plannedHours,
      actualHours: 0,
      status: idx === 0 ? 'Sedang Berjalan' : 'Menunggu',
      goodQty: 0,
      defectQty: 0,
      notes: `Tahap ${idx + 1} pengerjaan ${wo.productName}`
    }));

    setProductionSteps(prev => [...newSteps, ...prev]);

    // Initialize Job Order Costing
    const product = products.find(p => p.id === wo.productId);
    const bom = boms.find(b => b.productId === wo.productId);
    const standardCostPerUnit = bom ? bom.totalEstimatedHPP : (product?.estimatedHPP || 3000000);
    const totalStandardCost = standardCostPerUnit * wo.quantity;
    const totalRevenue = wo.targetSellingPrice * wo.quantity;
    const grossProfit = totalRevenue - totalStandardCost;
    const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const costing: JobOrderCosting = {
      id: `joc-${Date.now()}`,
      woId,
      woNumber,
      productName: wo.productName,
      quantity: wo.quantity,
      standardMaterialCost: bom ? bom.totalDirectMaterialCost * wo.quantity : totalStandardCost * 0.65,
      actualMaterialCost: bom ? bom.totalDirectMaterialCost * wo.quantity : totalStandardCost * 0.65,
      standardLaborCost: bom ? bom.totalDirectLaborCost * wo.quantity : totalStandardCost * 0.20,
      actualLaborCost: 0,
      standardOverheadCost: bom ? bom.overheadCost * wo.quantity : totalStandardCost * 0.15,
      actualOverheadCost: 0,
      totalStandardCost,
      totalActualCost: bom ? bom.totalDirectMaterialCost * wo.quantity : totalStandardCost * 0.65,
      sellingPricePerUnit: wo.targetSellingPrice,
      totalRevenue,
      grossProfit,
      marginPercentage: parseFloat(margin.toFixed(1)),
      varianceCost: 0,
      status: 'Dalam Pengerjaan'
    };

    setCostings(prev => [costing, ...prev]);
  };

  const updateWorkOrderStatus = (id: string, status: WOStatus) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === id) {
        return {
          ...wo,
          status,
          progressPercent: status === 'Selesai' ? 100 : wo.progressPercent
        };
      }
      return wo;
    }));
  };

  const deleteWorkOrder = (id: string) => {
    setWorkOrders(prev => prev.filter(w => w.id !== id));
    setProductionSteps(prev => prev.filter(s => s.woId !== id));
    setCostings(prev => prev.filter(c => c.woId !== id));
  };

  // Production Step Handlers
  const toggleStepTimer = (stepId: string) => {
    setProductionSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        const isRunning = !step.timerRunning;
        return {
          ...step,
          timerRunning: isRunning,
          status: isRunning ? 'Sedang Berjalan' : step.status,
          startedAt: step.startedAt || new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return step;
    }));
  };

  const updateProductionStepStatus = (id: string, status: StepStatus, notes?: string) => {
    setProductionSteps(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status,
          notes: notes !== undefined ? notes : s.notes,
          timerRunning: status === 'Sedang Berjalan' ? true : false,
          startedAt: (status === 'Sedang Berjalan' && !s.startedAt) ? new Date().toISOString().replace('T', ' ').substring(0, 16) : s.startedAt,
          completedAt: status === 'Selesai' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : s.completedAt
        };
      }
      return s;
    }));
  };

  const completeProductionStep = (
    stepId: string,
    goodQty: number,
    defectQty: number,
    actualHours: number,
    notes?: string
  ) => {
    const currentStep = productionSteps.find(s => s.id === stepId);
    if (!currentStep) return;

    const completedTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Update current step
    setProductionSteps(prev => {
      const updated = prev.map(s => {
        if (s.id === stepId) {
          return {
            ...s,
            status: 'Selesai' as StepStatus,
            goodQty,
            defectQty,
            actualHours: actualHours || (s.timerSeconds ? +(s.timerSeconds / 3600).toFixed(1) : s.plannedHours),
            timerRunning: false,
            completedAt: completedTimestamp,
            notes: notes || s.notes
          };
        }
        return s;
      });

      // Find next step for this WO and set to 'Sedang Berjalan'
      const woSteps = updated.filter(s => s.woId === currentStep.woId);
      const currentIndex = woSteps.findIndex(s => s.id === stepId);
      if (currentIndex !== -1 && currentIndex + 1 < woSteps.length) {
        const nextStepId = woSteps[currentIndex + 1].id;
        return updated.map(s => s.id === nextStepId ? { ...s, status: 'Sedang Berjalan' as StepStatus, startedAt: completedTimestamp } : s);
      }
      return updated;
    });

    // Update Work Order progress percentage & current stage
    const woSteps = productionSteps.filter(s => s.woId === currentStep.woId);
    const completedCount = woSteps.filter(s => s.id === stepId || s.status === 'Selesai').length;
    const totalCount = woSteps.length;
    const progressPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));

    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === currentStep.woId) {
        const isAllDone = progressPercent >= 100;
        return {
          ...wo,
          progressPercent,
          status: isAllDone ? 'Selesai' : 'Dalam Proses',
          currentStage: isAllDone ? 'Selesai' : currentStep.stage
        };
      }
      return wo;
    }));

    // If final step completed, auto increase product stock & deduct BOM materials if not deducted
    if (currentStep.stage === 'Packing & Siap Kirim') {
      const wo = workOrders.find(w => w.id === currentStep.woId);
      if (wo) {
        setProducts(prev => prev.map(p => p.id === wo.productId ? { ...p, stockQty: p.stockQty + goodQty } : p));
        // Add stock movement for finished goods
        const movement: StockMovement = {
          id: `sm-${Date.now()}`,
          date: completedTimestamp,
          itemType: 'Produk Jadi',
          itemId: wo.productId,
          itemName: wo.productName,
          itemCode: wo.productCode,
          type: 'IN',
          quantity: goodQty,
          unit: 'unit',
          referenceNo: wo.woNumber,
          notes: `Hasil penyelesaian SPK ${wo.woNumber} lolos tahap pengepakan final`,
          performedBy: currentUser.name
        };
        setStockMovements(prev => [movement, ...prev]);
      }
    }
  };

  // Stock Adjustment Handler
  const adjustStock = (itemId: string, itemType: 'Bahan Baku' | 'Produk Jadi', newStock: number, reason: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (itemType === 'Bahan Baku') {
      const mat = materials.find(m => m.id === itemId);
      if (!mat) return;
      const diff = newStock - mat.stock;
      setMaterials(prev => prev.map(m => m.id === itemId ? { ...m, stock: newStock } : m));

      const movement: StockMovement = {
        id: `sm-${Date.now()}`,
        date: timestamp,
        itemType: 'Bahan Baku',
        itemId: mat.id,
        itemName: mat.name,
        itemCode: mat.code,
        type: 'ADJUSTMENT',
        quantity: Math.abs(diff),
        unit: mat.unit,
        referenceNo: 'ADJ-STOK',
        notes: `Penyesuaian stok (${diff >= 0 ? '+' : ''}${diff}): ${reason}`,
        performedBy: currentUser.name
      };
      setStockMovements(prev => [movement, ...prev]);
    } else {
      const prod = products.find(p => p.id === itemId);
      if (!prod) return;
      const diff = newStock - prod.stockQty;
      setProducts(prev => prev.map(p => p.id === itemId ? { ...p, stockQty: newStock } : p));

      const movement: StockMovement = {
        id: `sm-${Date.now()}`,
        date: timestamp,
        itemType: 'Produk Jadi',
        itemId: prod.id,
        itemName: prod.name,
        itemCode: prod.code,
        type: 'ADJUSTMENT',
        quantity: Math.abs(diff),
        unit: 'unit',
        referenceNo: 'ADJ-STOK',
        notes: `Penyesuaian stok produk (${diff >= 0 ? '+' : ''}${diff}): ${reason}`,
        performedBy: currentUser.name
      };
      setStockMovements(prev => [movement, ...prev]);
    }
  };

  // Purchase Order Handlers
  const addPurchaseOrder = (newPO: Omit<PurchaseOrder, 'id' | 'poNumber'>) => {
    const poIndex = purchaseOrders.length + 23;
    const poNumber = `PO-BB-2026-${String(poIndex).padStart(3, '0')}`;
    const po: PurchaseOrder = {
      ...newPO,
      id: `po-${Date.now()}`,
      poNumber
    };
    setPurchaseOrders(prev => [po, ...prev]);
  };

  const receivePurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Increase stock for each item in PO
    po.items.forEach(item => {
      setMaterials(prev => prev.map(m => {
        if (m.id === item.materialId) {
          return { ...m, stock: m.stock + item.orderedQty };
        }
        return m;
      }));

      // Record stock movement
      const movement: StockMovement = {
        id: `sm-${Date.now()}-${item.id}`,
        date: timestamp,
        itemType: 'Bahan Baku',
        itemId: item.materialId,
        itemName: item.materialName,
        itemCode: item.materialCode,
        type: 'IN',
        quantity: item.orderedQty,
        unit: item.unit,
        referenceNo: po.poNumber,
        notes: `Penerimaan barang dari supplier ${po.supplierName} (${po.poNumber})`,
        performedBy: currentUser.name
      };
      setStockMovements(prev => [movement, ...prev]);
    });

    // Mark PO as Diterima Lengkap
    setPurchaseOrders(prev => prev.map(p => {
      if (p.id === poId) {
        return {
          ...p,
          status: 'Diterima Lengkap',
          receivedDate: timestamp.substring(0, 10),
          items: p.items.map(item => ({ ...item, receivedQty: item.orderedQty }))
        };
      }
      return p;
    }));
  };

  const updatePOStatus = (id: string, status: POStatus) => {
    setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  // Costing Handlers
  const updateCosting = (id: string, updated: Partial<JobOrderCosting>) => {
    setCostings(prev => prev.map(c => {
      if (c.id === id) {
        const merged = { ...c, ...updated };
        const totalActualCost = merged.actualMaterialCost + merged.actualLaborCost + merged.actualOverheadCost;
        const grossProfit = merged.totalRevenue - totalActualCost;
        const marginPercentage = merged.totalRevenue > 0 ? (grossProfit / merged.totalRevenue) * 100 : 0;
        const varianceCost = totalActualCost - merged.totalStandardCost;

        return {
          ...merged,
          totalActualCost,
          grossProfit,
          marginPercentage: parseFloat(marginPercentage.toFixed(1)),
          varianceCost
        };
      }
      return c;
    }));
  };

  // QC Handlers
  const addQCInspection = (newQC: Omit<QCInspection, 'id' | 'inspectionCode'>) => {
    const qcIndex = qcInspections.length + 89;
    const inspectionCode = `QC-2026-${String(qcIndex).padStart(3, '0')}`;
    const qc: QCInspection = {
      ...newQC,
      id: `qc-${Date.now()}`,
      inspectionCode
    };
    setQcInspections(prev => [qc, ...prev]);
  };

  const resetAllData = () => {
    localStorage.clear();
    setMaterials(INITIAL_MATERIALS);
    setProducts(INITIAL_PRODUCTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setCustomers(INITIAL_CUSTOMERS);
    setWorkstations(INITIAL_WORKSTATIONS);
    setBoms(INITIAL_BOMS);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setProductionSteps(INITIAL_PRODUCTION_STEPS);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setCostings(INITIAL_JOB_ORDER_COSTINGS);
    setQcInspections(INITIAL_QC_INSPECTIONS);
    setCurrentUser(INITIAL_USERS[0]);
  };

  const lowStockItemsCount = materials.filter(m => m.stock <= m.minStock).length;
  const activeOrdersCount = workOrders.filter(w => w.status === 'Dalam Proses' || w.status === 'Disetujui').length;
  const pendingQCCount = qcInspections.filter(q => q.result === 'Rework (Perbaikan)').length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        hasPermission,
        materials,
        products,
        suppliers,
        customers,
        workstations,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addProduct,
        updateProduct,
        deleteProduct,
        addSupplier,
        addCustomer,
        addWorkstation,
        boms,
        addBOM,
        updateBOM,
        deleteBOM,
        workOrders,
        addWorkOrder,
        updateWorkOrderStatus,
        deleteWorkOrder,
        productionSteps,
        updateProductionStepStatus,
        toggleStepTimer,
        completeProductionStep,
        stockMovements,
        adjustStock,
        purchaseOrders,
        addPurchaseOrder,
        receivePurchaseOrder,
        updatePOStatus,
        costings,
        updateCosting,
        qcInspections,
        addQCInspection,
        resetAllData,
        lowStockItemsCount,
        activeOrdersCount,
        pendingQCCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
