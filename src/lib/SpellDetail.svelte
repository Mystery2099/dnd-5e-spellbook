<script>
    /**
     * SpellDetail Component
     * Displays detailed information about a selected spell
     * Shows loading state, spell stats, and rendered markdown description
     *
     * @component
     * @fires clearselection - Dispatched when user wants to clear the selected spell
     */

    import { createEventDispatcher } from 'svelte';

    /**
     * @typedef {import('../types.svelte.js').SpellDetailData} SpellDetailData
     */

    // Data coming IN from App.svelte
    /** @type {boolean} - Loading state for spell details */
    export let isDetailLoading = false;

    /** @type {SpellDetailData | null} - The selected spell's full data */
    export let selectedSpellDetails = null;

    /** @type {string} - Pre-rendered HTML from markdown description */
    export let renderedDescription = '';

    const dispatch = createEventDispatcher();

    /**
     * Clear the selected spell (mobile back button)
     * Dispatches event to parent component
     */
    function handleClear() {
        dispatch('clearselection');
    }
</script>

<div class="w-full md:sticky md:top-4 md:max-h-[85vh] md:overflow-y-auto">
    {#if isDetailLoading}
        <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl
                    border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div class="flex flex-col items-center justify-center py-8">
                <div class="relative">
                    <div class="w-20 h-20 border-4 border-purple-200 border-t-purple-600
                                dark:border-purple-800 dark:border-t-purple-400
                                rounded-full animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-3xl">🔮</span>
                    </div>
                </div>
                <p class="mt-4 text-gray-600 dark:text-gray-300 text-lg font-medium">Deciphering ancient texts...</p>
            </div>
        </div>
    {:else if selectedSpellDetails}
        <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl
                    border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- Mobile Back Button -->
            <button class="w-full md:hidden bg-gradient-to-r from-purple-600 to-pink-600
                           dark:from-purple-700 dark:to-pink-700
                           text-white px-6 py-4 text-left font-semibold flex items-center gap-2
                           hover:from-purple-700 hover:to-pink-700
                           dark:hover:from-purple-800 dark:hover:to-pink-800
                           transition-all"
                    on:click={handleClear}>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Back to spell list
            </button>

            <!-- Spell Header -->
            <div class="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600
                        dark:from-purple-800 dark:via-violet-800 dark:to-indigo-800
                        px-8 py-6">
                <h2 class="text-4xl font-bold text-white mb-2 drop-shadow-lg">{selectedSpellDetails?.name}</h2>
                <div class="flex flex-wrap gap-2">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
                                 bg-white/20 dark:bg-white/30 text-white backdrop-blur-sm">
                        ⭐ Level {selectedSpellDetails?.level}
                    </span>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
                                 bg-white/20 dark:bg-white/30 text-white backdrop-blur-sm">
                        🎯 {selectedSpellDetails?.school.name}
                    </span>
                </div>
            </div>

            <!-- Spell Details -->
            <div class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4
                                border-2 border-purple-200 dark:border-purple-700">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xl">⏱️</span>
                            <span class="text-sm font-semibold text-purple-900 dark:text-purple-300">Casting Time</span>
                        </div>
                        <p class="text-gray-800 dark:text-gray-200 font-medium">{selectedSpellDetails.casting_time}</p>
                    </div>
                    <div class="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4
                                border-2 border-blue-200 dark:border-blue-700">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xl">📏</span>
                            <span class="text-sm font-semibold text-blue-900 dark:text-blue-300">Range</span>
                        </div>
                        <p class="text-gray-800 dark:text-gray-200 font-medium">{selectedSpellDetails?.range}</p>
                    </div>
                </div>

                <!-- Description -->
                <div class="mt-6 prose prose-lg dark:prose-invert max-w-none
                            prose-headings:text-purple-900 dark:prose-headings:text-purple-300
                            prose-p:text-gray-700 dark:prose-p:text-gray-300
                            prose-strong:text-purple-800 dark:prose-strong:text-purple-300
                            prose-table:border-collapse
                            prose-th:border prose-th:p-3 prose-th:bg-purple-100 dark:prose-th:bg-purple-900/40
                            prose-td:border prose-td:p-3 dark:prose-td:border-gray-600
                            prose-a:text-purple-600 dark:prose-a:text-purple-400">
                    {@html renderedDescription}
                </div>
            </div>
        </div>
    {:else}
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center
                    border-2 border-dashed border-purple-300 dark:border-purple-600">
            <div class="text-6xl mb-4">📖</div>
            <p class="text-gray-600 dark:text-gray-300 text-lg font-medium">Select a spell to view its magical details</p>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">Click on any spell from the list to begin</p>
        </div>
    {/if}
</div>