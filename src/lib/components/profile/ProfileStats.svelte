<script lang="ts">
  export let wins: number;
  export let totalAttempts: number;
  export let tokenExpenditure: number;
  export let retryUsage: number;
</script>

<dl class="grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg shadow-md">
  <div class="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-md">
    <dd class="text-2xl font-bold text-green-400">{wins}</dd>
    <dt class="text-sm text-gray-300">Wins</dt>
  </div>
  <div class="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-md">
    <dd class="text-2xl font-bold text-blue-400">{totalAttempts}</dd>
    <dt class="text-sm text-gray-300">Total Attempts</dt>
  </div>
  <div class="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-md">
    <dd class="text-2xl font-bold text-purple-400">{tokenExpenditure}</dd>
    <dt class="text-sm text-gray-300">Token Expenditure</dt>
  </div>
  <div class="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-md">
    <dd class="text-2xl font-bold text-red-400">{retryUsage}</dd>
    <dt class="text-sm text-gray-300">Retry Usage</dt>
  </div>
</dl>
