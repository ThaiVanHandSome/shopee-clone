import 'i18next'
import { defaultNs, resources } from 'src/i18n/i18n'

const language = localStorage.getItem('language') ?? 'vi'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNs: typeof defaultNs
    resources: typeof resources.language
  }
}
