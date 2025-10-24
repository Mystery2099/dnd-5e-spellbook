# Directory Structure

```
📁 src/
├── 📄 App.svelte
├── 📄 app.css
│   📁 assets/
│   └── 📄 svelte.svg
│   📁 lib/
│   ├── 📄 CacheStats.svelte
│   ├── 📄 Filters.svelte
│   ├── 📄 SpellDetail.svelte
│   ├── 📄 SpellList.svelte
│   ├── 📄 ThemeToggle.svelte
│   ├── 📄 api.svelte.js
│   ├── 📄 cache.svelte.js
│   └── 📄 markdown.svelte.js
├── 📄 main.js
└── 📄 types.svelte.js
```

# File Contents

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/App.svelte
```svelte
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
```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/app.css
```css
@import "tailwindcss";
@import "tailwindcss/utilities";
@tailwind utilities;
@plugin "@tailwindcss/typography";

:root {
  /* Custom color palette */
  --primary: #8b5cf6;
  --primary-dark: #7c3aed;
  --primary-light: #a78bfa;
  --accent: #ec4899;
  --accent-dark: #db2777;

  /* D&D themed colors */
  --magic-purple: #8b5cf6;
  --arcane-blue: #3b82f6;
  --divine-gold: #f59e0b;

  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  font-weight: 400;

  color-scheme: light dark;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: background 0.3s ease;
}

.dark body {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e293b 100%);
}

#app {
  width: 100%;
  min-height: 100vh;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.7);
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/assets/svelte.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="26.6" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 308"><path fill="#FF3E00" d="M239.682 40.707C211.113-.182 154.69-12.301 113.895 13.69L42.247 59.356a82.198 82.198 0 0 0-37.135 55.056a86.566 86.566 0 0 0 8.536 55.576a82.425 82.425 0 0 0-12.296 30.719a87.596 87.596 0 0 0 14.964 66.244c28.574 40.893 84.997 53.007 125.787 27.016l71.648-45.664a82.182 82.182 0 0 0 37.135-55.057a86.601 86.601 0 0 0-8.53-55.577a82.409 82.409 0 0 0 12.29-30.718a87.573 87.573 0 0 0-14.963-66.244"></path><path fill="#FFF" d="M106.889 270.841c-23.102 6.007-47.497-3.036-61.103-22.648a52.685 52.685 0 0 1-9.003-39.85a49.978 49.978 0 0 1 1.713-6.693l1.35-4.115l3.671 2.697a92.447 92.447 0 0 0 28.036 14.007l2.663.808l-.245 2.659a16.067 16.067 0 0 0 2.89 10.656a17.143 17.143 0 0 0 18.397 6.828a15.786 15.786 0 0 0 4.403-1.935l71.67-45.672a14.922 14.922 0 0 0 6.734-9.977a15.923 15.923 0 0 0-2.713-12.011a17.156 17.156 0 0 0-18.404-6.832a15.78 15.78 0 0 0-4.396 1.933l-27.35 17.434a52.298 52.298 0 0 1-14.553 6.391c-23.101 6.007-47.497-3.036-61.101-22.649a52.681 52.681 0 0 1-9.004-39.849a49.428 49.428 0 0 1 22.34-33.114l71.664-45.677a52.218 52.218 0 0 1 14.563-6.398c23.101-6.007 47.497 3.036 61.101 22.648a52.685 52.685 0 0 1 9.004 39.85a50.559 50.559 0 0 1-1.713 6.692l-1.35 4.116l-3.67-2.693a92.373 92.373 0 0 0-28.037-14.013l-2.664-.809l.246-2.658a16.099 16.099 0 0 0-2.89-10.656a17.143 17.143 0 0 0-18.398-6.828a15.786 15.786 0 0 0-4.402 1.935l-71.67 45.674a14.898 14.898 0 0 0-6.73 9.975a15.9 15.9 0 0 0 2.709 12.012a17.156 17.156 0 0 0 18.404 6.832a15.841 15.841 0 0 0 4.402-1.935l27.345-17.427a52.147 52.147 0 0 1 14.552-6.397c23.101-6.006 47.497 3.037 61.102 22.65a52.681 52.681 0 0 1 9.003 39.848a49.453 49.453 0 0 1-22.34 33.12l-71.664 45.673a52.218 52.218 0 0 1-14.563 6.398"></path></svg>
```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/lib/CacheStats.svelte
```svelte
<script>
    import { apiCache } from './cache.svelte.js';
    
    let stats = { size: 0, keys: [] };
    let isExpanded = false;
    
    // Update stats every second
    setInterval(() => {
        stats = apiCache.getStats();
    }, 1000);
    
    function clearCache() {
        apiCache.clear();
        stats = apiCache.getStats();
    }
    
    function toggleExpanded() {
        isExpanded = !isExpanded;
    }
</script>

<div class="fixed bottom-4 right-4 z-50">
    <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl 
                border-2 border-purple-300 dark:border-purple-600 overflow-hidden
                transition-all duration-300 {isExpanded ? 'w-80' : 'w-auto'}">
        <!-- Header -->
        <button 
            class="w-full px-4 py-3 flex items-center justify-between gap-3 
                   hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            on:click={toggleExpanded}>
            <div class="flex items-center gap-2">
                <span class="text-xl">💾</span>
                <div class="text-left">
                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Cache
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                        {stats.size} {stats.size === 1 ? 'entry' : 'entries'}
                    </div>
                </div>
            </div>
            <svg 
                class="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 
                       {isExpanded ? 'rotate-180' : ''}" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
        </button>
        
        <!-- Expanded Content -->
        {#if isExpanded}
            <div class="border-t border-purple-200 dark:border-purple-700 p-4">
                <!-- Cache Keys -->
                {#if stats.size > 0}
                    <div class="mb-3">
                        <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Cached URLs:
                        </h4>
                        <div class="space-y-1 max-h-40 overflow-y-auto">
                            {#each stats.keys as key}
                                <div class="text-xs text-gray-600 dark:text-gray-400 
                                           bg-gray-50 dark:bg-gray-700/50 rounded px-2 py-1 
                                           truncate" title={key}>
                                    {key.replace('https://www.dnd5eapi.co', '...')}
                                </div>
                            {/each}
                        </div>
                    </div>
                    
                    <!-- Clear Button -->
                    <button 
                        class="w-full px-3 py-2 bg-red-500 hover:bg-red-600 
                               text-white text-sm font-semibold rounded-lg 
                               transition-colors duration-200"
                        on:click={clearCache}>
                        Clear Cache
                    </button>
                {:else}
                    <p class="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                        No cached data
                    </p>
                {/if}
                
                <!-- Info -->
                <div class="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        💡 Cache reduces API calls and improves performance
                    </p>
                </div>
            </div>
        {/if}
    </div>
</div>


```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/lib/Filters.svelte
```svelte
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
```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/lib/SpellDetail.svelte
```svelte
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
```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/lib/SpellList.svelte
```svelte
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
```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/lib/ThemeToggle.svelte
```svelte
<script>
    import { onMount } from 'svelte';

    /**
     * @typedef {'system' | 'light' | 'dark'} ThemeMode
     */

    /** @type {ThemeMode} */
    let themeMode = 'system';
    let isExpanded = false;
    let systemPrefersDark = false;

    onMount(() => {
        // Check localStorage for saved preference
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode === 'system' || savedMode === 'light' || savedMode === 'dark') {
            themeMode = savedMode;
        }

        // Get system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        systemPrefersDark = mediaQuery.matches;

        // Listen for system preference changes
        mediaQuery.addEventListener('change', (e) => {
            systemPrefersDark = e.matches;
            if (themeMode === 'system') {
                applyTheme();
            }
        });

        applyTheme();
    });

    function applyTheme() {
        const shouldBeDark = themeMode === 'dark' || (themeMode === 'system' && systemPrefersDark);

        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    /**
     * @param {ThemeMode} mode
     */
    function setTheme(mode) {
        themeMode = mode;
        localStorage.setItem('themeMode', mode);
        applyTheme();
        isExpanded = false;
    }

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }

    // Computed value for current effective theme
    $: effectiveTheme = themeMode === 'system'
        ? (systemPrefersDark ? 'dark' : 'light')
        : themeMode;
</script>

<div class="fixed top-4 right-4 z-50">
    <div class="relative">
        <!-- Toggle Button -->
        <button
            on:click={toggleExpanded}
            class="p-3 rounded-full bg-white/90 dark:bg-gray-800/90
                   backdrop-blur-sm shadow-lg border-2 border-purple-200 dark:border-purple-700
                   hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2
                   focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Theme settings"
        >
            {#if effectiveTheme === 'dark'}
                <!-- Moon icon -->
                <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
            {:else}
                <!-- Sun icon -->
                <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
            {/if}
        </button>

        <!-- Dropdown Menu -->
        {#if isExpanded}
            <div class="absolute top-full right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95
                        backdrop-blur-sm rounded-xl shadow-2xl border-2 border-purple-200
                        dark:border-purple-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div class="p-2">
                    <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Theme
                    </div>

                    <!-- System Option -->
                    <button
                        on:click={() => setTheme('system')}
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                               hover:bg-purple-50 dark:hover:bg-purple-900/20
                               transition-colors duration-150
                               {themeMode === 'system' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}"
                    >
                        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <div class="flex-1 text-left">
                            <div class="text-sm font-medium text-gray-800 dark:text-gray-100">
                                System
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                Use system preference
                            </div>
                        </div>
                        {#if themeMode === 'system'}
                            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                        {/if}
                    </button>

                    <!-- Light Option -->
                    <button
                        on:click={() => setTheme('light')}
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                               hover:bg-purple-50 dark:hover:bg-purple-900/20
                               transition-colors duration-150
                               {themeMode === 'light' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}"
                    >
                        <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                        <div class="flex-1 text-left">
                            <div class="text-sm font-medium text-gray-800 dark:text-gray-100">
                                Light
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                Light theme
                            </div>
                        </div>
                        {#if themeMode === 'light'}
                            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                        {/if}
                    </button>

                    <!-- Dark Option -->
                    <button
                        on:click={() => setTheme('dark')}
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                               hover:bg-purple-50 dark:hover:bg-purple-900/20
                               transition-colors duration-150
                               {themeMode === 'dark' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}"
                    >
                        <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                        </svg>
                        <div class="flex-1 text-left">
                            <div class="text-sm font-medium text-gray-800 dark:text-gray-100">
                                Dark
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                Dark theme
                            </div>
                        </div>
                        {#if themeMode === 'dark'}
                            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                        {/if}
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>


```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/lib/api.svelte.js
```js
/**
 * API Service Module
 * Handles all interactions with the D&D 5e API
 */

import { cachedFetch } from './cache.svelte.js';

const API_DOMAIN = "https://www.dnd5eapi.co";
const API_BASE_URL = `${API_DOMAIN}/api/`;

// Cache durations in milliseconds
const CACHE_DURATION = {
    SPELL_LIST: 10 * 60 * 1000,  // 10 minutes
    SPELL_DETAIL: 15 * 60 * 1000, // 15 minutes
    CLASSES: 30 * 60 * 1000       // 30 minutes
};

/**
 * Build URL for fetching spells based on filters
 * @param {Object} filters - Filter options
 * @param {string} filters.classIndex - D&D class index or 'all'
 * @param {string | number} filters.level - Spell level or 'all'
 * @returns {string} - Complete API URL
 */
function buildSpellListUrl(filters) {
    const { classIndex, level } = filters;
    
    if (classIndex !== 'all') {
        return `${API_BASE_URL}classes/${classIndex}/spells`;
    } else if (level !== 'all') {
        return `${API_BASE_URL}spells?level=${level}`;
    } else {
        return `${API_BASE_URL}spells`;
    }
}

/**
 * Fetch list of spells based on filters
 * @param {Object} filters - Filter options
 * @param {string} filters.classIndex - D&D class index or 'all'
 * @param {string | number} filters.level - Spell level or 'all'
 * @returns {Promise<Array>} - Array of spell objects
 * @throws {Error} - If fetch fails
 */
export async function fetchSpells(filters) {
    const url = buildSpellListUrl(filters);
    const data = await cachedFetch(url, CACHE_DURATION.SPELL_LIST);
    return data.results;
}

/**
 * Fetch detailed information for a specific spell
 * @param {string} spellUrl - Relative URL for the spell (e.g., '/api/spells/fireball')
 * @returns {Promise<Object>} - Spell detail object
 * @throws {Error} - If fetch fails
 */
export async function fetchSpellDetails(spellUrl) {
    const fullUrl = `${API_DOMAIN}${spellUrl}`;
    return await cachedFetch(fullUrl, CACHE_DURATION.SPELL_DETAIL);
}

/**
 * Fetch list of all D&D classes
 * @returns {Promise<Array>} - Array of class objects
 * @throws {Error} - If fetch fails
 */
export async function fetchClasses() {
    const url = `${API_BASE_URL}classes`;
    const data = await cachedFetch(url, CACHE_DURATION.CLASSES);
    return data.results;
}


```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/lib/cache.svelte.js
```js
/**
 * Simple in-memory cache for API responses
 * Stores data with timestamps to allow for cache expiration
 */

/**
 * @typedef {Object} CacheEntry
 * @property {any} data - The cached data
 * @property {number} timestamp - When the data was cached (milliseconds)
 */

class ApiCache {
    constructor() {
        /** @type {Map<string, CacheEntry>} */
        this.cache = new Map();
        
        // Cache duration in milliseconds (default: 5 minutes)
        this.defaultTTL = 5 * 60 * 1000;
    }

    /**
     * Get data from cache if it exists and is not expired
     * @param {string} key - Cache key
     * @param {number} [ttl] - Time to live in milliseconds (optional, uses default if not provided)
     * @returns {any | null} - Cached data or null if not found/expired
     */
    get(key, ttl = this.defaultTTL) {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return null;
        }

        const now = Date.now();
        const age = now - entry.timestamp;

        // Check if cache entry has expired
        if (age > ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Store data in cache
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     */
    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Check if a key exists in cache and is not expired
     * @param {string} key - Cache key
     * @param {number} [ttl] - Time to live in milliseconds
     * @returns {boolean}
     */
    has(key, ttl = this.defaultTTL) {
        return this.get(key, ttl) !== null;
    }

    /**
     * Clear a specific cache entry
     * @param {string} key - Cache key
     */
    delete(key) {
        this.cache.delete(key);
    }

    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     * @returns {{size: number, keys: string[]}}
     */
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Export a singleton instance
export const apiCache = new ApiCache();

/**
 * Fetch data with caching
 * @param {string} url - URL to fetch
 * @param {number} [ttl] - Cache TTL in milliseconds
 * @returns {Promise<any>}
 */
export async function cachedFetch(url, ttl) {
    // Check cache first
    const cached = apiCache.get(url, ttl);
    if (cached !== null) {
        console.log(`[Cache HIT] ${url}`);
        return cached;
    }

    console.log(`[Cache MISS] ${url}`);
    
    // Fetch from API
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store in cache
    apiCache.set(url, data);
    
    return data;
}


```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/lib/markdown.svelte.js
```js
/**
 * Markdown Rendering Utility
 * Handles conversion of spell descriptions to HTML with sanitization
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Process spell description text and handle special table formatting
 * Tables in the D&D API are marked with | characters
 * 
 * @param {string[]} descriptionLines - Array of description lines
 * @returns {string} - Processed text ready for markdown conversion
 */
function processDescriptionLines(descriptionLines) {
    let processedText = "";
    let inTable = false;

    for (const line of descriptionLines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('|')) {
            // Table row - keep on same line
            processedText += trimmedLine + '\n';
            inTable = true;
        } else if (inTable) {
            // End of table - add spacing
            processedText += '\n' + line + '\n\n';
            inTable = false;
        } else {
            // Regular paragraph
            processedText += line + '\n\n';
            inTable = false;
        }
    }

    return processedText;
}

/**
 * Render spell description from markdown to HTML with sanitization
 * Handles both main description and higher level casting information
 * Uses DOMPurify to sanitize the HTML output and prevent XSS attacks
 *
 * @param {Object} spellDetails - Spell detail object
 * @param {string[]} spellDetails.desc - Main description lines
 * @param {string[]} [spellDetails.higher_level] - Higher level casting description
 * @returns {string} - Sanitized HTML string rendered from markdown
 */
export function renderSpellDescription(spellDetails) {
    if (!spellDetails) return '';

    let allText = "";

    // Process the main description
    allText += processDescriptionLines(spellDetails.desc);

    // Process higher level information if it exists
    if (spellDetails.higher_level && spellDetails.higher_level.length > 0) {
        allText += '\n\n## At Higher Levels\n\n';
        allText += processDescriptionLines(spellDetails.higher_level);
    }

    // Convert markdown to HTML
    const rawHtml = marked(allText);

    // Sanitize the HTML to prevent XSS attacks
    return DOMPurify.sanitize(rawHtml);
}


```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/main.js
```js
import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app

```

### /home/mystery/WebstormProjects/kennedmrweb-webprogramming-project1/src/types.svelte.js
```js
/**
 * @typedef {Object} SpellDetailData
 * @property {string} index
 * @property {string} name
 * @property {number} level
 * @property {{name: string}} school
 * @property {string} casting_time
 * @property {string} range
 * @property {string[]} desc
 * @property {string[]} [higher_level]
 */

/**
 * @typedef {Object} Spell
 * @property {string} index
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {Object} DndClass
 * @property {string} index
 * @property {string} name
 */

export {};


```
