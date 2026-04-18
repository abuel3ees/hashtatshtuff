<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('points')->default(0)->after('password');
            $table->boolean('is_admin')->default(false)->after('points');
            $table->unsignedBigInteger('last_pulse_id')->nullable()->after('is_admin');
            $table->string('email')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['points', 'is_admin', 'last_pulse_id']);
            $table->string('email')->nullable(false)->change();
        });
    }
};
