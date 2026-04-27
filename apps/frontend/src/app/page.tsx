"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

type HealthResponse = { status: "ok"; timestamp: string };

type ScenarioType =
  | "success"
  | "validation_error"
  | "system_error"
  | "slow_request"
  | "teapot";

type RunScenarioFormValues = {
  type: ScenarioType;
  name?: string;
};

type ScenarioRun = {
  id: string;
  type: string;
  status: string;
  duration: number | null;
  error?: string | null;
  createdAt: string;
};

export default function Home() {
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: async (): Promise<HealthResponse> => {
      const res = await fetch(`${API_BASE_URL}/api/health`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
      return res.json();
    },
    refetchInterval: 10_000,
  });

  const form = useForm<RunScenarioFormValues>({
    defaultValues: { type: "success", name: "" },
  });

  const runScenarioMutation = useMutation({
    mutationFn: async (values: RunScenarioFormValues) => {
      const res = await fetch(`${API_BASE_URL}/api/scenarios/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          typeof json?.message === "string"
            ? json.message
            : "Request failed";
        throw new Error(message);
      }
      return json as { id: string; status: string };
    },
    onSuccess: (data) => {
      toast.success("Scenario started", { description: `Run id: ${data.id}` });
    },
    onError: (err) => {
      toast.error("Scenario failed", {
        description: err instanceof Error ? err.message : "Request failed",
      });
    },
  });

  const runsQuery = useQuery({
    queryKey: ["runs"],
    queryFn: async (): Promise<ScenarioRun[]> => {
      const res = await fetch(`${API_BASE_URL}/api/scenarios/runs`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Failed to load runs: ${res.status}`);
      return res.json();
    },
    refetchInterval: 5_000,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await runScenarioMutation.mutateAsync(values);
    await runsQuery.refetch();
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Signal Lab
            </span>
            <span className="text-xs text-zinc-600">
              Frontend: Next.js • Backend: NestJS
            </span>
          </div>
          <div className="text-xs text-zinc-600">
            API: <span className="font-mono">{API_BASE_URL}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Health</CardTitle>
            <CardDescription>Backend readiness check</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm">
                {healthQuery.isLoading && "Loading..."}
                {healthQuery.isError && (
                  <span className="text-red-600">
                    {(healthQuery.error as Error).message}
                  </span>
                )}
                {healthQuery.data && (
                  <span className="text-emerald-700">
                    ok • {new Date(healthQuery.data.timestamp).toLocaleString()}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => healthQuery.refetch()}
                disabled={healthQuery.isFetching}
              >
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Run Scenario</CardTitle>
            <CardDescription>
              Generates metrics, logs and errors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-zinc-700">Type</span>
                <select
                  className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm"
                  {...form.register("type")}
                >
                  <option value="success">success</option>
                  <option value="validation_error">validation_error</option>
                  <option value="system_error">system_error</option>
                  <option value="slow_request">slow_request</option>
                  <option value="teapot">teapot</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-zinc-700">Name</span>
                <Input placeholder="Optional label" {...form.register("name")} />
              </label>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={runScenarioMutation.isPending}>
                  {runScenarioMutation.isPending ? "Running..." : "Run"}
                </Button>
                <span className="text-xs text-zinc-500">
                  Toast shows the result
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Run History</CardTitle>
            <CardDescription>Last 20 runs (auto refresh)</CardDescription>
          </CardHeader>
          <CardContent>
            {runsQuery.isLoading && (
              <div className="text-sm text-zinc-600">Loading...</div>
            )}
            {runsQuery.isError && (
              <div className="text-sm text-red-600">
                {(runsQuery.error as Error).message}
              </div>
            )}
            {runsQuery.data && (
              <div className="flex flex-col gap-2">
                {runsQuery.data.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-700">
                          {run.type}
                        </span>
                        <span
                          className={[
                            "rounded-full px-2 py-0.5 text-[11px] font-medium",
                            run.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : run.status === "validation_error"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800",
                          ].join(" ")}
                        >
                          {run.status}
                        </span>
                      </div>
                      <div className="truncate font-mono text-[11px] text-zinc-500">
                        {run.id}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1 text-[11px] text-zinc-500">
                      <span>
                        {run.duration != null ? `${run.duration}ms` : "—"}
                      </span>
                      <span>
                        {new Date(run.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Observability Links</CardTitle>
            <CardDescription>Where to see the signals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
              <a
                className="rounded-md border border-zinc-200 bg-white px-3 py-2 hover:bg-zinc-50"
                href="http://localhost:3100"
                target="_blank"
                rel="noreferrer"
              >
                Grafana: <span className="font-mono">localhost:3100</span>
              </a>
              <a
                className="rounded-md border border-zinc-200 bg-white px-3 py-2 hover:bg-zinc-50"
                href="http://localhost:3001/metrics"
                target="_blank"
                rel="noreferrer"
              >
                Prometheus metrics:{" "}
                <span className="font-mono">/metrics</span>
              </a>
              <div className="rounded-md border border-zinc-200 bg-white px-3 py-2">
                Loki query (Grafana Explore):{" "}
                <span className="font-mono">{`{app="signal-lab"}`}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
