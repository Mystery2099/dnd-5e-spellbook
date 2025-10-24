<script>
    /**
     * @typedef {import('../types.svelte.js').DndClass} DndClass
     */

    import {createEventDispatcher} from "svelte";

    // Props (Data coming IN from App.svelte)
    /** @type {number[]} - Array of spell levels (0-9) */
    export let spellLevels = [];

    /** @type {DndClass[]} - Array of D&D classes */
    export let allDndClasses = [];

    // Bindable Props (Data going IN & OUT)
    /** @type {string} - Search query for filtering spells by name */
    export let searchQuery = '';

    /** @type {string | number} - Selected spell level or 'all' */
    export let selectedLevel = 'all';

    /** @type {string} - Selected D&D class index or 'all' */
    export let selectedClass = 'all';

    // Event dispatcher to send messages OUT
    // Dispatches: 'levelChange' and 'classChange' events
    const dispatch = createEventDispatcher();

    /**
     * Handle spell level filter change
     * Clears class filter when level is selected
     */
    function handleLevelChange() {
        if (selectedLevel !== 'all') {
            selectedClass = 'all';
        }
        dispatch('levelChange');
    }

    /**
     * Handle D&D class filter change
     * Clears level filter when class is selected
     */
    function handleClassChange() {
        if (selectedClass !== 'all') {
            selectedLevel = 'all';
        }
        dispatch('classChange');
    }
</script>

<div class="space-y-4 mb-6">
    <!-- Search Input -->
    <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
        </div>
        <input
                type="search"
                placeholder="Search for a spell..."
                class="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl
                       focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                       dark:focus:border-purple-400 dark:focus:ring-purple-900
                       bg-white
                       transition-all duration-200"
                bind:value={searchQuery}
        />
    </div>

    <!-- Filter Dropdowns -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="relative">
            <select
                    class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl appearance-none
                           focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white
                           dark:focus:border-purple-400 dark:focus:ring-purple-900
                           cursor-pointer transition-all duration-200
                           bg-white pr-10"
                    bind:value={selectedLevel}
                    on:change={handleLevelChange}>
                <option value="all">🎯 All Levels</option>
                {#each spellLevels as level}
                    <option value={level}>{level === 0 ? '✨ Cantrip' : `⭐ Level ${level}`}</option>
                {/each}
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </div>
        </div>

        <div class="relative">
            <select
                    class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl appearance-none
                           focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white
                           dark:focus:border-purple-400 dark:focus:ring-purple-900
                           cursor-pointer transition-all duration-200
                           bg-white pr-10"
                    bind:value={selectedClass}
                    on:change={handleClassChange}>
                <option value="all">🎭 All Classes</option>
                {#each allDndClasses as dndClass (dndClass.index)}
                    <option value={dndClass.index}>{dndClass.name}</option>
                {/each}
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </div>
        </div>
    </div>
</div>