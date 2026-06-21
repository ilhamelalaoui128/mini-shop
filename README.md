# 🛍️ Mini Shop - Plateforme E-Commerce Premium

**Mini Shop** est une application web e-commerce moderne, performante et élégante. Conçue avec une interface utilisateur de pointe (effets de glassmorphism, animations fluides, mode sombre/clair adaptatif), elle offre une expérience d'achat immersive pour les clients et un tableau de bord d'administration ultra-complet pour le gérant.

---

## 🌟 Fonctionnalités Principales

### 🛒 Expérience Client (Frontend)
- **Catalogue Dynamique :** Parcourez les produits par catégories, utilisez la barre de recherche intelligente.
- **Design Premium :** Interface "Glassmorphism", transitions douces, animations d'apparition et design 100% responsive (mobile-first avec "side drawer").
- **Panier d'Achat :** Ajout rapide au panier, persistance des données (localStorage), et processus de commande fluide.
- **Espace Client :** Inscription en deux étapes sécurisée, historique complet des commandes.
- **Notifications :** Système de "Toasts" animés pour avertir l'utilisateur (succès, erreurs, ajouts au panier).

### 🛠️ Espace Administration (Backend)
- **Tableau de Bord Visuel :** Vue d'ensemble des revenus, statistiques clés et état des stocks.
- **Gestion du Catalogue :** Création, modification et suppression de produits et de catégories.
- **Upload d'Images :** Intégration complète avec Supabase Storage pour héberger les images des produits directement depuis le panel admin.
- **Gestion des Commandes :** Changement des statuts de commande (En attente, Expédiée, Annulée) en un clic.
- **Liste des Utilisateurs :** Vue globale sur les clients inscrits.

---

## 🚀 Stack Technique (Technologies)

Le projet repose sur les dernières technologies modernes du web (stack 2026) :

- **Frontend :** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routage :** [React Router DOM v7](https://reactrouter.com/)
- **Style & UI :** [Tailwind CSS v4](https://tailwindcss.com/) (avec des utilitaires avancés pour le flou, les dégradés et les animations CSS).
- **Backend & Base de Données :** [Supabase](https://supabase.com/) (PostgreSQL pour les données, Supabase Auth pour l'authentification sécurisée, Supabase Storage pour l'hébergement des fichiers).

---

## ⚙️ Installation & Démarrage Rapide

### 1. Prérequis
- Node.js installé (v18+)
- Un compte gratuit sur [Supabase](https://supabase.com)

### 2. Cloner le projet
```bash
git clone https://github.com/ilham200312/mini-shop.git
cd mini-shop
npm install
```

### 3. Configuration de Supabase (Base de données)
1. Créez un nouveau projet sur Supabase.
2. Allez dans le **SQL Editor** et exécutez le contenu complet du fichier `supabase/schema.sql` fourni dans le projet. Cela créera les tables, les fausses données et les règles de sécurité.
3. Allez dans l'onglet **Storage**, créez un bucket nommé **`images`** et n'oubliez pas de cocher l'option **"Public bucket"**.

### 4. Variables d'environnement
Créez un fichier `.env` à la racine du projet et ajoutez vos clés Supabase (trouvées dans Settings → API) :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_publique
```

### 5. Lancer l'application
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

### 6. Devenir Administrateur
Pour tester l'interface d'administration :
1. Créez-vous un compte normalement via la page d'inscription du site.
2. Allez dans le SQL Editor de Supabase et exécutez la ligne suivante pour vous donner les droits d'admin :
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'votre@email.com');
   ```
3. Un nouveau bouton "Admin" apparaîtra dans votre menu client !

---

## 🛡️ Sécurité (RLS Policies)
Le projet utilise les *Row Level Security* (RLS) de PostgreSQL pour garantir que :
- Les clients ne peuvent voir que leurs propres commandes.
- Les données sensibles (comme les profils) sont protégées.
- **Seuls les administrateurs** peuvent uploader ou supprimer des images dans le Storage ou modifier le catalogue de produits.

---

## 📝 Licence
Ce projet est libre de droits. (MIT)
