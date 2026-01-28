# Portfolio Animé - CV Non Identifié

Portfolio interactif développé avec Next.js, TypeScript et GSAP, présentant un CV animé avec des animations fluides et immersives.

## 🚀 Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique pour une meilleure maintenabilité
- **GSAP (GreenSock Animation Platform)** - Animations performantes et fluides
- **Vivus** - Animation d'écriture SVG (handwriting effect)
- **React 18** - Bibliothèque UI moderne

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## 🛠️ Installation

1. Cloner le repository :
```bash
git clone https://github.com/Webacte/CvNonIdentifie.git
cd CvNonIdentifie
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   └── globals.css         # Styles globaux
├── components/
│   └── Scene/              # Composants de scène
│       ├── HomePage.tsx    # Composant principal
│       ├── PresentationSection.tsx
│       ├── AboutSection.tsx
│       └── ProjectsSection.tsx
├── animations/              # Configuration et utilitaires GSAP
│   ├── gsap.ts            # Configuration GSAP
│   ├── horizontalScroll.ts # Gestion du scroll horizontal
│   ├── scrollAnimations.ts # Animations liées au scroll
│   ├── handwriting.ts     # Animation d'écriture SVG
│   └── constants.ts        # Constantes partagées
├── styles/                 # Fichiers CSS spécifiques
│   ├── HomePage.css
│   └── AboutSection.css
└── types/                  # Définitions TypeScript
    └── jsx.d.ts
```

## ✨ Fonctionnalités principales

- **Scroll horizontal animé** : Conversion du scroll vertical en mouvement horizontal fluide
- **Animations synchronisées** : Toutes les animations suivent le rythme du scroll
- **Animations SVG complexes** : 
  - Animation de fusée avec rotation et déplacement
  - Animation d'extraterrestre avec mouvements des membres
  - Animation d'hologramme avec bases et réflecteurs
  - Effet d'écriture manuscrite (handwriting) sur texte SVG
- **Design responsive** : Adaptation à différentes tailles d'écran
- **Performance optimisée** : Utilisation de `force3D` et `will-change` pour des animations fluides

## 🎨 Architecture

### Pattern "1 scène = 1 composant"

Chaque section animée est un composant dédié dans `src/components/Scene/`. Cette organisation facilite la maintenance et la réutilisabilité du code.

### Système d'animations

Les animations sont organisées en modules :
- `horizontalScroll.ts` : Gère le scroll horizontal avec GSAP ScrollTrigger
- `scrollAnimations.ts` : Contient toutes les animations liées au scroll
- `handwriting.ts` : Gère l'animation d'écriture SVG avec Vivus

### Règles de performance

1. **SVG inline** : Les SVG sont chargés en inline pour permettre l'animation directe des éléments
2. **Optimisation GSAP** : Utilisation de `force3D: true` et `will-change` pour les animations complexes
3. **Lazy loading** : Les animations sont chargées uniquement quand nécessaire

## 📦 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée une version de production
- `npm run start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

## 🚢 Déploiement

Le projet peut être déployé sur différentes plateformes :

### Vercel (recommandé)

1. Connecter votre repository GitHub à Vercel
2. Vercel détectera automatiquement Next.js
3. Le déploiement se fera automatiquement à chaque push

### Autres plateformes

Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js :
- Netlify
- AWS Amplify
- Railway
- etc.

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

Benjamin Pochon

---

Développé avec ❤️ en utilisant Next.js et GSAP
