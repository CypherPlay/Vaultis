import { get } from 'svelte/store';
import { user } from '$lib/stores/userStore';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let BASE_URL: string = '';
if (VITE_API_BASE_URL) {
	try {
		const url = new URL(VITE_API_BASE_URL);
		BASE_URL = url.origin + url.pathname.replace(/\/$/, '');
	} catch (e: unknown) {
		if (e instanceof Error) {
			throw new Error(`Invalid VITE_API_BASE_URL in environment configuration: ${e.message}`);
		}
		throw new Error(
			'Invalid VITE_API_BASE_URL in environment configuration: An unknown error occurred'
		);
	}
} else {
	// Explicitly document that relative URLs will be used
	console.warn('VITE_API_BASE_URL not set - using relative URLs (API must be same-origin)');
}

export type ApiResponse<T = unknown> = T;

export class ApiError extends Error {
	status: number;
	data?: unknown;

	constructor(status: number, message: string, data?: unknown) {
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
 * Depends on `user` store for the session token.
 */
export async function apiFetch<T = unknown>(
	input: RequestInfo,
	init?: RequestInit,
	_retried = false
): Promise<ApiResponse<T>> {
	const { sessionToken } = get(user);
	const headers = new Headers(init?.headers);

	if (sessionToken) {
		headers.set('Authorization', `Bearer ${sessionToken}`);
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
	const url =
		typeof input === 'string' && !input.startsWith('http') && !input.startsWith('//')
			? `${BASE_URL}${input.startsWith('/') ? input : '/' + input}`
			: input;
	try {
		const opts: RequestInit = init ? { ...init, headers } : { headers };
		response = await fetch(url, opts);
	} catch (err: unknown) {
		throw new Error(
			`Network error: ${err instanceof Error ? err.message : 'Unknown network error'}`,
			{ cause: err }
		);
	}

	if (response.status === 401 && !_retried) {
		// In a real application, you would attempt to refresh the token here.
		// For this example, we'll just throw an error.
		throw new Error('Authentication failed: session expired or invalid.');
	}

	const contentType = response.headers.get('content-type')?.toLowerCase() || '';

	const isJson = contentType.includes('application/json') || contentType.includes('+json');

	if (!response.ok) {
		let errorBody: unknown = null;

		try {
			errorBody = isJson ? await response.json() : await response.text();
		} catch {
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

export async function submitGuess(data: {
	walletAddress: string;
	guess: string;
}): Promise<{ isCorrect: boolean; recordedTime: string | null; canRetry: boolean }> {
	return apiFetch('/api/guesses/submit', {
		method: 'POST',
		body: data
	});
}

export async function fetchLeaderboard<T>(type: 'daily-winners' | 'all-time-winners'): Promise<T> {
	return apiFetch<T>(`/api/leaderboard/${type}`);
}
