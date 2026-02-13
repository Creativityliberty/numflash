
import { createClient } from '@insforge/sdk';

// Variables d'environnement configurées
// @ts-ignore
const baseUrl = import.meta.env.VITE_INSFORGE_URL;
// @ts-ignore
const anonKey = import.meta.env.VITE_INSFORGE_API_KEY;

if (!baseUrl || !anonKey) {
  console.error("InsForge Configuration Missing: VITE_INSFORGE_URL or VITE_INSFORGE_API_KEY is not defined.");
}

/**
 * Client SDK InsForge unique pour toute l'application
 * Fournit l'accès à la Database, Auth, Storage, AI et Realtime
 */
export const insforge = createClient({
  baseUrl: baseUrl || 'http://localhost',
  anonKey: anonKey || 'mock-key'
});
