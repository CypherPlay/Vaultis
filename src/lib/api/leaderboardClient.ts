import { apiClient } from '$lib/utils/apiClient';

const PAGE_SIZE = 10; // Define your desired page size

interface LeaderboardPage {
	data: any[];
	totalCount: number;
	pageSize: number;
}

/**
 * Fetches a page of leaderboard data.
 * @param type The type of leaderboard to fetch (e.g., 'daily', 'weekly').
 * @param page The 0-based index of the page to fetch.
 * @returns A promise that resolves to a LeaderboardPage object.
 */
export async function fetchLeaderboardPage(type: string, page: number): Promise<LeaderboardPage> {
	if (typeof type !== 'string' || type.trim() === '') {
		throw new TypeError('Invalid parameter: "type" must be a non-empty string.');
	}
	if (typeof page !== 'number' || !Number.isInteger(page) || page < 0) {
		throw new TypeError('Invalid parameter: "page" must be a non-negative integer.');
	}

	const offset = page * PAGE_SIZE;
	const limit = PAGE_SIZE;

	try {
		const encodedType = encodeURIComponent(type);
		const response = await apiClient.get(
			`/leaderboard/${encodedType}?offset=${offset}&limit=${limit}`
		);
		return {
			data: response.data.entries,
			totalCount: response.data.totalCount,
			pageSize: PAGE_SIZE
		};
	} catch (error) {
		console.error('Error fetching leaderboard page:', error);
		throw error;
	}
}
