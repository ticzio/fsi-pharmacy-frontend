declare module 'bootstrap/dist/js/bootstrap.esm.js' {
  export interface ModalOptions {
    backdrop?: boolean | 'static'
    keyboard?: boolean
    focus?: boolean
  }

  export class Modal {
    constructor(element: HTMLElement, options?: ModalOptions)
    show(): void
    hide(): void
    toggle(): void
    dispose(): void
  }
}
