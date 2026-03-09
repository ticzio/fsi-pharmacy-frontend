declare module '@vueup/vue-quill' {
  import { DefineComponent } from 'vue'

  export const QuillEditor: DefineComponent<{
    content?: string
    contentType?: 'delta' | 'html' | 'text'
    enable?: boolean
    readOnly?: boolean
    placeholder?: string
    theme?: 'snow' | 'bubble' | ''
    toolbar?: string | object | Array<any>
    modules?: object
    options?: object
    globalOptions?: object
  }>

  export const Quill: any
}
