<script>
    /**
     * App Component
     * Main application component - coordinates data flow between child components
     */

    import {onMount} from "svelte";
    import Filters from "./lib/Filters.svelte";
    import SpellDetail from './lib/SpellDetail.svelte';
    import SpellList from './lib/SpellList.svelte';
    import CacheStats from './lib/CacheStats.svelte';
    import ThemeToggle from './lib/ThemeToggle.svelte';
    import { fetchSpells, fetchSpellDetails, fetchClasses } from './lib/api.svelte.js';
    import { renderSpellDescription } from './lib/markdown.svelte.js';

    /**
     * @typedef {import('./types.svelte.js').SpellDetailData} SpellDetailData
     * @typedef {import('./types.svelte.js').Spell} Spell
     * @typedef {import('./types.svelte.js').DndClass} DndClass
     */

    // Application state
    /** @type {Spell[]} */
    let allSpells = [];
    let isLoading = true;
    /** @type {string | null} */
    let error = null;
    let searchQuery = '';

    /** @type {SpellDetailData | null} */
    let selectedSpellDetails = null;
    let isDetailLoading = false;

    // Filter state
    let selectedLevel = 'all';
    let selectedClass = 'all';
    /** @type {DndClass[]} */
    let allDndClasses = [];

    const spellLevels = [0,1,2,3,4,5,6,7,8,9];

    /**
     * Load spell list based on current filters
     */
    async function loadSpellList() {
        isLoading = true;
        error = null;

        try {
            allSpells = await fetchSpells({
                classIndex: selectedClass,
                level: selectedLevel
            });
        } catch (err) {
            error = err instanceof Error ? err.message : String(err);
        } finally {
            isLoading = false;
        }
    }

    /**
     * Load list of D&D classes for filter dropdown
     */
    async function loadClasses() {
        try {
            allDndClasses = await fetchClasses();
        } catch (err) {
            console.error("Could not fetch D&D classes", err);
        }
    }

    onMount(() => {
        loadSpellList();
        loadClasses();
    });

    function handleLevelChange() {
        if (selectedLevel !== 'all') {
            selectedClass = 'all';
        }
        loadSpellList();
    }

    function handleClassChange() {
        if (selectedClass !== 'all') {
            selectedLevel = 'all';
        }
        loadSpellList();
    }

    /**
     * Load detailed information for a selected spell
     * @param {string} spellUrl - API URL for the spell
     */
    async function selectSpell(spellUrl) {
        isDetailLoading = true;
        selectedSpellDetails = null;

        try {
            selectedSpellDetails = await fetchSpellDetails(spellUrl);
        } catch (err) {
            error = err instanceof Error ? err.message : String(err);
        } finally {
            isDetailLoading = false;
        }
    }

    /**
     * Clear the currently selected spell
     */
    function clearSelection() {
        selectedSpellDetails = null;
    }

    // Reactive statements - automatically update when dependencies change
    $: filteredSpells = allSpells.filter(spell =>
        spell.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    $: renderedDescription = renderSpellDescription(selectedSpellDetails);

</script>

<div class="min-h-screen">
    <!-- Header -->
    <header class="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600
                   dark:from-purple-900 dark:via-violet-900 dark:to-indigo-900
                   shadow-2xl">
        <div class="container mx-auto px-4 py-8">
            <div class="text-center">
                <h1 class="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
                    ✨ D&D 5e Spellbook ✨
                </h1>
                <p class="text-purple-100 dark:text-purple-200 text-lg md:text-xl">
                    Discover and explore magical spells from the world's greatest roleplaying game
                </p>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
            <!-- Left Panel - Filters & Spell List -->
            <div class="w-full md:w-1/3 {selectedSpellDetails ? 'hidden' : 'block'} md:block">
                <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sticky top-4">
                    <Filters
                            {spellLevels}
                            {allDndClasses}
                            bind:searchQuery={searchQuery}
                            bind:selectedLevel={selectedLevel}
                            bind:selectedClass={selectedClass}
                            on:levelChange={handleLevelChange}
                            on:classChange={handleClassChange}
                    />

                    <SpellList
                            {isLoading}
                            {error}
                            {filteredSpells}
                            {selectedSpellDetails}
                            on:selectSpell={(event) => selectSpell(event.detail)}
                    />
                </div>
            </div>

            <!-- Right Panel - Spell Details -->
            <div class="w-full md:w-2/3 {selectedSpellDetails ? 'block' : 'hidden'} md:block">
                <SpellDetail
                        {isDetailLoading}
                        {selectedSpellDetails}
                        {renderedDescription}
                        on:clearselection={clearSelection}
                />
            </div>
        </div>
    </main>

    <!-- Theme Toggle -->
    <ThemeToggle />

    <!-- Cache Stats Widget -->
    <CacheStats />
</div>