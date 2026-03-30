# DépanNow — Frontend Web

> Marketplace de dépannage auto en temps réel. Inspiré de inDrive, adapté pour les pannes de voiture.

## 🚀 Stack

- **React 18** + **Vite**
- **Tailwind CSS** (design system custom)
- **React Router v6**
- **Axios** (client HTTP + intercepteurs JWT)
- **React Icons**

## 📋 Prérequis

- Node.js >= 18
- npm >= 9

## ⚙️ Installation

```bash
# Cloner le repo
git clone https://github.com/moha-317/depannow-web.git
cd depannow-web

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Lancer le serveur de développement
npm run dev
```

## 🔧 Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:3000` |

## 📁 Structure

```
src/
├── api/            # Fonctions axios (auth, demandes)
├── assets/         # Logo, images statiques
├── components/     # Composants réutilisables (Button, Input, Navbar, Footer)
├── context/        # AuthContext (JWT, état utilisateur)
├── hooks/          # useAuth, useGeolocation
└── pages/
    ├── Home.jsx           # Landing page
    ├── Login.jsx          # Connexion
    ├── Register.jsx       # Inscription (Client / Dépanneur)
    ├── Dashboard.jsx      # Espace client
    └── DriverDashboard.jsx # Espace dépanneur
```

## 🎨 Design System

| Token | Valeur |
|---|---|
| Bleu primaire | `#1E3A5F` |
| Orange accent | `#FF6B35` |
| Blanc | `#FFFFFF` |
| Police | Inter (Google Fonts) |

## 🔗 Liens

- **Backend API** : [depannow-api](https://github.com/moha-317/depannow-api)
- **Demo** : _à venir_

## 📄 Licence

MIT © 2024 DépanNow
