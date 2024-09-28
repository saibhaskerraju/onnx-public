import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import TextInputArea from "./nlp.tsx";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {/* <Grid item style={{ height: '30%' }}>
        <App />
      </Grid>
      <Divider sx={{ borderBottomWidth: 5 }} />
      <Grid item style={{ height: '50%' }}>
        <TextInputArea />
      </Grid> */}
      <Grid size={12}>
        <App />
      </Grid>
      <Grid size={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
      <Grid size={12}>
        <TextInputArea />
      </Grid>
    </Grid>
  </StrictMode>
);
