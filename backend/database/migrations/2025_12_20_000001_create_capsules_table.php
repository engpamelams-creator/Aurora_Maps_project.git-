<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('capsules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Creator
            $table->string('title');
            $table->text('message')->nullable();
            $table->string('image_url')->nullable();

            // Geolocation
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);

            // Gamification Status
            $table->boolean('is_collected')->default(false);
            $table->foreignId('collected_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('collected_at')->nullable();

            $table->timestamps();

            // Indexes for Geo-queries
            $table->index(['latitude', 'longitude']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capsules');
    }
};
