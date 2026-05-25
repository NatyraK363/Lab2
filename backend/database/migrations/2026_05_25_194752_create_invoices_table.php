<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('invoices', function (Blueprint $table) {
    $table->id();
    $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
    $table->foreignId('appointment_id')->nullable()->constrained('appointments')->nullOnDelete();
    $table->string('invoice_number')->unique();
    $table->decimal('total_amount', 10, 2);
    $table->enum('status', ['unpaid', 'paid', 'cancelled'])->default('unpaid');
    $table->date('issued_date');
    $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
    $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('invoices');
    }
};
