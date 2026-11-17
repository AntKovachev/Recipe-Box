<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->text('search_title')
                ->storedAs("title->>'en'");

            $table->text('search_description')
                ->storedAs("description->>'en'");
        });
    }

    public function down(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->dropColumn([
                'search_title',
                'search_description',
            ]);
        });
    }
};
