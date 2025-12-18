# CookBot Frontend

Frontend **Ionic + Vue 3** (TypeScript) de CookBot : application web/mobile orientée cuisine, **optimisée pour le navigateur (Web et Mobile)**.

Le code applicatif se trouve dans le dossier **`cook-bot/`**.

---

## 🎯 À propos et Fonctionnalités

CookBot Frontend est une application construite avec un design **Mobile-First** utilisant Ionic, mais destinée à fonctionner **exclusivement** en **application web** ou en **Mobile**.

| Catégorie | Fonctionnalités |
| :--- | :--- |
| **Accès** | Inscription / connexion, parcours invité / connecté. |
| **Accueil** | Page d’accueil (expérience adaptée selon le statut de l’utilisateur). |
| **Mon frigo** | Prise de photo → génération de titres de recettes ou d’une recette à partir du contenu détecté ; possibilité d’ajouter la recette aux favoris. |
| **Recettes** | Génération de recettes à partir d’une **liste d’ingrédients** ou d’un **titre de recette** ; possibilité d’ajouter la recette aux favoris.|
| **Favoris** | Consultation et gestion des recettes favorites. |
| **Paramètres** | Page Settings (configuration utilisateur). |
| **Liste de courses** | Gestion des listes de courses et des items (ajout, modification, suppression). |
| **Admin** | Espace dashboard avec accès restreint (administrateur). |

---

## 🛠️ Technologies (avec explications)

| :--- | :--- | :--- |
| **Vue 3 + TypeScript** | Framework JavaScript moderne et typé pour construire l'interface. | Base de l'interface utilisateur (UI). |
| **Capacitor** | Framework d’Ionic qui permet de porter l'application web vers un support mobile |
| **Ionic Vue** | Framework permettant de créer des UI avec une apparence native. | Fournit les composants UI pour un design Mobile-First. |
| **Vite** | Outil de développement rapide et léger. | Sert le serveur de développement local et optimise le build de production. |
| **Vitest** | Framework de tests unitaires (rapide). | Vérifie le bon fonctionnement des petites fonctions et composants. |
| **Cypress** | Framework de tests de bout en bout (E2E). | Simule l'utilisateur pour tester des parcours complets (ex: login → favori). |
| **ESLint** | Outil d'analyse de code statique. | Garantit le respect des règles de style et évite les erreurs courantes. |

---

## ⚙️ Pré-requis

* **Node.js** (version récente recommandée > 22).
* **npm** (gestionnaire de paquets de Node.js > 10).

> **Note sur la configuration :** Le frontend ne gère pas de fichier `.env`.
L'URL du Backend est donc généralement relative (ex: `/api/users`).

---

## 🚀 Démarrage Rapide

Cette section décrit les étapes minimales pour lancer l'application en développement.

### 1. Installation des dépendances

```bash
cd cook-bot
npm install 
```

### 2. Lancement du serveur de développement (Vite)

```bash
npm run dev
```

### 3. Lancement du serveur avec Ionic

```bash
ionic serve
```

## ⚖️ Licence

**Statut Actuel : Propriétaire**
