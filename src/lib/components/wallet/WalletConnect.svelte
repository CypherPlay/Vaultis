<script lang="ts">
	import { onMount } from 'svelte';
	import { BrowserProvider } from 'ethers';
	import { walletStore, connectWallet, disconnectWallet } from '$lib/stores/walletStore';
	import { shortAddress } from '$lib/utils/shortAddress';

	let provider: BrowserProvider | undefined;
	let signer: any | undefined;
	let error: string | undefined;

	// Reactive variables from the store
	let isConnected: boolean;
	let walletAddress: string | null;
	let network: string | null;

	walletStore.subscribe((state) => {
		isConnected = state.isConnected;
		walletAddress = state.walletAddress;
		network = state.network;
	});

	const targetNetwork = {
		chainId: '0xaa36a7', // Sepolia
		chainName: 'Sepolia Testnet',
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18
		},
		rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'], // Replace with your Infura Project ID
		blockExplorerUrls: ['https://sepolia.etherscan.io']
	};

	onMount(() => {
		if (window.ethereum) {
			provider = new BrowserProvider(window.ethereum);
			window.ethereum.on('accountsChanged', handleAccountsChanged);
			window.ethereum.on('chainChanged', handleChainChanged);
			checkConnection();
		} else {
			error = 'MetaMask or a compatible wallet is not installed.';
		}
	});

	async function checkConnection() {
		try {
			if (!provider) return;
			const accounts = await window.ethereum.request({ method: 'eth_accounts' });
			if (accounts.length > 0) {
				await handleConnectWallet();
			}
		} catch (err: any) {
			console.error('Error checking connection:', err);
			error = err.message;
		}
	}

	async function handleConnectWallet() {
		try {
			if (!provider) {
				error = 'Wallet provider not found.';
				return;
			}
			await provider.send('eth_requestAccounts', []);
			signer = await provider.getSigner();
			const address = await signer.getAddress();
			const { name } = await provider.getNetwork();
			connectWallet(address, name, provider); // Update the store
			error = undefined;
			checkNetwork();
		} catch (err: any) {
			console.error('Error connecting wallet:', err);
			error = err.message;
		}
	}

	async function handleDisconnectWallet() {
		disconnectWallet(); // Update the store
		signer = undefined;
		error = undefined;
	}

	async function checkNetwork() {
		if (!provider) return;
		const { chainId } = await provider.getNetwork();
		if (chainId !== BigInt(targetNetwork.chainId)) {
			error = `Wrong network. Please switch to ${targetNetwork.chainName}.`;
			try {
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: targetNetwork.chainId }]
				});
				// If switch is successful, re-check network
				const { name } = await provider.getNetwork();
				connectWallet(walletAddress!, name, provider); // Update the store
				error = undefined;
			} catch (switchError: any) {
				if (switchError.code === 4902) {
					// This error code indicates that the chain has not been added to MetaMask.
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [targetNetwork]
						});
						// If added, re-check network
						const { name } = await provider.getNetwork();
						connectWallet(walletAddress!, name, provider); // Update the store
						error = undefined;
					} catch (addError: any) {
						console.error('Failed to add the network:', addError);
						error = `Failed to add ${targetNetwork.chainName}: ${addError.message}`;
					}
				} else {
					console.error('Failed to switch network:', switchError);
					error = `Failed to switch to ${targetNetwork.chainName}: ${switchError.message}`;
				}
			}
		} else {
			error = undefined;
		}
	}

	function handleAccountsChanged(accounts: string[]) {
		if (accounts.length === 0) {
			handleDisconnectWallet();
		} else {
			handleConnectWallet();
		}
	}

	function handleChainChanged(chainId: string) {
		console.log('Chain changed:', chainId);
		handleConnectWallet();
	}
</script>

<div class="wallet-connect">
	{#if isConnected}
		<p>Connected: {shortAddress(walletAddress)}</p>
		<p>Network: {network}</p>
		<button on:click={handleDisconnectWallet}>Disconnect</button>
	{:else}
		<button on:click={handleConnectWallet}>Connect Wallet</button>
	{/if}

	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	.wallet-connect {
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		text-align: center;
		max-width: 300px;
		margin: 1rem auto;
	}
	.error {
		color: red;
		margin-top: 0.5rem;
	}
	button {
		background-color: #007bff;
		color: white;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 1rem;
	}
	button:hover {
		background-color: #0056b3;
	}
</style>
