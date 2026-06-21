# Cahier des Charges – Mini E-Commerce

## 1. Informations Générales

### Nom du Projet
Mini E-Commerce

### Type de Projet
Application Web E-Commerce

### Objectif
Développer une plateforme de commerce en ligne simple permettant aux utilisateurs de consulter des produits, les filtrer par catégorie, les ajouter à un panier et passer des commandes.

### Public Cible
- Clients souhaitant acheter des produits en ligne
- Administrateur chargé de gérer les produits, catégories et commandes

---

# 2. Technologies Utilisées

## Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Context API

## Backend (BaaS)
- Supabase

## Base de Données
- PostgreSQL (Supabase)

## Authentification
- Supabase Auth

## Déploiement
- Vercel ou Netlify (Frontend)
- Supabase (Backend)

---

# 3. Objectifs Fonctionnels

Le système doit permettre :

### Pour les visiteurs
- Consulter les produits
- Consulter les catégories
- Rechercher des produits
- Filtrer les produits par catégorie
- Voir les détails d'un produit

### Pour les clients
- Créer un compte
- Se connecter
- Ajouter des produits au panier
- Modifier les quantités du panier
- Supprimer des produits du panier
- Passer une commande
- Consulter son historique de commandes

### Pour l'administrateur
- Gérer les catégories
- Gérer les produits
- Consulter les commandes
- Consulter les utilisateurs

---

# 4. Acteurs du Système

## Visiteur

### Permissions
- Voir les catégories
- Voir les produits
- Rechercher des produits
- Consulter les détails d'un produit

---

## Client

### Permissions
- Toutes les permissions du visiteur
- Créer un compte
- Se connecter
- Ajouter au panier
- Passer une commande
- Voir ses commandes

---

## Administrateur

### Permissions
- Ajouter une catégorie
- Modifier une catégorie
- Supprimer une catégorie
- Ajouter un produit
- Modifier un produit
- Supprimer un produit
- Consulter les commandes
- Consulter les utilisateurs

---

# 5. Fonctionnalités Détaillées

## 5.1 Authentification

### Inscription

L'utilisateur doit pouvoir créer un compte avec :

- Nom complet
- Adresse email
- Mot de passe

### Validation

- Email obligatoire
- Mot de passe minimum 6 caractères

### Connexion

L'utilisateur doit pouvoir se connecter avec :

- Email
- Mot de passe

### Déconnexion

L'utilisateur doit pouvoir se déconnecter.

---

## 5.2 Gestion des Catégories

### Consultation

L'utilisateur peut :

- Voir toutes les catégories
- Voir le nombre de produits par catégorie

### Administration

L'administrateur peut :

- Ajouter une catégorie
- Modifier une catégorie
- Supprimer une catégorie

### Données d'une catégorie

- Nom
- Description
- Image

---

## 5.3 Gestion des Produits

### Consultation

Le système doit afficher :

- Image
- Nom
- Prix
- Catégorie
- Description courte

### Détails

Le système doit afficher :

- Image
- Nom
- Prix
- Description complète
- Catégorie

### Recherche

Recherche par :

- Nom du produit

### Filtrage

Filtrer par :

- Catégorie

### Administration

L'administrateur peut :

- Ajouter un produit
- Modifier un produit
- Supprimer un produit

---

## 5.4 Gestion du Panier

### Ajouter au panier

Le client peut ajouter un produit.

### Modifier la quantité

Le client peut :

- Augmenter la quantité
- Diminuer la quantité

### Supprimer un produit

Le client peut retirer un produit du panier.

### Calcul automatique

Le système doit calculer :

- Sous-total
- Total général

---

## 5.5 Gestion des Commandes

### Validation

Le client peut confirmer sa commande.

### Enregistrement

Le système enregistre :

- Produits
- Quantités
- Prix
- Date

### Historique

Le client peut consulter :

- Ses anciennes commandes
- Le détail de chaque commande

---

# 6. Base de Données

## Table categories

| Champ | Type |
|---------|---------|
| id | UUID |
| name | VARCHAR |
| description | TEXT |
| image_url | TEXT |
| created_at | TIMESTAMP |

---

## Table products

| Champ | Type |
|---------|---------|
| id | UUID |
| category_id | UUID |
| name | VARCHAR |
| description | TEXT |
| price | DECIMAL |
| image_url | TEXT |
| stock | INTEGER |
| created_at | TIMESTAMP |

---

## Table orders

| Champ | Type |
|---------|---------|
| id | UUID |
| user_id | UUID |
| total | DECIMAL |
| status | VARCHAR |
| created_at | TIMESTAMP |

---

## Table order_items

| Champ | Type |
|---------|---------|
| id | UUID |
| order_id | UUID |
| product_id | UUID |
| quantity | INTEGER |
| price | DECIMAL |

---

# 7. Relations Entre Les Tables

## Catégories et Produits

Une catégorie possède plusieurs produits.

```text
categories
    |
    | 1
    |
    | N
products
```

## Commandes et Produits

Une commande contient plusieurs produits.

```text
orders
    |
    | 1
    |
    | N
order_items
    |
    | N
    |
    | 1
products
```

---

# 8. Interfaces Utilisateur

## Page Accueil

Contient :

- Navbar
- Barre de recherche
- Liste des catégories
- Liste des produits

---

## Page Catégories

Contient :

- Toutes les catégories
- Nombre de produits

---

## Page Produits

Contient :

- Produits filtrés
- Pagination (optionnel)

---

## Page Détail Produit

Contient :

- Image
- Nom
- Prix
- Description
- Bouton Ajouter au panier

---

## Page Panier

Contient :

- Produits sélectionnés
- Quantités
- Prix total
- Bouton Commander

---

## Page Connexion

Contient :

- Email
- Mot de passe

---

## Page Inscription

Contient :

- Nom
- Email
- Mot de passe

---

## Dashboard Administrateur

### Gestion Catégories

- Liste
- Ajout
- Modification
- Suppression

### Gestion Produits

- Liste
- Ajout
- Modification
- Suppression

### Gestion Commandes

- Consultation des commandes

---

# 9. Structure Frontend

```text
src/

components/
├── Navbar.jsx
├── Footer.jsx
├── ProductCard.jsx
├── CategoryCard.jsx
├── CartItem.jsx
├── SearchBar.jsx

pages/
├── Home.jsx
├── Categories.jsx
├── Products.jsx
├── ProductDetails.jsx
├── Cart.jsx
├── Login.jsx
├── Register.jsx
├── Orders.jsx
├── AdminDashboard.jsx

context/
├── AuthContext.jsx
├── CartContext.jsx

services/
├── supabase.js

layouts/
├── MainLayout.jsx
├── AdminLayout.jsx

App.jsx
main.jsx
```

---

# 10. Règles de Gestion

### Produits

- Un produit appartient à une seule catégorie.
- Un produit doit avoir un prix supérieur à 0.

### Commandes

- Une commande doit contenir au moins un produit.
- Une commande ne peut être validée que par un utilisateur connecté.

### Catégories

- Une catégorie ne peut pas être supprimée si elle contient des produits.

---

# 11. Sécurité

- Authentification Supabase
- Protection des routes privées
- Protection des pages administrateur
- Validation des formulaires
- Gestion des erreurs

---

# 12. Responsive Design

Le site doit être compatible :

- Mobile
- Tablette
- Desktop

---

# 13. Fonctionnalités Bonus

- Wishlist (favoris)
- Upload d'images avec Supabase Storage
- Produits vedettes
- Tri par prix
- Tri par date
- Pagination
- Dashboard statistiques
- Dark Mode

---

# 14. Livrables

- Code source React
- Base de données Supabase
- Dépôt GitHub
- README.md
- Captures d'écran
- Guide d'installation

---

# 15. Planning Prévisionnel

## Phase 1
Initialisation du projet

## Phase 2
Configuration Supabase

## Phase 3
Authentification

## Phase 4
Gestion des catégories

## Phase 5
Gestion des produits

## Phase 6
Gestion du panier

## Phase 7
Gestion des commandes

## Phase 8
Dashboard administrateur

## Phase 9
Tests

## Phase 10
Déploiement