import { user, type UserState } from '$lib/stores/userStore';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let BASE_URL: string = '';
if (VITE_API_BASE_URL) {
    try {
        const url = new URL(VITE_API_BASE_URL);
        BASE_URL = url.href.replace(/\/$/, ''); // Remove trailing slash
    } catch (e) {
        console.error(`Invalid VITE_API_BASE_URL: ${VITE_API_BASE_URL}. API calls will use relative URLs.`, e);
    }
}

if (!BASE_URL) {
    console.warn('VITE_API_BASE_URL is not set or is invalid. API calls will use relative URLs.');
}

let currentAccessToken: string | null = null;
const unsubscribeUser = user.subscribe((u: UserState) => {
	currentAccessToken = u.sessionToken;
});

// TODO: Implement refreshAccessToken logic if needed
async function refreshAccessToken(): Promise<string | null> {
	// For now, just return the current token. Real implementation would involve
	// calling an auth endpoint to get a new token and updating the user store.
	return currentAccessToken;
}

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
 * Depends on `currentAccessToken` and `refreshAccessToken()`.
 * `currentAccessToken` should synchronously hold the current access token (or null/undefined).
 * `refreshAccessToken()` should be an async function that attempts to refresh the token
 * and returns the new token (or throws on failure).
 */
export async function apiFetch<T = any>(
	input: RequestInfo,
	init?: RequestInit,
	_retried = false
): Promise<ApiResponse<T>> {
	let token = currentAccessToken;
	const headers = new Headers(init?.headers);

	if (token) {
		headers.set('Authorization', `Bearer ${token}`);
	}

	// Set Content-Type for JSON bodies if not already set
	if (
		init?.body &&
		typeof init.body === 'object' &&
		!(init.body instanceof FormData) &&
		!headers.has('Content-Type')
	) {
		headers.set('Content-Type', 'application/json');
		init.body = JSON.stringify(init.body);
	}

	let response: Response;
	const url = (
		typeof input === 'string' &&
		!input.startsWith('http') &&
		!input.startsWith('//')
	)
		? `${BASE_URL}${input.startsWith('/') ? input : '/' + input}`
		: input;
	try {
		const opts: RequestInit = init ? { ...init, headers } : { headers };
		response = await fetch(url, opts);
	} catch (err: any) {
		throw new Error(`Network error: ${err?.message ?? 'Unknown network error'}`, { cause: err });
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

	const contentType = response.headers.get('content-type')?.toLowerCase() || '';

	const isJson = contentType.includes('application/json') || contentType.includes('+json');

	if (!response.ok) {
		let errorBody: any = null;

		try {
			errorBody = isJson ? await response.json() : await response.text();
		} catch (e) {
			// ignore parse errors
		}

		throw new ApiError(
			response.status,
			`API error ${response.status}: ${response.statusText || 'Unknown error'}`,
			errorBody
		);
	}

	if (isJson) {
		return (await response.json()) as ApiResponse<T>;
	}

	const text = await response.text();

	return text as unknown as ApiResponse<T>;
}
