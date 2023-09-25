// reducers.js
import { dummy_config } from "./dummy-conf";
import { createSlice } from "@reduxjs/toolkit";

const initialState = dummy_config;

// jsonReducer.js

const jsonSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    updateAll(state, action) {
      const { payload } = action;

      const newConf = payload?.payload;
      const { meta } = payload || null;
      const { actionType } = meta || {};

      if (actionType === "fromA") {
        //system
        state.system.a4updater_version.industrial =
          newConf?.system?.a4updater_version?.industrial;
        state.system.hostname.industrial =
          newConf?.system?.hostname?.industrial;
        state.system.network.industrial = newConf?.system?.network?.industrial;
        //services
        state.services.kepware = newConf?.services?.kepware;
        state.services.backchannel = newConf?.services?.backchannel;
        state.services.fastdata.industrial.ftp =
          newConf?.services?.fastdata?.industrial?.ftp;
        state.services.fastdata.industrial.http =
          newConf?.services?.fastdata?.industrial?.http;
        state.version = newConf?.version;
      } else if (actionType === "fromB") {
        //system
        state.system.a4updater_version.customer =
          newConf?.system?.a4updater_version?.customer;
        state.system.hostname.customer = newConf?.system?.hostname?.customer;
        state.system.network.customer = newConf?.system?.network?.customer;

        //services
        state.services.sitemanager = newConf?.services?.sitemanager;
        state.services.thingworx = newConf?.services?.thingworx;
        state.services.opcua = newConf?.services?.opcua;
        state.services.http = newConf?.services?.http;
        state.services.fastdata.customer.matrix =
          newConf?.services?.fastdata?.customer?.matrix;
        state.services.fastdata.enabled = newConf?.services?.fastdata?.enabled;
        state.services.fastdata.running = newConf?.services?.fastdata?.running;
      } else if (actionType === "fromBackup") {
        state = newConf;
      }
      state.timestamp = newConf?.timestamp;
    },
    updateHostName(state, action) {
      const { newHostName } = action.payload;
      state.system.hostname = newHostName;
    },
    updateInternalPC(state, action) {
      const { newInternalPC } = action.payload;
      state.system = {
        ...state.system,
        ...newInternalPC,
      };
    },
    updateIndustrialNetwork(state, action) {
      const { newIndustrial } = action.payload;
      state.system.network.industrial = newIndustrial;
    },
    updateKepware(state, action) {
      const { newKepware } = action.payload;
      state.services.kepware = newKepware;
    },
    updateExternalPC(state, action) {
      const { newExternalPC } = action.payload;
      state.system = {
        ...state.system,
        ...newExternalPC,
      };
    },
    updateCustomerNetwork(state, action) {
      const { newCustomer } = action.payload;
      state.system.network.customer = newCustomer;
    },
    updatePingResult(state, action) {
      const newPingResult = action.payload;
      console.log(newPingResult);
      state.system.network.customer.ping = newPingResult;
    },
    updateFirewallEnable(state, action) {
      const newFirewallEnabled = action.payload;
      state.system.network.customer.firewall_enabled = newFirewallEnabled;
    },
    updateSitemanager(state, action) {
      const { newSitemanager } = action.payload;
      state.services.sitemanager = newSitemanager;
    },
    updateSitemanagerEnable(state, action) {
      const newSitemanagerEnabled = action.payload;
      state.services.sitemanager.enabled = newSitemanagerEnabled;
    },
    updateThingworx(state, action) {
      const { newThingworx } = action.payload;
      state.services.thingworx = newThingworx;
    },
    updateThingNames(state, action) {
      const newThingNames = action.payload;
      state.services.thingworx.thing_names = newThingNames;
    },
    updateThingworxEnable(state, action) {
      const newThingworxEnabled = action.payload;
      state.services.thingworx.enabled = newThingworxEnabled;
    },
    updateOPCServer(state, action) {
      const { newOPCUAServer } = action.payload;
      state.services.opcua = newOPCUAServer;
    },
    updateOPCServerEnable(state, action) {
      const newOPCServerEnabled = action.payload;
      state.services.opcua.enabled = newOPCServerEnabled;
    },
    updateHTTPServerEnable(state, action) {
      const newHTTPServerEnabled = action.payload;
      state.services.http.enabled = newHTTPServerEnabled;
    },
    updateBackChannel(state, action) {
      const { newBackChannel } = action.payload;
      state.services.backchannel = newBackChannel;
    },
    updateFastDataFTP(state, action) {
      const { newFastDataFTP } = action.payload;
      state.services.fastdata.industrial.ftp = newFastDataFTP;
    },
    updateFastDataFTPEnable(state, action) {
      const ftpEnable = action.payload;
      state.services.fastdata.industrial.ftp.enabled = ftpEnable;
    },
    updateFastDataHTTPEnable(state, action) {
      const httpEnable = action.payload;
      state.services.fastdata.industrial.http.enabled = httpEnable;
    },
    updateFastDataMatrixEnable(state, action) {
      const matrixEnable = action.payload;
      state.services.fastdata.customer.matrix.enabled = matrixEnable;
    },
    updateFastDataHTTP(state, action) {
      const { newFastDataHTTP } = action.payload;
      state.services.fastdata.industrial.http = newFastDataHTTP;
    },
    updateFastDataMatrix(state, action) {
      const { newFastDataMatrix } = action.payload;
      state.services.fastdata.customer.matrix = newFastDataMatrix;
    },
    updateFastDataServices(state, action) {
      const { newFastDataServices } = action.payload;
      state.services.fastdata.enabled = newFastDataServices.fastdata;
      state.services.fastdata.industrial.ftp.enabled = newFastDataServices.ftp;
      state.services.fastdata.industrial.http.enabled =
        newFastDataServices.http;
      state.services.fastdata.customer.matrix.enabled =
        newFastDataServices.matrix;
    },
  },
});

export const {
  updateAll,
  updateHostName,
  updateInternalPC,
  updateIndustrialNetwork,
  updateKepware,
  updateExternalPC,
  updateCustomerNetwork,
  updatePingResult,
  updateThingworx,
  updateThingNames,
  updateSitemanager,
  updateOPCServer,
  updateFirewallEnable,
  updateSitemanagerEnable,
  updateThingworxEnable,
  updateOPCServerEnable,
  updateHTTPServerEnable,
  updateBackChannel,
  updateFastDataFTP,
  updateFastDataHTTP,
  updateFastDataMatrix,
  updateFastDataFTPEnable,
  updateFastDataHTTPEnable,
  updateFastDataMatrixEnable,
  updateFastDataServices,
} = jsonSlice.actions;
export const config = jsonSlice.reducer;
