import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider // Importar o Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { logout } from '../../../stores/auth/slice';

const drawerWidth = 240;

const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }, // Dashboard pessoal do usuário
    { text: 'Produtores', icon: <PeopleIcon />, path: '/producers' }, // Lista de produtores
    { text: 'Área Admin', icon: <AdminPanelSettingsIcon />, path: '/admin' }, // Dados administrativos globais
    { text: 'Propriedades', icon: <BusinessCenterIcon />, path: '/properties' }, // Lista de propriedades
  ];

  const secondaryNavItems = [
    { text: 'Nova Propriedade', icon: <AgricultureIcon />, path: '/properties/new' },
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        AgroManager
      </Typography>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} selected={location.pathname === item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {secondaryNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} selected={location.pathname === item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            AgroManager
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;