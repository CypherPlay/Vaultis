import { writable, type Writable } from 'svelte/store';

export interface UserProfile {
	username: string;
	totalGuesses: number;
	correctGuesses: number;
}

export interface UserState {
	sessionToken: string | null;
	isAuthenticated: boolean;
	user: UserProfile | null;
	error: string | null;
	riddleParticipation: Record<string, boolean>;
}

// Define the initial state for the user store
const initialUserState: UserState = {
	sessionToken: null,
	isAuthenticated: false,
	user: null,
	error: null,
	riddleParticipation: {}
};

// Create a writable store for user-related state
const userStore: Writable<UserState> = writable(initialUserState);

// Helper function to set the user's session token and authentication status
function setSession(token: string) {
	userStore.update((state: UserState) => ({
		...state,
		sessionToken: token,
		isAuthenticated: !!token
	}));
}

// Helper function to update riddle participation status
function updateRiddleParticipation(riddleId: string, participated: boolean) {
	userStore.update((state: UserState) => ({
		...state,
		riddleParticipation: {
			...state.riddleParticipation,
			[riddleId]: participated
		}
	}));
}

// Helper function to reset the user state (e.g., on logout)
function resetUserState() {
	userStore.set(initialUserState);
}

async function fetchUserProfile() {
	userStore.update((state) => ({ ...state, error: null })); // Clear previous errors
	try {
		// Simulate API call
		const response = await new Promise<UserProfile>((resolve, reject) => {
			setTimeout(() => {
				const success = Math.random() > 0.2; // 80% chance of success
				if (success) {
					resolve({
						username: 'TestUser',
						totalGuesses: 100,
						correctGuesses: 75
					});
				} else {
					reject('Failed to fetch user profile');
				}
			}, 1000);
		});
		userStore.update((state) => ({ ...state, user: response, error: null }));
	} catch (err) {
		userStore.update((state) => ({ ...state, user: null, error: err as string }));
	}
}

function clearError() {
	userStore.update((state) => ({ ...state, error: null }));
}

// Export the store and helper functions
export const user = {
	subscribe: userStore.subscribe,
	setSession,
	updateRiddleParticipation,
	resetUserState,
	fetchUserProfile,
	clearError
};
