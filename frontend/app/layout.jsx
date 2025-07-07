import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import ClientSocketProvider from './components/provider/ClientSocketProvider'


export const metadata = {
  title: 'Waitless Online',
  description: 'Waitless Online - Skip the Queue, Live the Life',
}

export default function RootLayout({children}) {

  return (
    <html lang="en">
      <body>
          <Header />
          <ClientSocketProvider>
            {children}
          </ClientSocketProvider>
          <Footer />
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              className: '',
              duration: 1500,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
      </body>
    </html>
  )
}

