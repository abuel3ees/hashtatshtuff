<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clock_pulses', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('number');
            $table->boolean('is_active')->default(true)->index();
            $table->timestamp('started_at');
            $table->timestamp('ends_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clock_pulses');
    }
};
