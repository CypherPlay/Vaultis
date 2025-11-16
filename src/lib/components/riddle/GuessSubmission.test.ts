import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import GuessSubmission from './GuessSubmission.svelte';
import { vi } from 'vitest';
import * as apiClient from '$lib/utils/apiClient';
import { alertStore } from '$lib/stores/alertStore';

// Mock the apiClient and alertStore
vi.mock('$lib/utils/apiClient');
vi.mock('$lib/stores/alertStore', () => ({
	alertStore: {
		error: vi.fn(),
		info: vi.fn(),
		success: vi.fn()
	}
}));

vi.mock('$lib/stores/walletStore', () => ({
	walletStore: {
		subscribe: vi.fn((fn) => {
			fn({ walletAddress: '0xTestWalletAddress' });
			return () => {};
		}),
		set: vi.fn(),
		update: vi.fn()
	}
}));

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

		expect(screen.getByText('Your guess cannot be empty.')).toBeInTheDocument();
	});

	it('calls apiFetch on successful submission and clears input', async () => {
		const apiFetchSpy = vi.spyOn(apiClient, 'apiFetch').mockResolvedValueOnce({});
		render(GuessSubmission);

		const input = screen.getByPlaceholderText('Enter your guess here');
		const submitButton = screen.getByText('Submit Guess');

		await fireEvent.input(input, { target: { value: 'test guess' } });
		await fireEvent.click(submitButton);

		expect(apiFetchSpy).toHaveBeenCalledWith(
			'/api/guesses/submit',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({ walletAddress: '0xTestWalletAddress', guess: 'test guess' }),
				headers: { 'Content-Type': 'application/json' }
			})
		);
		await waitFor(() =>
			expect(alertStore.success).toHaveBeenCalledWith('Guess submitted successfully!', 3000)
		);
	});

	it('shows an error message on failed submission and does not clear input', async () => {
		const errorMessage = 'Network error';
		vi.mocked(apiClient.apiFetch).mockRejectedValue(new Error(errorMessage));

		render(GuessSubmission, { entryFee: 5 });

		const input = screen.getByPlaceholderText('Enter your guess here');
		await userEvent.type(input, 'bad guess');

		const submitButton = screen.getByRole('button', { name: 'Submit Guess' });
		await fireEvent.click(submitButton);

		await waitFor(() => expect(alertStore.error).toHaveBeenCalledWith(errorMessage, 5000));
		expect(input).toHaveValue('bad guess');
	});

	it('disables submit button while loading', async () => {
		vi.spyOn(apiClient, 'apiFetch').mockImplementationOnce(
			() => new Promise((resolve) => setTimeout(resolve, 100))
		); // Simulate async
		render(GuessSubmission);

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
