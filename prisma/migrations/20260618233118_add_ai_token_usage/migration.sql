-- CreateTable
CREATE TABLE "ai_token_usage" (
    "ai_token_usage_id" TEXT NOT NULL,
    "user_id" TEXT,
    "feature" TEXT NOT NULL,
    "feature_group" TEXT,
    "page" TEXT,
    "route" TEXT,
    "method" TEXT,
    "request_id" TEXT,
    "session_id" TEXT,
    "reference_type" TEXT,
    "reference_id" TEXT,
    "sdk_provider" TEXT,
    "llm_provider" TEXT,
    "llm_model" TEXT NOT NULL,
    "llm_model_version" TEXT,
    "llm_model_slug" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,
    "top_p" DOUBLE PRECISION,
    "max_output_tokens" INTEGER,
    "input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_tokens" INTEGER NOT NULL DEFAULT 0,
    "reasoning_tokens" INTEGER,
    "cached_input_tokens" INTEGER,
    "prompt_char_count" INTEGER,
    "completion_char_count" INTEGER,
    "prompt_message_count" INTEGER,
    "completion_message_count" INTEGER,
    "duration_ms" INTEGER,
    "first_token_ms" INTEGER,
    "streaming" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "error_code" TEXT,
    "error_message" TEXT,
    "input_cost_usd" DECIMAL(18,10),
    "output_cost_usd" DECIMAL(18,10),
    "total_cost_usd" DECIMAL(18,10),
    "currency" TEXT DEFAULT 'USD',
    "price_source" TEXT,
    "usage_raw" JSONB,
    "provider_metadata" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ai_token_usage_pkey" PRIMARY KEY ("ai_token_usage_id")
);

-- CreateIndex
CREATE INDEX "ai_token_usage_feature_created_at_idx" ON "ai_token_usage"("feature", "created_at");

-- CreateIndex
CREATE INDEX "ai_token_usage_feature_group_created_at_idx" ON "ai_token_usage"("feature_group", "created_at");

-- CreateIndex
CREATE INDEX "ai_token_usage_user_id_created_at_idx" ON "ai_token_usage"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_token_usage_llm_provider_llm_model_created_at_idx" ON "ai_token_usage"("llm_provider", "llm_model", "created_at");

-- CreateIndex
CREATE INDEX "ai_token_usage_llm_model_slug_created_at_idx" ON "ai_token_usage"("llm_model_slug", "created_at");

-- CreateIndex
CREATE INDEX "ai_token_usage_status_created_at_idx" ON "ai_token_usage"("status", "created_at");

-- CreateIndex
CREATE INDEX "ai_token_usage_reference_type_reference_id_idx" ON "ai_token_usage"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "ai_token_usage_request_id_idx" ON "ai_token_usage"("request_id");

-- AddForeignKey
ALTER TABLE "ai_token_usage" ADD CONSTRAINT "ai_token_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
