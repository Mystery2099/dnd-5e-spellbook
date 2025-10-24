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

