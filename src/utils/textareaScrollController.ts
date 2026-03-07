/**
 * API de contrôle du scroll d’un textarea.
 * Toutes les méthodes lisent les métriques à l’appel (pas de cache).
 */

export interface TextareaScrollControllerMetrics {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  maxScroll: number
}

export interface TextareaScrollController {
  isScrollable(): boolean
  getScrollRatio(): number
  getMetrics(): TextareaScrollControllerMetrics
  scrollToRatio(ratio: number): void
  scrollByRatio(deltaRatio: number): void
  scrollToPx(scrollTop: number): void
  scrollByPx(deltaPx: number): void
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function createTextareaScrollController(
  textarea: HTMLTextAreaElement
): TextareaScrollController {
  return {
    getMetrics(): TextareaScrollControllerMetrics {
      const scrollTop = textarea.scrollTop
      const scrollHeight = textarea.scrollHeight
      const clientHeight = textarea.clientHeight
      const maxScroll = Math.max(0, scrollHeight - clientHeight)
      return { scrollTop, scrollHeight, clientHeight, maxScroll }
    },

    isScrollable(): boolean {
      return this.getMetrics().maxScroll > 0
    },

    getScrollRatio(): number {
      const { scrollTop, maxScroll } = this.getMetrics()
      if (maxScroll <= 0) return 0
      return clamp(scrollTop / maxScroll, 0, 1)
    },

    scrollToRatio(ratio: number): void {
      const { maxScroll } = this.getMetrics()
      if (maxScroll <= 0) return
      const r = clamp(ratio, 0, 1)
      textarea.scrollTop = r * maxScroll
    },

    scrollByRatio(deltaRatio: number): void {
      const newRatio = clamp(this.getScrollRatio() + deltaRatio, 0, 1)
      this.scrollToRatio(newRatio)
    },

    scrollToPx(px: number): void {
      const { maxScroll } = this.getMetrics()
      textarea.scrollTop = clamp(px, 0, maxScroll)
    },

    scrollByPx(deltaPx: number): void {
      const { scrollTop, maxScroll } = this.getMetrics()
      textarea.scrollTop = clamp(scrollTop + deltaPx, 0, maxScroll)
    }
  }
}
