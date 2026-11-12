
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE recipes
                ALTER COLUMN title TYPE jsonb
                    USING CASE
                        WHEN title IS NULL THEN NULL
                        ELSE jsonb_build_object('en', title)
                    END,
                ALTER COLUMN description TYPE jsonb
                    USING CASE
                        WHEN description IS NULL THEN NULL
                        ELSE jsonb_build_object('en', description)
                    END,
                ALTER COLUMN instructions TYPE jsonb
                    USING CASE
                        WHEN instructions IS NULL THEN NULL
                        ELSE jsonb_build_object('en', instructions)
                    END
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE recipes
                ALTER COLUMN title TYPE text
                    USING title->>'en',
                ALTER COLUMN description TYPE text
                    USING description->>'en',
                ALTER COLUMN instructions TYPE text
                    USING instructions->>'en'
        ");
    }
};
