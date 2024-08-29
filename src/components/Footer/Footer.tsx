import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation(['footer'])
  return (
    <footer className='bg-neutral-100 py-16'>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-1 gap-4 text-center lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            <div>{t('footer:text1')}</div>
          </div>
          <div className='lg:col-span-2'>
            <div>{t('footer:text2')}</div>
          </div>
        </div>
        <div className='mt-10 text-center text-sm'>
          <div>{t('footer:name')}</div>
          <div className='mt-2'>{t('footer:address')}</div>
          <div className='mt-2'>{t('desc')}</div>
          <div className='mt-2'>{t('footer:id')}</div>
          <div className='mt-2'>{t('footer:text3')}</div>
        </div>
      </div>
    </footer>
  )
}
