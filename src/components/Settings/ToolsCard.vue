<template>
  <div class="tools-card card border border-light shadow-sm rounded-4 p-4">
    <!-- ── Header ── -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <div class="settings-icon-wrap bg-warning-soft">
        <i class="bi bi-code-square fs-5 text-warning"></i>
      </div>
      <div>
        <h5 class="fw-bold mb-0" style="color: #1a1a2e">Herramientas</h5>
        <small class="text-muted">Utilidades del sistema</small>
      </div>
    </div>

    <!-- ── Tool buttons ── -->
    <div class="d-flex flex-column gap-2">
      <!-- Caché del Sistema -->
      <button
        class="btn tool-btn d-flex align-items-center gap-3 text-start w-100 px-3 py-3 rounded-3"
        disabled
      >
        <div class="tool-btn-icon" style="background: rgba(6, 182, 212, 0.1)">
          <i class="bi bi-database-fill-gear" style="color: #06b6d4"></i>
        </div>
        <div>
          <p class="mb-0 fw-semibold" style="font-size: 0.88rem; color: #1a1a2e">
            Caché del Sistema
          </p>
          <small class="text-muted" style="font-size: 0.75rem"
            >Limpiar caché global (próximamente)</small
          >
        </div>
        <i class="bi bi-chevron-right ms-auto text-muted"></i>
      </button>

      <!-- Exportar Logs 
      
      <button
        class="btn tool-btn d-flex align-items-center gap-3 text-start w-100 px-3 py-3 rounded-3"
        disabled
      >
        <div class="tool-btn-icon" style="background: rgba(16, 185, 129, 0.1)">
          <i class="bi bi-file-earmark-bar-graph-fill" style="color: #10b981"></i>
        </div>
        <div>
          <p class="mb-0 fw-semibold" style="font-size: 0.88rem; color: #1a1a2e">Exportar Logs</p>
          <small class="text-muted" style="font-size: 0.75rem"
            >Descarga de registros del sistema</small
          >
        </div>
        <i class="bi bi-chevron-right ms-auto text-muted"></i>
      </button>
      -->
    </div>
  </div>
</template>

<style scoped>
/* ── Card hover ── */
.tools-card {
  transition: box-shadow 0.25s ease;
}
.tools-card:hover {
  box-shadow: 0 8px 30px rgba(18, 62, 147, 0.1) !important;
}

/* ── Icon badge ── */
.settings-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bg-warning-soft {
  background: rgba(245, 158, 11, 0.1);
}

/* ── Tool buttons ── */
.tool-btn {
  background: #f8fafc;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  color: inherit;
}
.tool-btn:hover:not(:disabled) {
  background: #f0f4ff;
  border-color: rgba(18, 62, 147, 0.15);
  transform: translateX(3px);
}
.tool-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.tool-btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* ── border-light override ── */
.border-light {
  border-color: #eee !important;
}
</style>
