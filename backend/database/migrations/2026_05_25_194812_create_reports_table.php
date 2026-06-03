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
       Schema::create('reports', function (Blueprint $table) {
        $table->id();
        $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
        $table->string('title');
        $table->string('type');
        $table->date('from_date')->nullable();
        $table->date('to_date')->nullable();
        $table->json('filters')->nullable();
        $table->json('data')->nullable();
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
        Schema::dropIfExists('reports');
    }
};
