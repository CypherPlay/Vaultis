<script>
	import Header from '../components/common/Header.svelte';
	import Footer from '../components/common/Footer.svelte';
	import NavMenu from '../components/common/NavMenu.svelte';
	import AlertDisplay from '../components/common/AlertDisplay.svelte';
</script>

<div class="flex min-h-screen flex-col">
	<Header title="Vaultis Dashboard" />
	<NavMenu />
	<main class="p-4 flex-grow max-w-screen-xl mx-auto">
		<slot />
	</main>
	<Footer />
	<AlertDisplay />
</div>
