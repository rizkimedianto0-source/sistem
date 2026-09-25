import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Database, 
  Layers, 
  ClipboardList, 
  Hammer, 
  Boxes, 
  ShoppingCart, 
  Calculator, 
  ShieldCheck, 
  FileText, 
  Users, 
  Code2,
  TreePine,
  Lock
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'master_data'
  | 'bom'
  | 'work_orders'
  | 'production_process'
  | 'inventory'
  | 'purchase_orders'
  | 'costing'
  | 'qc'
  | 'reports'
  | 'users'
  | 'laravel_docs';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { hasPermission, lowStockItemsCount, activeOrdersCount, pendingQCCount } = useApp();

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      module: 'dashboard'
    },
    {
      id: 'master_data' as NavTab,
      label: 'Data Master',
      icon: Database,
      module: 'master_data'
    },
    {
      id: 'bom' as NavTab,
      label: 'BOM (Bill of Materials)',
      icon: Layers,
      module: 'bom'
    },
    {
      id: 'work_orders' as NavTab,
      label: 'Pesanan Produksi (SPK)',
      icon: ClipboardList,
      module: 'work_orders',
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeColor: 'bg-amber-600/30 text-amber-300'
    },
    {
      id: 'production_process' as NavTab,
      label: 'Proses Produksi',
      icon: Hammer,
      module: 'production_process'
    },
    {
      id: 'inventory' as NavTab,
      label: 'Persediaan Stok',
      icon: Boxes,
      module: 'inventory',
      badge: lowStockItemsCount > 0 ? `${lowStockItemsCount} Alert` : undefined,
      badgeColor: 'bg-rose-600/30 text-rose-300'
    },
    {
      id: 'purchase_orders' as NavTab,
      label: 'Pembelian Bahan Baku',
      icon: ShoppingCart,
      module: 'purchase_orders'
    },
    {
      id: 'costing' as NavTab,
      label: 'Biaya Produksi (HPP)',
      icon: Calculator,
      module: 'costing'
    },
    {
      id: 'qc' as NavTab,
      label: 'Quality Control (QC)',
      icon: ShieldCheck,
      module: 'qc',
      badge: pendingQCCount > 0 ? `${pendingQCCount} Defek` : undefined,
      badgeColor: 'bg-amber-600/30 text-amber-300'
    },
    {
      id: 'reports' as NavTab,
      label: 'Laporan Produksi',
      icon: FileText,
      module: 'reports'
    },
    {
      id: 'users' as NavTab,
      label: 'User & Hak Akses',
      icon: Users,
      module: 'users'
    },
    {
      id: 'laravel_docs' as NavTab,
      label: 'Arsitektur Backend Laravel',
      icon: Code2,
      module: 'laravel_docs'
    }
  ];

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 min-h-screen no-print select-none">
      {/* Brand Zone (Single text element wordmark with icon) */}
      <div className="h-16 border-b border-neutral-800 flex items-center gap-2.5 px-5">
        <div className="w-8 h-8 rounded bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <TreePine className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-neutral-100 text-base leading-none">
            KAYU CRAFT ERP
          </span>
          <span className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase mt-1">
            Sistem Produksi Mebel
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Modul Pabrik
        </div>
        {navItems.map(item => {
          const permitted = hasPermission(item.module);
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (permitted) {
                  onSelectTab(item.id);
                }
              }}
              disabled={!permitted}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-600/40'
                  : permitted
                  ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  : 'text-neutral-600 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!permitted && (
                  <span title="Akses terkunci untuk peran Anda">
                    <Lock className="w-3 h-3 text-neutral-600" />
                  </span>
                )}
                {item.badge && permitted && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${item.badgeColor} tabular-nums`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-neutral-800 text-[11px] text-neutral-400 bg-neutral-900/40">
        <div className="flex items-center justify-between">
          <span className="text-neutral-300">Stack Teknologi:</span>
          <span className="text-amber-400 font-mono text-[10px]">Laravel + React</span>
        </div>
        <div className="text-[10px] text-neutral-400 mt-1">
          Standard Industri Mebel Kayu Solid & Jok Jepara
        </div>
      </div>
    </aside>
  );
};
