<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  let remainingTime = -1;
  let interval: number;
  const dispatch = createEventDispatcher();

  // Calculate the end of the current day in UTC for the riddle reset
  function getRiddleEndTime(): Date {
    const now = new Date();
    // Set to the next midnight UTC
    const nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
    return nextMidnight;
  }

  let riddleEndTime: Date;

  function updateCountdown() {
    const now = new Date();
    remainingTime = Math.max(0, riddleEndTime.getTime() - now.getTime());

    if (remainingTime === 0) {
      clearInterval(interval);
      dispatch('riddleExpired');
    }
  }

  onMount(() => {
    riddleEndTime = getRiddleEndTime();
    updateCountdown(); // Initial call to set the time immediately
    interval = setInterval(updateCountdown, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  // Reactive declaration to format the time
  $: formattedTime = formatTime(remainingTime);

  function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(unit => unit.toString().padStart(2, '0'))
      .join(':');
  }
</script>

<div class="text-center p-4 bg-gray-800 text-white rounded-lg shadow-lg max-w-xs mx-auto">
  <h3 class="text-lg font-semibold mb-2">Next riddle unlocks in:</h3>
  {#if remainingTime === -1}
    <p class="text-2xl font-bold text-gray-400">Loading...</p>
  {:else if remainingTime > 0}
    <p class="text-4xl font-bold tracking-wide">{formattedTime}</p>
  {:else}
    <p class="text-2xl font-bold text-green-400">New riddle available!</p>
    <p class="text-sm text-gray-400 mt-1">Refreshing soon...</p>
  {/if}
</div>
