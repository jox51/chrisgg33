<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('email')->nullable();
            $table->string('whop_payment_id')->unique()->nullable();
            $table->string('whop_membership_id')->nullable();
            $table->string('plan_type');
            $table->string('plan_id');
            $table->string('status')->default('pending');
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('currency', 3)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index('plan_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
