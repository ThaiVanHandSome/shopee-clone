import 'i18next'
import { defaultNs, resources } from 'src/i18n/i18n'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNs: typeof defaultNs
    resources: (typeof resources)['vi']
  }
}
