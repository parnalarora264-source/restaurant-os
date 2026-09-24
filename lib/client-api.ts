export async function apiFetch<T>(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 12000): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'content-type': 'application/json' } : {}),
        ...(init.headers || {}),
      },
    });

    const text = await response.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Server returned an invalid response (${response.status})`);
    }

    if (!response.ok) {
      throw new Error(data?.error || `Request failed (${response.status})`);
    }

    return data as T;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error('Request timed out. Please check the server/database connection.');
    }
    if (error instanceof TypeError) {
      throw new Error('Could not connect to the server.');
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}
