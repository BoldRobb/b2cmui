import { Box } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from "../../components/layout/AppAppBar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {


  return (
    <Box>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Outlet />
    </Box>
  );
}