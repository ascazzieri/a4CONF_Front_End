import React from "react";
import classes from "./Menu.module.css"
import useTheme from "@mui/material/styles/useTheme";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailIcon from "@mui/icons-material/Mail";
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import MessageIcon from '@mui/icons-material/Message';
import GridViewIcon from "@mui/icons-material/GridView";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import SpeedIcon from "@mui/icons-material/Speed";
import CellTowerIcon from "@mui/icons-material/CellTower";
import Avatar from '@mui/material/Avatar';
import a4GATELogo from "../media/img/a4GATE-logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid } from "@mui/material";
import { ChecklistOutlined } from "@mui/icons-material";

const drawerWidth = 240;

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  textAlign: "center",
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
const floatingLogo = {
  animationName: 'fly-1', // Since animation-name cannot be set via inline style directly
  animationDuration: '0.6s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  animationDirection: 'alternate',
}
const movingIcons = {
  animationName: 'move-foreward', // Since animation-name cannot be set via inline style directly
  animationDuration: '0.6s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  animationDirection: 'alternate',
}


export default function MiniDrawer(props) {
  const { children } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const currentURLArray = location.pathname.split("/");

  const mainSectionTitle = currentURLArray[1].replace("-", " ").toUpperCase();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            /* onMouseOver={handleDrawerOpen} */
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <img src="/img/applied_logo_cropped.png" alt="menu icon" width={35} height={35} style={floatingLogo} />

          </IconButton>
          <Grid container alignItems="center">
            <Grid item xs={3}>
              <Title
                variant="h6"
                noWrap
                component="div"
                fontFamily="monserrat"
                fontStyle="italic"
              >
                Innovation Makers
              </Title>
            </Grid>
            <Grid item xs={6} sx={{ justifyContent: "center" }}>
              <Title
                variant="h6"
                noWrap
                component="div"
                style={{ paddingTop: 5, paddingBottom: 0, minWidth: 250 }}
              >
                <img
                  src={a4GATELogo}
                  alt="a4GATE logo"
                  width="230"
                  height="70"
                />
              </Title>
            </Grid>
            <Grid item xs={3}>
              {mainSectionTitle && mainSectionTitle.length !== 0 && <Avatar sx={{ bgcolor: '#1F293F', width: 150, color: 'white' }} variant="rounded">
                {mainSectionTitle}
              </Avatar>
              }
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} onMouseOver={handleDrawerOpen} onMouseLeave={handleDrawerClose}>
        <DrawerHeader style={{ justifyContent: 'center' }}>
          <p style={{ fontWeight: 'bolder' }}><img src="/img/applied_logo_cropped.png" alt="menu icon" width={35} height={35} style={floatingLogo} /> a4CONF</p>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton> */}
        </DrawerHeader>
        <Divider />
        <List>
          {["Dashboard", "Internal-PC", "External-PC"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                name={text}
                onClick={() => {


                  navigate(`/${text?.toLowerCase()}`);


                }}
              >
                <ListItemIcon className={classes.hoverIcons}>
                  {index !== 0 ? (
                    index === 1 ? (
                      <PrecisionManufacturingIcon name="internal-pc" />
                    ) : (
                      <CellTowerIcon name="external-pc" />
                    )
                  ) : (
                    <GridViewIcon name="dashboard" />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Fast-Data"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                name={text}
                onClick={() => {


                  navigate(`/${text?.toLowerCase()}`);


                }}>
                <ListItemIcon className={classes.hoverIcons}>
                  <SpeedIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Back-Channel", "Info", "Archive"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                name={text}
                onClick={() => {
                  navigate(`/${text?.toLowerCase()}`);
                }}>
                <ListItemIcon className={classes.hoverIcons}>
                  {index === 0 && <LowPriorityIcon />}
                  {index === 1 && <InfoOutlinedIcon />}
                  {index === 2 && <MessageIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Checklist", "Logs"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton>
                <ListItemIcon className={classes.hoverIcons}>
                  {index === 0 ? <ChecklistOutlinedIcon /> : <MonitorHeartOutlinedIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Container component="main" sx={{ flexGrow: 1 }} style={{ marginTop: 100 }}>
        {children}
      </Container>
    </Box>
  );
}
