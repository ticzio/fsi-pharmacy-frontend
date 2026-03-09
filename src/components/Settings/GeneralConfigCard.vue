<script setup lang="ts">
// ── Emits ──────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'navigate', key: string): void
}>()

// ── Navigation items ───────────────────────────────────────────────────────
const items = [
  {
    key: 'misiones',
    label: 'Misiones',
    desc: 'Gestiona las misiones disponibles en el sistema',
    icon: 'bi-trophy-fill',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
  },
  {
    key: 'niveles',
    label: 'Niveles',
    desc: 'Configura los niveles y rangos de usuarios',
    icon: 'bi-bar-chart-fill',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
  {
    key: 'banners',
    label: 'Banners publicitarios',
    desc: 'Administra los banners visibles en la aplicación',
    icon: 'bi-image-fill',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
  },
  {
    key: 'ciudades',
    label: 'Ciudades',
    desc: 'Gestiona las ciudades habilitadas en el sistema',
    icon: 'bi-building-fill',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
  },
]
</script>

<template>
  <div class="gc-card">
    <!-- ── Header ── -->
    <div class="gc-header">
      <div class="gc-icon-wrap" style="background: rgba(18, 62, 147, 0.1); color: #123e93">
        <i class="bi bi-sliders2"></i>
      </div>
      <div>
        <h5 class="fw-bold mb-0">Configuración General</h5>
        <small class="text-muted">Parámetros básicos del sistema</small>
      </div>
    </div>

    <!-- ── Navigation rows ── -->
    <div class="gc-rows">
      <template v-for="(item, index) in items" :key="item.key">
        <button class="gc-row" @click="emit('navigate', item.key)">
          <!-- Icon -->
          <div class="gc-icon-wrap" :style="{ background: item.bg, color: item.color }">
            <i :class="['bi', item.icon]"></i>
          </div>

          <!-- Text -->
          <div class="gc-row-text">
            <p class="gc-row-label">{{ item.label }}</p>
            <span class="gc-row-desc">{{ item.desc }}</span>
          </div>

          <!-- Chevron -->
          <i class="bi bi-chevron-right gc-chevron"></i>
        </button>

        <div v-if="index < items.length - 1" class="gc-divider" />
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ── Card ── */
.gc-card {
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.25s ease;
}
.gc-card:hover {
  box-shadow: 0 6px 28px rgba(18, 62, 147, 0.09);
}

/* ── Header ── */
.gc-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}
.gc-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a2e;
}
.gc-subtitle {
  font-size: 0.8rem;
  color: #94a3b8;
}

/* ── Icon wraps ── */
.gc-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}

/* ── Rows ── */
.gc-rows {
  padding: 0 24px;
}

.gc-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 0;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.18s;
  border-radius: 8px;
}
.gc-row:hover {
  background: #f8fafc;
  padding-left: 8px;
  padding-right: 8px;
  margin: 0 -8px;
  width: calc(100% + 16px);
}
.gc-row:hover .gc-chevron {
  transform: translateX(3px);
  background: rgba(18, 62, 147, 0.16);
}

.gc-row-text {
  flex: 1;
  min-width: 0;
}
.gc-row-label {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a2e;
}
.gc-row-desc {
  font-size: 0.78rem;
  color: #94a3b8;
}

/* ── Chevron ── */
.gc-chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(18, 62, 147, 0.08);
  color: #123e93;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
  transition:
    background 0.2s,
    transform 0.2s;
}

/* ── Divider ── */
.gc-divider {
  height: 1px;
  background: #f3f4f6;
}
</style>
