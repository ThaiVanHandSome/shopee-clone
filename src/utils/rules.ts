import type { RegisterOptions } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

export const rules: Rules = {
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 kí tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 kí tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 kí tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 kí tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Confirm password là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 kí tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 kí tự'
    }
  }
}

export const registerSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 kí tự')
    .max(160, 'Độ dài từ 5 - 160 kí tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(5, 'Độ dài từ 6 - 160 kí tự')
    .max(160, 'Độ dài từ 6 - 160 kí tự'),
  confirm_password: yup
    .string()
    .required('Confirm password là bắt buộc')
    .min(5, 'Độ dài từ 6 - 160 kí tự')
    .max(160, 'Độ dài từ 6 - 160 kí tự')
    .oneOf([yup.ref('password')], 'Nhập lại password không khớp')
})

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 kí tự')
    .max(160, 'Độ dài từ 5 - 160 kí tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(5, 'Độ dài từ 6 - 160 kí tự')
    .max(160, 'Độ dài từ 6 - 160 kí tự')
})

export const searchSchema = yup.object({
  search: yup.string().trim().required('Tên sản phẩm là bắt buộc')
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
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allow',
    message: 'Giá không phù hợp',
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
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(5, 'Độ dài từ 6 - 160 kí tự')
    .max(160, 'Độ dài từ 6 - 160 kí tự'),
  new_password: yup
    .string()
    .required('Password là bắt buộc')
    .min(5, 'Độ dài từ 6 - 160 kí tự')
    .max(160, 'Độ dài từ 6 - 160 kí tự'),
  confirm_password: yup
    .string()
    .required('Confirm password là bắt buộc')
    .min(5, 'Độ dài từ 6 - 160 kí tự')
    .max(160, 'Độ dài từ 6 - 160 kí tự')
    .oneOf([yup.ref('new_password')], 'Nhập lại password không khớp')
})
