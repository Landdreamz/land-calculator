import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShowChart as SalesIcon,
  People as ContactsIcon,
  AccountTree as PipelineIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Task as TaskIcon,
  Notifications as NotificationsIcon,
  Calculate as CalculateIcon,
  Landscape as LandIcon,
  School as TrainingIcon,
  Campaign as MarketingIcon,
  AutoFixHigh as AutomationIcon,
  SmartToy as AIIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import SalesPerformance from './components/SalesPerformance';
import Contacts from './components/Contacts';
import Announcements from './components/Announcements';
import AmortizationCalculator from './components/AmortizationCalculator';
import { LandCalculator } from './components/LandCalculator';
import TrainingResources from './components/TrainingResources';
import MarketingChannel from './components/MarketingChannel';
import AutomationWorkflows from './components/AutomationWorkflows';
import AskAI from './components/AskAI';
import PowerDialer from './components/PowerDialer';

type Section = 'Sales Performance' | 'Contacts' | 'Pipeline Management' | 'Calendar' | 'Tasks' | 'Settings' | 'Announcements' | 'Amortization Calculator' | 'Land Evaluation Calculator' | 'Training & Resources' | 'Marketing Channel' | 'Automation & Workflows' | 'Ask A.I' | 'Power Dialer';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DashboardLayout: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [selectedSection, setSelectedSection] = React.useState<Section>('Sales Performance');

  const menuItems = [
    { text: 'Sales Performance' as Section, icon: <SalesIcon /> },
    { text: 'Marketing Channel' as Section, icon: <MarketingIcon /> },
    { text: 'Automation & Workflows' as Section, icon: <AutomationIcon /> },
    { text: 'Power Dialer' as Section, icon: <PhoneIcon /> },
    { text: 'Ask A.I' as Section, icon: <AIIcon /> },
    { text: 'Announcements' as Section, icon: <NotificationsIcon /> },
    { text: 'Amortization Calculator' as Section, icon: <CalculateIcon /> },
    { text: 'Land Evaluation Calculator' as Section, icon: <LandIcon /> },
    { text: 'Training & Resources' as Section, icon: <TrainingIcon /> },
    { text: 'Contacts' as Section, icon: <ContactsIcon /> },
    { text: 'Pipeline Management' as Section, icon: <PipelineIcon /> },
    { text: 'Calendar' as Section, icon: <CalendarIcon /> },
    { text: 'Tasks' as Section, icon: <TaskIcon /> },
    { text: 'Settings' as Section, icon: <SettingsIcon /> },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'Sales Performance':
        return <SalesPerformance />;
      case 'Marketing Channel':
        return <MarketingChannel />;
      case 'Automation & Workflows':
        return <AutomationWorkflows />;
      case 'Power Dialer':
        return <PowerDialer />;
      case 'Ask A.I':
        return <AskAI />;
      case 'Contacts':
        return <Contacts />;
      case 'Announcements':
        return <Announcements />;
      case 'Amortization Calculator':
        return <AmortizationCalculator />;
      case 'Land Evaluation Calculator':
        return <LandCalculator />;
      case 'Training & Resources':
        return <TrainingResources />;
      default:
        return (
          <Typography variant="h6">
            {selectedSection} - Coming Soon
          </Typography>
        );
    }
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            CRM Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selectedSection === item.text}
                  onClick={() => setSelectedSection(item.text)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Main open={open}>
        <Toolbar />
        {renderContent()}
      </Main>
    </Box>
  );
};

export default DashboardLayout; 