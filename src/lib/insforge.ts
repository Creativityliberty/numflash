
import { createClient } from '@insforge/sdk';

// Fonction helper pour récupérer les variables (LocalStorage > Env)
const getEnv = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || import.meta.env[key];
  }
  // @ts-ignore
  return import.meta.env[key];
};

const baseUrl = getEnv('VITE_INSFORGE_URL');
const anonKey = getEnv('VITE_INSFORGE_API_KEY');

if (!baseUrl || !anonKey) {
  console.warn("InsForge Configuration: Keys not found in env or localStorage. Please configure in Settings.");
}

/**
 * Client SDK InsForge unique pour toute l'application
 * Fournit l'accès à la Database, Auth, Storage, AI et Realtime
 */
export const insforge = createClient({
  baseUrl: baseUrl || 'http://localhost',
  anonKey: anonKey || 'mock-key'
});
