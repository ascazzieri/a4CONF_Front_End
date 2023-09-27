/* eslint-disable default-case */
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    updateSitemanager,
    updateThingworx,
    updateOPCServer,
    updateHTTPServer,
    updateFastData
} from "../../utils/redux/reducers";
import { Typography } from "@mui/material";

export default function ServiceDisabler() {

    const serviceStatus = useSelector((state) => state?.services);

    const navigate = useNavigate()

    const [sitemanagerEnabled, setSitemanagerEnabled] = useState(
        serviceStatus?.sitemanager?.enabled
    );

    const [thingworxEnabled, setThingworxEnabled] = useState(
        serviceStatus?.thingworx?.enabled
    );

    const [opcuaServerEnabled, setOPCUAServerEnabled] = useState(
        serviceStatus?.opcua?.enabled
    );

    const [httpServerEnabled, setHTTPServerEnabled] = useState(
        serviceStatus?.http?.enabled
    );

    const [fastDataEnabled, setFastDataEnabled] = useState(serviceStatus?.fastdata?.enabled)

    const [ftpEnabled, setFTPEnabled] = useState(
        serviceStatus?.fastdata?.industrial?.ftp?.enabled
    );

    const [httpEnabled, setHTTPEnabled] = useState(
        serviceStatus?.fastdata?.industrial?.http?.enabled
    );

    const [matrixEnabled, setMatrixEnabled] = useState(
        serviceStatus?.fastdata?.customer?.matrix?.enabled
    );

    const dispatch = useDispatch();

    useEffect(() => {
        setSitemanagerEnabled(serviceStatus?.sitemanager?.enabled);
        setThingworxEnabled(serviceStatus?.thingworx?.enabled);
        setOPCUAServerEnabled(serviceStatus?.opcua?.enabled);
        setHTTPServerEnabled(serviceStatus?.http?.enabled);
        setFastDataEnabled(serviceStatus?.fastdata?.enabled)
        setFTPEnabled(serviceStatus?.fastdata?.industrial?.ftp?.enabled)
        setHTTPEnabled(serviceStatus?.fastdata?.industrial?.http?.enabled)
        setMatrixEnabled(serviceStatus?.fastdata?.customer?.matrix?.enabled)

    }, [serviceStatus]);

    const location = useLocation();

    const currentURLArray = location.pathname.split("/");

    const isFastData = (currentURLArray[1] === "fast-data") && !currentURLArray[2]

    const serviceName = isFastData ? currentURLArray[1] : location?.pathname?.split("/")[location?.pathname?.split("/").length - 1].split("-")[0]
    const handleChange = (event) => {
        const checked = event?.target?.checked
        console.log(checked)
        if (serviceName === "sitemanager") {
            setSitemanagerEnabled(checked)
            dispatch(updateSitemanager({ enabled: checked }));
        } else if (serviceName === "thingworx") {
            setThingworxEnabled(checked)
            dispatch(updateThingworx({ enabled: checked }));
        } else if (serviceName === "opcua") {
            setOPCUAServerEnabled(checked)
            dispatch(updateOPCServer({ enabled: checked }));
        } else if (currentURLArray[1] === "data-sender" && serviceName === "http") {
            setHTTPServerEnabled(checked)
            dispatch(updateHTTPServer({ enabled: checked }));
        }
        else if (isFastData) {
            setFastDataEnabled(checked)
            dispatch(updateFastData({ enabled: checked }));

        } else if (serviceName === "ftp") {
            setFTPEnabled(checked)
            dispatch(updateFastData({ industrial: { ftp: { enabled: checked } } }));
        }
        else if (currentURLArray[1] === "fast-data" && serviceName === "http") {
            setHTTPEnabled(checked)
            dispatch(
                updateFastData({ industrial: { http: { enabled: checked } } })
            );
        }
        else if (serviceName === "matrix") {
            setMatrixEnabled(checked)
            dispatch(
                updateFastData({ customer: { matrix: { enabled: checked } } })
            );
        }

        if (serviceName !== "fast-data" || currentURLArray[2]) {
            currentURLArray.pop()
            console.log('dio')
            navigate(`/${currentURLArray.toString().replace(',', '')}`);
        }

    }

    return (
        <><Typography >{serviceName && serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} service status:</Typography>
            <div><FormControlLabel control={<Switch checked={
                (serviceName === "sitemanager" && sitemanagerEnabled) ||
                (serviceName === "thingworx" && thingworxEnabled) ||
                (serviceName === "opcua" && opcuaServerEnabled) ||
                (serviceName === "http" && httpServerEnabled) ||
                (serviceName === "ftp" && ftpEnabled) ||
                (currentURLArray[1] === 'fast-data' && serviceName === "http" && httpEnabled) ||
                (serviceName === "matrix" && matrixEnabled) ||
                (serviceName === "fast-data" && fastDataEnabled) ||
                false} />} label="Enabled" onChange={handleChange} /></div></>
    );
}