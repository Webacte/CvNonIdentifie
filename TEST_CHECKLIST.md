# Checklist de tests responsive (post-cleanup)

À valider après modifications (cleanup, breakpoints, CSS). Viewport de référence : desktop 1050px.

## Desktop (viewport ~1050px)

- [ ] Pas de saut (jump) au chargement ou au scroll
- [ ] Caméra centrée, scale cohérent (contain), monde bien cadré
- [ ] Scroll horizontal fluide : blocs Présentation → About → Expérience → Projets → Contact
- [ ] Aucune animation ne se déclenche sans scroll (fusée, alien, hologramme, expérience, etc.)
- [ ] Ligne de sol et ground-overcoat alignés

## Tablette (ex. 768px)

- [ ] Même checklist que desktop ; pas de régression visuelle majeure
- [ ] Pas de jump au resize (si test de redimensionnement)

## Mobile (ex. 425px, 375px)

- [ ] Sol à 55 % (≤425px) cohérent avec les constantes (fusée, positions)
- [ ] Scroll horizontal et blocs toujours cohérents
- [ ] Pas d’animation sans scroll

## Rédimensionnement

- [ ] Passer de desktop à tablette/mobile (ou l’inverse) : pas de jump, camera et scroll recalculés correctement
