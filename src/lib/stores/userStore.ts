import { writable } from 'svelte/store';

// Define the initial state for the user store
const initialUserState = {
  sessionToken: null as string | null,
  isAuthenticated: false,
  riddleParticipation: {} as Record<string, boolean>, // e.g., { 'riddleId1': true, 'riddleId2': false }
};

// Create a writable store for user-related state
const userStore = writable(initialUserState);

// Helper function to set the user's session token and authentication status
function setSession(token: string) {
  userStore.update(state => ({
    ...state,
    sessionToken: token,
    isAuthenticated: !!token,
  }));
}

// Helper function to update riddle participation status
function updateRiddleParticipation(riddleId: string, participated: boolean) {
  userStore.update(state => ({
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
