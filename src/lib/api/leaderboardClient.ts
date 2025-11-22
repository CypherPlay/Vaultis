import { apiClient } from '$lib/utils/apiClient';

const PAGE_SIZE = 10; // Define your desired page size

export async function fetchLeaderboardPage(type: string, page: number) {
  const offset = page * PAGE_SIZE;
  const limit = PAGE_SIZE;

  try {
    const response = await apiClient.get(`/leaderboard/${type}?offset=${offset}&limit=${limit}`);
    return {
      data: response.data.entries,
      totalCount: response.data.totalCount,
      pageSize: PAGE_SIZE,
    };
  } catch (error) {
    console.error('Error fetching leaderboard page:', error);
    throw error;
  }
}
