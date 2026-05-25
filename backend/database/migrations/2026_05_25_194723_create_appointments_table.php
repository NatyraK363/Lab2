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
        Schema::create('appointments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
    $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
    $table->date('appointment_date');
    $table->time('appointment_time');
    $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
    $table->text('reason')->nullable();
    $table->text('notes')->nullable();
    $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
    $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamps();

    $table->index(['doctor_id', 'appointment_date', 'appointment_time']);
});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('appointments');
    }
};
