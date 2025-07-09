import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes'
import { Provider } from 'react-redux'
import { store } from './stores/store'
import { NotificationProvider } from './contexts/NotificationContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </Provider>
  </StrictMode>,
)
