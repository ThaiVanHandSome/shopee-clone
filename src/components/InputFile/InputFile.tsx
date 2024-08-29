import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

interface Props {
  readonly onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const { t } = useTranslation(['user'])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChooseImage = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && (fileFromLocal?.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error('File không đúng định dạng quy định')
      return
    }
    onChange && onChange(fileFromLocal)
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='.jpg,.jpeg,.png'
        className='hidden'
        onChange={onFileChange}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(event.target as any).value = null
        }}
      />
      <button
        type='button'
        className='h-10 flex-shrink-0 rounded-sm border border-transparent bg-white px-6 text-sm capitalize text-gray-600 shadow-sm hover:border-orange'
        onClick={handleChooseImage}
      >
        {t('user:chooseImage')}
      </button>
    </>
  )
}
