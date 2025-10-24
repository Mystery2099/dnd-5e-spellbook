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

