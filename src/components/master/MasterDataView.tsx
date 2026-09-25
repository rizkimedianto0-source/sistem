import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Material, Product, Supplier, Customer, Workstation } from '../../types';
import { formatIDR, getStatusBadgeClass } from '../../utils/formatters';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Image as ImageIcon,
  CheckCircle2,
  X,
  AlertTriangle,
  FolderTree,
  Building,
  Users2,
  Cpu
} from 'lucide-react';

type MasterTab = 'materials' | 'products' | 'suppliers' | 'customers' | 'workstations';

export const MasterDataView: React.FC = () => {
  const { 
    materials, 
    addMaterial, 
    updateMaterial, 
    deleteMaterial,
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    suppliers,
    addSupplier,
    customers,
    addCustomer,
    workstations,
    addWorkstation
  } = useApp();

  const [activeTab, setActiveTab] = useState<MasterTab>('materials');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Material form state
  const [matForm, setMatForm] = useState({
    code: '',
    name: '',
    category: 'Kayu Log & Papan' as Material['category'],
    unit: 'm3',
    stock: 0,
    minStock: 5,
    pricePerUnit: 0,
    supplierId: suppliers[0]?.id || '',
    supplierName: suppliers[0]?.name || '',
    location: '',
    moistureContent: '12% - 14%'
  });

  // New Product form state
  const [prodForm, setProdForm] = useState({
    code: '',
    name: '',
    category: 'Meja' as Product['category'],
    dimensions: '',
    woodType: 'Kayu Jati Solid TPK Perhutani',
    finishType: 'Natural Satin Doff',
    targetSellingPrice: 0,
    estimatedHPP: 0,
    stockQty: 0,
    image: '/src/assets/images/furniture_dining_table_1790346986616.jpg',
    status: 'Aktif' as Product['status'],
    description: ''
  });

  // Material Form Handlers
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === matForm.supplierId);
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, {
        ...matForm,
        supplierName: sup?.name || matForm.supplierName
      });
      setEditingMaterial(null);
    } else {
      addMaterial({
        ...matForm,
        supplierName: sup?.name || matForm.supplierName
      });
    }
    setShowAddMaterialModal(false);
    setMatForm({
      code: '',
      name: '',
      category: 'Kayu Log & Papan',
      unit: 'm3',
      stock: 0,
      minStock: 5,
      pricePerUnit: 0,
      supplierId: suppliers[0]?.id || '',
      supplierName: suppliers[0]?.name || '',
      location: '',
      moistureContent: '12% - 14%'
    });
  };

  // Product Form Handlers
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, prodForm);
      setEditingProduct(null);
    } else {
      addProduct(prodForm);
    }
    setShowAddProductModal(false);
    setProdForm({
      code: '',
      name: '',
      category: 'Meja',
      dimensions: '',
      woodType: 'Kayu Jati Solid TPK Perhutani',
      finishType: 'Natural Satin Doff',
      targetSellingPrice: 0,
      estimatedHPP: 0,
      stockQty: 0,
      image: '/src/assets/images/furniture_dining_table_1790346986616.jpg',
      status: 'Aktif',
      description: ''
    });
  };

  // Filters
  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.woodType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Data Master Pabrik Mebel
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Katalog bahan baku kayu & kimia, produk mebel jadi, vendor supplier, buyer, dan spesifikasi stasiun kerja.
          </p>
        </div>

        {/* Action Button */}
        {activeTab === 'materials' && (
          <button
            onClick={() => {
              setEditingMaterial(null);
              setShowAddMaterialModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Bahan Baku</span>
          </button>
        )}
        {activeTab === 'products' && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowAddProductModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Produk Mebel</span>
          </button>
        )}
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-md border border-neutral-800">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'materials'
                ? 'bg-neutral-800 text-amber-300 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Bahan Baku ({materials.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'products'
                ? 'bg-neutral-800 text-amber-300 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Produk Mebel ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'suppliers'
                ? 'bg-neutral-800 text-amber-300 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Supplier Kayu & Vendor ({suppliers.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'customers'
                ? 'bg-neutral-800 text-amber-300 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Pelanggan / Buyer ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('workstations')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'workstations'
                ? 'bg-neutral-800 text-amber-300 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Stasiun Kerja ({workstations.length})
          </button>
        </div>

        {/* Live Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Cari kode, nama, jenis kayu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-neutral-200 placeholder-neutral-500 focus:outline-hidden focus:border-amber-500 w-56 sm:w-64"
          />
        </div>
      </div>

      {/* TAB 1: BAHAN BAKU */}
      {activeTab === 'materials' && (
        <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 font-medium">
                <tr>
                  <th className="p-3">Kode & Nama Bahan</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Lokasi / Rak</th>
                  <th className="p-3">Spesifikasi MC</th>
                  <th className="p-3 text-right">Harga Satuan</th>
                  <th className="p-3 text-right">Stok Fisik</th>
                  <th className="p-3 text-right">Min. Stok</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
                {filteredMaterials.map(m => {
                  const isLow = m.stock <= m.minStock;
                  return (
                    <tr key={m.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="p-3">
                        <div className="font-mono text-amber-400 font-medium text-[11px]">{m.code}</div>
                        <div className="font-medium text-neutral-100">{m.name}</div>
                        <div className="text-[11px] text-neutral-500">{m.supplierName}</div>
                      </td>
                      <td className="p-3">
                        <span className="text-neutral-300">{m.category}</span>
                      </td>
                      <td className="p-3 text-neutral-400">{m.location}</td>
                      <td className="p-3 text-neutral-400">{m.moistureContent || '-'}</td>
                      <td className="p-3 text-right font-mono tabular-nums text-neutral-200">
                        {formatIDR(m.pricePerUnit)} / {m.unit}
                      </td>
                      <td className="p-3 text-right font-mono tabular-nums font-semibold text-neutral-100">
                        {m.stock} {m.unit}
                      </td>
                      <td className="p-3 text-right font-mono tabular-nums text-neutral-400">
                        {m.minStock} {m.unit}
                      </td>
                      <td className="p-3 text-center">
                        {isLow ? (
                          <span className="px-2 py-0.5 text-[10px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/70 rounded">
                            Menipis
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/70 rounded">
                            Aman
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingMaterial(m);
                            setMatForm({
                              code: m.code,
                              name: m.name,
                              category: m.category,
                              unit: m.unit,
                              stock: m.stock,
                              minStock: m.minStock,
                              pricePerUnit: m.pricePerUnit,
                              supplierId: m.supplierId,
                              supplierName: m.supplierName,
                              location: m.location,
                              moistureContent: m.moistureContent || '12% - 14%'
                            });
                            setShowAddMaterialModal(true);
                          }}
                          className="p-1 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors"
                          title="Ubah Bahan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus bahan baku ${m.name}?`)) {
                              deleteMaterial(m.id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
                          title="Hapus Bahan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* TAB 2: PRODUK MEBEL JADI */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map(p => (
            <div
              key={p.id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col hover:border-neutral-700 transition-colors"
            >
              {/* Product Thumbnail */}
              <div className="aspect-4/3 w-full bg-neutral-950 relative overflow-hidden group">
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 font-mono text-[10px] font-bold px-1.5 py-0.5 bg-neutral-900/90 text-amber-400 rounded">
                  {p.code}
                </div>
                <div className="absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 bg-neutral-900/90 text-neutral-300 rounded">
                  {p.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-100 text-sm line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">
                    {p.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-neutral-800/80 space-y-1 text-xs text-neutral-400">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Material Kayu:</span>
                      <span className="text-neutral-300 truncate max-w-[130px]">{p.woodType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Dimensi:</span>
                      <span className="text-neutral-300 font-mono text-[11px]">{p.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Stok Gudang:</span>
                      <span className="text-neutral-100 font-mono font-semibold">{p.stockQty} unit</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Estimasi HPP Standar</span>
                      <span className="font-mono text-xs text-neutral-300 tabular-nums">
                        {formatIDR(p.estimatedHPP)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 block">Harga Jual Target</span>
                      <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                        {formatIDR(p.targetSellingPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-1">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setProdForm({
                          code: p.code,
                          name: p.name,
                          category: p.category,
                          dimensions: p.dimensions,
                          woodType: p.woodType,
                          finishType: p.finishType,
                          targetSellingPrice: p.targetSellingPrice,
                          estimatedHPP: p.estimatedHPP,
                          stockQty: p.stockQty,
                          image: p.image,
                          status: p.status,
                          description: p.description
                        });
                        setShowAddProductModal(true);
                      }}
                      className="px-2 py-1 text-xs text-neutral-300 hover:text-amber-400 hover:bg-neutral-800 rounded flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus produk ${p.name}?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="px-2 py-1 text-xs text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3">Nama Vendor / Supplier</th>
                <th className="p-3">Kategori Pasokan</th>
                <th className="p-3">Kontak Person</th>
                <th className="p-3">No. Telepon & Email</th>
                <th className="p-3">Alamat</th>
                <th className="p-3 text-center">Lead Time</th>
                <th className="p-3 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-neutral-800/40">
                  <td className="p-3 font-semibold text-neutral-100">{s.name}</td>
                  <td className="p-3 text-amber-400/90">{s.category}</td>
                  <td className="p-3 text-neutral-300">{s.contactPerson}</td>
                  <td className="p-3 font-mono text-[11px] text-neutral-400">
                    <div>{s.phone}</div>
                    <div className="text-neutral-500">{s.email}</div>
                  </td>
                  <td className="p-3 text-neutral-400 max-w-xs">{s.address}</td>
                  <td className="p-3 text-center font-mono tabular-nums">{s.leadTimeDays} hari</td>
                  <td className="p-3 text-center text-amber-400 font-mono font-bold">★ {s.rating}.0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: CUSTOMERS / BUYERS */}
      {activeTab === 'customers' && (
        <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3">Kode & Nama Pelanggan</th>
                <th className="p-3">Perusahaan / Entitas</th>
                <th className="p-3">Segmen Buyer</th>
                <th className="p-3">Telepon & Email</th>
                <th className="p-3">Alamat Pengiriman Proyek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-neutral-800/40">
                  <td className="p-3">
                    <span className="font-mono text-[11px] text-amber-400 block">{c.code}</span>
                    <span className="font-semibold text-neutral-100">{c.name}</span>
                  </td>
                  <td className="p-3 text-neutral-300">{c.company || '-'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {c.type}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-neutral-400">
                    <div>{c.phone}</div>
                    <div className="text-neutral-500">{c.email}</div>
                  </td>
                  <td className="p-3 text-neutral-400 max-w-xs">{c.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: WORKSTATIONS */}
      {activeTab === 'workstations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workstations.map(ws => (
            <div key={ws.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">{ws.code}</span>
                <span className={`px-2 py-0.5 text-[10px] rounded font-semibold ${getStatusBadgeClass(ws.status)}`}>
                  {ws.status}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-100 text-sm">{ws.name}</h3>
                <span className="text-xs text-neutral-500">Departemen: {ws.section}</span>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-xs text-neutral-400">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Kapasitas:</span>
                  <span className="font-mono font-medium text-neutral-200">{ws.capacityPerDay} unit/hari</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Tarif Mesin/Jam:</span>
                  <span className="font-mono font-medium text-neutral-200">{formatIDR(ws.hourlyRate)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500 block text-[11px]">Operator Aktif Shift Ini:</span>
                  <span className="font-mono text-neutral-200">{ws.activeOperators} Personil Pengrajin Kayu</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: TAMBAH / UBAH BAHAN BAKU */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-neutral-100 text-sm">
                {editingMaterial ? 'Ubah Bahan Baku' : 'Tambah Bahan Baku Baru'}
              </h3>
              <button
                onClick={() => setShowAddMaterialModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Kode Bahan</label>
                  <input
                    type="text"
                    required
                    placeholder="MAT-WOD-03"
                    value={matForm.code}
                    onChange={(e) => setMatForm({ ...matForm, code: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Kategori</label>
                  <select
                    value={matForm.category}
                    onChange={(e) => setMatForm({ ...matForm, category: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="Kayu Log & Papan">Kayu Log & Papan</option>
                    <option value="Finishing & Cat">Finishing & Cat</option>
                    <option value="Aksesoris & Hardware">Aksesoris & Hardware</option>
                    <option value="Busa & Jok">Busa & Jok</option>
                    <option value="Perekat & Kimia">Perekat & Kimia</option>
                    <option value="Kemasan">Kemasan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Nama Bahan Baku</label>
                <input
                  type="text"
                  required
                  placeholder="Kayu Sungkai Papan Pilihan (MC 12%)"
                  value={matForm.name}
                  onChange={(e) => setMatForm({ ...matForm, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Satuan (Unit)</label>
                  <input
                    type="text"
                    required
                    placeholder="m3, kg, kaleng..."
                    value={matForm.unit}
                    onChange={(e) => setMatForm({ ...matForm, unit: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Stok Fisik Awal</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={matForm.stock}
                    onChange={(e) => setMatForm({ ...matForm, stock: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Safety Stock (Min)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={matForm.minStock}
                    onChange={(e) => setMatForm({ ...matForm, minStock: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    required
                    value={matForm.pricePerUnit}
                    onChange={(e) => setMatForm({ ...matForm, pricePerUnit: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Lokasi Gudang / Rak</label>
                  <input
                    type="text"
                    required
                    placeholder="Gudang Kayu A-2"
                    value={matForm.location}
                    onChange={(e) => setMatForm({ ...matForm, location: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Supplier / Vendor</label>
                  <select
                    value={matForm.supplierId}
                    onChange={(e) => {
                      const sup = suppliers.find(s => s.id === e.target.value);
                      setMatForm({
                        ...matForm,
                        supplierId: e.target.value,
                        supplierName: sup?.name || ''
                      });
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Kadar Air Kayu (MC)</label>
                  <input
                    type="text"
                    placeholder="12% - 14% (KD Standard)"
                    value={matForm.moistureContent}
                    onChange={(e) => setMatForm({ ...matForm, moistureContent: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium rounded transition-colors"
                >
                  Simpan Bahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / UBAH PRODUK MEBEL */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-neutral-100 text-sm">
                {editingProduct ? 'Ubah Produk Mebel' : 'Tambah Produk Mebel Baru'}
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Kode Produk</label>
                  <input
                    type="text"
                    required
                    placeholder="MJ-002"
                    value={prodForm.code}
                    onChange={(e) => setProdForm({ ...prodForm, code: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Kategori Mebel</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="Meja">Meja</option>
                    <option value="Kursi">Kursi</option>
                    <option value="Lemari & Storage">Lemari & Storage</option>
                    <option value="Sofa & Lounge">Sofa & Lounge</option>
                    <option value="Tempat Tidur">Tempat Tidur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Nama Produk Mebel</label>
                <input
                  type="text"
                  required
                  placeholder="Meja Tamu Minimalis Teak Solid"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Jenis Kayu / Konstruksi</label>
                  <input
                    type="text"
                    required
                    placeholder="Kayu Jati Solid TPK Perhutani"
                    value={prodForm.woodType}
                    onChange={(e) => setProdForm({ ...prodForm, woodType: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Dimensi (P x L x T)</label>
                  <input
                    type="text"
                    required
                    placeholder="120 x 60 x 45 cm"
                    value={prodForm.dimensions}
                    onChange={(e) => setProdForm({ ...prodForm, dimensions: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Tipe Finishing</label>
                  <input
                    type="text"
                    required
                    placeholder="Melamic Doff Walnut"
                    value={prodForm.finishType}
                    onChange={(e) => setProdForm({ ...prodForm, finishType: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Target Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    value={prodForm.targetSellingPrice}
                    onChange={(e) => setProdForm({ ...prodForm, targetSellingPrice: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Pilih Foto Produk</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Meja Jati', path: '/src/assets/images/furniture_dining_table_1790346986616.jpg' },
                    { label: 'Kursi Cafe', path: '/src/assets/images/furniture_cafe_chair_1790347000752.jpg' },
                    { label: 'Lemari Teak', path: '/src/assets/images/furniture_wood_wardrobe_1790347013395.jpg' },
                    { label: 'Sofa Jepara', path: '/src/assets/images/furniture_sofa_jepara_1790347025793.jpg' }
                  ].map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setProdForm({ ...prodForm, image: img.path })}
                      className={`cursor-pointer border-2 rounded overflow-hidden p-0.5 ${
                        prodForm.image === img.path ? 'border-amber-500' : 'border-neutral-800'
                      }`}
                    >
                      <img src={img.path} alt={img.label} className="w-full h-14 object-cover" />
                      <span className="text-[10px] text-neutral-400 block text-center truncate mt-0.5">{img.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Deskripsi Produk</label>
                <textarea
                  rows={2}
                  placeholder="Spesifikasi konstruksi dan fitur mebel..."
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium rounded transition-colors"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
