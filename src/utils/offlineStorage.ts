/**
 * Offline Storage Utility for Lanna Calendar
 * Handles persistence of normalized dataset, PDF hash, and metadata.
 */

const DB_NAME = 'LannaCalendarDB';
const STORE_NAME = 'calendarCache';
const DB_VERSION = 1;

import { NormalizedRecord } from "./lanna";

export interface OfflineCache {
  resolvedData: Record<string, NormalizedRecord[]>;      // Current single source of truth for UI
  rawVersions: Record<string, unknown>;       // All versions per month for re-resolution
  fileHash: string;
  lastUpdated: string;
}

/**
 * Persist dataset to IndexedDB (Preferred) or localStorage (Fallback)
 */
export async function persistLocally(data: OfflineCache): Promise<boolean> {
  try {
    // Attempt IndexedDB
    return await saveToIndexedDB(data);
  } catch (e) {
    console.warn("IndexedDB failed, falling back to localStorage", e);
    try {
      localStorage.setItem('lanna_calendar_cache', JSON.stringify(data));
      return true;
    } catch (localErr) {
      console.error("LocalStorage also failed", localErr);
      return false;
    }
  }
}

/**
 * Load dataset from local storage
 */
export async function loadFromLocal(): Promise<OfflineCache | null> {
  try {
    const data = await getFromIndexedDB();
    if (data) return data;
  } catch (e) {
    console.warn("IndexedDB load failed, trying localStorage", e);
  }

  const localData = localStorage.getItem('lanna_calendar_cache');
  return localData ? JSON.parse(localData) : null;
}

// --- IndexedDB Native Implementation ---

function saveToIndexedDB(data: OfflineCache): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      const putRequest = store.put(data, 'current_cache');
      
      putRequest.onsuccess = () => resolve(true);
      putRequest.onerror = () => reject(putRequest.error);
      
      tx.oncomplete = () => db.close();
    };

    request.onerror = () => reject(request.error);
  });
}

function getFromIndexedDB(): Promise<OfflineCache | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      
      const getRequest = store.get('current_cache');
      
      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => reject(getRequest.error);
      
      tx.oncomplete = () => db.close();
    };

    request.onerror = () => reject(request.error);
  });
}
