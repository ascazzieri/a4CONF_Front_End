import React, { useContext } from "react";
import classes from "./Menu.module.css";
import { useSelector } from "react-redux";
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
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import MessageIcon from "@mui/icons-material/Message";
import GridViewIcon from "@mui/icons-material/GridView";
import MergeIcon from "@mui/icons-material/Merge";
import TuneIcon from "@mui/icons-material/Tune";
import SpeedIcon from "@mui/icons-material/Speed";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid } from "@mui/material";
import MainButtons from "../MainButtons/MainButtons";
import applied_logo_cropped from "../../media/img/applied_logo_cropped.png";
import { getQueuePending, togglePageSleep } from "../../utils/utils";
import { SuperUserContext } from "../../utils/context/SuperUser";
import { SnackbarContext } from "../../utils/context/SnackbarContext";
import { LoadingContext } from "../../utils/context/Loading";
import { send_conf, is_B_ready } from "../../utils/api";
import styled_normal from "styled-components";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

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
  animationName: "fly-1", // Since animation-name cannot be set via inline style directly
  animationDuration: "0.6s",
  animationTimingFunction: "ease-in-out",
  animationIterationCount: "infinite",
  animationDirection: "alternate",
};
const ApplyButton = styled_normal.button`
  position: relative;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  padding-block: 0.5rem;
  padding-inline: 1.25rem;
  background-color: rgb(0, 107, 179);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffff;
  gap: 10px;
  font-weight: bold;
  border: 3px solid #ffffff4d;
  outline: none;
  overflow: hidden;
  font-size: 15px;
  
  &:hover {
    transform: scale(1.05);
    border-color: #fff9;
  }
  
  .icon {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease-in-out;
  }
  
  &:hover .icon {
    transform: translate(4px);
  }
  
  &::before {
    content: "";
    position: absolute;
    width: 100px;
    height: 100%;
    background-image: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0) 70%
    );
    top: 0;
    left: -100px;
    opacity: 0.6;
  }
  
  &:hover::before {
    animation: shine 1.5s ease-out infinite;
  }
`;
const ApplyChanges = () => {
  const config = useSelector((state) => state);
  const snackBarContext = React.useContext(SnackbarContext);
  const loadingContext = React.useContext(LoadingContext);
  const [applyDialog, setApplyDialog] = React.useState(false);

  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const applyChanges = async () => {
    try {
      loadingContext[1](true);
      togglePageSleep("block");
      const res = await send_conf(config);
      togglePageSleep("release");
      if (res) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: "Configuration sent to a4GATE",
        });
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: "Error on sending configuration to a4GATE",
        });
      }
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: "Error on sending configuration to a4GATE",
      });
    } finally {
      if (getQueuePending() === 0) {
        loadingContext[1](false);
      }
    }
  };

  const handleSendConf = async () => {
    const isBReady = await is_B_ready();
    if (isBReady?.ready) {
      applyChanges();
    } else {
      setApplyDialog(true);
    }
  };
  const applyOnlyPCA = async () => {
    await applyChanges();
    setApplyDialog(false);
  };

  return (
    <>
      <ApplyButton onClick={handleSendConf}>
        <div className="img-wrapper-1">
          <div className="img-wrapper">
            <img
              src={applied_logo_cropped}
              height="24"
              width="24"
              alt="applied main button icon"
              className="icon"
            />
          </div>
        </div>
        <span>Apply</span>
      </ApplyButton>
      <Dialog
        open={applyDialog}
        onClose={() => setApplyDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          It Seems some internal a4GATE services are not working correctly!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can apply your configuration to a4GATE but only Data Collector
            will receive it! If this problem persist, reboot a4GATE with the
            physical button and wait every led to turn off before restarting it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialog(false)}>Close</Button>
          <Button variant="contained" color="error" onClick={applyOnlyPCA}>
            Apply on Data Collector Only
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function MiniDrawer(props) {
  const { children } = props;
  const superUser = useContext(SuperUserContext)[0];

  const secondaryMenuList = superUser
    ? ["Help", "Back-Channel", "Archive", "Manage-Users", "Advanced"]
    : ["Help", "User-Settings"];
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const currentURLArray = location.pathname.split("/");

  const mainSectionTitle = currentURLArray[1].replace("-", " ").toUpperCase();

  const handleDrawerOpen = () => {
    if (
      location.pathname.includes("login") ||
      location.pathname.includes("register")
    ) {
      setOpen(false);
    } else {
      setOpen(true);
    }
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
            <img
              src="/img/applied_logo_cropped.png"
              alt="menu icon"
              width={35}
              height={35}
              style={floatingLogo}
            />
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
                {mainSectionTitle}
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
                  src="/img/a4GATE-logo.png"
                  alt="a4GATE logo"
                  width="230"
                  height="70"
                />
              </Title>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "center" }}>
              {!location.pathname.includes("login") &&
                !location.pathname.includes("register") && <ApplyChanges />}
            </Grid>
            <Grid item xs={1} sx={{ textAlign: "center" }}>
              {!currentURLArray.includes("login") &&
                !currentURLArray.includes("register") && <MainButtons />}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {!currentURLArray.includes("login") &&
        !currentURLArray.includes("register") && (
          <Drawer
            variant="permanent"
            open={open}
            onMouseOver={handleDrawerOpen}
            onMouseLeave={handleDrawerClose}
          >
            <DrawerHeader style={{ justifyContent: "center" }}>
              <p style={{ fontWeight: "bolder" }}>
                <img
                  src="/img/applied_logo_cropped.png"
                  alt="menu icon"
                  width={35}
                  height={35}
                  style={floatingLogo}
                />{" "}
                a4CONF
              </p>
            </DrawerHeader>
            <Divider />
            <List>
              {["Dashboard", "Data-Collector", "Data-Sender"].map(
                (text, index) => (
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
                            <MergeIcon name="internal-pc" />
                          ) : (
                            <CallSplitIcon name="external-pc" />
                          )
                        ) : (
                          <GridViewIcon name="dashboard" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </List>
            <Divider />
            <List>
              {["Fast-Data"].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    name={text}
                    onClick={() => {
                      navigate(`/${text?.toLowerCase()}`);
                    }}
                  >
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
              {secondaryMenuList.map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    name={text}
                    onClick={() => {
                      navigate(`/${text?.toLowerCase()}`);
                    }}
                  >
                    <ListItemIcon className={classes.hoverIcons}>
                      {index === 0 && <InfoOutlinedIcon />}
                      {index === 1 &&
                        (superUser ? (
                          <LowPriorityIcon />
                        ) : (
                          <ManageAccountsIcon />
                        ))}
                      {index === 2 && <MessageIcon />}
                      {index === 3 && <PersonAddIcon />}
                      {index === 4 && <TuneIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Drawer>
        )}

      <Container
        component="main"
        sx={{ flexGrow: 1 }}
        style={{ marginTop: 100 }}
      >
        {children}
      </Container>
    </Box>
  );
}
