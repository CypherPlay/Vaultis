<script lang="ts">
	export let title: string = 'Vaultis'; // Default title
</script>

<header class="bg-gray-800 text-white p-4 shadow-md">
	<div class="md:flex-nowrap container mx-auto flex flex-wrap items-center justify-between">
		<!-- Logo Area -->
		<div class="text-white mr-6 flex flex-shrink-0 items-center">
			<a href="/" class="flex items-center">
				<img src="/src/lib/assets/favicon.svg" alt="Logo" class="h-8 w-8 mr-2" />
				<span class="font-semibold text-xl tracking-tight">Vaultis</span>
			</a>
		</div>

		<!-- Dynamic Title Section -->
		<div
			class="md:flex md:items-center md:w-auto md:text-left mt-4 md:mt-0 block w-full flex-grow text-center"
		>
			<h1 class="text-2xl font-bold">{title}</h1>
		</div>

		<!-- Wallet Connect Button Placeholder -->
		<div class="md:w-auto md:text-right mt-4 md:mt-0 w-full text-center">
			<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
				Connect Wallet
			</button>
		</div>
	</div>
</header>
