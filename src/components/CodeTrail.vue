<script setup>
import { onMounted, ref } from 'vue'
import './code-trail/fonts.css'
import { FONT_RATIO, LINE_RATIO, PAD_RATIO } from './code-trail/engine.ts'
import { FRAGMENTS } from './code-trail/fragments.ts'
import { PAIRS } from './code-trail/palette.ts'
import { FONT_VAR } from './code-trail/params.ts'

const chips = ref([])
const metrics = ref({ font: 12, line: 15, pad: 2 })

function badgeStyle(badge, first) {
  return {
    background: badge.bg,
    color: badge.fg,
    height: `${metrics.value.line}px`,
    lineHeight: `${metrics.value.line}px`,
    fontSize: `${metrics.value.font}px`,
    padding: `0 ${metrics.value.pad}px`,
    opacity: badge.comment ? 0.72 : 1,
    fontStyle: badge.comment ? 'italic' : undefined,
    textDecoration: badge.underline ? 'underline' : undefined,
    textDecorationThickness: badge.underline ? '2px' : undefined,
    fontFamily: `var(${FONT_VAR})`,
    whiteSpace: 'pre',
    flex: '0 0 auto',
    boxShadow: first ? '0 1px 2px rgba(16, 22, 40, 0.16)' : undefined,
  }
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function randomLine() {
  const roll = Math.random()
  const count = roll < 0.58 ? 1 : roll < 0.86 ? 2 : 3
  const badges = []
  for (let i = 0; i < count; i++) {
    const fragment = pick(FRAGMENTS)
    const pair = pick(PAIRS)
    badges.push({
      text: fragment.text,
      bg: pair.bg,
      fg: pair.fg,
      underline: Math.random() < 0.22,
      comment: fragment.comment === true,
    })
  }
  return badges
}

function populate() {
  const w = window.innerWidth
  const h = window.innerHeight
  const font = Math.max(8, w * FONT_RATIO * 0.5)
  const line = font * LINE_RATIO
  const pad = font * PAD_RATIO
  metrics.value = { font, line, pad }

  const target = Math.round((w * h) / (font * 15 * line * 4.6))
  const spots = []
  let attempts = 0
  while (spots.length < target && attempts < target * 40) {
    attempts++
    const x = rand(-font * 4, w - font * 2)
    const y = rand(-line, h - line * 0.4)
    const reach = font * rand(6.5, 16)
    const crowded = spots.some((spot) => {
      const dx = spot.x - x
      const dy = (spot.y - y) * 1.7
      return dx * dx + dy * dy < reach * reach
    })
    if (crowded && Math.random() < 0.78) continue
    spots.push({ x, y })
  }

  chips.value = spots.map((spot, id) => ({
    id,
    badges: randomLine(),
    delay: `${rand(0, 0.72).toFixed(2)}s`,
    x: `${spot.x.toFixed(1)}px`,
    y: `${spot.y.toFixed(1)}px`,
    scale: rand(0.84, 1.16).toFixed(3),
    gap: Math.random() < 0.72 ? '0px' : `${rand(6, 18).toFixed(0)}px`,
  }))
}

onMounted(populate)
</script>

<template>
  <div
    class="code-trail"
    role="img"
    aria-label="Code fragments on brightly coloured bars filling the screen."
  >
    <div
      v-for="chip in chips"
      :key="chip.id"
      class="code-spot"
      :style="{
        left: chip.x,
        top: chip.y,
        transform: `scale(${chip.scale})`,
      }"
    >
      <div class="code-chip" :style="{ animationDelay: chip.delay, gap: chip.gap }">
        <span
          v-for="(badge, index) in chip.badges"
          :key="index"
          :style="badgeStyle(badge, index === 0)"
        >{{ badge.text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-trail {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.code-spot {
  position: absolute;
  transform-origin: left center;
}

.code-chip {
  display: flex;
  align-items: center;
}
</style>
