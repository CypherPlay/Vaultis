<script lang="ts">
  let guess: string = "";
  const entryFee: number = 5; // Example entry fee in tokens

  function handleSubmit() {
    if (guess.trim() === "") {
      alert("Please enter your guess before submitting.");
      return;
    }
    // TODO: Implement actual guess submission logic
    console.log("Submitting guess:", guess);
    alert(`Guess "${guess}" submitted! (Entry fee: $${entryFee} tokens)`);
    guess = ""; // Clear the input after submission
  }
</script>

<div class="p-4 border rounded-lg shadow-md bg-white">
  <h2 class="text-xl font-semibold mb-4">Submit Your Guess</h2>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="mb-4">
      <label for="guess" class="block text-sm font-medium text-gray-700">Your Guess:</label>
      <input
        type="text"
        id="guess"
        name="guess"
        bind:value={guess}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder="Enter your guess here"
      />
    </div>
    <div class="text-sm text-gray-500 mb-4">
      Entry Fee: ${entryFee} tokens per guess.
    </div>
    <button
      type="submit"
      class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Submit Guess
    </button>
  </form>
</div>
