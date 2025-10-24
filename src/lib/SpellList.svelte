<script>
    /**
     * SpellList Component
     * Displays a scrollable list of spells with loading and error states
     * Highlights the currently selected spell
     *
     * @component
     * @fires selectSpell - Dispatched when a spell is clicked, passes spell URL
     */

    import { createEventDispatcher } from 'svelte';

    /**
     * @typedef {import('../types.svelte.js').SpellDetailData} SpellDetailData
     * @typedef {import('../types.svelte.js').Spell} Spell
     */

    // Data coming IN from App.svelte
    export let isLoading = true;
    export let error = null;
    /** @type {Spell[]} */
    export let filteredSpells = [];
    /** @type {SpellDetailData | null} */
    export let selectedSpellDetails = null; // Needed for the 'active' highlight

    const dispatch = createEventDispatcher();

    /**
     * Function to tell App.svelte which spell was clicked
     * @param {string} spellUrl
     */
    function handleSpellClick(spellUrl) {
        dispatch('selectSpell', spellUrl); // Dispatch 'selectSpell' event with the URL
    }
</script>

{#if isLoading}
    <div class="flex flex-col items-center justify-center py-12">
        <div class="relative">
            <div class="w-16 h-16 border-4 border-purple-200 border-t-purple-600
                        dark:border-purple-800 dark:border-t-purple-400
                        rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl">✨</span>
            </div>
        </div>
        <p class="mt-4 text-gray-600 dark:text-gray-300 font-medium">Summoning spells...</p>
    </div>
{:else if error}
    <div class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <div class="text-4xl mb-2">⚠️</div>
        <p class="text-red-600 dark:text-red-300 font-semibold">Error: {error}</p>
    </div>
{:else}
    <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {#each filteredSpells as spell (spell.index)}
            <button
                    class="w-full p-4 text-left rounded-xl border-2 transition-all duration-200
                           transform hover:scale-[1.02] hover:shadow-lg
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                           dark:focus:ring-purple-400 dark:focus:ring-offset-gray-800
                           {selectedSpellDetails?.index === spell.index
                               ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 shadow-md dark:from-purple-900/50 dark:to-pink-900/50 dark:border-purple-500'
                               : 'bg-white border-gray-200 hover:border-purple-300 dark:bg-gray-700/80 dark:border-gray-600 dark:hover:border-purple-400'}"
                    on:click={() => handleSpellClick(spell.url)}
            >
                <div class="flex items-center gap-2">
                    <span class="text-xl">📜</span>
                    <h2 class="font-semibold text-gray-800 dark:text-gray-100">{spell.name}</h2>
                </div>
            </button>
        {/each}
    </div>
{/if}