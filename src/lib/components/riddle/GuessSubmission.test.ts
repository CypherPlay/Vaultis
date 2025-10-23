import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import GuessSubmission from './GuessSubmission.svelte';
import { tick } from 'svelte';

describe('GuessSubmission', () => {
  it('renders the component correctly', () => {
    render(GuessSubmission);
    expect(screen.getByText('Submit Your Guess')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your guess here')).toBeInTheDocument();
    expect(screen.getByText('Submit Guess')).toBeInTheDocument();
  });

  it('shows an error message for empty submission', async () => {
    render(GuessSubmission);
    const submitButton = screen.getByText('Submit Guess');
    await fireEvent.click(submitButton);

    expect(screen.getByText('Please enter your guess before submitting.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter your guess before submitting.');
  });

  it('calls submitGuess prop on successful submission and clears input', async () => {
    const mockSubmitGuess = vi.fn(() => Promise.resolve());
    render(GuessSubmission, { props: { submitGuess: mockSubmitGuess } });

    const input = screen.getByPlaceholderText('Enter your guess here');
    const submitButton = screen.getByText('Submit Guess');

    await fireEvent.input(input, { target: { value: 'test guess' } });
    await fireEvent.click(submitButton);

    expect(mockSubmitGuess).toHaveBeenCalledWith('test guess', 5);
    await waitFor(() => expect(input).toHaveValue(''));
    expect(screen.getByText('Guess "test guess" submitted! (Entry fee: 5 tokens)')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Guess "test guess" submitted! (Entry fee: 5 tokens)');
  });

  it('dispatches "submit" event on successful submission when no submitGuess prop', async () => {
    const { component } = render(GuessSubmission);
    const mockDispatch = vi.fn();
    component.$on('submit', mockDispatch);

    const input = screen.getByPlaceholderText('Enter your guess here');
    const submitButton = screen.getByText('Submit Guess');

    await fireEvent.input(input, { target: { value: 'event guess' } });
    await fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { guess: 'event guess', entryFee: 5 } })
    );
    await waitFor(() => expect(input).toHaveValue(''));
    expect(screen.getByText('Guess "event guess" submitted! (Entry fee: 5 tokens)')).toBeInTheDocument();
  });

  it('shows an error message on failed submission and does not clear input', async () => {
    const mockSubmitGuess = vi.fn(() => Promise.reject(new Error('Network error')));
    render(GuessSubmission, { props: { submitGuess: mockSubmitGuess } });

    const input = screen.getByPlaceholderText('Enter your guess here');
    const submitButton = screen.getByText('Submit Guess');

    await fireEvent.input(input, { target: { value: 'bad guess' } });
    await fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText('Network error')).toBeInTheDocument());
    expect(input).toHaveValue('bad guess');
    expect(screen.getByRole('alert')).toHaveTextContent('Network error');
  });

  it('disables submit button while loading', async () => {
    const mockSubmitGuess = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100))); // Simulate async
    render(GuessSubmission, { props: { submitGuess: mockSubmitGuess } });

    const input = screen.getByPlaceholderText('Enter your guess here');
    const submitButton = screen.getByText('Submit Guess');

    await fireEvent.input(input, { target: { value: 'loading test' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Submitting...');

    await waitFor(() => expect(submitButton).not.toBeDisabled());
    expect(submitButton).toHaveTextContent('Submit Guess');
  });

  it('applies Tailwind v4 focus ring classes', async () => {
    render(GuessSubmission);
    const input = screen.getByPlaceholderText('Enter your guess here');

    // This test primarily checks for the presence of the classes.
    // Visual verification would be needed for exact ring appearance.
    expect(input).toHaveClass('focus:ring-3');
    expect(input).toHaveClass('focus:ring-indigo-200/50');
  });
});
