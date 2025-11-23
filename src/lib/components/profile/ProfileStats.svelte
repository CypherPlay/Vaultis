<script lang="ts">
  export let wins: number;
  export let totalAttempts: number;
  export let tokenExpenditure: number;
  export let retryUsage: number;
</script>

<div class="grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg shadow-md">
  <div class="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-md">
    <span class="text-2xl font-bold text-green-400">{wins}</span>
    <span class="text-sm text-gray-300">Wins</span>
  </div>
  <div class="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-md">
    <span class="text-2xl font-bold text-blue-400">{totalAttempts}</span>
    <span class="text-sm text-gray-300">Total Attempts</span>
  </div>
  <div class="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-md">
    <span class="text-2xl font-bold text-purple-400">{tokenExpenditure}</span>
    <span class="text-sm text-gray-300">Token Expenditure</span>
  </div>
  <div class="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-md">
    <span class="text-2xl font-bold text-red-400">{retryUsage}</span>
    <span class="text-sm text-gray-300">Retry Usage</span>
  </div>
</div>
