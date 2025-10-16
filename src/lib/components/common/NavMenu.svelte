<script lang="ts">
	import { page } from '$app/stores';

	let isMenuOpen = false;

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};

	const navLinks = [
		{ name: 'Home', href: '/' },
		{ name: 'Daily Riddle', href: '/daily-riddle' },
		{ name: 'Leaderboard', href: '/leaderboard' }
	];
</script>

<nav class="bg-gray-800 p-4">
	<div class="container mx-auto flex items-center justify-between">
		<a href="/" class="text-white text-lg font-bold">Vaultis</a>

		<!-- Hamburger menu button for small screens -->
		<div class="md:hidden">
			<button
				on:click={toggleMenu}
				class="text-white focus:outline-none"
				aria-label="Toggle navigation menu"
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
					></path>
				</svg>
			</button>
		</div>

		<!-- Navigation links for larger screens -->
		<div class="md:flex space-x-4 hidden">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
					class:bg-gray-900={link.href === $page.url.pathname}
					class:text-white={link.href === $page.url.pathname}>{link.name}</a
				>
			{/each}
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	{#if isMenuOpen}
		<div class="md:hidden">
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium block"
						class:bg-gray-900={link.href === $page.url.pathname}
						class:text-white={link.href === $page.url.pathname}
						on:click={toggleMenu}>{link.name}</a
					>
				{/each}
			</div>
		</div>
	{/if}
</nav>
