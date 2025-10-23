import { render, screen } from '@testing-library/svelte';
import DailyRiddleDisplay from './DailyRiddleDisplay.svelte';
import { vi } from 'vitest';

import * as apiClient from '$lib/utils/apiClient';

// Mock the apiClient to control the riddle data
vi.mock('$lib/utils/apiClient');

describe('DailyRiddleDisplay', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders loading state initially', () => {
    vi.mocked(apiClient.apiFetch).mockReturnValue(new Promise(() => {})); // Never resolve to keep it loading
    render(DailyRiddleDisplay);
    expect(screen.getByText('Loading daily riddle...')).toBeInTheDocument();
  });

  test('renders riddle with imageAlt when provided', async () => {
    const riddleData = {
      id: '1',
      text: 'What has an eye but cannot see?',
      imageUrl: '/images/riddle-eye.png',
      imageAlt: 'A close-up of a needle eye',
      prizePool: '100 ETH',
    };
    vi.mocked(apiClient.apiFetch).mockResolvedValue(riddleData);

    render(DailyRiddleDisplay);

    const img = await screen.findByAltText('A close-up of a needle eye');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/riddle-eye.png');
  });

  test('renders riddle with empty alt attribute when imageAlt is undefined', async () => {
    const riddleData = {
      id: '2',
      text: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
      imageUrl: '/images/riddle-echo.png',
    vi.mocked(apiClient.apiFetch).mockResolvedValue(riddleData);

    render(DailyRiddleDisplay);

    const img = await screen.findByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/riddle-echo.png');
    expect(img).toHaveAttribute('alt', '');
  });

  test('renders riddle without image if imageUrl is not provided', async () => {
    const riddleData = {
      id: '3',
      text: 'What is always in front of you but can’t be seen?',
      prizePool: '200 ETH',
    };
    vi.mocked(apiClient.apiFetch).mockResolvedValue(riddleData);

    render(DailyRiddleDisplay);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(await screen.findByText(riddleData.text)).toBeInTheDocument();
  });

  test('renders error message on API fetch failure', async () => {
    const errorMessage = 'Network error';
    vi.mocked(apiClient.apiFetch).mockRejectedValue(new Error(errorMessage));

    render(DailyRiddleDisplay);

    expect(await screen.findByText(`An unexpected error occurred: ${errorMessage}`)).toBeInTheDocument();
  });

  test('renders no riddle available message if API returns null', async () => {
    vi.mocked(apiClient.apiFetch).mockResolvedValue(null);

    render(DailyRiddleDisplay);

    expect(await screen.findByText('No daily riddle available today.')).toBeInTheDocument();
  });
});