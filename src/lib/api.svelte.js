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

