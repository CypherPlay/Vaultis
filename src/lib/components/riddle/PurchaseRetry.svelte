<script lang="ts">
	import { walletStore } from '$lib/stores/walletStore';
	import { apiFetch, ApiError } from '$lib/utils/apiClient';
	import { ethers } from 'ethers';
	import { createEventDispatcher } from 'svelte';
	import { alertStore } from '$lib/stores/alertStore';

	export let riddleId: string;
	export let retryCost: number; // Cost in $Y tokens
	export let yTokenAddress: string;
	export let riddleContractAddress: string;

	const dispatch = createEventDispatcher();

	let isLoading = false;
	let transactionHash: string | null = null;
	let error: string | null = null;
	let success = false;

	const Y_TOKEN_ABI = [
		'function approve(address spender, uint256 amount) returns (bool)',
		'function transfer(address to, uint256 amount) returns (bool)',
		'function balanceOf(address account) view returns (uint256)',
		'function decimals() view returns (uint8)'
	];

	let yTokenDecimals: number = 18; // Default to 18, will be fetched dynamically

	// Helper to get token decimals
	async function fetchYTokenDecimals(provider: ethers.BrowserProvider, address: string): Promise<number> {
		try {
			const tokenContract = new ethers.Contract(address, Y_TOKEN_ABI, provider);
			const decimals = await tokenContract.decimals();
			return Number(decimals);
		} catch (e) {
			console.error('Failed to fetch Y token decimals, using default 18:', e);
			return 18; // Fallback to 18 decimals
		}
	}

	const RIDDLE_CONTRACT_ABI = [
		'function purchaseRetry(uint256 riddleId, uint256 cost) returns (bool)'
	];

	async function handlePurchaseRetry() {
		isLoading = true;
		error = null;
		transactionHash = null;
		success = false;

		const walletProvider = $walletStore.provider;
		const walletAddress = $walletStore.walletAddress;

		if (!walletProvider || !walletAddress) {
			error = 'Wallet not connected.';
			alertStore.addAlert({ message: error, type: 'error' });
			isLoading = false;
			return;
		}

		// Validate contract addresses
		if (!yTokenAddress || !ethers.isAddress(yTokenAddress)) {
			error = 'Invalid or missing Y Token contract address.';
			alertStore.addAlert({ message: error, type: 'error' });
			isLoading = false;
			return;
		}
		if (!riddleContractAddress || !ethers.isAddress(riddleContractAddress)) {
			error = 'Invalid or missing Riddle contract address.';
			alertStore.addAlert({ message: error, type: 'error' });
			isLoading = false;
			return;
		}

		// Developer warning for dummy addresses
				if (yTokenAddress === '0x...' || riddleContractAddress === '0x...') {
					console.warn('Using dummy contract addresses. Please replace with real addresses for production.');
				}
		
				try {
					const provider = new ethers.BrowserProvider(walletProvider);
					const signer = await provider.getSigner();
					const network = await provider.getNetwork();
					explorerUrl = getExplorerUrl(Number(network.chainId));
					// Fetch Y token decimals dynamically
					yTokenDecimals = await fetchYTokenDecimals(provider, yTokenAddress);
		
					// 1. Approve the Riddle Contract to spend $Y tokens
					const yTokenContract = new ethers.Contract(yTokenAddress, Y_TOKEN_ABI, signer);
					const amountToApprove = ethers.parseUnits(retryCost.toString(), yTokenDecimals);
		
					alertStore.addAlert({ message: `Approving ${retryCost} $Y tokens...`, type: 'info' });
					const approveTx = await yTokenContract.approve(riddleContractAddress, amountToApprove);
					transactionHash = approveTx.hash;
					await approveTx.wait();
					alertStore.addAlert({ message: 'Approval successful!', type: 'success' });
		
					// 2. Call the Riddle Contract's purchaseRetry function
					const riddleContract = new ethers.Contract(
						riddleContractAddress,
						RIDDLE_CONTRACT_ABI,
						signer
					);
		
					alertStore.addAlert({
						message: `Purchasing retry for Riddle ID: ${riddleId}...`,
						type: 'info'
					});
					const purchaseTx = await riddleContract.purchaseRetry(riddleId, amountToApprove);
					transactionHash = purchaseTx.hash;
					await purchaseTx.wait();
					alertStore.addAlert({ message: 'Retry purchase successful!', type: 'success' });
		
					// 3. Update backend to reflect riddle participation status
					await apiFetch(`/api/riddle/${riddleId}/purchase-retry`, {
						method: 'POST',
						body: {
							riddleId,
							transactionHash: purchaseTx.hash,
							walletAddress
						}
					});
		
					success = true;
					alertStore.addAlert({ message: 'Riddle participation status updated!', type: 'success' });
					dispatch('purchaseSuccess'); // Notify parent component of success
				} catch (e: unknown) {
					if (e instanceof ApiError) {
						error = `API Error: ${e.message} (Status: ${e.status})`;
					} else if (e instanceof Error) {
						error = e.message;
					} else {
						error = 'An unknown error occurred during purchase.';
					}
					alertStore.addAlert({ message: error, type: 'error' });
					console.error('Purchase retry error:', e);
				} finally {
					isLoading = false;
				}
			}
		
			// Helper to get Etherscan-like URL based on chain ID
			function getExplorerUrl(chainId: number): string {
				switch (chainId) {
					case 1: // Mainnet
						return 'https://etherscan.io';
					case 11155111: // Sepolia
						return 'https://sepolia.etherscan.io';
					case 80001: // Polygon Mumbai (example)
						return 'https://mumbai.polygonscan.com';
					// Add other networks as needed
					default:
						return 'https://etherscan.io'; // Fallback to Ethereum Mainnet Etherscan
				}
			}
		
			let explorerUrl: string = 'https://etherscan.io';</script>

<div class="p-4 bg-gray-800 rounded-lg shadow-md text-white">
	<h3 class="text-xl font-semibold mb-4">Purchase Riddle Retry</h3>

	{#if !$walletStore.isConnected}
		<p class="text-red-400 mb-4">Please connect your wallet to purchase a retry.</p>
	{:else if success}
		<p class="text-green-400 mb-4">
			Successfully purchased a retry! You can now attempt the riddle again.
		</p>
		<p class="text-sm text-gray-400">Transaction Hash: {transactionHash}</p>
	{:else}
		<p class="mb-4">
			You can purchase another attempt for this riddle for <span class="font-bold"
				>{retryCost} $Y tokens</span
			>.
		</p>
		<p class="text-sm text-gray-400 mb-4">
			This will allow you to submit another guess for Riddle ID: {riddleId}.
		</p>

		{#if error}
			<p class="text-red-400 mb-4">Error: {error}</p>
		{/if}

		<button
			on:click={handlePurchaseRetry}
			disabled={isLoading || !$walletStore.isConnected}
			class="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:bg-gray-600 w-full transition-colors
			duration-200 disabled:cursor-not-allowed"
		>
			{#if isLoading}
				Processing...
			{:else}
				Purchase Retry
			{/if}
		</button>

		{#if transactionHash}
			<p class="mt-4 text-sm text-gray-400">
				Transaction in progress: <a
					href="{explorerUrl}/tx/{transactionHash}"
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-400 hover:underline">View on Explorer</a
				>
			</p>
		{/if}
	{/if}
</div>
