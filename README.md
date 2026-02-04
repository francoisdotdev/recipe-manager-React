# Recipe Manager

<div align="center">

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

---

**Application de gestion de recettes avec planification de repas et liste de courses**

[Fonctionnalités](#-fonctionnalités) •
[Installation](#-installation) •
[Stack](#-stack-technique)

</div>

---

## ✨ Fonctionnalités

- 📖 **Catalogue de recettes** — Parcourez et filtrez les recettes par type, cuisine ou difficulté
- ⭐ **Mes recettes** — Sauvegardez vos recettes favorites
- 📅 **Planning hebdomadaire** — Planifiez vos repas de la semaine
- 🛒 **Liste de courses** — Génération automatique à partir du planning

---

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/francoisdotdev/recipe-manager-React.git
cd recipe-manager-React

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

---

## 🛠 Stack Technique

| Outil | Usage |
|-------|-------|
| **React 19** | Framework UI |
| **TypeScript** | Typage statique |
| **Vite** | Build & Dev Server |
| **TailwindCSS** | Styling |
| **TanStack Router** | Routing |
| **Biome** | Linting & Formatting |

---

## 📁 Structure

```
src/
├── components/
│   ├── planning/      # Composants planning
│   ├── recipe/        # Composants recettes
│   └── shopping/      # Composants liste de courses
├── hooks/             # Custom hooks
├── pages/             # Pages de l'application
├── types/             # Types TypeScript
├── router.tsx         # Configuration routing
└── main.tsx           # Point d'entrée
```

---

## 📜 Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run preview  # Preview du build
npm run check    # Lint & Format (Biome)
```

---

<div align="center">
</div>
