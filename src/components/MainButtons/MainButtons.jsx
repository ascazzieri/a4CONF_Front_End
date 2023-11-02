import { styled } from "@mui/material/styles";
import * as React from "react";
import { useDispatch } from "react-redux";
import { updateAll } from "../../utils/redux/reducers";
import { get_confA, get_confB } from "../../utils/api";
import { SnackbarContext } from "../../utils/context/SnackbarContext";
import { LoadingContext } from "../../utils/context/Loading";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CachedIcon from '@mui/icons-material/Cached';
import { downloadJSON, add_recovery_ip, remove_recovery_ip } from "../../utils/api"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import applied_logo_cropped from "../../media/img/applied_logo_cropped.png";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { SuperUserContext } from "../../utils/context/SuperUser";
import { togglePageSleep } from "../../utils/utils";

export const StyledButton = styled("div")`
  && {
    font-family: inherit;
    font-size: 20px;
    color: white;
    background-color: #3e4756;
    padding: 10px 120px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    &:hover {
      background-color: #e2ecff;
    }

    span {
      display: flex; // Aggiunto display flex per allineare il testo verticalmente
      align-items: center; // Allinea verticalmente il testo al centro
      width: 100%; // Larghezza al 100% per occupare lo spazio rimanente
      margin-left: 0.1em;
      margin-right: 3.5em;
      transition: all 0.3s ease-in-out;
    }

    img {
      display: block;
      transform-origin: center center;
      transition: transform 0.3s ease-in-out;
    }
    .reload-icon {
      display: block;
      transform-origin: center center;
      transition: transform 0.3s ease-in-out;
    }
    .admin-icon {
      display: block
      transition: transform 0.3s ease-in-out
      
    }
    &:hover .admin-icon {
      transform: translateX(1.8em) scale(1.5);
    }

    &:hover .img-wrapper {
      animation: fly-1 0.6s ease-in-out infinite alternate;
    }

    &:hover img {
      transform: translateX(2.25em) rotate(45deg) scale(1.5);
    }
    &:hover .reload-icon {
      animation: rotate-1 1.2s ease-in-out infinite;
      
    }

    &:hover span {
      transform: translateX(5em);
    }

    &:active {
      transform: scale(0.95);
    }

    @keyframes fly-1 {
      from {
        transform: translateY(0.1em);
      }

      to {
        transform: translateY(-0.1em);
      }
    }
    @keyframes rotate-1 {
      from {
        transform: translateX(1.8em) rotate(360deg) scale(1.5);
      }
      to {
        transform: translateX(1.8em) rotate(0deg) scale(1.5);
      }
    }
  }
`;
const ReloadInternal = () => {

  const dispatch = useDispatch()

  const snackBarContext = useContext(SnackbarContext)
  const loadingContext = useContext(LoadingContext)

  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const handleInternalReload = async () => {
    loadingContext[1](true)
    togglePageSleep('block')
    const confA = await get_confA();
    togglePageSleep('release')
    console.log("get conf A")

    if (confA) {
      dispatch(updateAll({ payload: confA, meta: { actionType: "fromA" } }));

      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Configuration loaded from PCA`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Error on loading PCA configuration`,
      });
    }
    loadingContext[1](false)
  }
  return (
    <StyledButton onClick={handleInternalReload}>
      <div className="img-wrapper-1">
        <div className="img-wrapper">
          <CachedIcon className="reload-icon" color="primary" />
        </div>
      </div>
      <span>ReloadA</span>
    </StyledButton>

  );
};
const ReloadExternal = () => {

  const dispatch = useDispatch()

  const snackBarContext = useContext(SnackbarContext)
  const loadingContext = useContext(LoadingContext)

  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const handleExternalReload = async () => {
    loadingContext[1](true)
    togglePageSleep('block')
    const confB = await get_confB();
    togglePageSleep('release')
    console.log("get conf B")
    if (confB) {
      dispatch(updateAll({ payload: confB, meta: { actionType: "fromB" } }));
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Configuration loaded from PCB`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Error on loading PCB configuration`,
      });
    }
    loadingContext[1](false)

  }
  return (
    <StyledButton onClick={handleExternalReload}>
      <div className="img-wrapper-1">
        <div className="img-wrapper">
          <CachedIcon className="reload-icon" color="primary" />
        </div>
      </div>
      <span>ReloadB</span>
    </StyledButton>
  );
};

const DownloadConfig = () => {
  const config = useSelector((state) => state)
  return (
    <StyledButton onClick={() => downloadJSON(config)}>
      <div className="img-wrapper-1">
        <div className="img-wrapper">
          <img
            src={applied_logo_cropped}
            height="24"
            width="24"
            alt="applied main button icon"
          />
        </div>
      </div>
      <span>Download</span>
    </StyledButton>
  );
};
const UploadConfig = () => {
  const dispatch = useDispatch();

  const snackBarContext = React.useContext(SnackbarContext);
  const loadingContext = React.useContext(LoadingContext)

  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const handleFileUpload = async (event) => {
    loadingContext[1](true)
    const file = event.target.files[0];
    console.log(file)
    togglePageSleep('block')
    const fileContent = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsText(file);
    });
    togglePageSleep('release')

    try {
      const jsonObject = JSON.parse(fileContent);
      if (jsonObject?.crashed_page) {
        delete jsonObject.crashed_page
      }
      console.log(jsonObject)
      if (jsonObject?.system?.network?.industrial?.recovery_ip_needed === true) {
        console.log("serve ip di recupero")
        const response = await add_recovery_ip();
        if (response) {
          alert("Recovery IP key has been find inside loaded back up and it has been restored successfully")
        } else {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `Recovery IP key has been find inside back-up configuration but something wrong happed trying to restore it `,
          });
        }
      } else if (jsonObject?.system?.network?.industrial?.recovery_ip_needed === false) {
        console.log("togli ip di recupero")
        const response = await remove_recovery_ip();
        if (response) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "success",
            message: `Absence of Recovery IP key has been found inside back-up configuration and it has been removed correctly`,
          });
        } else {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `Absence of recovery IP key has been found inside back-up configuration but something wrong happen trying to removing it`,
          });
        }
      }
      dispatch(updateAll({ payload: jsonObject, meta: { actionType: "upload" } }));

      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: "Uploaded JSON configuration",
      });
    } catch (error) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: "Error parsing JSON file",
      });
    }
    const inputAnchor = document.getElementById("upload-backup-input")
    inputAnchor.value = ""
    loadingContext[1](false)

  };
  return (
    <StyledButton>

      <div className="img-wrapper-1">
        <div className="img-wrapper">
          <img
            src={applied_logo_cropped}
            height="24"
            width="24"
            alt="applied main button icon"
          />
        </div>
      </div>
      <input
        type="file"
        accept=".json"
        style={{ position: 'fixed', width: '120px', height: 50, right: 15, opacity: 0}}
        onChange={handleFileUpload}
        id="upload-backup-input"
      />
      <span>Upload</span>
    </StyledButton>
  );
};

const AdminEl = () => {

  const navigate = useNavigate();

  const handleClick = () => {

    navigate('/login', { state: { elevation: true } });

  }
  return (
    <StyledButton onClick={() => handleClick()}>
      <div className="img-wrapper-1">
        <div className="img-wrapper">
          <AdminPanelSettingsIcon sx={{ fontSize: 25 }} className="admin-icon" color="primary" />
        </div>
      </div>
      <span>Admin</span>
    </StyledButton>
  );
};

export default function SpeedDialTooltipOpen() {
  const [openUpper, setOpenUpper] = React.useState(false);
  /*   const [openBottom, setOpenBottom] = React.useState(false); */
  const handleOpenUpper = () => setOpenUpper(true);
  const handleCloseUpper = () => setOpenUpper(false);
  const superUser = useContext(SuperUserContext)
  /*   const handleOpenBottom = () => setOpenBottom(true);
    const handleCloseBottom = () => setOpenBottom(false); */

  const upperActions = superUser[0] ? [
    { icon: <ReloadInternal />, name: "reload PCA" },
    { icon: <ReloadExternal />, name: "reload PCB" },
    { icon: <DownloadConfig />, name: "download JSON" },
    { icon: <UploadConfig />, name: "upload JSON" },
  ] : [
    { icon: <ReloadInternal />, name: "reload PCA" },
    { icon: <ReloadExternal />, name: "reload PCB" },
    { icon: <DownloadConfig />, name: "download JSON" },
    { icon: <UploadConfig />, name: "upload JSON" },
    { icon: <AdminEl />, name: "admin elevation" },
  ];

  return (

    <Box sx={{ height: "100%" }}>
      <Backdrop open={openUpper} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip upper"
        sx={{ position: "fixed", top: 25, right: 10 }}
        icon={<MoreHorizIcon />}
        onClose={handleCloseUpper}
        onOpen={handleOpenUpper}
        open={openUpper}
        direction="down"
      >
        {upperActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleCloseUpper}
            style={{ width: 120, justifyContent: "center", margin: 5 }}
          />
        ))}
      </SpeedDial>

    </Box>

  );
}
