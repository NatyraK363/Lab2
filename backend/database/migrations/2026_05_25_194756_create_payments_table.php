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
       Schema::create('payments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('invoice_id')->constrained('invoices')->cascadeOnDelete();
    $table->decimal('amount', 10, 2);
    $table->string('payment_method');
    $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
    $table->dateTime('paid_at')->nullable();
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
        Schema::dropIfExists('payments');
    }
};
