/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }

declare module '@/api/auth.js' {
  import { AxiosPromise } from 'axios'
  export function loginApi(username: string, password: string): AxiosPromise
  export function registerApi(username: string, password: string): AxiosPromise
}