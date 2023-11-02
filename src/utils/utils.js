import axios from "axios";
import axiosRetry from "axios-retry";
import PQueue from "p-queue";
const host = window?.location?.hostname;
const is_local = host?.includes("localhost") || host?.includes("127.0.0.1");

const ipformat =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export const agents_vendor_list = [
  "GENERIC",
  "Allen-Bradley",
  "ABB",
  "Axis Communications",
  "B&amp;R",
  "Beckhoff",
  "Beijer",
  "Bihl+Wiedemann",
  "Bosch Rexroth",
  "BRControls",
  "Cognex",
  "Comau Robotics",
  "Control Techniques",
  "COPA-DATA",
  "Danfoss",
  "Eaton Moeller",
  "ELAU",
  "ESA",
  "Exor",
  "FANUC Robotics",
  "Fatek Automation",
  "GE IP",
  "Grundfos",
  "Hakko",
  "Hilscher",
  "Hirschmann",
  "Horner",
  "IDEC",
  "ifm electronic",
  "IMO",
  "InduSoft",
  "Inovance",
  "Invensys Wonderware",
  "Kawasaki Robotics",
  "Keyence",
  "Koyo",
  "KUKA Robotics",
  "Lenze",
  "Mitsubishi Electric",
  "Omron",
  "Panasonic",
  "Parker",
  "Pepperl+Fuchs",
  "Pilz",
  "Phoenix Contact",
  "Priva",
  "Pro-face",
  "Rockwell Automation",
  "Saia-Burgess",
  "Schneider Electric",
  "Secomea",
  "SEW",
  "Sick",
  "Siemens",
  "Unitronics",
  "Universal Robots",
  "Vacon",
  "VIPA",
  "Wago",
  "Weintek",
  "Yaskawa",
];
export const agent_vendor_device_type = {
  GENERIC: [
    "LogTunnel Client",
    "LogTunnel Master (Pull)",
    "LogTunnel Master (Push)",
    "Web access (WWW)",
    "Remote Desktop (RDP)",
    "Remote Desktop (VNC)",
    "View-only VNC",
    "Desktop PC",
    "All ports, 1-way NAT",
    "Mobile VPN",
    "Subnet",
    "Device",
    "Secure Shell (SSH)",
    "FTP",
    "Shared Folder",
  ],
  "Allen-Bradley": ["Ethernet"],
  ABB: ["Robot"],
  "Axis Communications": ["IP Camera"],
  "B&amp;R": ["Ethernet"],
  Beckhoff: ["Embedded Agent", "Ethernet", "Legacy (Ethernet)"],
  Beijer: ["E410 Panel", "iX HMI", "Exter HMI"],
  "Bihl+Wiedemann": ["Ethernet"],
  "Bosch Rexroth": ["IndraDrive", "IndraMotion MLC"],
  BRControls: ["Ethernet", "BRC-45", "BRC-46"],
  Cognex: ["Ethernet"],
  "Comau Robotics": ["Control Unit"],
  "Control Techniques": ["Ethernet"],
  "COPA-DATA": ["Zenon VNC", "Zenon Web Client", "Zenon All Service"],
  Danfoss: ["AK-SC255 Ethernet"],
  "Eaton Moeller": ["Ethernet HMI"],
  ELAU: ["Ethernet"],
  ESA: ["Ethernet"],
  Exor: ["Ethernet HMI"],
  "FANUC Robotics": ["Ethernet"],
  "Fatek Automation": ["Ethernet"],
  "GE IP": ["QuickPanel+", "Ethernet"],
  Grundfos: ["VNC Server"],
  Hakko: ["Ethernet HMI"],
  Hilscher: ["NetLink Gateway"],
  Hirschmann: [
    "Embedded Agent",
    "Switch",
    "Industrial Protocol Switch",
    "Industrial HiVision Server",
  ],
  Horner: ["Ethernet"],
  IDEC: ["Ethernet"],
  "ifm electronic": ["Ethernet"],
  IMO: ["Ethernet"],
  InduSoft: ["Web Studio"],
  Inovance: ["Ethernet"],
  "Invensys Wonderware": ["Ethernet"],
  "Kawasaki Robotics": ["Ethernet"],
  Keyence: ["Ethernet"],
  Koyo: ["Ethernet"],
  "KUKA Robotics": ["Ethernet"],
  Lenze: ["Ethernet", "Inverter"],
  "Mitsubishi Electric": ["Ethernet", "HMI (GOT series)", "Remote4U"],
  Omron: ["Ethernet PLC", "Ethernet HMI", "Vision"],
  Panasonic: ["Ethernet"],
  Parker: ["PAC Controller"],
  "Pepperl+Fuchs": ["Ethernet"],
  Pilz: ["Ethernet"],
  "Phoenix Contact": ["Ethernet"],
  Priva: ["Ethernet"],
  "Pro-face": ["Ethernet", "Mobile App"],
  "Rockwell Automation": ["Ethernet"],
  "Saia-Burgess": ["Ether-S-Bus"],
  "Schneider Electric": ["Ethernet", "Mobile App"],
  Secomea: ["SiteManager", "SiteManager Embedded", "TrustGate"],
  SEW: ["Inverter"],
  Sick: ["Ethernet"],
  Siemens: ["Ethernet", "Q80 Recorder"],
  Unitronics: ["Ethernet", "Unistream"],
  "Universal Robots": ["Ethernet"],
  Vacon: ["Inverter"],
  VIPA: ["PLC", "HMI"],
  Wago: ["Ethernet"],
  Weintek: ["Ethernet"],
  Yaskawa: ["Ethernet"],
};
export const getAuthToken = () => {
  return localStorage.getItem("jwtToken");
};
export const getArrayOfObjects = (data, key1, key2) => {
  let arrayOfObjects = [];
  if (data) {
    const keys = Object.keys(data);
    if (keys && keys.length !== 0) {
      keys.forEach((item, index) => {
        arrayOfObjects.push({
          [key1]: item,
          [key2]: data[item]?.toString()?.replace(",", ", "),
        });
      });
    }
  }
  return arrayOfObjects;
};

const queue = new PQueue({ concurrency: 5 });

axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

export async function fetchData(url, method, body, noToken) {
  const axiosConfig = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    httpsAgent: {
      rejectUnauthorized: false,
    },
  };

  if (method === "POST") {
    axiosConfig.data = body;
  }

  const makeRequest = async () => {
    try {
      const path = window.location.origin;
      const pathWithoutPort = path.substring(0, path.indexOf(":", 6));
      const completePath = encodeURIComponent(pathWithoutPort + url);
      const compatibleEncodedUrl = decodeURIComponent(completePath);

      console.log(compatibleEncodedUrl);

      const response = await axios(compatibleEncodedUrl, axiosConfig);

      // Axios handles non-2xx status codes as errors automatically
      const data = response.data;
      return data;
    } catch (error) {
      throw new Error(`Axios errorrrrrr: ${error.message}`);
    }
  };

  if (noToken) {
    return queue.add(makeRequest);
  } else {
    const token = getAuthToken() || null;
    if (!token && !is_local) {
      console.error("User not authenticated");
      window.location.replace("/login");
    } else {
      const wrappedRequest = async () => {
        try {
          const path = window.location.origin;
          const pathWithoutPort = path.substring(0, path.indexOf(":", 6));
          const completePath = encodeURIComponent(pathWithoutPort + url);
          const compatibleEncodedUrl = decodeURIComponent(completePath);
          const response = await axios(compatibleEncodedUrl, {
            ...axiosConfig,
            headers: {
              ...axiosConfig.headers,
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;
          return data;
        } catch (error) {
          if (error?.message?.includes("401")) {
            localStorage.removeItem("jwtToken");
            window.location.replace("/login");
          }
          throw new Error(`Axios error: ${error.message}`);
        }
      };

      return queue.add(wrappedRequest);
    }
  }
}

/* export async function fetchData(url, method, body, noToken) {
  const axiosConfig = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    httpsAgent: {
      rejectUnauthorized: false,
    },
  };

  if (method === "POST") {
    axiosConfig.data = body;
  }
  if (noToken) {
    try {
      const path = window.location.origin;
      const pathWithoutPort = path.substring(0, path.indexOf(":", 6));
      const completePath = encodeURIComponent(pathWithoutPort + url);
      const compatibleEncodedUrl = decodeURIComponent(completePath);

      console.log(compatibleEncodedUrl);

      const response = await axios(compatibleEncodedUrl, axiosConfig);

      // Axios handles non-2xx status codes as errors automatically
      const data = response.data;
      return data;
    } catch (error) {
      throw new Error(`Axios error: ${error.message}`);
    }
  } else {
    const token = getAuthToken() || null;
    if (!token && !is_local) {
      console.error("User not authenticated");
      window.location.replace("/login");
    } else {
      try {
        const path = window.location.origin;
        const pathWithoutPort = path.substring(0, path.indexOf(":", 6));
        const completePath = encodeURIComponent(pathWithoutPort + url);
        const compatibleEncodedUrl = decodeURIComponent(completePath);
        const response = await axios(compatibleEncodedUrl, {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        return data;
      } catch (error) {
        if (error?.message?.includes("401")) {
          localStorage.removeItem("jwtToken");
          window.location.replace("/login");
        }
        console.error(`Axios error: ${error.message}`);
      }
    }
  }
}  */

export const confToHTML = (conf) => {
  //in futuro puoi inserire quì dentro eventuali check del contenuto corretto delle chiavi
  //puoi utilizzare il parametro PCSide per capire da qualche PC è in arrivo la configurazione da controllare

  //QUESTA FUNZIONE DEVE ESSERE CHIAMATA ALL'INTERNO DI OGNI API  E DEVE GESTIRE ATTRAVERSO REDUX L'UPDATE DEL CONFIG

  return conf;
};
export const validate_input = () => {
  /*
    *
    *lista delle validazioni da fare:
-controlla che non ci siano duplicati all'interno di array
-verifica dell'ip attraverso verifyIPCIDR() e verifyIPnotbroadcast(), inoltre assicurati che non ci siano duplicati, in tal caso rimuovili
-fai la stessa verifica anche per le rotte => check se il gateway inserito per una rotta fa parte della subnet corrispondente; check se per la subnet inserita nelle rotte si ha almeno un IP sulla scheda di rete del pc A appartenente a quella rete
-verifyIPCIDR sull'indirizzo delle networkscan
-verifyIPCIDR e verifyIPnotbroadcast anche sugli ip del PCB
-verifyIP sui dns e sui default gateway del PCB
-per tutti gli ip inseriti, verificare se almeno uno degli ip è nella stessa subnet del gateway
-verifyIP sull' ntp server
-gli alias del firewall non devono essere vuoti e non devono essere dei numeri. I vaori degli alias possono essere: an empty string (accepted here, then ignored by a4firewall)
          //  a port number, so a number between 1 and 65535 (if that, parseInt is used to avoid floats) => isPortNumber()
          //  an IP address => verifyIP()
          //  a network in CIDR notation => verifyIPCIDR()
-tcp input table: EXTERNAL_tcp_PORT
          // port (or alias for port) must be an integer between 1 and 65535 => isPortNumber()
          // could be an alias controlla se la stringa inserita è presente negli alias
          SOURCE
          //potrebbe essere un ip in CIDR notation => verifyIPCIDR()
          //potrebbe essere a sua volta un alias, nel caso in cui è un alias controlla che l'alias sia un ip in CIDR notation => verifyIPCIDR()
-forward tcp table:
        //controlla che solamente externak IP ( o è vuoto oppure verifyIP()) e destination port ( o è vuoto oppure isPortNumber()) possono essere vuoti, gli altri no
        //IP_DIST => verifyIP() potrebbe anche essere un alias, in tal caso fai lo stesso controllo su di esso
        //PORT_DIST => isPortNumber() potrebbe essere un alias, in tal caso fai lo stesso controllo su di esso
        //Source => verifyIPCIDR() potrebbe essere un alias, in tal caso fai lo stesso controllo su di esso
-sitemanager:
        //domain e server non possono essere vuoti
        //se name as hostname è false, il name di sitemanager diventa required
-thingworx:
        //host ed appkey devono essere required?
        //iotgateway e things non devono essere vuoti
-opcua:
        //se la custom port è abilitata constrolla che non sia vuota e che sia un numero
        //se l'autenticazione è abilitata, controlla che users e password non siano ""

    */
};
export const confToJSON = () => {
  //funzione per fare il download del JSON di configurazione
};
export const confFromJSON = (file) => {
  //chiama confToHTML
};
export const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const clearEmpties = (o) => {
  for (var k in o) {
    if (!o[k] || typeof o[k] !== "object") {
      continue; // If null or not an object, skip to the next iteration
    }

    // The property is an object
    clearEmpties(o[k]); // <-- Make a recursive call on the nested object
    if (Object.keys(o[k]).length === 0) {
      delete o[k]; // The object had no properties, so delete that property
    }
  }
};

/**
 *
 * @param {*} text
 * @returns false if text is not a valid ip in cidr notation, true if it is
 *
 */
export const verifyIPCIDR = (text) => {
  try {
    const input = text.trim().split("/");
    if (input.length !== 2) return false;
    if (input[1] < 0 || input[1] > 32) return false;
    return verifyIP(input[0]);
  } catch (e) {
    return false;
  }
};

/**
 *
 * @param {*} text
 * @returns if a string is formatted as an ipv4 address
 */
export const verifyIP = (text) => {
  try {
    return text.match(ipformat);
  } catch (e) {
    return false;
  }
};

/**
 *
 * @param {*} text
 * @returns if the text is not a broadcast ip, so true means user typed not a broadcast ip, false means user typed a broadcast ip
 *
 */
export const verifyIPnotbroadcast = (text) => {
  try {
    const input = text.trim().split("/");

    if (input.length !== 2) return false;

    if (input[1] < 0 || input[1] > 32) return false;

    let result = "";

    input[0].split(".").forEach(function (octect) {
      result += octecttobits(octect);
    });
    return result.slice(input[1]).includes("0");
  } catch (e) {
    return false;
  }
};

export const octecttobits = (text) => {
  let number = parseInt(text);
  let result = "";
  let base = 8;
  for (base--; base >= 0; base--) {
    // IE doesn't know ~~
    // result += ~~(number / (2**base))
    let a = Math.pow(2, base);
    let b = number / a;
    let c = Math.floor(b);
    result += "" + c;
    number = number % a;
  }
  return result;
};

export const getIpRangeFromAddressAndNetmask = (str) => {
  var part = str.split("/"); // part[0] = base address, part[1] = netmask
  var ipaddress = part[0].split(".");
  var netmaskblocks = ["0", "0", "0", "0"];
  if (!/\d+\.\d+\.\d+\.\d+/.test(part[1])) {
    // part[1] has to be between 0 and 32
    netmaskblocks = (
      "1".repeat(parseInt(part[1], 10)) + "0".repeat(32 - parseInt(part[1], 10))
    ).match(/.{1,8}/g);
    netmaskblocks = netmaskblocks.map(function (el) {
      return parseInt(el, 2);
    });
  } else {
    // xxx.xxx.xxx.xxx
    netmaskblocks = part[1].split(".").map(function (el) {
      return parseInt(el, 10);
    });
  }
  // invert for creating broadcast address (highest address)
  var invertedNetmaskblocks = netmaskblocks.map(function (el) {
    return el ^ 255;
  });
  var baseAddress = ipaddress.map(function (block, idx) {
    return block & netmaskblocks[idx];
  });
  var broadcastaddress = baseAddress.map(function (block, idx) {
    return block | invertedNetmaskblocks[idx];
  });
  return [baseAddress.join("."), broadcastaddress.join(".")];
};

/**
 *
 * @param {*} text
 * @returns if the object passed is numeric, is > 0 and <= 65535
 */
export const isPortNumber = (text) => {
  return isNumeric(text) && text > 0 && text <= 65535;
};

export const downloadafilewithIE = (text, filename) => {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";

  const byteCharacters = text;
  let byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++)
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  const byteArray = new Uint8Array(byteNumbers);
  var blob = new Blob([byteArray], { type: "application/octet-stream" });

  // IE 11
  if (window.navigator.msSaveOrOpenBlob) {
    a.onclick = function (evx) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    };
    a.click();
  } else {
    const file_object = URL.createObjectURL(blob);
    a.href = file_object;
    a["download"] = filename;
    a.click();
    window.URL.revokeObjectURL(file_object);
  }
  a.remove();
};

export const removeDuplicates = (a) => {
  return a.sort().filter(function (item, pos, ary) {
    return !pos || item !== ary[pos - 1];
  });
};

export const deepMerge = (obj1, obj2) => {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (
        typeof obj2[key] === "object" &&
        obj2[key] !== null &&
        typeof result[key] === "object" &&
        result[key] !== null
      ) {
        // Se sia obj2[key] che result[key] sono oggetti, richiamiamo la funzione deepMerge in modo ricorsivo
        result[key] = deepMerge(result[key], obj2[key]);
      } else {
        // Altrimenti, aggiorniamo il valore
        result[key] = obj2[key];
      }
    }
  }
  return result;
};
export const togglePageSleep = (action) => {
  const blocker = document.getElementById("page-blocker");
  if (action === "block") {
    blocker.style.display = "block";
  } else if (action === "release") {
    blocker.style.display = "none";
  }
};
