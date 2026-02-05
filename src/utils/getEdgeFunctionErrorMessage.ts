/**
 * Extracts a useful, user-facing error message from `supabase.functions.invoke()` failures.
 *
 * Supabase returns a generic FunctionsHttpError message for non-2xx responses,
 * but it also provides the underlying `Response` object (status + body).
 */
export async function getEdgeFunctionErrorMessage(input: {
  error: unknown;
  response?: Response;
}): Promise<string> {
  const { error, response } = input;

  const status = response?.status;

  // Prefer the server-provided JSON error message when available.
  if (response) {
    try {
      const contentType = (response.headers.get("Content-Type") ?? "").split(";")[0].trim();

      // clone() so we don't depend on response body being unread later.
      if (contentType === "application/json") {
        const body = (await response.clone().json().catch(() => null)) as any;
        const msg = body?.error ?? body?.message;
        if (typeof msg === "string" && msg.trim()) return msg;
      } else {
        const text = await response.clone().text().catch(() => "");
        if (text?.trim()) {
          // Sometimes the server returns JSON as text; attempt to parse.
          try {
            const parsed = JSON.parse(text);
            const msg = parsed?.error ?? parsed?.message;
            if (typeof msg === "string" && msg.trim()) return msg;
          } catch {
            return text;
          }
        }
      }
    } catch {
      // ignore parsing errors and fall back
    }
  }

  const fallback = error instanceof Error ? error.message : String(error ?? "Unknown error");

  // Helpful fallbacks for common cases where the body isn't readable.
  if (status === 402 || fallback.includes("402")) {
    return "AI credits exhausted. Please add credits to continue.";
  }
  if (status === 429 || fallback.includes("429")) {
    return "Rate limited. Please try again in a moment.";
  }

  return fallback || "Failed to generate image";
}
