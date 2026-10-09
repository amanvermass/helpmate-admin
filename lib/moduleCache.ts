"use client";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const moduleStore = new Map<string, CacheEntry<any>>();

/**
 * Retrieve cached data for a module if it's within the TTL window (default 30 seconds).
 */
export function getCachedModuleData<T>(moduleKey: string, ttlMs: number = 30000): T | null {
  const entry = moduleStore.get(moduleKey);
  if (entry && Date.now() - entry.timestamp < ttlMs) {
    return entry.data as T;
  }
  return null;
}

/**
 * Get cached module data regardless of TTL (for initial state fallback).
 */
export function getStoredModuleData<T>(moduleKey: string): T | null {
  const entry = moduleStore.get(moduleKey);
  return entry ? (entry.data as T) : null;
}

/**
 * Store latest API data for a module with current timestamp.
 */
export function setCachedModuleData<T>(moduleKey: string, data: T): void {
  moduleStore.set(moduleKey, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Check if the cache for a module is still fresh (under 30 seconds).
 */
export function isModuleCacheFresh(moduleKey: string, ttlMs: number = 30000): boolean {
  const entry = moduleStore.get(moduleKey);
  return !!(entry && Date.now() - entry.timestamp < ttlMs);
}

/**
 * Invalidate cache for a specific module or clear all.
 */
export function clearModuleCache(moduleKey?: string): void {
  if (moduleKey) {
    moduleStore.delete(moduleKey);
  } else {
    moduleStore.clear();
  }
}
