  import { render, screen, fireEvent } from '@testing-library/svelte';
  import GuessHistory from './GuessHistory.svelte';
  import { vi } from 'vitest';

  const dispatch = vi.fn();

  vi.mock('svelte', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      createEventDispatcher: () => dispatch,
    };
  });

  const mockGuesses = [
    {
      id: '1',
      timestamp: new Date('2025-11-23T10:00:00Z').toISOString(),
      result: 'Correct',
      timeTaken: 60,
      tokenCost: 10,
    },
    {
      id: '2',
      timestamp: new Date('2025-11-23T10:05:00Z').toISOString(),
      result: 'Incorrect',
      timeTaken: 120,
      tokenCost: 5,
    },
    {
      id: '3',
      timestamp: new Date('2025-11-23T10:10:00Z').toISOString(),
      result: 'Correct',
      timeTaken: 90,
      tokenCost: 10,
    },
    {
      id: '4',
      timestamp: new Date('2025-11-23T10:15:00Z').toISOString(),
      result: 'Incorrect',
      timeTaken: 75,
      tokenCost: 5,
    },
    {
      id: '5',
      timestamp: new Date('2025-11-23T10:20:00Z').toISOString(),
      result: 'Correct',
      timeTaken: 110,
      tokenCost: 10,
    },
    {
      id: '6',
      timestamp: new Date('2025-11-23T10:25:00Z').toISOString(),
      result: 'Incorrect',
      timeTaken: 80,
      tokenCost: 5,
    },
    {
      id: '7',
      timestamp: new Date('2025-11-23T10:30:00Z').toISOString(),
      result: 'Correct',
      timeTaken: 95,
      tokenCost: 10,
    },
    {
      id: '8',
      timestamp: new Date('2025-11-23T10:35:00Z').toISOString(),
      result: 'Incorrect',
      timeTaken: 100,
      tokenCost: 5,
    },
    {
      id: '9',
      timestamp: new Date('2025-11-23T10:40:00Z').toISOString(),
      result: 'Correct',
      timeTaken: 70,
      tokenCost: 10,
    },
    {
      id: '10',
      timestamp: new Date('2025-11-23T10:45:00Z').toISOString(),
      result: 'Incorrect',
      timeTaken: 130,
      tokenCost: 5,
    },
    {
      id: '11',
      timestamp: new Date('2025-11-23T10:50:00Z').toISOString(),
      result: 'Correct',
      timeTaken: 85,
      tokenCost: 10,
    },
  ];

  describe('GuessHistory', () => {
    beforeEach(() => {
      dispatch.mockClear();
    });

    it('renders correctly with no guesses', () => {
      render(GuessHistory, { props: { guesses: [] } });
      expect(screen.getByText('No guesses yet.')).toBeInTheDocument();
    });

    it('renders a list of guesses with pagination', async () => {
      render(GuessHistory, { props: { guesses: mockGuesses, itemsPerPage: 5 } });

      // Check initial page (page 1)
      expect(screen.getByText(new Date(mockGuesses[0].timestamp).toLocaleString())).toBeInTheDocument();
      expect(screen.queryByText(new Date(mockGuesses[5].timestamp).toLocaleString())).not.toBeInTheDocument();

      // Go to page 2
      const nextButton = screen.getByRole('button', { name: '›' });
      await fireEvent.click(nextButton);

      // Check page 2
      expect(screen.queryByText(new Date(mockGuesses[0].timestamp).toLocaleString())).not.toBeInTheDocument();
      expect(screen.getByText(new Date(mockGuesses[5].timestamp).toLocaleString())).toBeInTheDocument();

      // Go to last page
      const lastPageButton = screen.getByRole('button', { name: '»' });
      await fireEvent.click(lastPageButton);

      // Check last page
      expect(screen.getByText(new Date(mockGuesses[10].timestamp).toLocaleString())).toBeInTheDocument();
      expect(screen.queryByText(new Date(mockGuesses[9].timestamp).toLocaleString())).not.toBeInTheDocument();
    });

    it('dispatches pageChange event when page is changed', async () => {
      render(GuessHistory, { props: { guesses: mockGuesses, itemsPerPage: 5 } });

      const nextButton = screen.getByRole('button', { name: '›' });
      await fireEvent.click(nextButton);

      expect(dispatch).toHaveBeenCalledWith('pageChange', 2);
    });
  });
