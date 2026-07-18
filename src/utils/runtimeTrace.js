const TRACE_FLAG = "__RUNTIME_TRACE_ENABLED__";
const TRACE_STORE_KEY = "runtime_trace_events";
const MAX_EVENTS = 300;

function getGlobalScope() {
  if (typeof window !== "undefined") {
    return window;
  }

  if (typeof globalThis !== "undefined") {
    return globalThis;
  }

  return null;
}

function nowIso() {
  return new Date().toISOString();
}

function getActiveTraceId() {
  const scope = getGlobalScope();
  return scope?.__ACTIVE_RUNTIME_TRACE_ID__ || null;
}

function isTraceEnabled() {
  const scope = getGlobalScope();
  return Boolean(scope?.[TRACE_FLAG]);
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeBody(body) {
  if (!body) {
    return null;
  }

  if (typeof body === "string") {
    return body;
  }

  if (body instanceof FormData) {
    return Object.fromEntries(body.entries());
  }

  return String(body);
}

function readEvents() {
  if (typeof window === "undefined") {
    return [];
  }

  return safeJsonParse(window.localStorage.getItem(TRACE_STORE_KEY), []);
}

function writeEvents(events) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TRACE_STORE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
}

export function appendRuntimeTrace(event) {
  if (typeof window === "undefined" || !isTraceEnabled()) {
    return;
  }

  const events = readEvents();
  const activeTraceId = getActiveTraceId();
  events.push({ ts: nowIso(), ...(activeTraceId && !event.traceId ? { traceId: activeTraceId } : {}), ...event });
  writeEvents(events);
}

export function createRuntimeTraceId(prefix = "trace") {
  const scope = getGlobalScope();
  const randomId = scope?.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}:${randomId}`;
}

export function withRuntimeTrace(traceId, callback) {
  const scope = getGlobalScope();
  if (!scope) {
    return callback();
  }

  const previousTraceId = scope.__ACTIVE_RUNTIME_TRACE_ID__;
  scope.__ACTIVE_RUNTIME_TRACE_ID__ = traceId;

  try {
    return callback();
  } finally {
    if (previousTraceId) {
      scope.__ACTIVE_RUNTIME_TRACE_ID__ = previousTraceId;
    } else {
      delete scope.__ACTIVE_RUNTIME_TRACE_ID__;
    }
  }
}

export function shouldEnableRuntimeTrace() {
  if (typeof window === "undefined") {
    return false;
  }

  const traceParam = new URLSearchParams(window.location.search).get("trace");
  return import.meta.env.DEV || import.meta.env.VITE_RUNTIME_TRACE === "true" || traceParam === "true";
}

export function installRuntimeTrace() {
  const scope = getGlobalScope();
  if (!scope || scope[TRACE_FLAG] || !shouldEnableRuntimeTrace()) {
    return;
  }

  scope[TRACE_FLAG] = true;
  scope.__dumpRuntimeTrace = () => readEvents();
  scope.__clearRuntimeTrace = () => writeEvents([]);

  const originalFetch = scope.fetch?.bind(scope);
  if (originalFetch) {
    scope.fetch = async (input, init = {}) => {
      const requestUrl = typeof input === "string" ? input : input?.url || "";
      const method = init.method || (typeof input !== "string" ? input?.method : "GET") || "GET";
      const requestBody = normalizeBody(init.body || (typeof input !== "string" ? input?.body : null));

      appendRuntimeTrace({
        type: "fetch:start",
        url: requestUrl,
        method,
        requestBody,
      });

      try {
        const response = await originalFetch(input, init);
        const clone = response.clone();
        let responseBody = "";
        try {
          responseBody = await clone.text();
        } catch {
          responseBody = "<unreadable>";
        }

        appendRuntimeTrace({
          type: "fetch:end",
          url: requestUrl,
          method,
          status: response.status,
          responseBody,
        });

        return response;
      } catch (error) {
        appendRuntimeTrace({
          type: "fetch:error",
          url: requestUrl,
          method,
          requestBody,
          error: String(error?.message || error),
        });
        throw error;
      }
    };
  }

  scope.addEventListener?.("error", (event) => {
    appendRuntimeTrace({
      type: "window:error",
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno,
    });
  });

  scope.addEventListener?.("unhandledrejection", (event) => {
    appendRuntimeTrace({
      type: "promise:rejection",
      reason: String(event.reason?.message || event.reason),
    });
  });
}