import { fetchGuessHistory } from './profileClient';
import { vi } from 'vitest';
import { apiFetch } from '$lib/utils/apiClient';

// Mock the apiFetch function
vi.mock('$lib/utils/apiClient', () => ({
    apiFetch: vi.fn(),
}));

describe('fetchGuessHistory', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw an error if page is negative', async () => {
        await expect(fetchGuessHistory(-1, 10)).rejects.toThrow('Page number cannot be negative.');
    });

    it('should throw an error if limit is less than 1', async () => {
        await expect(fetchGuessHistory(0, 0)).rejects.toThrow('Limit must be at least 1.');
    });

    it('should call apiFetch with correct parameters for valid input', async () => {
        const mockResponse = {
            data: [],
            total: 0,
            page: 0,
            limit: 10,
        };
        (apiFetch as vi.Mock).mockResolvedValue(mockResponse);

        const result = await fetchGuessHistory(0, 10);

        expect(apiFetch).toHaveBeenCalledWith('/api/profile/guess-history?page=0&limit=10');
        expect(result).toEqual(mockResponse);
    });
});
