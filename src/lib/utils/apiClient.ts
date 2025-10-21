import { getAccessToken, refreshAccessToken } from '$lib/stores/userStore';

export type ApiResponse<T> = T;

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Authenticated API client for making fetch requests.
 * It automatically attaches the access token, handles token refresh on 401 errors,
 * and normalizes network and API errors.
 *
 * Depends on `getAccessToken()` and `refreshAccessToken()` from `$lib/stores/userStore`.
 * `getAccessToken()` should synchronously return the current access token (or null/undefined).
 * `refreshAccessToken()` should be an async function that attempts to refresh the token
 * and returns the new token (or throws on failure).
 */
export async function apiFetch<T = any>(
  input: RequestInfo,
  init?: RequestInit,
  _retried = false
): Promise<ApiResponse<T>> {
  let token = getAccessToken();
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set Content-Type for JSON bodies if not already set
  if (init?.body && typeof init.body === 'object' && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
    init.body = JSON.stringify(init.body);
  }

  let response: Response;
  try {
    response = await fetch(input, { ...init, headers });
  } catch (err: any) {
    throw new Error(`Network error: ${err.message}`);
  }

  if (response.status === 401 && !_retried) {
    try {
      await refreshAccessToken();
      // Retry the original request with the new token
      return apiFetch<T>(input, init, true);
    } catch (err) {
      throw new Error('Authentication failed: token expired or refresh failed');
    }
  }

  if (!response.ok) {
    let errorBody: any;
    try {
      errorBody = await response.json();
    } catch (e) {
      errorBody = await response.text();
    }
    throw new ApiError(
      response.status,
      `API error ${response.status}: ${response.statusText || 'Unknown error'}`,
      errorBody
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as ApiResponse<T>;
  }

  try {
    return await response.json();
  } catch (e) {
    // If response is OK but not JSON, return as is (e.g., plain text, empty response)
    return (await response.text()) as ApiResponse<T>;
  }
}
