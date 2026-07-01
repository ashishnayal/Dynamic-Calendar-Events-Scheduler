"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { endpoints, EndpointDef } from "@/config/endpoints";

// ── Simple JSON syntax highlighter ──────────────────────────
function highlight(json: string): string {
  return json
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "json-number";
        if (/^"/.test(match)) cls = /:$/.test(match) ? "json-key" : "json-string";
        else if (/true|false/.test(match)) cls = "json-bool";
        else if (/null/.test(match)) cls = "json-null";
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<{ status: number; statusText: string; data: unknown } | null>(null);
  const [loading, setLoading] = useState(false);

  const active = useMemo(
    () => endpoints.find((e) => e.id === selectedId) ?? null,
    [selectedId]
  );

  useEffect(() => {
    setParamValues({});
    setBody(active?.defaultBody ?? "");
    setResponse(null);
  }, [active]);

  const buildUrl = useCallback(() => {
    if (!active) return "";
    let url = active.path;
    const qp: string[] = [];
    active.params.forEach((p) => {
      const val = paramValues[p.name] ?? "";
      if (p.type === "path") url = url.replace(`{${p.name}}`, val || `{${p.name}}`);
      else if (p.type === "query" && val) qp.push(`${encodeURIComponent(p.name)}=${encodeURIComponent(val)}`);
    });
    return `http://localhost:8081${url}${qp.length ? "?" + qp.join("&") : ""}`;
  }, [active, paramValues]);

  const builtUrl = buildUrl();

  const curlSnippet = useMemo(() => {
    if (!active) return "";
    let s = `curl -X ${active.method} \\\n  "${builtUrl}" \\\n  -H "Accept: application/json"`;
    if (active.hasBody && body)
      s += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${body.replace(/'/g, "\\'")}'`;
    return s;
  }, [active, builtUrl, body]);

  const send = async () => {
    if (!active) return;
    setLoading(true);
    setResponse(null);
    try {
      const headers: HeadersInit = { Accept: "application/json" };
      const opts: RequestInit = { method: active.method, headers };
      if (active.hasBody && body) {
        (headers as Record<string, string>)["Content-Type"] = "application/json";
        opts.body = body;
      }
      const res = await fetch(builtUrl, opts);
      const text = await res.text();
      let data: unknown;
      try { data = text ? JSON.parse(text) : null; } catch { data = text; }
      setResponse({ status: res.status, statusText: res.statusText, data });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setResponse({ status: 0, statusText: "Network Error", data: { error: msg } });
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(() => {
    const g: Record<string, EndpointDef[]> = {};
    endpoints.forEach((e) => { (g[e.group] ??= []).push(e); });
    return g;
  }, []);

  const statusChip = (status: number) => {
    if (status === 201) return { cls: "created", label: "201 Created" };
    if (status >= 200 && status < 300) return { cls: "ok", label: `${status} OK` };
    if (status === 0) return { cls: "error", label: "Network Error" };
    if (status >= 400) return { cls: "error", label: `${status} Error` };
    return { cls: "none", label: `${status}` };
  };

  return (
    <div className="app">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">⚡</div>
            <span className="logo-text">Nettu API Tester</span>
          </div>
          <div className="logo-sub">Spring Boot · MongoDB</div>
        </div>

        <nav className="sidebar-nav">
          {Object.entries(grouped).map(([group, eps]) => (
            <div key={group}>
              <div className="nav-group-label">{group}</div>
              {eps.map((ep) => (
                <div
                  key={ep.id}
                  className={`nav-item ${ep.id === selectedId ? "active" : ""}`}
                  onClick={() => setSelectedId(ep.id)}
                >
                  <span className={`badge ${ep.method}`}>{ep.method}</span>
                  {ep.name}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="main">
        {!active ? (
          <div className="welcome">
            <div className="welcome-orb">⚡</div>
            <div className="welcome-title">Select an Endpoint</div>
            <div className="welcome-sub">
              Choose any route from the sidebar to start testing your Spring Boot backend.
            </div>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="hero">
              <div className="hero-title">
                <span className={`badge lg ${active.method}`}>{active.method}</span>
                <span className="hero-name">{active.name}</span>
              </div>
              <div className="hero-path">{builtUrl}</div>
              <div className="hero-desc">{active.description}</div>
            </div>

            {/* Workspace */}
            <div className="workspace">
              {/* Request Panel */}
              <div className="panel">
                {/* Parameters */}
                {active.params.length > 0 && (
                  <div className="glass-card">
                    <div className="card-header">
                      <span className="card-header-dot"></span>
                      Parameters
                    </div>
                    <div className="fields">
                      {active.params.map((p) => (
                        <div key={p.name}>
                          <label className="field-label">
                            {p.name}
                            <span className="field-type-tag">{p.type}</span>
                          </label>
                          <input
                            className="input"
                            type="text"
                            placeholder={p.description || `Enter ${p.name}`}
                            value={paramValues[p.name] ?? ""}
                            onChange={(e) =>
                              setParamValues((prev) => ({ ...prev, [p.name]: e.target.value }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Body */}
                {active.hasBody && (
                  <div className="glass-card">
                    <div className="card-header">
                      <span className="card-header-dot"></span>
                      Request Body (JSON)
                    </div>
                    <div className="fields">
                      <textarea
                        className="input textarea"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                )}

                {/* cURL */}
                <div className="glass-card">
                  <div className="card-header">
                    <span className="card-header-dot"></span>
                    cURL Equivalent
                  </div>
                  <div className="curl-block">{curlSnippet}</div>
                </div>

                {/* Send */}
                <button className="btn-send" onClick={send} disabled={loading}>
                  {loading ? <div className="spinner" /> : "⚡"}
                  {loading ? "Sending..." : "Send Request"}
                </button>
              </div>

              {/* Response Panel */}
              <div className="panel">
                {response ? (
                  <div className="glass-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="response-status-row">
                      {(() => {
                        const chip = statusChip(response.status);
                        return (
                          <>
                            <span className={`status-chip ${chip.cls}`}>{chip.label}</span>
                            <span className="status-text">{response.statusText}</span>
                          </>
                        );
                      })()}
                    </div>
                    <div
                      className="response-body"
                      dangerouslySetInnerHTML={{
                        __html: highlight(
                          typeof response.data === "object"
                            ? JSON.stringify(response.data, null, 2)
                            : String(response.data ?? "")
                        ),
                      }}
                    />
                  </div>
                ) : (
                  <div className="empty">
                    <div className="empty-icon">🚀</div>
                    <div className="empty-title">Awaiting Response</div>
                    <div className="empty-sub">
                      Fill in parameters and click <strong>Send Request</strong> to see the live API response here.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
