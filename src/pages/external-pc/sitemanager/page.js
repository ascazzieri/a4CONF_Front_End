import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSitemanager } from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import {
  agents_vendor_list,
  agent_vendor_device_type,
} from "../../../utils/utils";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import BackButton from "../../../components/BackButton/BackButton";
import Table from "../../../components/Table/Table";
import {
  Autocomplete,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveButton from "../../../components/SaveButton/SaveButton";
import {
  sitemanager_activation_desc,
  sitemanager_device_name_desc,
  sitemanager_domain_desc,
  sitemanger_agents_desc,
  sitemanger_server_address_desc,
} from "../../../utils/titles";

export default function Sitemanager() {
  const sitemanager = useSelector((state) => state.services?.sitemanager);
  /* const industrialIP = useSelector(
    (state) => state.json.config.system.network.industrial.ip
  ); */
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState(0);
  const superUser = useContext(SuperUserContext)[0];
  const navbarItems = superUser
    ? ["Gate manager", "Advanced", "Agents", "JSON"]
    : ["Gate manager", "Advanced", "Agents"];

  const getArrayFromAgentsObject = (agentsObject) => {
    let agentsArrayOfObjects = [];
    if (agentsObject && Object.keys(agentsObject).length !== 0) {
      Object.keys(agentsObject).forEach((item, index) =>
        agentsArrayOfObjects.push({
          agent: agentsObject[`${item}`]?.agent,
          name: agentsObject[`${item}`]?.name,
          sn: agentsObject[`${item}`]?.sn,
          cfg: agentsObject[`${item}`]?.cfg,
        })
      );
    }

    return agentsArrayOfObjects;
  };

  const [smeDomain, setSMEDomain] = useState(sitemanager?.domain);
  const [smeServer, setSMEServer] = useState(sitemanager?.server);
  const [onlybidir, setOnlyBidir] = useState(sitemanager?.onlybidir);
  const [nameashostname, setNameAsHostName] = useState(
    sitemanager?.nameashostname
  );
  const [smeName, setSMEName] = useState(sitemanager?.name);

  const [currentAgentVendor, setCurrentAgentVendor] = useState();
  const [currentAgentType, setCurrentAgentType] = useState();

  const [agentsTableData, setAgentTableData] = useState(
    getArrayFromAgentsObject(sitemanager?.agents)
  );

  useEffect(() => {
    setSMEDomain(sitemanager?.domain);
    setSMEServer(sitemanager?.server);
    setOnlyBidir(sitemanager?.onlybidir);
    setNameAsHostName(sitemanager?.nameashostname);
    setSMEName(sitemanager?.name);
    setAgentTableData(getArrayFromAgentsObject(sitemanager?.agents));
  }, [sitemanager]);

  const handleDomainChange = (event) => {
    setSMEDomain(event.target.value);
  };
  const handleServerChange = (event) => {
    setSMEServer(event.target.value);
  };
  const handleOnlyBidirChange = (event) => {
    setOnlyBidir(event.target.checked);
  };
  const handleNameAsHostNameChange = (event) => {
    setNameAsHostName(event.target.checked);
  };
  const handleSMENameChange = (event) => {
    setSMEName(event.target.value);
  };

  const handleAddAgent = () => {
    const oldAgents = agentsTableData ? [...agentsTableData] : [];
    const dummy_agent = {
      agent: `${currentAgentVendor}:${currentAgentType}`,
      cfg: "",
      name: "",
      sn: "",
    };
    const isDuplicate = oldAgents.some(
      (item) =>
        item?.agent === dummy_agent?.agent &&
        item?.cfg === "" &&
        item?.name === "" &&
        item?.sn === ""
    );
    if (isDuplicate) {
      return;
    }
    oldAgents.push(dummy_agent);

    setAgentTableData(oldAgents);
  };

  const handleSitemanagerSubmit = (event) => {
    event.preventDefault();

    let smeAgents = {};

    agentsTableData?.length !== 0 &&
      agentsTableData?.map(
        (item, index) =>
          (smeAgents[`Agent${index + 1}`] = {
            agent: item?.agent,
            name: item?.name,
            sn: item?.sn,
            cfg: item?.cfg,
          })
      );

    const newSitemanager = {
      domain: smeDomain,
      server: smeServer,
      onlybidir: onlybidir,
      enabled: sitemanager?.enabled,
      nameashostname: nameashostname,
      name: !nameashostname ? smeName : "",
      agents: smeAgents,
    };
    dispatch(updateSitemanager(newSitemanager));
  };

  const agentsColumnData = [
    {
      accessorKey: "agent",
      header: "Agent",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
    {
      accessorKey: "name",
      header: "Name",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
    {
      accessorKey: "sn",
      header: "S/N",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
    {
      accessorKey: "cfg",
      header: "CFG",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
  ];
  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="Sitemanager" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 3 && superUser && <JSONTree data={sitemanager} />}

        <form onSubmit={handleSitemanagerSubmit}>
          {currentTab === 0 && (
            <>
              <FormControl fullWidth>
                <FormLabel title={sitemanager_domain_desc}>
                  Gatemanager domain path:
                </FormLabel>

                <TextField
                  title={sitemanager_domain_desc}
                  type="text"
                  label="Domain"
                  helperText="Gate Manager Domain"
                  value={smeDomain || ""}
                  required={true}
                  onChange={handleDomainChange}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <FormLabel title={sitemanger_server_address_desc}>
                  Server address:
                </FormLabel>

                <TextField
                  type="text"
                  label="Server"
                  helperText="Gate Manager IP Address"
                  value={smeServer || ""}
                  onChange={handleServerChange}
                />
              </FormControl>
              <Divider />
            </>
          )}
          {currentTab === 1 && (
            <>
              <FormControl fullWidth>
                <FormLabel title={sitemanager_activation_desc}>
                  Sitemanager activation
                </FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Always</Typography>

                  <Switch
                    checked={onlybidir}
                    onChange={handleOnlyBidirChange}
                  />

                  <Typography>Only in bidirectionl mode</Typography>
                </Stack>
              </FormControl>

              <Divider />

              <FormControl fullWidth>
                <FormLabel title={sitemanager_device_name_desc}>
                  Gatemanager device name
                </FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Use a custom name for Gate Manager</Typography>

                  <Switch
                    checked={nameashostname}
                    onChange={handleNameAsHostNameChange}
                  />

                  <Typography>Use a4GATE Hostname</Typography>
                </Stack>
              </FormControl>

              {!nameashostname && (
                <>
                  <FormControl fullWidth>
                    <FormLabel>Gate manager device name:</FormLabel>

                    <TextField
                      type="text"
                      label="Name"
                      helperText="Gate Manager device name"
                      value={smeName || ""}
                      required={!nameashostname ? true : false}
                      onChange={handleSMENameChange}
                    />
                  </FormControl>
                </>
              )}

              <Divider />
            </>
          )}

          {currentTab === 2 && (
            <>
              <FormLabel title={sitemanger_agents_desc}>Agents</FormLabel>

              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <Autocomplete
                  disablePortal
                  id="agent-vendor"
                  options={agents_vendor_list}
                  sx={{ width: 300 }}
                  value={currentAgentVendor || null}
                  onChange={(event, newValue) => {
                    setCurrentAgentVendor(newValue);
                    setCurrentAgentType()
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Vendor" />
                  )}
                />

                <Autocomplete
                  disablePortal
                  id="agent-type"
                  options={
                    currentAgentVendor
                      ? agent_vendor_device_type[currentAgentVendor]
                      : []
                  }
                  value={currentAgentType || null}
                  disabled={!currentAgentVendor}
                  sx={{ width: 300 }}
                  onChange={(event, newValue) => {
                    setCurrentAgentType(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Type" />
                  )}
                />

                <Button
                  disabled={!currentAgentVendor || !currentAgentType}
                  onClick={handleAddAgent}
                  variant="contained"
                >
                  Add Agent
                </Button>
              </Stack>

              <Table
                tableData={agentsTableData}
                setTableData={setAgentTableData}
                columnsData={agentsColumnData}
              />

              <Divider />
            </>
          )}

          {currentTab !== 3 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
