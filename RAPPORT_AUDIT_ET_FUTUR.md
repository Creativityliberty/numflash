
# 🚀 Nümflash V1 - Rapport d'Audit & Roadmap

## ✅ Architecture InsForge Native (Vérifiée)

### 1. Backend & Infrastructure (`.insforge/`)
*   **Schéma SQL** :
    *   Tables : `projects`, `tasks` (récursive), `files`, `task_dependencies`.
    *   **Sécurité** : Row Level Security (RLS) activé sur toutes les tables. Les politiques garantissent que seul le `owner_id` peut lire/écrire ses données.
*   **Edge Functions** :
    *   `agent-chef` : Génère le plan de tâches via IA. Sécurisé par token utilisateur.
    *   `agent-worker` : Génère le code et le stocke. Accède à la DB via le contexte utilisateur.
    *   `github-sync` : Pousse le code vers GitHub. Utilise `Octokit`.
    *   `deploy-project` : (Simulation) Déclenche le déploiement.

### 2. Frontend & Services (`src/`)
*   **Store (Zustand)** : Centralise l'état (`tasks`, `files`, `user`). Connecté via `src/lib/insforge.ts`.
*   **Services** :
    *   `DagService` : Gestion typée des tâches (CRUD).
    *   `FileService` : Gestion des fichiers (Upload/Download) via Storage SDK.
    *   `TemplateService` : (Nouveau) Applique les templates PocketFlow en créant des tâches et fichiers en base.
    *   `RealtimeHub` : Écoute les événements WebSocket (`task_updated`, `file_created`).
*   **UI (Material Design 3)** :
    *   Composants modernisés avec Tailwind (`rounded-xl`, `bg-slate-50`).
    *   `DAGCanvas` : Visualisation dynamique du graphe via React Flow.
    *   `DataView` : Inspecteur de base de données intégré pour le débogage RLS.
    *   `SettingsView` : Configuration dynamique des clés API (LocalStorage).

### 3. Fonctionnalités Clés
*   **Voice Coding** : Intégré via `VoiceInput.tsx` (Web Speech API).
*   **Templates PocketFlow** : Intégrés et fonctionnels via `TemplateService`. Les exemples (Agent, RAG, Voice) sont chargés comme projets.

---

## 🔮 Roadmap V2 & Améliorations Futures

1.  **Sécurité des Clés API** :
    *   Actuellement : Stockées dans le `localStorage` du navigateur (Client-side).
    *   Futur : Stocker les clés de manière chiffrée dans une table `user_secrets` (Backend) ou utiliser le Vault InsForge.

2.  **Exécution Serveur des Agents** :
    *   Actuellement : Les agents sont simulés ou exécutés via des prompts simples.
    *   Futur : Exécuter le moteur PocketFlow (`flow.py`) dans des conteneurs éphémères pour une vraie autonomie.

3.  **Streaming Bidirectionnel (Gemini Live)** :
    *   Actuellement : Requêtes HTTP/WebSocket standard.
    *   Futur : Intégrer une connexion WebSocket audio directe pour une latence < 500ms.

4.  **Déploiement Réel** :
    *   Actuellement : Simulation via `deploy-project`.
    *   Futur : Pipeline CI/CD complet vers Vercel/Netlify.

---

*Audit réalisé par l'Agent Architecte Nümflash.*
