<script lang="ts">
  import MainLayout from '../../lib/layouts/MainLayout.svelte';
  import DailyRiddleDisplay from '../../lib/components/riddle/DailyRiddleDisplay.svelte';
  import GuessSubmission from '../../lib/components/riddle/GuessSubmission.svelte';
</script>

<MainLayout>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md mb-8">
      <DailyRiddleDisplay />
    </div>
    <div class="w-full max-w-md">
      <GuessSubmission />
    </div>
  </div>
</MainLayout>