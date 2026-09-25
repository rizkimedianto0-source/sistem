import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Check, 
  X, 
  CheckCircle2, 
  Lock,
  KeyRound,
  Building
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { users, currentUser, setCurrentUser } = useApp();

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('operator');
  const [userDepartment, setUserDepartment] = useState('Divisi Produksi Mebel');

  // Matrix of role permissions
  const rolePermissions = [
    {
      module: 'Dashboard Eksekutif',
      admin: true,
      manager: true,
      warehouse: true,
      qc: true,
      operator: true
    },
    {
      module: 'Data Master (Bahan & Mebel)',
      admin: true,
      manager: true,
      warehouse: true,
      qc: false,
      operator: false
    },
    {
      module: 'BOM (Bill of Materials)',
      admin: true,
      manager: true,
      warehouse: false,
      qc: false,
      operator: false
    },
    {
      module: 'Pesanan Produksi (SPK)',
      admin: true,
      manager: true,
      warehouse: false,
      qc: false,
      operator: true
    },
    {
      module: 'Routing Proses & Timer',
      admin: true,
      manager: true,
      warehouse: false,
      qc: true,
      operator: true
    },
    {
      module: 'Persediaan & Opname Stok',
      admin: true,
      manager: true,
      warehouse: true,
      qc: false,
      operator: false
    },
    {
      module: 'Pembelian Bahan Baku (PO)',
      admin: true,
      manager: true,
      warehouse: true,
      qc: false,
      operator: false
    },
    {
      module: 'Job Order Costing (HPP)',
      admin: true,
      manager: true,
      warehouse: false,
      qc: false,
      operator: false
    },
    {
      module: 'Quality Control (QC)',
      admin: true,
      manager: true,
      warehouse: false,
      qc: true,
      operator: false
    },
    {
      module: 'Laporan Manajerial & Ekspor',
      admin: true,
      manager: true,
      warehouse: true,
      qc: true,
      operator: false
    },
    {
      module: 'Manajemen Hak Akses User',
      admin: true,
      manager: false,
      warehouse: false,
      qc: false,
      operator: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            User & Manajemen Hak Akses (Multi-Role RBAC)
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Pengaturan peran otoritas (Direktur, Manajer Produksi, Gudang, Kepala QC, Operator) dan matriks izin per modul.
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* ACTIVE USER PROFILE BANNER */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-base">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-neutral-100 text-sm">{currentUser.name}</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                Akun Aktif Anda
              </span>
            </div>
            <p className="text-xs text-neutral-400">{currentUser.roleTitle} · {currentUser.department}</p>
            <p className="text-[11px] font-mono text-neutral-500">{currentUser.email}</p>
          </div>
        </div>

        <div className="text-xs text-neutral-400 flex items-center gap-2">
          <span>Ganti Peran Cepat:</span>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const u = users.find(x => x.id === e.target.value);
              if (u) setCurrentUser(u);
            }}
            className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-neutral-200 focus:outline-hidden focus:border-amber-500 font-medium"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.roleTitle.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* USERS LIST TABLE */}
      <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
        <div className="p-3.5 border-b border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-200">
            Daftar Pengguna Sistem Pabrik Mebel
          </h3>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
            <tr>
              <th className="p-3">Nama Pengguna</th>
              <th className="p-3">Email Akun</th>
              <th className="p-3">Jabatan & Peran Otoritas</th>
              <th className="p-3">Divisi / Departemen</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
            {users.map(u => {
              const isCurrent = u.id === currentUser.id;

              return (
                <tr key={u.id} className="hover:bg-neutral-800/40">
                  <td className="p-3">
                    <span className="font-semibold text-neutral-100">{u.name}</span>
                  </td>
                  <td className="p-3 font-mono text-neutral-400">{u.email}</td>
                  <td className="p-3">
                    <span className="font-medium text-amber-400/90">{u.roleTitle}</span>
                  </td>
                  <td className="p-3 text-neutral-400">{u.department}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {!isCurrent && (
                      <button
                        onClick={() => setCurrentUser(u)}
                        className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[11px] font-medium transition-colors"
                      >
                        Simulasikan
                      </button>
                    )}
                    {isCurrent && (
                      <span className="text-[11px] text-amber-400 font-medium">Aktif</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* RBAC PERMISSION MATRIX TABLE */}
      <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900 space-y-0">
        <div className="p-4 border-b border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-200">
            Matriks Hak Akses Modul (Role-Based Access Control)
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Daftar izin akses modul pabrik berdasarkan peran masing-masing user
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3">Modul Aplikasi</th>
                <th className="p-3 text-center">Super Admin (Direktur)</th>
                <th className="p-3 text-center">Manajer Produksi</th>
                <th className="p-3 text-center">Supervisor Gudang</th>
                <th className="p-3 text-center">Kepala QC</th>
                <th className="p-3 text-center">Operator Bengkel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
              {rolePermissions.map((rp, idx) => (
                <tr key={idx} className="hover:bg-neutral-800/30">
                  <td className="p-3 font-medium text-neutral-200">{rp.module}</td>
                  <td className="p-3 text-center">
                    {rp.admin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-neutral-600 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {rp.manager ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-neutral-600 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {rp.warehouse ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-neutral-600 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {rp.qc ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-neutral-600 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {rp.operator ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-neutral-600 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
