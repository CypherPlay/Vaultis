<script>
	import Header from '../components/common/Header.svelte';
	import Footer from '../components/common/Footer.svelte';
	import NavMenu from '../components/common/NavMenu.svelte';
	import Alert from '../components/common/Alert.svelte';
	import ToastContainer from '../components/common/ToastContainer.svelte';
</script>

<div class="flex min-h-screen flex-col">
	<Header title="Vaultis Dashboard" />
	<NavMenu />
	<main class="p-4 max-w-screen-xl mx-auto flex-grow">
		<slot />
	</main>
	<Footer />
	<Alert />
	<ToastContainer />
</div>
