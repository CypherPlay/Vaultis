<script>
  import Header from '../components/common/Header.svelte';
  import Footer from '../components/common/Footer.svelte';
  import Navigation from '../components/common/Navigation.svelte';
</script>

<div class="flex flex-col min-h-screen">
  <Header title="Vaultis Dashboard" />
  <Navigation />
  <main class="flex-grow p-4">
    <slot />
  </main>
  <Footer />
</div>