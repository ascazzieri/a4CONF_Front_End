/* eslint-disable default-case */
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormControl, Stack, Grid } from "@mui/material"
import Switch from '@mui/material/Switch';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    updateSitemanager,
    updateThingworx,
    updateOPCServer,
    updateHTTPServer,
    updateFastData,
    updateExternalPC,
    updateFirewallEnable
} from "../../utils/redux/reducers";
import { Typography } from "@mui/material";
import { service_reboot_data, service_status_desc } from "../../utils/titles";

export default function ServiceDisabler() {

    const serviceStatus = useSelector((state) => state?.services);

    const firewallStatus = useSelector((state) => state?.system?.network?.customer?.firewall_enabled)

    const externalPCReboot = useSelector((state) => state?.system.reboot);

    const navigate = useNavigate()

    const [firewallEnabled, setFirewallEnabled] = useState(firewallStatus)

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
    const [rebootData, setRebootData] = useState(externalPCReboot);

    const dispatch = useDispatch();

    const handleExternalPCChange = (event) => {
        const checked = event?.target?.checked;
        setRebootData(checked);
        const newExternalPC = {
            reboot: checked,
        };
        dispatch(updateExternalPC({ newExternalPC }));
    };

    useEffect(() => {
        setFirewallEnabled(firewallStatus)
        setSitemanagerEnabled(serviceStatus?.sitemanager?.enabled);
        setThingworxEnabled(serviceStatus?.thingworx?.enabled);
        setOPCUAServerEnabled(serviceStatus?.opcua?.enabled);
        setHTTPServerEnabled(serviceStatus?.http?.enabled);
        setFastDataEnabled(serviceStatus?.fastdata?.enabled)
        setFTPEnabled(serviceStatus?.fastdata?.industrial?.ftp?.enabled)
        setHTTPEnabled(serviceStatus?.fastdata?.industrial?.http?.enabled)
        setMatrixEnabled(serviceStatus?.fastdata?.customer?.matrix?.enabled)
        setRebootData(externalPCReboot)

    }, [serviceStatus, firewallStatus, externalPCReboot]);

    const location = useLocation();

    const currentURLArray = location.pathname.split("/");

    const isFastData = (currentURLArray[1] === "fast-data") && !currentURLArray[2]

    const serviceName = isFastData ? currentURLArray[1] : location?.pathname?.split("/")[location?.pathname?.split("/").length - 1].split("-")[0]
    const handleChange = (event) => {
        const checked = event?.target?.checked
        if (serviceName === "network") {
            setFirewallEnabled(checked)
            dispatch(updateFirewallEnable({ firewall_enabled: checked }));
        }
        else if (serviceName === "sitemanager") {
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

        if (serviceName !== "network" && (serviceName !== "fast-data" || currentURLArray[2])) {
            currentURLArray.pop()
            navigate(`/${currentURLArray.toString().replace(',', '')}`);
        }

    }
    return (
        <Grid container>
            <Grid item md={12} sm={12}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-start">
                    <Typography title={service_status_desc}>{serviceName && serviceName.replace("network", "firewall").charAt(0).toUpperCase() + serviceName.replace("network", "firewall").slice(1)} service status:</Typography>
                    <FormControlLabel control={<Switch checked={
                        (serviceName === "network" && firewallEnabled) ||
                        (serviceName === "sitemanager" && sitemanagerEnabled) ||
                        (serviceName === "thingworx" && thingworxEnabled) ||
                        (serviceName === "opcua" && opcuaServerEnabled) ||
                        (serviceName === "http" && httpServerEnabled) ||
                        (serviceName === "ftp" && ftpEnabled) ||
                        (currentURLArray[1] === 'fast-data' && serviceName === "http" && httpEnabled) ||
                        (serviceName === "matrix" && matrixEnabled) ||
                        (serviceName === "fast-data" && fastDataEnabled) ||
                        false} />} label={serviceName === "network" ? (firewallEnabled ? "Enabled" : "Disabled") : (isFastData ? (fastDataEnabled ? "Enabled" : "Disabled") : "Enabled")} onChange={handleChange} />
                </Stack>
            </Grid>
            <Grid item md={12} sm={12}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl title={service_reboot_data}>Reboot Data Sender</FormControl>
                    <Switch
                        checked={rebootData || false}
                        onChange={handleExternalPCChange}
                    />
                    <Typography>Enabled</Typography>
                </Stack>
            </Grid>

        </Grid>


    );
}