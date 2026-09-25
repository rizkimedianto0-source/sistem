export const formatIDR = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatDuration = (totalSeconds: number): string => {
  if (!totalSeconds || totalSeconds <= 0) return '0j 00m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}j ${String(minutes).padStart(2, '0')}m`;
  }
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
};

export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'Selesai':
    case 'Lolos Sempurna':
    case 'Lunas':
    case 'Diterima Lengkap':
    case 'Aktif':
    case 'Optimal':
      return 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60';
    case 'Dalam Proses':
    case 'Sedang Berjalan':
    case 'Dipesan':
    case 'Uang Muka 50%':
    case 'Disetujui':
      return 'text-amber-400 bg-amber-950/40 border border-amber-800/60';
    case 'Rework (Perbaikan)':
    case 'Lolos Bersyarat':
    case 'Menunggu':
    case 'Draft':
    case 'Diterima Sebagian':
      return 'text-sky-400 bg-sky-950/40 border border-sky-800/60';
    case 'Dibatalkan':
    case 'Reject (Ditolak)':
    case 'Belum Dibayar':
    case 'Kapasitas Penuh':
    case 'Nonaktif':
      return 'text-rose-400 bg-rose-950/40 border border-rose-800/60';
    default:
      return 'text-neutral-400 bg-neutral-800/60 border border-neutral-700/60';
  }
};

export const getPriorityClass = (priority: string): string => {
  switch (priority) {
    case 'Urgent':
      return 'text-rose-400 bg-rose-950/60 border-rose-800';
    case 'Tinggi':
      return 'text-amber-400 bg-amber-950/60 border-amber-800';
    case 'Sedang':
      return 'text-sky-400 bg-sky-950/60 border-sky-800';
    case 'Rendah':
    default:
      return 'text-neutral-400 bg-neutral-800/50 border-neutral-700';
  }
};
