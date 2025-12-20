<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('points', function (Blueprint $table) {
            $table->boolean('has_ramp')->default(false)->after('description');
            $table->boolean('is_pet_friendly')->default(false)->after('has_ramp');
            $table->boolean('has_braille')->default(false)->after('is_pet_friendly');
            $table->boolean('is_sensory_friendly')->default(false)->after('has_braille');
            $table->boolean('wifi_free')->default(false)->after('is_sensory_friendly');
        });
    }

    public function down(): void
    {
        Schema::table('points', function (Blueprint $table) {
            $table->dropColumn(['has_ramp', 'is_pet_friendly', 'has_braille', 'is_sensory_friendly', 'wifi_free']);
        });
    }
};
