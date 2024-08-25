import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import { searchSchema } from 'src/utils/rules'
import * as yup from 'yup'

type FormData = yup.InferType<typeof searchSchema>

export default function useSearchProducts() {
  const queryConfig: QueryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      search: ''
    },
    resolver: yupResolver(searchSchema)
  })
  const navigate = useNavigate()
  const onSubmitSearch = handleSubmit((data) => {
    const omitConfig = queryConfig.order ? ['order', 'sort_by'] : []
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            name: data.search
          },
          omitConfig
        )
      ).toString()
    })
  })
  return { onSubmitSearch, register }
}
