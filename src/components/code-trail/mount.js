import { CodeTrail } from './engine.ts'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function watchPause(element, onChange, { threshold = 0.2 } = {}) {
  let onScreen = false
  let hidden = document.hidden
  let running = false
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const sync = () => {
    const next = onScreen && !hidden && !motion.matches
    if (next === running) return
    running = next
    onChange(next)
  }
  const io = new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting)
    sync()
  }, { threshold })
  io.observe(element)
  const onVisibility = () => {
    hidden = document.hidden
    sync()
  }
  document.addEventListener('visibilitychange', onVisibility)
  motion.addEventListener('change', sync)
  return () => {
    io.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    motion.removeEventListener('change', sync)
    if (running) {
      running = false
      onChange(false)
    }
  }
}

export function mountCodeTrail(host, elements, onRows, onMetrics) {
  const engine = new CodeTrail(host, elements, onRows, onMetrics)
  if (prefersReducedMotion()) engine.renderStill()
  else engine.seed()

  const stopWatch = watchPause(host, (run) => {
    if (prefersReducedMotion()) {
      engine.renderStill()
      return
    }
    if (run) engine.start()
    else engine.stop()
  })

  const ro = new ResizeObserver(() => engine.resize())
  ro.observe(host)

  return {
    paint: () => engine.paint(),
    destroy() {
      ro.disconnect()
      stopWatch()
      engine.destroy()
    },
  }
}
