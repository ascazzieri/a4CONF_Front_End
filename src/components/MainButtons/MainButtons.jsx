import { styled } from "@mui/material/styles";
import * as React from "react";
import { useDispatch } from "react-redux";
import { updateAll } from "../../utils/redux/reducers";
import { get_confA, get_confB } from "../../utils/api";
import { SnackbarContext } from "../../utils/context/SnackbarContext";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CachedIcon from '@mui/icons-material/Cached';
import { Snackbar, Alert } from "@mui/material"
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import applied_logo_cropped from "../../media/img/applied_logo_cropped.png";
import { SparkContext } from "../RerenderSpark/RerenderSparkContext";
import background_tech from "../../media/img/tech_background.jpg";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useContext } from "react";

const StyledButton = styled("div")`
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

  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const handleInternalReload = async () => {
    const confA = await get_confA();
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
      console.log(confA)
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Error on loading PCA configuration`,
      });
    }

    /* sparkContext[1](!sparkContext[0])
    console.log(sparkContext) */
  }
  return (
    <StyledButton>
      <div className="img-wrapper-1">
        <div className="img-wrapper">
          <CachedIcon onClick={handleInternalReload} className="reload-icon" color="primary" />
        </div>
      </div>
      <span>ReloadA</span>
    </StyledButton>

  );
};
const ReloadExternal = () => {

  const dispatch = useDispatch()

  const snackBarContext = useContext(SnackbarContext)

  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const handleExternalReload = async () => {
    const confB = await get_confB();
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


  }
  return (
    <StyledButton>
      <div className="img-wrapper-1">
        <div className="img-wrapper">
          <CachedIcon onClick={handleExternalReload} className="reload-icon" color="primary" />
        </div>
      </div>
      <span>ReloadB</span>
    </StyledButton>
  );
};

const ApplyChanges = () => {
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
      <span>Apply</span>
    </StyledButton>
  );
};
const DownloadConfig = () => {
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
      <span>Download</span>
    </StyledButton>
  );
};
const UploadConfig = () => {
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
      <span>Upload</span>
    </StyledButton>
  );
};
const Checklist = () => {
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
      <span>Checklist</span>
    </StyledButton>
  );
};



export default function SpeedDialTooltipOpen() {
  const [openUpper, setOpenUpper] = React.useState(false);
  const [openBottom, setOpenBottom] = React.useState(false);
  const handleOpenUpper = () => setOpenUpper(true);
  const handleCloseUpper = () => setOpenUpper(false);
  const handleOpenBottom = () => setOpenBottom(true);
  const handleCloseBottom = () => setOpenBottom(false);

  const upperActions = [
    { icon: <ReloadInternal />, name: "Reload PCA" },
    { icon: <ReloadExternal />, name: "Reload PCB" },
  ];

  const bottomActions = [
    { icon: <ApplyChanges />, name: "send to a4GATE" },
    { icon: <DownloadConfig />, name: "download JSON" },
    { icon: <UploadConfig />, name: "upload JSON" },
    { icon: <Checklist />, name: "modified data list" },
  ];


  return (

    <Box sx={{ height: "100%" }}>
      <Backdrop open={openUpper} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip upper"
        sx={{ position: "fixed", top: 100, right: 10, textAlign: "center" }}
        icon={<SpeedDialIcon />}
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
      <Backdrop open={openBottom} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip bottom"
        sx={{ position: "fixed", bottom: 10, right: 10, textAlign: "center" }}
        icon={<SpeedDialIcon />}
        onClose={handleCloseBottom}
        onOpen={handleOpenBottom}
        open={openBottom}
      >
        {bottomActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleCloseBottom}
            style={{ width: 120, justifyContent: "center", margin: 5 }}
          />
        ))}
      </SpeedDial>
    </Box>

  );
}
