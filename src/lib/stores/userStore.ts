import { writable, type Writable } from 'svelte/store';

export interface UserState {
  sessionToken: string | null;
  isAuthenticated: boolean;
  riddleParticipation: Record<string, boolean>;
}

// Define the initial state for the user store
const initialUserState: UserState = {
  sessionToken: null,
  isAuthenticated: false,
  riddleParticipation: {},
};

// Create a writable store for user-related state
const userStore: Writable<UserState> = writable(initialUserState);

// Helper function to set the user's session token and authentication status
function setSession(token: string) {
  userStore.update((state: UserState) => ({
    ...state,
    sessionToken: token,
    isAuthenticated: !!token,
  }));
}

// Helper function to update riddle participation status
function updateRiddleParticipation(riddleId: string, participated: boolean) {
  userStore.update((state: UserState) => ({
    ...state,
    riddleParticipation: {
      ...state.riddleParticipation,
      [riddleId]: participated,
    },
  }));
}

// Helper function to reset the user state (e.g., on logout)
function resetUserState() {
  userStore.set(initialUserState);
}

// Export the store and helper functions
export const user = {
  subscribe: userStore.subscribe,
  setSession,
  updateRiddleParticipation,
  resetUserState,
};
