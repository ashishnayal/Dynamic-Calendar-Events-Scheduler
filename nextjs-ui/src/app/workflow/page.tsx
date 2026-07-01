"use client";

import { useState } from "react";

const API_BASE = "http://localhost:8081/api/v1";

type StepStatus = "pending" | "running" | "success" | "error";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  method: "GET" | "POST";
  path: (ctx: Record<string, string | number>) => string;
  getBody?: (ctx: Record<string, string | number>) => Record<string, unknown> | unknown[];
  status: StepStatus;
  response?: unknown;
  error?: string;
}

export default function WorkflowPage() {
  const [context, setContext] = useState<Record<string, string | number>>({
    startTs: Date.now(),
    endTs: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
  });
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: "create-account",
      title: "1. Create Account",
      description: "Initialize a new account in Nettu Scheduler.",
      method: "POST",
      path: () => "/accounts",
      getBody: () => ({}),
      status: "pending",
    },
    {
      id: "create-user",
      title: "2. Create User",
      description: "Create a user under the newly created account.",
      method: "POST",
      path: () => "/users",
      getBody: (ctx) => ({ accountId: ctx.accountId }),
      status: "pending",
    },
    {
      id: "create-calendar",
      title: "3. Create Calendar",
      description: "Create a calendar for the user to manage their time.",
      method: "POST",
      path: () => "/calendars",
      getBody: (ctx) => ({
        accountId: ctx.accountId,
        userId: ctx.userId,
        settings: { timezone: "UTC", weekStart: "Mon" },
      }),
      status: "pending",
    },
    {
      id: "create-schedule",
      title: "4. Create Schedule",
      description: "Define a working schedule for the user.",
      method: "POST",
      path: () => "/schedules",
      getBody: (ctx) => ({
        userId: ctx.userId,
        timezone: "UTC",
        rules: [],
      }),
      status: "pending",
    },
    {
      id: "create-service",
      title: "5. Create Service",
      description: "Create a bookable service (e.g. 15 Min Meeting).",
      method: "POST",
      path: () => "/services",
      getBody: (ctx) => ({ accountId: ctx.accountId }),
      status: "pending",
    },
    {
      id: "add-user-to-service",
      title: "6. Add User to Service",
      description: "Register the user to provide this service.",
      method: "POST",
      path: (ctx) => `/services/${ctx.serviceId}/users`,
      getBody: (ctx) => ({
        userId: ctx.userId,
        serviceId: ctx.serviceId,
        availability: { variant: "Calendar", id: ctx.calendarId },
        bufferAfter: 0,
        bufferBefore: 0,
        closestBookingTime: 0,
      }),
      status: "pending",
    },
    {
      id: "get-booking-slots",
      title: "7. Get Booking Slots",
      description: "Find available time slots for the service.",
      method: "GET",
      path: (ctx) => `/services/${ctx.serviceId}/booking?startTs=${ctx.startTs}&endTs=${ctx.endTs}`,
      status: "pending",
    },
    {
      id: "create-booking",
      title: "8. Create Booking Intend",
      description: "Reserve a time slot based on availability.",
      method: "POST",
      path: (ctx) => `/services/${ctx.serviceId}/booking-intend`,
      getBody: (ctx) => ({
        accountId: ctx.accountId,
        userId: ctx.userId,
        startTs: ctx.startTs,
        endTs: ctx.startTs + 3600000, // +1 hr
      }),
      status: "pending",
    },
  ]);

  const updateStep = (index: number, patch: Partial<WorkflowStep>) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const runStep = async (index: number) => {
    const step = steps[index];
    updateStep(index, { status: "running", error: undefined, response: undefined });

    try {
      const url = `${API_BASE}${step.path(context)}`;
      const options: RequestInit = { method: step.method, headers: {} };

      if (step.method === "POST" && step.getBody) {
        options.body = JSON.stringify(step.getBody(context));
        (options.headers as Record<string, string>)["Content-Type"] = "application/json";
      }

      const res = await fetch(url, options);
      const data = (await res.json().catch(() => ({}))) as Record<string, string>;

      if (!res.ok) throw new Error(data.message || `Status ${res.status}`);

      // Extract generated IDs into context
      const newContext = { ...context };
      if (step.id === "create-account" && data.id) newContext.accountId = data.id;
      if (step.id === "create-user" && data.id) newContext.userId = data.id;
      if (step.id === "create-calendar" && data.id) newContext.calendarId = data.id;
      if (step.id === "create-schedule" && data.id) newContext.scheduleId = data.id;
      if (step.id === "create-service" && data.id) newContext.serviceId = data.id;
      setContext(newContext);

      updateStep(index, { status: "success", response: data });
      if (index + 1 < steps.length) {
        setActiveStepIndex(index + 1);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      updateStep(index, { status: "error", error: message });
    }
  };

  const statusChip = (status: StepStatus) => {
    switch (status) {
      case "success": return <span className="status-chip ok">Success</span>;
      case "error": return <span className="status-chip error">Error</span>;
      case "running": return <span className="status-chip created">Running...</span>;
      default: return <span className="status-chip none">Pending</span>;
    }
  };

  return (
    <div className="app">
      <main className="main">
        <header className="hero">
          <div className="hero-title">
            <h1 className="hero-name">End-to-End Workflow</h1>
          </div>
          <p className="hero-desc">
            Test the entire sequence of Nettu Scheduler API calls from creating an account down to making a booking intend. 
            Data passed between steps is handled automatically.
          </p>
        </header>

        <div className="workspace" style={{ display: "flex", overflow: "hidden" }}>
          {/* Steps List */}
          <div className="panel" style={{ flex: "0 0 380px", borderRight: "1px solid var(--clr-border)", overflowY: "auto" }}>
            <h3 style={{ marginBottom: "16px", color: "var(--clr-text-2)" }}>Workflow Sequence</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {steps.map((step, idx) => (
                <div 
                  key={step.id} 
                  className={`glass-card ${idx === activeStepIndex ? "active" : ""}`}
                  style={{ 
                    cursor: "pointer", 
                    padding: "16px",
                    borderColor: idx === activeStepIndex ? "var(--clr-border-glow)" : "var(--clr-border)",
                    boxShadow: idx === activeStepIndex ? "0 0 15px rgba(139,92,246,.2)" : "none"
                  }}
                  onClick={() => setActiveStepIndex(idx)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{step.title}</span>
                    {statusChip(step.status)}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--clr-text-3)", marginBottom: "8px" }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Step Details */}
          <div className="panel" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
            {(() => {
              const step = steps[activeStepIndex];
              if (!step) return null;
              
              const isRunning = step.status === "running";

              return (
                <>
                  <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{step.title}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className={`badge ${step.method} lg`}>{step.method}</span>
                      <span className="hero-path" style={{ margin: 0 }}>{step.path(context)}</span>
                    </div>

                    {step.method === "POST" && step.getBody && (
                      <div style={{ marginTop: "12px" }}>
                        <span className="field-label">Request Payload</span>
                        <pre className="curl-block" style={{ background: "rgba(0,0,0,0.3)", borderRadius: "8px" }}>
                          {JSON.stringify(step.getBody(context), null, 2)}
                        </pre>
                      </div>
                    )}

                    <button 
                      className="btn-send" 
                      onClick={() => runStep(activeStepIndex)} 
                      disabled={isRunning}
                      style={{ marginTop: "8px" }}
                    >
                      {isRunning ? <div className="spinner" /> : "⚡"}
                      {isRunning ? "Running..." : "Run Step"}
                    </button>
                  </div>

                  {(step.response || step.error) && (
                    <div className="glass-card" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: "250px" }}>
                      <div className="card-header">
                        <div className="card-header-dot" />
                        Response
                      </div>
                      <pre className="response-body">
                        {step.error ? (
                          <span style={{ color: "#f87171" }}>Error: {step.error}</span>
                        ) : (
                          JSON.stringify(step.response, null, 2)
                        )}
                      </pre>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}
