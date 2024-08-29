import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_EN from 'src/locales/en/home.json'
import PRODUCT_EN from 'src/locales/en/product.json'
import CART_EN from 'src/locales/en/cart.json'
import HEADER_EN from 'src/locales/en/header.json'
import FOOTER_EN from 'src/locales/en/footer.json'
import USER_EN from 'src/locales/en/user.json'
import AUTH_EN from 'src/locales/en/auth.json'
import RULE_EN from 'src/locales/en/rules.json'

import HOME_VI from 'src/locales/vi/home.json'
import PRODUCT_VI from 'src/locales/vi/product.json'
import CART_VI from 'src/locales/vi/cart.json'
import HEADER_VI from 'src/locales/vi/header.json'
import FOOTER_VI from 'src/locales/vi/footer.json'
import USER_VI from 'src/locales/vi/user.json'
import AUTH_VI from 'src/locales/vi/auth.json'
import RULE_VN from 'src/locales/vi/rules.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN,
    cart: CART_EN,
    header: HEADER_EN,
    footer: FOOTER_EN,
    user: USER_EN,
    auth: AUTH_EN,
    rules: RULE_EN
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI,
    cart: CART_VI,
    header: HEADER_VI,
    footer: FOOTER_VI,
    user: USER_VI,
    auth: AUTH_VI,
    rules: RULE_VN
  }
}

const language = localStorage.getItem('language') ?? 'vi'

i18n.use(initReactI18next).init({
  resources,
  lng: language,
  ns: ['home', 'product'],
  fallbackLng: language,
  interpolation: {
    escapeValue: false
  }
})
