-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."ScenarioRun" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "duration" INTEGER,
    "error" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScenarioRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScenarioRun_type_status_createdAt_idx" ON "public"."ScenarioRun"("type", "status", "createdAt");
