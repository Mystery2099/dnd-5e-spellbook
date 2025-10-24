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

