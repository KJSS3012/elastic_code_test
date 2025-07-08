import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes'
import { Provider } from 'react-redux'
import { store } from './stores/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </StrictMode>,
)
