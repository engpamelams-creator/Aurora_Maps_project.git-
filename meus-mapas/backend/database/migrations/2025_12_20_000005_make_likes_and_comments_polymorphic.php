<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Refactor Likes Table
        Schema::table('likes', function (Blueprint $table) {
            // Drop the specific post_id foreign key constraint first
            // Note: In SQLite (often used in dev) this can be tricky, but in Postgres/MySQL standard dropForeign works.
            // Since we are likely in a flexible dev environment, we'll try to just add the columns and migrate data.

            // However, to do this strictly "Polymorphic", we usually remove the specific ID.
            // Let's drop the FK if it exists, then the column.
            $table->dropForeign(['post_id']);
            $table->dropColumn('post_id');

            // Add polymorphic columns
            $table->morphs('likeable'); // Adds likeable_id, likeable_type

            // Unique constraint for user + entity
            $table->unique(['user_id', 'likeable_id', 'likeable_type']);
        });

        // 2. Refactor Comments Table
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
            $table->dropColumn('post_id');

            $table->morphs('commentable'); // Adds commentable_id, commentable_type
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'likeable_id', 'likeable_type']);
            $table->dropMorphs('likeable');
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->unique(['user_id', 'post_id']);
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropMorphs('commentable');
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
        });
    }
};
