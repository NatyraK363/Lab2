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
       Schema::create('prescriptions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('medical_record_id')->constrained('medical_records')->cascadeOnDelete();
    $table->foreignId('medicine_id')->nullable()->constrained('medicines')->nullOnDelete();
    $table->string('dosage');
    $table->string('frequency');
    $table->integer('duration_days');
    $table->text('instructions')->nullable();
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
        Schema::dropIfExists('prescriptions');
    }
};
