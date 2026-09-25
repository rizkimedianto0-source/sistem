import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Database, 
  Server, 
  FileCode, 
  Layers, 
  Terminal,
  CheckCircle2
} from 'lucide-react';

export const LaravelArchitectureView: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'migrations' | 'models' | 'routes' | 'controllers'>('migrations');

  const handleCopy = (filename: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const codeSnippets = {
    migrations: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Skema Database Sistem Produksi Mebel (SIMPRO MEBEL ERP)
     * Laravel 11 / 12 Schema Engine
     */
    public function up(): void
    {
        // 1. Tabel Bahan Baku (Materials)
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // MAT-WOD-01
            $table->string('name');
            $table->enum('category', ['Kayu Log & Papan', 'Finishing & Cat', 'Aksesoris & Hardware', 'Busa & Jok', 'Perekat & Kimia', 'Kemasan']);
            $table->string('unit'); // m3, kg, kaleng, lembar
            $table->decimal('stock', 12, 3)->default(0);
            $table->decimal('min_stock', 12, 3)->default(5);
            $table->decimal('price_per_unit', 15, 2);
            $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('cascade');
            $table->string('location'); // Gudang A-1
            $table->string('moisture_content')->nullable(); // 12% - 14%
            $table->timestamps();
        });

        // 2. Tabel Produk Mebel Jadi (Products)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // MJ-001
            $table->string('name');
            $table->enum('category', ['Meja', 'Kursi', 'Lemari & Storage', 'Sofa & Lounge', 'Tempat Tidur']);
            $table->string('dimensions'); // 200 x 95 x 76 cm
            $table->string('wood_type');
            $table->string('finish_type');
            $table->decimal('target_selling_price', 15, 2);
            $table->decimal('estimated_hpp', 15, 2)->default(0);
            $table->integer('stock_qty')->default(0);
            $table->string('image_path')->nullable();
            $table->enum('status', ['Aktif', 'Discontinue'])->default('Aktif');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 3. Bill of Materials (BOM) & BOM Items
        Schema::create('bill_of_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('code')->unique(); // BOM-MJ001-REV2
            $table->string('version')->default('1.0');
            $table->decimal('direct_labor_hours', 8, 2);
            $table->decimal('direct_labor_rate_per_hour', 12, 2)->default(45000);
            $table->decimal('overhead_cost', 15, 2)->default(0);
            $table->decimal('total_material_cost', 15, 2)->default(0);
            $table->decimal('total_estimated_hpp', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('bom_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bom_id')->constrained('bill_of_materials')->onDelete('cascade');
            $table->foreignId('material_id')->constrained('materials')->onDelete('cascade');
            $table->decimal('quantity', 12, 4);
            $table->decimal('unit_price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->decimal('wastage_percent', 5, 2)->default(5);
            $table->timestamps();
        });

        // 4. Pesanan Produksi (Work Orders / SPK)
        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->string('wo_number')->unique(); // SPK-2026-041
            $table->foreignId('customer_id')->constrained('customers');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity');
            $table->date('order_date');
            $table->date('start_date');
            $table->date('due_date');
            $table->enum('priority', ['Rendah', 'Sedang', 'Tinggi', 'Urgent'])->default('Sedang');
            $table->enum('status', ['Draft', 'Disetujui', 'Dalam Proses', 'Selesai', 'Dibatalkan'])->default('Disetujui');
            $table->integer('progress_percent')->default(0);
            $table->string('current_stage')->default('Pemotongan Kayu');
            $table->string('batch_code');
            $table->decimal('target_selling_price', 15, 2);
            $table->text('notes')->nullable();
            $table->string('approved_by')->nullable();
            $table->timestamps();
        });

        // 5. Routing Tahapan Produksi (Production Steps)
        Schema::create('production_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_order_id')->constrained('work_orders')->onDelete('cascade');
            $table->string('stage'); // Pemotongan, Perakitan, Sanding, Finishing, Jok, Packing
            $table->string('workstation_name');
            $table->string('assigned_operator');
            $table->decimal('planned_hours', 6, 2);
            $table->decimal('actual_hours', 6, 2)->default(0);
            $table->enum('status', ['Menunggu', 'Sedang Berjalan', 'Selesai', 'Tertunda'])->default('Menunggu');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('good_qty')->default(0);
            $table->integer('defect_qty')->default(0);
            $table->integer('timer_seconds')->default(0);
            $table->boolean('timer_running')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 6. Quality Control Inspections
        Schema::create('qc_inspections', function (Blueprint $table) {
            $table->id();
            $table->string('inspection_code')->unique(); // QC-2026-088
            $table->enum('inspection_type', ['Bahan Baku Masuk', 'In-Process Produksi', 'Produk Jadi (FQC)']);
            $table->string('reference_no'); // SPK or PO
            $table->string('item_name');
            $table->integer('sample_qty');
            $table->integer('passed_qty');
            $table->integer('defect_qty')->default(0);
            $table->string('defect_type')->nullable();
            $table->enum('result', ['Lolos Sempurna', 'Lolos Bersyarat', 'Rework (Perbaikan)', 'Reject (Ditolak)']);
            $table->string('inspector_name');
            $table->date('inspection_date');
            $table->json('checklist')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qc_inspections');
        Schema::dropIfExists('production_steps');
        Schema::dropIfExists('work_orders');
        Schema::dropIfExists('bom_items');
        Schema::dropIfExists('bill_of_materials');
        Schema::dropIfExists('products');
        Schema::dropIfExists('materials');
    }
};`,
    models: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'code', 'name', 'category', 'dimensions', 
        'wood_type', 'finish_type', 'target_selling_price', 
        'estimated_hpp', 'stock_qty', 'image_path', 'status', 'description'
    ];

    public function boms(): HasMany
    {
        return $this->hasMany(BillOfMaterial::class);
    }

    public function workOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class);
    }
}

class WorkOrder extends Model
{
    protected $fillable = [
        'wo_number', 'customer_id', 'product_id', 'quantity',
        'order_date', 'start_date', 'due_date', 'priority',
        'status', 'progress_percent', 'current_stage', 'batch_code',
        'target_selling_price', 'notes', 'approved_by'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function productionSteps(): HasMany
    {
        return $this->hasMany(ProductionStep::class);
    }

    public function costing(): BelongsTo
    {
        return $this->hasOne(JobOrderCosting::class);
    }
}

class BillOfMaterial extends Model
{
    protected $table = 'bill_of_materials';
    protected $fillable = [
        'product_id', 'code', 'version', 'direct_labor_hours',
        'direct_labor_rate_per_hour', 'overhead_cost',
        'total_material_cost', 'total_estimated_hpp', 'notes'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(BOMItem::class, 'bom_id');
    }
}`,
    routes: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\ProductController;
use App\\Http\\Controllers\\Api\\MaterialController;
use App\\Http\\Controllers\\Api\\BOMController;
use App\\Http\\Controllers\\Api\\WorkOrderController;
use App\\Http\\Controllers\\Api\\ProductionTrackingController;
use App\\Http\\Controllers\\Api\\InventoryController;
use App\\Http\\Controllers\\Api\\PurchaseOrderController;
use App\\Http\\Controllers\\Api\\CostingController;
use App\\Http\\Controllers\\Api\\QCInspectionController;

/**
 * KAYU CRAFT ERP - Laravel REST API Routes
 * Prefix: /api/v1/
 */
Route::prefix('v1')->group(function () {
    // Public healthcheck
    Route::get('/health', fn() => response()->json(['status' => 'online', 'system' => 'Kayu Craft ERP']));

    // Protected Routes (Sanctum Auth & RBAC Middleware)
    Route::middleware(['auth:sanctum'])->group(function () {
        // Master Data
        Route::apiResource('materials', MaterialController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('boms', BOMController::class);

        // Production & SPK
        Route::apiResource('work-orders', WorkOrderController::class);
        Route::post('work-orders/{id}/start', [WorkOrderController::class, 'startProduction']);
        Route::post('work-orders/{id}/finish', [WorkOrderController::class, 'completeProduction']);
        Route::get('work-orders/{id}/print-spk', [WorkOrderController::class, 'generatePrintableSPK']);

        // Shop Floor Routing & Tracking
        Route::post('production-steps/{id}/timer-toggle', [ProductionTrackingController::class, 'toggleTimer']);
        Route::post('production-steps/{id}/complete', [ProductionTrackingController::class, 'completeStep']);

        // Inventory & Stocks
        Route::get('inventory/stocks', [InventoryController::class, 'index']);
        Route::post('inventory/adjust-stock', [InventoryController::class, 'adjustStock']);
        Route::get('inventory/movements', [InventoryController::class, 'movements']);

        // Purchasing (PO)
        Route::apiResource('purchase-orders', PurchaseOrderController::class);
        Route::post('purchase-orders/{id}/receive-goods', [PurchaseOrderController::class, 'receiveGoods']);

        // Job Order Costing
        Route::get('costings', [CostingController::class, 'index']);
        Route::put('costings/{id}', [CostingController::class, 'update']);

        // Quality Control
        Route::apiResource('qc-inspections', QCInspectionController::class);
    });
});`,
    controllers: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\WorkOrder;
use App\\Models\\ProductionStep;
use App\\Models\\Material;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class WorkOrderController extends Controller
{
    /**
     * Penerbitan SPK Baru dengan Pengecekan Ketersediaan Bahan Baku BOM
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:start_date',
            'priority' => 'required|in:Rendah,Sedang,Tinggi,Urgent',
            'batch_code' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $woNumber = 'SPK-' . date('Y') . '-' . str_pad(WorkOrder::count() + 1, 3, '0', STR_PAD_LEFT);

            $workOrder = WorkOrder::create(array_merge($validated, [
                'wo_number' => $woNumber,
                'order_date' => now()->toDateString(),
                'status' => 'Disetujui',
                'progress_percent' => 0,
                'current_stage' => 'Pemotongan Kayu',
                'approved_by' => $request->user()->name ?? 'Budi Raharjo, S.T.'
            ]));

            // Otomatis generate 6 Alur Tahapan Routing Mebel
            $stages = [
                ['stage' => 'Pemotongan Kayu', 'ws' => 'Bandsaw Cutting Station', 'op' => 'Slamet Riyadi', 'hours' => 16],
                ['stage' => 'Perakitan Komponen', 'ws' => 'Perakitan & Joinery Bench', 'op' => 'Wahyudi Santoso', 'hours' => 24],
                ['stage' => 'Pengamplasan', 'ws' => 'Wide-Belt Sanding Station', 'op' => 'Darto Sugeng', 'hours' => 16],
                ['stage' => 'Finishing & Pewarnaan', 'ws' => 'Spray Booth Melamic Oven', 'op' => 'Teguh Suwarto', 'hours' => 20],
                ['stage' => 'Pemasangan Jok & Aksesoris', 'ws' => 'Hardware & Upholstery Bench', 'op' => 'Wahyudi Santoso', 'hours' => 8],
                ['stage' => 'Packing & Siap Kirim', 'ws' => 'Pengepakan Single Face Box', 'op' => 'Rahmat Hidayat', 'hours' => 8],
            ];

            foreach ($stages as $index => $s) {
                ProductionStep::create([
                    'work_order_id' => $workOrder->id,
                    'stage' => $s['stage'],
                    'workstation_name' => $s['ws'],
                    'assigned_operator' => $s['op'],
                    'planned_hours' => $s['hours'],
                    'status' => $index === 0 ? 'Sedang Berjalan' : 'Menunggu',
                    'started_at' => $index === 0 ? now() : null,
                ]);
            }

            return response()->json([
                'message' => 'SPK Berhasil diterbitkan dan alur routing diaktifkan.',
                'data' => $workOrder->load('productionSteps')
            ], 201);
        });
    }
}`
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
              Arsitektur Backend Laravel 11/12 & Skema Relasional
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-950/60 text-rose-300 border border-rose-800 rounded">
              Laravel + Eloquent
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Blueprint database migration, Eloquent Models, API routing Sanctum, dan Controller business logic untuk deployment ke framework Laravel.
          </p>
        </div>

        <button
          onClick={() => handleCopy(activeTab, codeSnippets[activeTab])}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded text-xs font-medium transition-colors"
        >
          {copiedFile === activeTab ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Tersalin ke Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Kode {activeTab.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-md border border-neutral-800 w-fit">
        {[
          { id: 'migrations' as const, label: 'Database Migrations', icon: Database },
          { id: 'models' as const, label: 'Eloquent Models', icon: Layers },
          { id: 'routes' as const, label: 'API Routes (routes/api.php)', icon: Server },
          { id: 'controllers' as const, label: 'WorkOrderController', icon: FileCode }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === tab.id
                  ? 'bg-neutral-800 text-amber-300 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Code Container */}
      <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950 font-mono text-xs">
        <div className="bg-neutral-900 px-4 py-2 border-b border-neutral-800 flex items-center justify-between text-neutral-400 text-[11px]">
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {activeTab === 'migrations' && 'database/migrations/2026_09_25_create_furniture_erp_tables.php'}
              {activeTab === 'models' && 'app/Models/Product.php & WorkOrder.php'}
              {activeTab === 'routes' && 'routes/api.php'}
              {activeTab === 'controllers' && 'app/Http/Controllers/Api/WorkOrderController.php'}
            </span>
          </span>
          <span className="text-[10px] text-neutral-500">PHP 8.3 / Laravel 11+ Ready</span>
        </div>

        <pre className="p-4 text-neutral-200 overflow-x-auto leading-relaxed select-all">
          <code>{codeSnippets[activeTab]}</code>
        </pre>
      </div>

      {/* Deployment & Integration Steps Guide */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg space-y-2 text-xs text-neutral-400">
        <h3 className="font-semibold text-neutral-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-500" />
          <span>Cara Mengintegrasikan ke Backend Laravel Standar:</span>
        </h3>
        <ol className="list-decimal pl-5 space-y-1 text-neutral-300">
          <li>Buat file migrasi baru: <code className="bg-neutral-950 px-1 py-0.5 rounded text-amber-400">php artisan make:migration create_furniture_erp_tables</code> dan salin kode tab Migrations.</li>
          <li>Jalankan migrasi database: <code className="bg-neutral-950 px-1 py-0.5 rounded text-amber-400">php artisan migrate</code>.</li>
          <li>Tempatkan Model di folder <code className="bg-neutral-950 px-1 py-0.5 rounded text-amber-400">app/Models/</code>.</li>
          <li>Daftarkan API endpoints di <code className="bg-neutral-950 px-1 py-0.5 rounded text-amber-400">routes/api.php</code> dan pasang controller terkait.</li>
        </ol>
      </div>
    </div>
  );
};
