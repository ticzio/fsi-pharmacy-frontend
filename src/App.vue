<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <router-view />
</template>

<style lang="scss" is:global>
$primary: #103560;
$secondary: #527387;
$info: #84b0c0;
$dark: #2c363e;
$success: #16855f;
$danger: #b25672;
$warning: #ffba43;
$light: #d6dde6;

$card-border-width: 2px;
$input-border-width: 2px;

@use 'bootstrap' with (
  $primary: $primary,
  $secondary: $secondary,
  $info: $info,
  $success: $success,
  $danger: $danger,
  $warning: $warning,
  $dark: $dark,
  $light: $light,
  $border-width: 1px,
  $border-widths: (
    1: 2px,
    2: 3px,
    3: 4px,
    4: 5px,
    5: 6px,
  ),

  // AQUÍ fuerzas cómo se generan los *-bg-subtle
  $theme-colors-bg-subtle:
    (
      'primary': rgba($primary, 0.7),
      'secondary': rgba($secondary, 0.7),
      'info': rgba($info, 0.7),
      'success': rgba($success, 0.7),
      'danger': rgba($danger, 0.7),
      'warning': rgba($warning, 0.7),
      'dark': rgba($dark, 0.7),
      'light': rgba($light, 0.7),
    )
);

html {
  overflow: hidden;
}

body {
  font-family: 'Lexend Deca', sans-serif;
}

[data-title]:hover:after {
  opacity: 1;
  transition: all 0.2s ease 0.5s;
  visibility: visible;
}
[data-title]:after {
  content: attr(data-title);
  /* Glass efecto tomado del nav-link.active del sidebar */
  background: rgba(15, 32, 92, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(3px);
  white-space: nowrap;
  min-width: 9rem;
  color: #ffffff;
  font-size: 14px;
  font-weight: 300;
  font-family: 'Lexend Deca', sans-serif;
  position: absolute;
  padding: 5px 20px;
  border: 1px solid rgba(251, 253, 255, 0.7);
  opacity: 0;
  z-index: 99999;
  visibility: hidden;
  border-radius: var(--bs-border-radius-xl);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(151, 187, 255, 0.55),
    inset 0 -1px 0 rgba(5, 18, 64, 0.6), inset 0 0 18px 11px rgba(48, 92, 210, 0.35);

  // Default: show above
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
}

[data-title] {
  position: relative;
}

/* Show below if not enough space above (using a modifier class) */
[data-title][data-tooltip-pos='bottom']:after {
  top: 105%;
  left: 50%;
  transform: translateX(-50%);
}

/* Show to the right */
[data-title][data-tooltip-pos='right']:after {
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
}

/* Show to the left */
[data-title][data-tooltip-pos='left']:after {
  top: 50%;
  right: 100%;
  left: auto;
  transform: translateY(-50%);
}

.form-control {
  min-height: 40px;
  border-radius: 20px;
}

.form-control::placeholder {
  color: #adadad;
  opacity: 1;
}
.input-group-text {
  border-radius: 20px 0 0 20px;
  background: white;
}

//TRANSITIONS
/* Izquierda a derecha */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Derecha a izquierda */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

/* 1. Aplica UNA SOLA sombra al contenedor padre cuando el input tiene foco */
.input-group:has(.form-control:focus) {
  box-shadow: 0 0 0 0.25rem rgba(7, 43, 43, 0.25);
}

/* 2. MUY IMPORTANTE: Elimina la sombra por defecto del input para que no compita */
.input-group:has(.form-control:focus) .form-control {
  box-shadow: none;
}

/* 3. Mantenemos los estilos base para el ícono (sin bordes) */
.input-group .input-group-text {
  border: none;
}

/* 4. Mantenemos la superposición para una unión perfecta de los bordes */
.input-group .input-group-text + .form-control {
  border-left: none;
  margin-left: -1px;
}

.border-radius-right {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.border-radius-left {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
</style>
