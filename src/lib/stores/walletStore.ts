import { writable } from 'svelte/store';

interface WalletState {
	isConnected: boolean;
	walletAddress: string | null;
	network: string | null;
	provider: any | null; // Consider a more specific type if known (e.g., ethers.Provider, Web3Provider)
}

const initialState: WalletState = {
	isConnected: false,
	walletAddress: null,
	network: null,
	provider: null
};

export const walletStore = writable<WalletState>(initialState);

export const connectWallet = (address: string, networkName: string, walletProvider: any) => {
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
