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
    const dispatch = useDispatch();

    useEffect(() => {
        setSitemanagerEnabled(serviceStatus?.sitemanager?.enabled);
        setThingworxEnabled(serviceStatus?.thingworx?.enabled);
        setOPCUAServerEnabled(serviceStatus?.opcua?.enabled);
        setHTTPServerEnabled(serviceStatus?.http?.enabled);
    }, [serviceStatus]);

    const location = useLocation();

    const currentURLArray = location.pathname.split("/");

    const serviceName = location?.pathname?.split("/")[location?.pathname?.split("/").length - 1].split("-")[0]
    const handleChange = () => {
        if (serviceName === "sitemanager") {
            setSitemanagerEnabled(false)
            dispatch(updateSitemanager({ enabled: false }));
        } else if (serviceName === "thingworx") {
            setThingworxEnabled(false)
            dispatch(updateThingworx({ enabled: false }));
        } else if (serviceName === "opcua") {
            setOPCUAServerEnabled(false)
            dispatch(updateOPCServer({ enabled: false }));
        } else if (serviceName === "http") {
            setHTTPServerEnabled(false)
            dispatch(updateHTTPServer({ enabled: false }));
        }

        currentURLArray.pop()
        navigate(`/${currentURLArray.toString().replace(',', '')}`);

    }

    return (
        <><Typography >{serviceName && serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} service status:</Typography>
            <div><FormControlLabel control={<Switch checked={(serviceName === "sitemanager" && sitemanagerEnabled) || (serviceName === "thingworx" && thingworxEnabled) || (serviceName === "opcua" && opcuaServerEnabled) || (serviceName === "http" && httpServerEnabled) || false} />} label="Enabled" onChange={handleChange} /></div></>
    );
}
