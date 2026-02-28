# Analyse : animation fumée fusée (effet miroir)

## Ce qui a été tenté

| Approche | Résultat | Hypothèse cause |
|----------|----------|------------------|
| **GSAP scaleX 1/-1** + transformOrigin 50% | Pivot ~90° au lieu de miroir | Contexte 3D du parent (perspective + preserve-3d) : le scaleX est projeté en 3D, on voit le « bord » de la forme = effet pivot. |
| **transform-style: flat** sur #fumee | Mieux (reste 2D) mais toujours pivot 90° | Réduit la 3D mais l’axe du flip reste le mauvais. |
| **Attribut SVG** transform="translate(cx,cy) scale(-1,1) rotate(-10) translate(-cx,-cy)" | Plus d’animation visible | getBBox() peut renvoyer (0,0) si l’élément n’est pas encore rendu ; ou conflit avec clearProps / style. |
| **scale(-1,-1)** (180°) en SVG | Idem pivot / disparition | Même soucis que ci‑dessus. |
| **Retour GSAP scaleX** | À nouveau pivot 90° | Même cause qu’au début. |

## Cause probable du « pivot 90° »

1. **Mauvais axe de symétrie**  
   On a toujours utilisé un **retournement horizontal** : `scaleX(-1)` (miroir gauche/droite).  
   Tu demandes un **effet miroir vertical** (haut/bas, comme un reflet).  
   → Il faut **scaleY(-1)** (retournement vertical), pas scaleX(-1).

2. **Géométrie du path #fumee**  
   Le path fumée dans `fusee.svg` est une forme qui monte depuis la fusée (coordonnées d’environ 142 → 308 en Y). En X elle est plus étroite.  
   - **scaleX(-1)** : flip selon l’axe vertical → on inverse la « largeur », visuellement ça peut donner un effet de rotation bizarre (pivot).  
   - **scaleY(-1)** : flip selon l’axe horizontal → on inverse la « hauteur » de la fumée = vrai miroir vertical (reflet haut/bas).

3. **Perspective du parent**  
   `.rocket-container` a `perspective: 900px` et `transform-style: preserve-3d`. Même avec `transform-style: flat` sur #fumee, le rendu peut encore composer avec le parent et accentuer un effet de rotation au lieu d’un flip net.

## Piste de correction

- **Changer scaleX en scaleY** pour la fumée fusée : alterner **scaleY: 1** et **scaleY: -1** au scroll (avec transformOrigin 50% 50%).  
- Conserver le même principe de pulse (ROCKET_FUMEE_PULSE_COUNT) et opacity 0/1.  
- Si le pivot persiste, envisager de retirer `perspective` / `preserve-3d` uniquement pour la branche qui contient #fumee (ou isoler la fumée dans un conteneur sans perspective).

## Implémenté

- **scaleY 1/-1** à la place de scaleX pour #fumee dans `createRocketScrollAnimation` (init + update + fallback ScrollTrigger).
- Commentaire et CSS `.rocket-scaled #fumee` : retrait du `rotate` fixe, conservation de `transform-style: flat` et `transition: none`.
