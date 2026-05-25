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
       Schema::create('medical_records', function (Blueprint $table) {
    $table->id();
    $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
    $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
    $table->foreignId('appointment_id')->nullable()->constrained('appointments')->nullOnDelete();
    $table->text('diagnosis');
    $table->text('treatment')->nullable();
    $table->text('notes')->nullable();
    $table->date('record_date');
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
        Schema::dropIfExists('medical_records');
    }
};
