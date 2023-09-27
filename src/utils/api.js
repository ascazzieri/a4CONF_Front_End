import * as helper from "./utils";
const verbose = window.location.href.includes("verbose");

export const get_version = async () => {
  try {
    const res = await helper.fetchData("/version", "GET");
    const version = res.replace("\n", "").replace("\r", "");
    const version_string = "Version: " + version;
    verbose && console.log("version: " + version_string);
    return version_string;
  } catch (error) {
    console.error(error);
    // Gestisci l'errore come desiderato
  }
};
export const get_ready = async () => {
  //aggiungi il timer al componente che la chiama
  try {
    const res = await helper.fetchData("/ready", "GET");
    verbose && verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const get_confA = async () => {
  try {
    const res = await helper.fetchData("/confA", "GET");
    const conf = helper.confToHTML(res);
    verbose && console.log(res);
    return conf;
  } catch (e) {
    console.error(e);
  }
};
export const get_confB = async () => {
  //ricordati di far chiamare questa funzione con un delay
  try {
    const res = await helper.fetchData("/confB", "GET");
    const conf = helper.confToHTML(res);
    verbose && console.log(res);
    return conf;
  } catch (e) {
    console.error(e);
  }
};
export const send_conf = async (data) => {
  //aggiungi un controllo su cambio della network per avvertire che l'utente potrebbe perdere la sessione
  try {
    const res = await helper.fetchData("/post", "POST", data);
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const createiotgw = async (
  type,
  channel,
  device,
  thingName,
  blob_folder,
  scan_rate,
  publish_rate,
  sampling_time,
  sampling_number_start_index,
  sampling_number,
  tags_list
) => {
  try {
    const res = await helper.fetchData(
      `/createiotgw?channel=${channel}&device=${device}&type=${type}&publish_rate_ms=${publish_rate}&items_scan_rate=${scan_rate}&thing_name=${thingName}&machine_id=${blob_folder}&sampling_time=${sampling_time}&sampling_number_start_index=${sampling_number_start_index}&sampling_number=${sampling_number}`,
      "POST",
      tags_list
    );
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const get_device_tags = async (channel, device) => {
  try {
    const res = await helper.fetchData(
      `/channel/device/tags/tree?channel=${channel}&device=${device}`,
      "GET"
    );
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const loadiotgws = async (direction) => {
  try {
    if (direction === "from") {
      const res = await helper.fetchData("/iotgwhttp", "GET");
      verbose && console.log(res);
      return res;
    } else {
      const res = await helper.fetchData("/iotgwhttpserver", "GET");
      verbose && console.log(res);
      return res;
    }
  } catch (e) {
    console.error(e);
  }
};
export const get_iot_gtws_http_client_enabled = async () => {
  try {
    const res = await helper.fetchData("/iotgw/http/client/enabled", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const get_iot_gtws_http_client_disabled = async () => {
  try {
    const res = await helper.fetchData("/iotgw/http/client/disabled", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const twx_connection_diagnostic = async () => {
  try {
    const res = await helper.fetchData("/conf/twx/diagnostic", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const get_iot_gtws_http_server_enabled = async () => {
  try {
    const res = await helper.fetchData("/iotgw/http/server/enabled", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const get_iot_gtws_http_server_disabled = async () => {
  try {
    const res = await helper.fetchData("/iotgw/http/server/disabled", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const machines_connected = async () => {
  try {
    const res = await helper.fetchData(`/machine/connections`, "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const monitor_logs_isWorking = async () => {
  try {
    const res = await helper.fetchData(`/monitor/logs/isWorking`, "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const monitor_a4monitor_status = async () => {
  try {
    const res = await helper.fetchData(`/monitor/logs/status`, "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const is_B_ready = async () => {
  try {
    const res = await helper.fetchData(`/ready`, "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const get_iot_gtws_opcua_reading_enabled = async () => {
  try {
    const res = await helper.fetchData(
      `/iotgw/http/client/enabled/opcua_from`,
      "GET"
    );
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const get_iot_gtws_opcua_reading_disabled = async () => {
  try {
    const res = await helper.fetchData(
      `/iotgw/http/client/disabled/opcua_from`,
      "GET"
    );
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const get_iot_gtws_opcua_reading_writing_enabled = async () => {
  try {
    const res = await helper.fetchData(
      `/iotgw/http/client/enabled/opcua_to`,
      "GET"
    );
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const enable_http_client_iot_gateway = async (name) => {
  try {
    const res = await helper.fetchData(
      `/iotgw/http/client/enable?iotgw_name=${name}`,
      "GET"
    );
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const disable_http_client_iot_gateway = async (name) => {
  try {
    const res = await helper.fetchData(
      `/iotgw/http/client/disable&iotgw_name=${name}`,
      "GET"
    );
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Retrieves data related to OPC UA reading and writing disabled status for IoT gateways.
 * @returns {Promise} The response data from the API endpoint.
 * @example
 * const result = await get_iot_gtws_opcua_reading_writing_disabled();
 * console.log(result); // Output: the response data from the API endpoint
 */

export const get_iot_gtws_opcua_reading_writing_disabled = async () => {
  try {
    const res = await helper.fetchData(
      `/iotgw/http/client/disabled/opcua_to`,
      "GET"
    );
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const check_bidir = async () => {
  try {
    const res = await helper.fetchData(`/a4gate/bidir`, "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const uploadKepwareProject = async (file) => {
  //upload file from an input
  try {
    const res = await helper.fetchData("/kepware/upload", "POST", file);
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const get_a4monitor_logs = async () => {
  try {
    const res_isWorking = await helper.fetchData(
      "/monitor/logs/isWorking",
      "GET"
    );
    const res_table = await helper.fetchData("/monitor/logs/table", "GET");
    const a4logs = { is_working: res_isWorking, table: res_table };
    console.log(a4logs);
    return a4logs;
  } catch (e) {
    console.error(e);
  }
};

export const a4monitorStatus = async () => {
  try {
    const res = await helper.fetchData("/monitor/logs/status", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const reloadA4monitor = async () => {
  try {
    const res = await helper.fetchData("/monitor/logs/reload", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const loadChannels = async () => {
  try {
    const res = await helper.fetchData("/kepwaredevices", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const get_bidir_info = async () => {
  try {
    const res = await helper.fetchData("/a4gate/bidir", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const reload_kepware = async () => {
  try {
    const res = await helper.fetchData("/reload_kepware_now", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const downloadJSON = (object, reportName, hostname) => {
  const utcDate = new Date().toJSON().slice(0, 10); // Ottieni la data UTC nel formato "yyyy-mm-dd"
  const hostName = hostname || "unknown";
  const fileName = !reportName
    ? `a4json_${utcDate}.json`
    : `crash_report_${hostName}_${utcDate}.json`;

  let json = null;

  if (reportName) {
    json = {
      ...object,
      crashed_page: reportName,
    };
  } else {
    json = { ...object };
  }

  const data = JSON.stringify(json);

  const blob = new Blob([data], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};

export const get_archive = async () => {
  try {
    const res = await helper.fetchData("/conf/archive", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const post_archive = async (data) => {
  try {
    const res = await helper.fetchData("/conf/archive", "POST", data);
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const post_login = async (data) => {
  try {
    const res = await helper.fetchData("/conf/login", "POST", data);
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const post_register = async (data) => {
  try {
    const res = await helper.fetchData("/conf/register", "POST", data);
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const check_credentials = async () => {
  try {
    const res = await helper.fetchData("/conf/check-credentials", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const test_connection = async (data) => {
  try {
    const res = await helper.fetchData("/external/network/ping", "POST", data);
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const get_matrix = async () => {
  try {
    const res = await helper.fetchData("/fast-data/matrix", "GET");
    verbose && console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
