/**
 * Constantes partagées pour les animations de scroll
 */

/**
 * Distance fixe en pixels avant que le mouvement horizontal commence
 * Cette valeur est utilisée pour créer un bloc initial où le scroll vertical
 * ne déclenche pas encore de mouvement horizontal
 */
export const INITIAL_SCROLL_BLOCK = 2500
export const ACCELERATE_ROCKET_X = 1300

/**
 * Configuration du deuxième bloc de scroll (pour la deuxième section)
 * Le scroll s'arrête à SECOND_SECTION_BLOCK_START et redémarre à SECOND_SECTION_BLOCK_END
 */
export const SECOND_SECTION_BLOCK_START = 3550
export const SECOND_SECTION_BLOCK_END = 6000
