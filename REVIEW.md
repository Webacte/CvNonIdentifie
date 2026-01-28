# Revue du projet – Portfolio CV Non Identifié

Tour de contrôle effectué après nettoyage et préparation pour GitHub.

---

## ✅ Ce qui est en ordre

- **Structure** : App Router Next.js claire, composants Scene bien séparés, animations en modules.
- **Config** : `tsconfig.json`, `next.config.js`, `package.json` cohérents. Pas d’erreurs de lint.
- **Documentation** : README complet (technos, installation, structure, déploiement).
- **Licence** : MIT avec auteur et année.
- **.gitignore** : `node_modules`, `.next`, `out`, `.env*.local`, etc. Couvre l’essentiel.

---

## 🔧 Modifications appliquées lors de cette revue

1. **Suppression de `GIT_PUSH_INSTRUCTIONS.md`**  
   Fichier temporaire devenu inutile après votre commit.

2. **Nettoyage de `src/animations/constants.ts`**  
   Export `ACCELERATE_ROCKET_X` supprimé : jamais importé (la valeur 450 est en dur dans `scrollAnimations.ts`).

3. **Nettoyage de `src/app/page.tsx`**  
   Commentaire superflu `{/* Page de Présentation */}` supprimé.

---

## 📌 Points à garder en tête (sans changement obligatoire)

### Assets non référencés

Dans `public/assets/svg/`, ces fichiers ne sont pas utilisés dans le code :

- `habitation.svg`
- `main-robot.svg`
- `tete-robot.svg`
- `public/assets/svg/text/profile-mobile.svg`

Vous pouvez les garder pour une évolution (ex. version mobile) ou les supprimer pour alléger le repo.

### Fichier `src/types/jsx.d.ts`

Il déclare `JSX.IntrinsicElements` avec `[elemName: string]: any`.  
Avec React + Next.js, les types JSX sont déjà fournis. Ce fichier peut servir si vous utilisez des balises SVG ou custom non reconnues par défaut. À supprimer seulement si vous n’en avez pas besoin (après vérification que le build reste vert).

### Police « Handvetica Neue Regular Trial »

`public/assets/police/Handvetica Neue Regular Trial.ttf` : nom indique une version « Trial ». Vérifier la licence si le projet est public / pro.

---

## 🚀 Recommandations optionnelles

1. **ESLint**  
   Le README mentionne `npm run lint`. Next 14 embarque ESLint ; si vous voulez des règles plus strictes, ajouter un `.eslintrc.json` (ou équivalent) au projet.

2. **Métadonnées SEO**  
   Dans `layout.tsx`, vous avez déjà `title` et `description`. Pour un portfolio public, vous pouvez ajouter `openGraph`, `twitter`, `keywords` dans `metadata` pour le partage sur les réseaux.

3. **Accessibilité**  
   Les sections avec `aria-hidden="true"` sur les décors (ground-overcoat, ground-line) sont cohérentes. Penser à un lien « Aller au contenu » et à la navigation au clavier si vous visez un public large.

4. **.gitignore**  
   Si vous utilisez Cursor et ne voulez pas versionner la config du projet Cursor, ajouter par exemple `.cursor/` (ou les dossiers/fichiers concernés) dans `.gitignore`.

---

## 📦 Résumé

Le projet est propre, documenté et prêt à être présenté (recruteurs, portfolio public). Les seuls changements faits dans cette revue sont la suppression du fichier d’instructions Git, la suppression d’une constante inutilisée et d’un commentaire inutile. Le reste est optionnel selon vos priorités (assets, SEO, a11y, ESLint).

Vous pouvez supprimer ce fichier `REVIEW.md` après lecture si vous ne souhaitez pas le garder dans le dépôt.
