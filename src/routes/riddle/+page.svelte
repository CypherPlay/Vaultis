<script lang="ts">
	import MainLayout from '../../lib/layouts/MainLayout.svelte';
	import DailyRiddleDisplay from '../../lib/components/riddle/DailyRiddleDisplay.svelte';
	import GuessSubmission from '../../lib/components/riddle/GuessSubmission.svelte';
</script>

<MainLayout>
	<div class="p-4 flex flex-1 flex-col items-center justify-center">
		<div class="max-w-md mb-8 w-full">
			<DailyRiddleDisplay />
		</div>
		<div class="max-w-md w-full">
			<GuessSubmission />
		</div>
	</div>
</MainLayout>
