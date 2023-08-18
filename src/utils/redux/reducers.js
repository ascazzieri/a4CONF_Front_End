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
        state.services.ftp = newConf?.services?.ftp;
        state.services.opcua = newConf?.services?.opcua;
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
    updateBackChannel(state, action) {
      const { newBackChannel } = action.payload;
      state.services.backchannel = newBackChannel;
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
  updateThingworx,
  updateThingNames,
  updateSitemanager,
  updateOPCServer,
  updateFirewallEnable,
  updateSitemanagerEnable,
  updateThingworxEnable,
  updateOPCServerEnable,
  updateBackChannel,
} = jsonSlice.actions;
export const config = jsonSlice.reducer;
