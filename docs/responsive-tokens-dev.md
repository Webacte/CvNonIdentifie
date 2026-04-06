# Responsive Tokens – tests et référence

## Référence visuelle : 1348×768

La résolution **1348×768** est la **seule référence visuelle** considérée correcte. Aucune modification ne doit en changer le rendu.

- Toutes les valeurs de base des tokens (exp-hab, convoyeur, mask, ground, rocket, about, quest, robot, contact) sont dérivées des valeurs réellement appliquées à cette résolution.
- Les interpolations se font **autour** de cette référence (vers mobile ≤425, tablette ≤768, grand desktop ≥1349 / ≥1500).

## Stage scalé et tokens

Le stage (`.horizontal-scroll-stage`) est scalé par `applyCamera()` : `transform: translate3d(...) scale(S, S)`. Les éléments **à l’intérieur** du stage ne doivent pas utiliser `vw` / `%` / `vh` pour taille ou position sous peine de **double scale** (unités viewport déjà interprétées, puis scale caméra appliqué au conteneur).

- **Règle** : pour habitation et convoyeur, les tokens sont en **px visuels** (ce qu’on veut à l’écran). En CSS : `calc(var(--token, fallback) / var(--camera-scale, 1) * 1px)` pour obtenir la valeur en “monde” et annuler le scale.
- **`--camera-scale`** : défini sur le stage par `applyCamera()` (après `gsap.set`), reflète le scale réellement appliqué. À utiliser avec fallback `1` dans les `calc()` si le JS n’a pas encore posé la variable.

### Habitation (.experiences-habitation-container)

Tokens en px visuels : `--exp-hab-top`, `--exp-hab-left`, `--exp-hab-w`, `--exp-hab-h`, `--exp-hab-max-w`, `--exp-hab-max-h` (nombres unitless). CSS : `calc(var(--exp-hab-*, fallback) / var(--camera-scale, 1) * 1px)`. Fallbacks = référence 1348×768 (ex. 461, 876, 1173, 499).

### Convoyeur-projet (`.projets-convoyeur-layer` + `.projets-convoyeur-svg`)

- **Couche** : `--convoyeur-left-vw`, `--convoyeur-w-vw`, `--ground-bottom-vh` (et fallbacks dans `ProjectsSection.css`).
- **Hauteur du dessin** : `--projets-convoyeur-scale-y` sur le stage (`transform: scaleY(...)` sur le `<svg>`).
- **Animation scroll** : le JS met à jour l’attribut `transform` sur `#convoyeur-motion` (translate + scale X) et `#battant-motion` (rotate avec pivot). La position X **finale** du glissement peut être surchargée sans recompiler via `--projets-convoyeur-slide-end-x` (nombre unitless, unités SVG ; repli = `EXP_CONVEYOR_END_X` dans `constants.ts`). Le slide est **linéaire** entre début et cette fin (plus de calcul via `getScreenCTM`).

### Mask chemine – clip-path

`--mask-chemine-clip-raw` (pas d’auto-référence) doit contenir une chaîne **complète** du type `polygon(...)` (ex. `polygon(65% 24%, 179% 0, 100% 100%, 0% 100%, 0% 45.5%)`). La var est posée sur le stage ; le masque est descendant donc hérite. Fallback fidèle golden : `polygon(65% 24%, 179% 0, 100% 100%, 0% 100%, 0% 45.5%)`. Rapport scope : `window.__TOKENS_DEBUG_CLIP__ = true` puis rafraîchir.

## Matrice de résolutions à tester

Pour chaque migration / changement responsive, vérifier **au moins** :

| Résolution   | Usage                    |
|-------------|---------------------------|
| 320×568     | Mobile très étroit        |
| 375×667     | Mobile standard           |
| 390×844     | Mobile récent             |
| 425×900     | Breakpoint sm (425)       |
| 768×1024    | Tablette portrait         |
| 1024×768    | Tablette paysage          |
| **1348×768**| **Référence golden**      |
| **1366×768**| **Near-golden** (smoothstep t∈[0,1] entre 1348 et 1366) : ground 62% / 62.5%, mask-convoyeur 9.5% / 36%, mask-chemine 20% / 57%, **robot ground 56%**, **alien2** left 13.66px / top 54.5%, exp-hab 423/1000, rocket -65vh, typo -1vw. |
| 1440×900    | Desktop                   |
| **1920×1080**| **Wide desktop** (tWide=1) : ground 45% / 45.5%, about hologram 29.5% / alien 44.5%, handwriting 67%, presentation margin-top -35vh, typo delta -1vw. Aucune MQ ; mix via getTWide(). |
| 2560×1440   | QHD                       |
| 2560×1080   | Ultra-wide                |

### Alien2 (.experiences-extraterrestre-container.alien2)

Alien2 est dans le stage (scalé) : **pas de vw** dans les styles. Tokens `--exp-alien2-left-px` (px compensés par `--camera-scale`) et `--exp-alien2-top-percent` (%). Golden 1348 : left -26.96px, top 59.5%. 1366 : left 13.66px (1vw), top 54.5%. Interpolation smoothstep entre 1348 et 1366.

## Debug

- Vérifier que `data-bp`, `data-short`, `data-ar`, `data-scale` sur `.horizontal-scroll-stage` reflètent bien le viewport.
- En DevTools, vérifier que les variables `--rocket-*`, `--about-*`, `--quest-*`, `--robot-*`, `--contact-*`, `--ground-*`, `--exp-hab-*`, `--exp-alien2-left-px`, `--exp-alien2-top-percent`, `--convoyeur-*`, `--projets-convoyeur-scale-y`, `--projets-convoyeur-slide-end-x`, `--mask-convoyeur-*`, `--mask-chemine-*` sont présentes sur le stage et changent au resize.
- Overlay optionnel : dans `responsiveTokens.ts`, mettre `DEBUG_RESPONSIVE_TOKENS = true` pour afficher vw, vh, scale, t nearGolden, robotGroundYPercent, alien2LeftPx, alien2TopPercent (en bas à gauche). Désactivé en prod.
