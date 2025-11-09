import { writable } from 'svelte/store';

import type { Provider } from 'ethers';

interface WalletState {
	isConnected: boolean;
	walletAddress: string | null;
	network: string | null;
	provider: Provider | null; // Consider a more specific type if known (e.g., ethers.Provider, Web3Provider)
}

const initialState: WalletState = {
	isConnected: false,
	walletAddress: null,
	network: null,
	provider: null
};

export const walletStore = writable<WalletState>(initialState);

export const connectWallet = (address: string, networkName: string, walletProvider: Provider) => {
	walletStore.update((state: WalletState) => ({
		...state,
		isConnected: true,
		walletAddress: address,
		network: networkName,
		provider: walletProvider
	}));
};

export const disconnectWallet = () => {
	walletStore.set(initialState);
};
