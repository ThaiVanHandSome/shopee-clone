import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface Props {
  readonly children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
