// reducers.js
import { dummy_config } from "./dummy-conf";
import { createSlice } from "@reduxjs/toolkit";
import { deepMerge } from "../utils";
import _ from "lodash";

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
        state.services.fastdata = {
          ...state.services.fastdata,
          ...newConf?.services?.fastdata,
        };
      } else if (actionType === "fromBackup") {
        const mergedObject = deepMerge({ ...state }, newConf);
        state = mergedObject;
      }
      state.timestamp = newConf?.timestamp;
    },
    updateHostName(state, action) {
      const { newHostName } = action.payload;
      state.system.hostname = {
        ...state.system.hostname,
        ...newHostName,
      };
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
      state.system.network.industrial = {
        ...state.system.network.industrial,
        ...newIndustrial,
      };
    },
    updateKepware(state, action) {
      const { newKepware } = action.payload;
      state.services.kepware = {
        ...state.services.kepware,
        ...newKepware,
      };
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
      state.system.network.customer = {
        ...state.system.network.customer,
        ...newCustomer,
      };
    },
    updatePingResult(state, action) {
      const newPingResult = action.payload;
      state.system.network.customer.ping = {
        ...state.system.network.customer.ping,
        ...newPingResult,
      };
    },
    updateFirewallEnable(state, action) {
      const newFirewallEnabled = { firewall_enabled: action.payload };
      state.system.network.customer = deepMerge(
        ...state.system.network.customer,
        newFirewallEnabled
      );
    },
    updateSitemanager(state, action) {
      const newSitemanager = action.payload;
      state.services.sitemanager = {
        ...state.services.sitemanager,
        ...newSitemanager,
      };
    },
    updateThingworx(state, action) {
      const newThingworx = action.payload;
      state.services.thingworx = {
        ...state.services.thingworx,
        ...newThingworx,
      };
    },
    updateThingNames(state, action) {
      const newThingNames = action.payload;
      state.services.thingworx.thing_names = {
        ...state.services.thingworx.thing_names,
        ...newThingNames,
      };
    },
    updateOPCServer(state, action) {
      const newOPCUAServer = action.payload;
      state.services.opcua = {
        ...state.services.opcua,
        ...newOPCUAServer,
      };
    },
    updateHTTPServer(state, action) {
      const newHTTPServer = action.payload;
      state.services.http = {
        ...state.services.http,
        ...newHTTPServer,
      };
    },
    updateBackChannel(state, action) {
      const { newBackChannel } = action.payload;
      state.services.backchannel = {
        ...state.services.backchannel,
        ...newBackChannel,
      };
    },
    updateFastData(state, action) {
      const newFastData = action.payload;
      const oldFastData = { ...state.services.fastdata };
      state.services.fastdata = _.merge(oldFastData, newFastData);
    },
    updateUserList(state, action) {
      const newCurrentUser = action.payload;
      const oldUsers = state.users;
      if (oldUsers.length > 200) {
        oldUsers.shift();
      }
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const currentDateTime = new Date()
        .toLocaleString("en-US", options)
        .replace(/\//g, "-");
      state.users = oldUsers.push({ currentDateTime: newCurrentUser });
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
  updateHTTPServer,
  updateFirewallEnable,
  updateBackChannel,
  updateFastData,
  updateUserList,
} = jsonSlice.actions;
export const config = jsonSlice.reducer;
