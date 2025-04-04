import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserCard from './UserCard.jsx'
import QrCode from './Components/QrCode.jsx'
import './css/QrCode.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QrCode/>
    {/* <UserCard/> */}
    {/* <App/> */}
  </StrictMode>,
)
