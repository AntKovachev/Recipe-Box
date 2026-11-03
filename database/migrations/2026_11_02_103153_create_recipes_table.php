<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');
            $table->string('slug')->unique();

            $table->text('description')->nullable();
            $table->string('image_path')->nullable();

            $table->longText('instructions');

            $table->unsignedSmallInteger('prep_time')->default(0);
            $table->unsignedSmallInteger('cook_time')->default(0);
            $table->unsignedSmallInteger('servings')->default(1);

            $table->timestamps();

            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
