/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { MasterDataView } from './components/master/MasterDataView';
import { BOMView } from './components/bom/BOMView';
import { WorkOrdersView } from './components/orders/WorkOrdersView';
import { ProductionProcessView } from './components/production/ProductionProcessView';
import { InventoryView } from './components/inventory/InventoryView';
import { PurchasingView } from './components/purchasing/PurchasingView';
import { CostingView } from './components/costing/CostingView';
import { QualityControlView } from './components/qc/QualityControlView';
import { ReportsView } from './components/reports/ReportsView';
import { UsersView } from './components/users/UsersView';
import { LaravelArchitectureView } from './components/laravel/LaravelArchitectureView';

const tabTitles: Record<NavTab, string> = {
  dashboard: 'Dashboard Produksi',
  master_data: 'Data Master Pabrik',
  bom: 'Bill of Materials (BOM)',
  work_orders: 'Pesanan Produksi (SPK)',
  production_process: 'Proses & Routing Workshop',
  inventory: 'Persediaan Stok',
  purchase_orders: 'Pembelian Bahan Baku (PO)',
  costing: 'Biaya Produksi & HPP',
  qc: 'Quality Control (QC)',
  reports: 'Laporan Produksi',
  users: 'User & Hak Akses',
  laravel_docs: 'Arsitektur Backend Laravel'
};

const MainContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const { hasPermission } = useApp();

  const renderActiveView = () => {
    // Check permission for active tab, fallback to dashboard if role doesn't have access
    if (!hasPermission(currentTab)) {
      return (
        <div className="p-12 text-center space-y-3">
          <div className="text-rose-400 font-semibold text-base">Akses Dibatasi</div>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Peran akun Anda saat ini tidak memiliki otorisasi untuk mengakses modul ini. Silakan gunakan menu simulasi peran di pojok kanan atas untuk beralih ke Super Admin atau Manajer Produksi.
          </p>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="px-3 py-1.5 bg-neutral-800 text-neutral-200 rounded text-xs hover:bg-neutral-700 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      );
    }

    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'master_data':
        return <MasterDataView />;
      case 'bom':
        return <BOMView />;
      case 'work_orders':
        return <WorkOrdersView />;
      case 'production_process':
        return <ProductionProcessView />;
      case 'inventory':
        return <InventoryView />;
      case 'purchase_orders':
        return <PurchasingView />;
      case 'costing':
        return <CostingView />;
      case 'qc':
        return <QualityControlView />;
      case 'reports':
        return <ReportsView />;
      case 'users':
        return <UsersView />;
      case 'laravel_docs':
        return <LaravelArchitectureView />;
      default:
        return <DashboardView onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased selection:bg-amber-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header currentTabTitle={tabTitles[currentTab]} />

        {/* Viewport content area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
