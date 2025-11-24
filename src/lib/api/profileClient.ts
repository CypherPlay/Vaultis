import { apiFetch } from '$lib/utils/apiClient';

export interface UserProfile {
    walletAddress: string;
    totalGuesses: number;
    correctGuesses: number;
    riddlesSolved: number;
    averageAttempts: number;
    rank: number;
    // Add other profile-related fields as they become available from the API
}

export interface GuessHistoryEntry {
    riddleId: string;
    guess: string;
    isCorrect: boolean;
    submittedAt: string; // ISO date string
    // Add other guess history related fields
}

export interface PaginatedGuessHistory {
    data: GuessHistoryEntry[];
    total: number;
    page: number;
    limit: number;
}

/**
 * Fetches the current user's profile information.
 * @returns A promise that resolves to the UserProfile object.
 */
export async function fetchProfile(): Promise<UserProfile> {
    return apiFetch<UserProfile>('/api/profile');
}

/**
 * Fetches the current user's guess history with pagination.
 * @param page The page number to fetch (0-indexed).
 * @param limit The number of items per page.
 * @returns A promise that resolves to a PaginatedGuessHistory object.
 */
export async function fetchGuessHistory(page: number = 0, limit: number = 10): Promise<PaginatedGuessHistory> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    return apiFetch<PaginatedGuessHistory>(`/api/profile/guess-history?${params.toString()}`);
}
