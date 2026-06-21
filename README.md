# Mini Shop (E-commerce)

Un projet e-commerce simple développé avec React, Vite, Tailwind CSS et Supabase.

## Technologies utilisées
- **Frontend** : React 19, React Router v7
- **Style** : Tailwind CSS v4
- **Backend / Base de données** : Supabase
- **Build Tool** : Vite

## Prérequis
- Node.js installé sur votre machine
- Un compte Supabase (avec l'URL et la clé anonyme)

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/ilhamelalaoui128/mini-shop.git
   cd mini-shop
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   Copiez le fichier `.env.example` vers `.env` et ajoutez vos identifiants Supabase :
   ```bash
   cp .env.example .env
   ```
   *(Assurez-vous de remplir `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans le fichier `.env`)*

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

## Structure du projet
- `src/` : Code source React (Pages, Composants, etc.)
- `supabase/` : Fichiers liés à Supabase (Schéma SQL)
