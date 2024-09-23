import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import TextInputArea from './nlp.tsx'
import Grid  from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <Grid container direction="column" style={{ height: '100vh' }}>
      <Grid item style={{ height: '30%' }}>
        <App />
      </Grid>
      <Divider sx={{ borderBottomWidth: 5 }} />
      <Grid item style={{ height: '50%' }}>
        <TextInputArea />
      </Grid>
    </Grid>
  </StrictMode>,
)
