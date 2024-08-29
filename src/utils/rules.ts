import i18next from 'i18next'
import * as yup from 'yup'

export const registerSchema = yup.object({
  email: yup
    .string()
    .required(i18next.t('rules:email:required'))
    .email(i18next.t('rules:email:email'))
    .min(5, i18next.t('rules:email:length'))
    .max(160, i18next.t('rules:email:length')),
  password: yup
    .string()
    .required(i18next.t('rules:password:required'))
    .min(5, i18next.t('rules:password:length'))
    .max(160, i18next.t('rules:password:length')),
  confirm_password: yup
    .string()
    .required(i18next.t('rules:confirmPassword:required'))
    .min(5, i18next.t('rules:confirmPassword:length'))
    .max(160, i18next.t('rules:confirmPassword:length'))
    .oneOf([yup.ref('password')], i18next.t('rules:password:notMatch'))
})

export const loginSchema = yup.object({
  email: yup
    .string()
    .required(i18next.t('rules:email:required'))
    .email(i18next.t('rules:email:email'))
    .min(5, i18next.t('rules:email:length'))
    .max(160, i18next.t('rules:email:length')),
  password: yup
    .string()
    .required(i18next.t('rules:password:required'))
    .min(5, i18next.t('rules:password:length'))
    .max(160, i18next.t('rules:password:length'))
})

export const searchSchema = yup.object({
  search: yup.string().trim().required(i18next.t('rules:search:required'))
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) > Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

export const priceSchema = yup.object({
  price_min: yup.string().test({
    name: 'price-not-allow',
    message: i18next.t('rules:priceFilter:notCorrect'),
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allow',
    message: i18next.t('rules:priceFilter:notCorrect'),
    test: function (value) {
      const price_max = value
      const { price_min } = this.parent
      if (price_min !== '' && price_max !== '') {
        return Number(price_max) > Number(price_min)
      }
      return price_min !== '' || price_max !== ''
    }
  })
})

export const userSchema = yup.object({
  name: yup.string().max(160, i18next.t('rules:name:length')),
  phone: yup.string().max(20, i18next.t('rules:phone:length')),
  address: yup.string().max(160, i18next.t('rules:address:length')),
  avatar: yup.string().max(1000, i18next.t('rules:avatar:length')),
  date_of_birth: yup.date().max(new Date(), i18next.t('rules:dateOfBirth:notCorrect')),
  password: yup
    .string()
    .required(i18next.t('rules:password:required'))
    .min(5, i18next.t('rules:password:length'))
    .max(160, i18next.t('rules:password:length')),
  new_password: yup
    .string()
    .required(i18next.t('rules:password:required'))
    .min(5, i18next.t('rules:password:length'))
    .max(160, i18next.t('rules:password:length')),
  confirm_password: yup
    .string()
    .required(i18next.t('rules:confirmPassword:required'))
    .min(5, i18next.t('rules:confirmPassword:length'))
    .max(160, i18next.t('rules:confirmPassword:length'))
    .oneOf([yup.ref('new_password')], i18next.t('rules:confirmPassword:notMatch'))
})
