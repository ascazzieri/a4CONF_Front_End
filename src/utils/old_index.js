function loadScript(url) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

// loads newer functions that browser do not have built-in. it is needed for IE 11
loadScript("./polyfill.js")
// loads functions to get and set values in html tables
loadScript("./tables.js")
// laods various functions
loadScript("./utils.js")

// const urlParams = new URLSearchParams(window.location.search)
// const debug =  urlParams.has('debug') ? urlParams.get('debug') : false
const debug = (window.location.pathname == "/debug")


// https://graphemica.com/%F0%9F%97%91

const trash_unicode = "&#x1F5D1;"

let isBready = null

let version = null

let sitemanager_commands = [];

let class_last_checked = false;

let iotgwmqtt = []

let a4monitor_isWorking = false

let confB_requested = false
let confB_autoload_timer = 10

const iotgw_topic_prefix_no_rep = "fromkepware/"

function mydebug(text) { }

const cb_update_suffix = ".update"
const manage_suffix = ".manage"
const div_suffix = ".div"
const interval_ready = 10000
const services_ftp_cloud_prefix = "services.ftp.cloud.";

const iotgw_topic_prefix = "rep/fromkepware/"
const iotgw_topic_prefix_regex = new RegExp("^" + iotgw_topic_prefix);

let hostname_internal = ""
let hostname_external = ""
let InternalPC_FTP_error = false;

let Explorer = false;
let readyToGo = false;


// init MQTT protocol
topic_u2u_rt = "monitor/hwsw/json/a4GATE.U2U.RT"
topic_u2u_bidir = "monitor/hwsw/json/a4GATE.U2U.BIDIR"

//loadScript("./helper_mqtt.js")
/* const helper_mqtt = require("./helper_mqtt.js")
const mqtt_ciient = new helper_mqtt();

// as for http protocol , assign mqtt message handler to function values_to_database
mqtt_ciient.on( "message" , function (topic, message)
{
    if (topic == topic_u2u_rt){
        u2u_rt_element = dgeid("u2u.bidir.rt")
        u2u_rt_element.style.color = "blue"
        u2u_rt_element.innerHTML = obj["a4GATE.U2U.RT"]
    } else if (topic == topic_u2u_bidir)
        u2u_bidir_element = dgeid("u2u.bidir.bidir")
        u2u_bidir_element.style.color = "blue"
        u2u_bidir_element.innerHTML = obj["a4GATE.U2U.BIDIR"]
});
mqtt_ciient.listen() */
// MQTT

const agents_vendor_list = [
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
    "Yaskawa"
]

const agent_vendor_device_type = {
    "GENERIC": [
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
        "Shared Folder"
    ],
    "Allen-Bradley": [
        "Ethernet"
    ],
    "ABB": [
        "Robot"
    ],
    "Axis Communications": [
        "IP Camera"
    ],
    "B&amp;R": [
        "Ethernet"
    ],
    "Beckhoff": [
        "Embedded Agent",
        "Ethernet",
        "Legacy (Ethernet)"
    ],
    "Beijer": [
        "E410 Panel",
        "iX HMI",
        "Exter HMI"
    ],
    "Bihl+Wiedemann": [
        "Ethernet"
    ],
    "Bosch Rexroth": [
        "IndraDrive",
        "IndraMotion MLC"
    ],
    "BRControls": [
        "Ethernet",
        "BRC-45",
        "BRC-46"
    ],
    "Cognex": [
        "Ethernet"
    ],
    "Comau Robotics": [
        "Control Unit"
    ],
    "Control Techniques": [
        "Ethernet"
    ],
    "COPA-DATA": [
        "Zenon VNC",
        "Zenon Web Client",
        "Zenon All Service"
    ],
    "Danfoss": [
        "AK-SC255 Ethernet"
    ],
    "Eaton Moeller": [
        "Ethernet HMI"
    ],
    "ELAU": [
        "Ethernet"
    ],
    "ESA": [
        "Ethernet"
    ],
    "Exor": [
        "Ethernet HMI"
    ],
    "FANUC Robotics": [
        "Ethernet"
    ],
    "Fatek Automation": [
        "Ethernet"
    ],
    "GE IP": [
        "QuickPanel+",
        "Ethernet"
    ],
    "Grundfos": [
        "VNC Server"
    ],
    "Hakko": [
        "Ethernet HMI"
    ],
    "Hilscher": [
        "NetLink Gateway"
    ],
    "Hirschmann": [
        "Embedded Agent",
        "Switch",
        "Industrial Protocol Switch",
        "Industrial HiVision Server"
    ],
    "Horner": [
        "Ethernet"
    ],
    "IDEC": [
        "Ethernet"
    ],
    "ifm electronic": [
        "Ethernet"
    ],
    "IMO": [
        "Ethernet"
    ],
    "InduSoft": [
        "Web Studio"
    ],
    "Inovance": [
        "Ethernet"
    ],
    "Invensys Wonderware": [
        "Ethernet"
    ],
    "Kawasaki Robotics": [
        "Ethernet"
    ],
    "Keyence": [
        "Ethernet"
    ],
    "Koyo": [
        "Ethernet"
    ],
    "KUKA Robotics": [
        "Ethernet"
    ],
    "Lenze": [
        "Ethernet",
        "Inverter"
    ],
    "Mitsubishi Electric": [
        "Ethernet",
        "HMI (GOT series)",
        "Remote4U"
    ],
    "Omron": [
        "Ethernet PLC",
        "Ethernet HMI",
        "Vision"
    ],
    "Panasonic": [
        "Ethernet"
    ],
    "Parker": [
        "PAC Controller"
    ],
    "Pepperl+Fuchs": [
        "Ethernet"
    ],
    "Pilz": [
        "Ethernet"
    ],
    "Phoenix Contact": [
        "Ethernet"
    ],
    "Priva": [
        "Ethernet"
    ],
    "Pro-face": [
        "Ethernet",
        "Mobile App"
    ],
    "Rockwell Automation": [
        "Ethernet"
    ],
    "Saia-Burgess": [
        "Ether-S-Bus"
    ],
    "Schneider Electric": [
        "Ethernet",
        "Mobile App"
    ],
    "Secomea": [
        "SiteManager",
        "SiteManager Embedded",
        "TrustGate"
    ],
    "SEW": [
        "Inverter"
    ],
    "Sick": [
        "Ethernet"
    ],
    "Siemens": [
        "Ethernet",
        "Q80 Recorder"
    ],
    "Unitronics": [
        "Ethernet",
        "Unistream"
    ],
    "Universal Robots": [
        "Ethernet"
    ],
    "Vacon": [
        "Inverter"
    ],
    "VIPA": [
        "PLC",
        "HMI"
    ],
    "Wago": [
        "Ethernet"
    ],
    "Weintek": [
        "Ethernet"
    ],
    "Yaskawa": [
        "Ethernet"
    ]
}



function dgeid(id) {
    return document.getElementById(id)
}

/* Use this function to print in developer console advanced logs. This results helpfull to check the heartbeat of functions only in debug mode */
if (debug) {
    function mydebug(text) {
        console.log(text)
    }
}




/* Simple check of my browser's user agent to determine if i'm using IE*/

if (navigator.userAgent.indexOf('Chrome') == -1 && navigator.userAgent.indexOf('Edg') == -1 && navigator.userAgent.indexOf('Mozilla') != -1) {
    Explorer = true;
    alert('Some features of this applications are deprecated and not supported by this browser.');

    html_page = document.getElementById('my_html');
    html_page.setAttribute('style', 'overflow-y:scroll;');

} else {

    html_page = document.getElementById('my_html');
    html_page.setAttribute('style', 'overflow:hidden;')
}








/**
 * all functions that must be run when the body loads
 * 
 * if the page has been loaded standalone, this function will not enable features as "Apply" and/or other buttons
 * 
 */

function onload_js() {
    var loading_text_div = dgeid('loading_text_div');

    if (debug) {
        dgeid("nav__list").style.display = "block";
        dgeid("loading").style.display = "none";
        dgeid("version.div").style.display = "block";
    }

    var innovation_makers = dgeid('InnovationMakers');
    var IE_loader = dgeid('IE_loader');

    /* Put inside the below 'if' all the functionality you want to develop in the IE browser use*/
    if (Explorer) {
        innovation_makers.style.color = 'snow';
        innovation_makers.style.paddingRight = '3%';
        IE_loader.style.display = 'block';
        dgeid("services.kepware.createiotgw").style.marginLeft = '20%';
        dgeid("services.sitemanager.agents.type.button").style.width = "150px"


    } else {
        dgeid('loaderSection').style.display = 'flex';

    }
    loading_text_div.style.display = 'block';
    innovation_makers.style.display = 'block';

    // to hide automatically wireless table
    dgeid("system.network.customer.connection.ethernet").click()

    // simulate click on + in tables. Just aesthetic
    dgeid("system.network.industrial.routes.add").click()
    dgeid("services.backchannel.topics.add").click()
    dgeid("services.backchannel.files.add").click()
    dgeid("system.network.customer.input.wan.tcp.add").click()
    dgeid("system.network.customer.nat.forward.add").click()
    dgeid("system.network.customer.alias.add").click()
    dgeid("system.network.customer.connection.wireless.networks.add").click()
    dgeid("system.network.industrial.netwroksscan.add").click()
    dgeid("services.opcua.users.add").click()
    dgeid("services.ftp.users.add").click()


    if (window.location.protocol == "file:") {
        // if here, html page has been opened as file
        dgeid("apply").disabled = true
        dgeid("loadexternalpc").disabled = true
        dgeid("services.kepware.createiotgw.button").disabled = true
        dgeid("services.kepware.createiotgw_opcua.button").disabled = true
        dgeid("services.kepware.createiotgw.refresh").disabled = true
        set_ready(false)
        alert('You are opening a4Conf as a File');

        dgeid('apply').style.visibility = 'visible';
        dgeid('createfile').style.visibility = 'visible';
        dgeid('uploadfile').style.visibility = 'visible';
        dgeid("loading").style.display = "none";
        dgeid('nav__list').style.display = 'block';
    } else {
        // check if external PCis ready to receive data or not
        get_ready()
        // try to get running a4conf version
        get_version()
        // try to get running config internal PC
        get_confA()
        // load available channels in kepware, so that an iot gateway can be created form a channel
        loaddevices()
        // load available iot gateways in kepware, displayed in thingworx agent section

        //loadiotgws()

        //load SME agents vendor name
        loadDeviceVendor()
        //load available iot gateways in kepware for opcua(fromkepware)
        loadiotgws_opcua('from')
        //load available iot gateways in kepware for opcua(tokepware)
        loadiotgws_opcua('to')

        checkfordebug()
        //gets info about the U2U data in terms of bidirectionality service
        setInterval(get_bidir_info, 10000);
        //gets info about a4monitor status
        setInterval(a4monitorStatus, 10000);
        //gets info about a4monitor logs 
        setInterval(get_a4monitor_log, 10000);
        // get FTP service conf
        get_confFTP();


    }

    // hide backchannel group

    // scams for every div with a particular class, then adds a checkbox for the update
    add_cb()


    //Services commands event listeners 
    const buttons = document.querySelectorAll("input[class='service-radio']");
    // adding event to all radio buttons

    for (let k = 0; k < buttons.length; k++) {

        buttons[k].onclick = radioclick;
    }
    function radioclick() {
        for (let n = 0; n < buttons.length; n++) {

            if (buttons[n].checked) {

                let service = buttons[n].value;
                if (service.indexOf('SME') !== -1 || service.indexOf('TWX') !== -1 || service.indexOf('OPCUA') !== -1 || service.indexOf('FTP') !== -1) {
                    let service_JSON = {
                        services: {
                            sitemanager: {
                                command: ""
                            },
                            thingworx: {
                                command: ""
                            },
                            opcua: {
                                command: ""
                            },
                            ftp: {
                                A: {
                                    command: ""
                                }

                            }
                        }

                    }
                    var getSiblings = function (elem) {

                        // Setup siblings array and get the first sibling
                        var siblings = [];
                        var sibling = elem.parentNode.firstChild;

                        // Loop through each sibling and push to the array
                        while (sibling) {
                            if (sibling.nodeType === 1 && sibling !== elem) {
                                siblings.push(sibling);
                            }
                            sibling = sibling.nextSibling
                        }

                        return siblings;

                    };

                    let siblings = getSiblings(buttons[n].parentNode);


                    function uncheck() {
                        for (let k = 0; k < buttons.length; k++) {
                            buttons[k].checked = false;
                        }




                    }
                    function reappearSibilings() {
                        for (let i = 0; i < siblings.length; i++) {
                            if (siblings[i].classList.contains('transparent')) {
                                siblings[i].classList.remove('transparent');

                            }


                        }

                    }

                    for (let i = 0; i < siblings.length; i++) {
                        if (!siblings[i].classList.contains('transparent')) {
                            siblings[i].classList.add('transparent');

                        }


                    }
                    setTimeout(uncheck, 5000);
                    setTimeout(reappearSibilings, 5000)



                    if (service.indexOf('SME') !== -1) {
                        my_command = service.substring(3, service.length);
                        if (my_command == 'stop') {
                            try {
                                answer = prompt("WARNING!!! You will not be able to reconnect to a4GATE unless via the the same network. Digit 'yes' to stop SiteManager")
                                if (answer !== 'yes') {
                                    return;
                                }
                            } catch (e) {
                                alert('In order to use this feature, go to "Control panel" => "Internet Options" => "Security" => "Custom level" and enable the "Allow websites to prompt for information using scripted windows". Then reboot the system  ')
                            }

                        }
                        service_JSON.services.sitemanager.command = my_command;




                    } else if (service.indexOf('TWX') !== -1) {

                        my_command = service.substring(3, service.length);
                        service_JSON.services.thingworx.command = my_command;


                    } else if (service.indexOf('OPCUA') !== -1) {
                        my_command = service.substring(5, service.length);
                        service_JSON.services.opcua.command = my_command;

                    } else if (service.indexOf('FTP') !== -1) {
                        my_command = service.substring(3, service.length);
                        service_JSON.services.ftp.A.command = my_command;

                    } else {
                        return;
                    } console.log(service_JSON);

                    try {
                        let xhr = new XMLHttpRequest();

                        let endpoint = "/post"
                        if (debug) endpoint += "/debug"

                        xhr.open('POST', endpoint)

                        xhr.onload = function () {
                            rc = xhr.status

                            if (rc >= 200 && rc < 300) alert("Command sent to a4Gate")
                            else alert("Something went wrong.\nPlease contact a4GATE support")
                        };

                        xhr.onerror = function () {
                            console.log("send_single_service() -> network Error")
                            alert("send_single_service() -> network Error");
                        }

                        xhr.onprogress = function (event) {
                            console.log("send_single_service() -> Received", event.loaded, event.total);
                        }

                        xhr.send(JSON.stringify(service_JSON))


                    } catch (e) {
                        alert(e.message)
                    }
                }




            }

        }
    }






}

/* If I'm on debug mode, a red title will appeare on the main menu header*, this will also manage the 'Debug Mode' and 'Normal Mode' logic*/

function checkfordebug() {
    if (debug) {
        document.getElementById("debug_mode_title").style.display = 'block';
        /*     dgeid("debugOnBtn").style.display = "none"; */
        mydebug("Debug Enabled");
        /* dgeid("ConsoleDiv").style.display = "block"; */

    } else {
        document.getElementById("debug_mode_title").style.display = 'none';
        /* dgeid("debugOffBtn").style.display = "none"; */

    }
}



function set_ready(booloano) {
    isBready = booloano
    ready_element = document.getElementById("ready")

    ready_label_element = document.getElementById("ready.label")

    switch (isBready) {
        case true:
            ready_label_element.innerHTML = "External PC ready"
            ready_element.style.color = "green"
            break;
        case false:
            ready_label_element.innerHTML = "External PC not ready"
            ready_element.style.color = "red"
            break;
        default:
            ready_label_element.innerHTML = "Checking external PC connection"
            ready_element.style.color = "#808080"
    }

}

function get_version() {
    get_xhr("get_version()", "/version", get_version_handler)
}

function get_version_handler(text) {
    version = text
    version = version.replace("\n", "").replace("\r", "")
    version_string = "Version: " + version
    mydebug(version_string)
    document.getElementById("version" + div_suffix).innerText = version_string
}

function get_ready() {
    get_xhr("get_ready()", "/ready", get_ready_handler, get_ready_handler_error)

    setTimeout(get_ready, interval_ready);
}

function get_ready_handler(text) {
    isready = text
    mydebug("isready -> " + isready)
    try {
        isready = JSON.parse(isready)
        set_ready(isready["ready"])
    } catch (e) {
        console.error(e)
        set_ready(null)
    }
}

function get_ready_handler_error() {
    set_ready(null)
}

function get_confA() {
    dgeid("loaded.internal").innerHTML = "trying to load internal PC configuration"
    dgeid("loaded.internal").style.color = "#808080"
    get_xhr("get_confA()", "/confA", get_confA_handler, get_confA_handler_error)

}

function get_confA_handler(text) {
    try {
        confA = JSON.parse(text)
        mydebug("get_confA -> " + confA)
        conftohtml(confA, "A")
        dgeid("loaded.internal").innerHTML = "configuration loaded"
        dgeid("loaded.internal").style.color = "green"
    } catch (e) {
        console.console.error(); (e.message)
        get_confA_handler_error()
    }
}

function get_confA_handler_error() {
    dgeid("loaded.internal").innerHTML = "error while trying to load internal PC configuration"
    dgeid("loaded.internal").style.color = "red"
    var a4mon_logs = dgeid("logsDiv");
    a4mon_logs.insertAdjacentHTML("beforeend", "<p class='con con-log'><span style='color:lightgray;'>> </span>" + 'Error while trying to communicate with PCA' + "</p>");
    dgeid('apply').style.visibility = 'visible';
    dgeid('createfile').style.visibility = 'visible';
    dgeid('uploadfile').style.visibility = 'visible';
    dgeid("loading").style.display = "none";
    dgeid('nav__list').style.display = 'block';

}

function get_confFTP() {

    dgeid("loaded.ftp").innerHTML = "trying to load FTP configuration"
    dgeid("loaded.ftp").style.color = "#808080"
    get_xhr("get_confFTP()", "/ftp/conf", get_confFTP_handler, get_confFTP_handler_error)

}

function get_confFTP_handler(text) {
    try {
        confFTP = JSON.parse(text)
        mydebug("get_confFTP -> " + confFTP)
        conftohtml(confFTP, "FTP")

        dgeid("loaded.ftp").innerHTML = "Configuration about FTP on PC A loaded. Waiting for B side"
        //dgeid("loaded.ftp").style.color = "green"
        dgeid("loaded.ftp").style.color = "blue"
        InternalPC_FTP_error = false;
    } catch (e) {
        console.error(e.message)
        get_confFTP_handler_error()
    }

}

function get_confFTP_handler_error() {
    dgeid("loaded.ftp").innerHTML = "error while trying to load internal FTP configuration"
    dgeid("loaded.ftp").style.color = "red"
    InternalPC_FTP_error = true;
    var a4mon_logs = dgeid("logsDiv");
    a4mon_logs.insertAdjacentHTML("beforeend", "<p class='con con-log'><span style='color:lightgray;'>> </span>" + 'Error in Fast Data Service...' + "</p>");

}

function get_confB() {
    confB_requested = true
    dgeid("loaded.external").innerHTML = "trying to load external PC configuration"
    dgeid("loaded.external").style.color = "#808080"
    get_xhr("get_confB()", "/confB", get_confB_handler, get_confB_handler_error)


}


function get_confB_handler(text) {
    try {
        mydebug("get_confB -> " + text)
        if (text != "{}") {
            confB = JSON.parse(text)
            conftohtml(confB, "B")
            dgeid("loaded.external").innerHTML = "configuration loaded"
            dgeid("loaded.external").style.color = "green"
            alert("INFO:\nConfiguration from external PC loaded")
            /* dgeid("services.ftp.iotedge.info.div").style.display = "block" */
            readyToGo = true;
            /*  check_child(); */



        } else {
            // if here, server sent an empty object, which means there is no conf to load
            dgeid("loaded.external").innerHTML = "unable to load external PC configuration"
            dgeid("loaded.external").style.color = "black"
            dgeid("loaded.ftp").innerHTML = "unable to load external PC configuration"
            dgeid("loaded.ftp").style.color = "black"
            dgeid("services.ftp.iotedge.info.div").style.display = "none"
            alert("WARNING:\nConfiguration from external PC NOT loaded")

        }
        dgeid('apply').style.visibility = 'visible';
        dgeid('createfile').style.visibility = 'visible';
        dgeid('uploadfile').style.visibility = 'visible';
        dgeid("loading").style.display = "none";
        dgeid('nav__list').style.display = 'block';



    } catch (e) {
        console.error(e.message)
        get_confB_handler_error()
    }


}

function get_confB_handler_error() {
    alert("Error while loading configuration from external PC")
    dgeid("loaded.external").innerHTML = "error while trying to get external PC configuration"
    dgeid("loaded.external").style.color = "red"
    var a4mon_logs = dgeid("logsDiv");
    a4mon_logs.insertAdjacentHTML("beforeend", "<p class='con con-log'><span style='color:lightgray;'>> </span>" + 'Error while trying to communicate with PCB' + "</p>");
    dgeid("loaded.ftp").innerHTML = "error while trying to get external PC configuration"
    dgeid("loaded.ftp").style.color = "red"
    //fast data with iot edge feedback on PCb services -> se ci sono errori durante il caricamento della cfg da pc B, nascondi la sezione dei servizi dell'iot edge
    dgeid("services.ftp.iotedge.info.div").style.display = "none"
    dgeid('apply').style.visibility = 'visible';
    dgeid('createfile').style.visibility = 'visible';
    dgeid('uploadfile').style.visibility = 'visible';
    dgeid('nav__list').style.display = 'block';
    dgeid("loading").style.display = "none";

}

function get_confB_auto() {
    if (window.location.protocol != "file:" && confB_requested == false) {
        if (confB_autoload_timer > 0) {
            dgeid("loaded.external").innerHTML = "configuration will be loaded automatically in " + confB_autoload_timer-- + " seconds"
            setTimeout(get_confB_auto, 1000);
        } else {
            get_confB()
        }
    }
}

/**
 * given an object with a specific schema,
 * this fucntion parses all data inside the object and populates the html view. 
 */
function conftohtml(conf) {
    if ("system" in conf) {
        if ("network" in conf["system"]) {
            if ("industrial" in conf["system"]["network"]) {
                local_container = conf["system"]["network"]["industrial"]

                if ("dhcp" in local_container) {
                    document.getElementById("system.network.industrial.dhcp").checked = local_container["dhcp"]
                    checkifnotchecked("system.network.industrial.dhcp.div.update")
                    dhcp_industrial(local_container["dhcp"])
                }

                if ("ip" in local_container) {
                    document.getElementById("system.network.industrial.ip").value = local_container["ip"].join(", ")
                    checkifnotchecked("system.network.industrial.ip.div.update")
                }

                if ("routes" in local_container) {
                    routes = local_container["routes"]
                    routes_table = document.getElementById("system.network.industrial.routes")

                    routes_list = []

                    for (route in routes) {
                        routes_list.push([route, routes[route]])
                    }

                    if (routes_list.length > 0) {
                        emptytable("system.network.industrial.routes")
                        conftotable(routes_list, routes_table)
                    }

                    checkifnotchecked("system.network.industrial.routes.div.update")
                }

                if ("net_scan" in local_container) {
                    networks = local_container["net_scan"]
                    networks_table = document.getElementById("system.network.industrial.netwroksscan")

                    if (networks.length > 0) {
                        emptytable("system.network.industrial.netwroksscan")
                        conftotable(networks, networks_table)
                    }

                    checkifnotchecked("system.network.industrial.netwroksscan.div.update")
                }

            }

            if ("customer" in conf["system"]["network"]) {
                local_container = conf["system"]["network"]["customer"]

                if ("dhcp" in local_container) {
                    document.getElementById("system.network.customer.dhcp").checked = local_container["dhcp"]
                    checkifnotchecked("system.network.customer.dhcp.div.update")
                    dhcp_customer(local_container["dhcp"])
                }

                if ("static" in local_container) {
                    if ("ip" in local_container["static"]) {
                        document.getElementById("system.network.customer.static.ip").value = local_container["static"]["ip"].join(", ")
                        checkifnotchecked("system.network.customer.static.ip.div.update")
                    }

                    if ("dns" in local_container["static"]) {
                        document.getElementById("system.network.customer.static.dns").value = local_container["static"]["dns"].join(", ")
                        checkifnotchecked("system.network.customer.static.dns.div.update")
                    }

                    if ("gateway" in local_container["static"]) {
                        document.getElementById("system.network.customer.static.dgw").value = local_container["static"]["gateway"]
                        checkifnotchecked("system.network.customer.static.dgw.div.update")
                    }

                    if ("connected" in local_container["static"]) {
                        isConnectedElementID = "system.network.customer.static.external.is_connected"
                        isConnected = local_container["static"]["connected"]
                        if (isConnected == true) {
                            dgeid(isConnectedElementID).style.color = "green"
                            dgeid(isConnectedElementID).innerHTML = "CONNECTED!"
                        } else {
                            dgeid(isConnectedElementID).style.color = "red"
                            dgeid(isConnectedElementID).innerHTML = "NOT CONNECTED!"

                        }

                    }

                    if ("mac" in local_container["static"]) {
                        macAddress = local_container["static"]["mac"]
                        dgeid("system.network.customer.static.mac.value").innerText = macAddress
                    }

                }

                if ("nat" in local_container) {
                    document.getElementById("system.network.customer.nat.enabled").checked = local_container["nat"]
                    checkifnotchecked("system.network.customer.nat.enabled.div.update")
                }

                if ("machine_to_internet" in local_container) {
                    document.getElementById("system.network.customer.mtoi").checked = local_container["machine_to_internet"]
                    checkifnotchecked("system.network.customer.mtoi.div.update")
                }

                if ("if_wan_medium" in local_container) {
                    if (local_container["if_wan_medium"].startsWith("eth")) document.getElementById("system.network.customer.connection.ethernet").click()
                    else document.getElementById("system.network.customer.connection.wireless").click()
                    checkifnotchecked("system.network.customer.connection.div.update")
                }

                if ("ntp" in local_container) {
                    document.getElementById("system.network.customer.ntp.server").value = local_container["ntp"].join(", ")
                    checkifnotchecked("system.network.customer.ntp.server.div.update")
                }

                if ("wireless" in local_container) {
                    wireless_obj = local_container["wireless"]
                    wireless_table_id = "system.network.customer.connection.wireless.networks"
                    wireless_table = dgeid(wireless_table_id)
                    wireless_list = []

                    for (key in wireless_obj) {
                        wireless_list.push([key, wireless_obj[key]])
                    }

                    emptytable(wireless_table_id)
                    conftotable(wireless_list, wireless_table)
                }

                if ("essid" in local_container) {
                    essid_select_id = "system.network.customer.connection.wireless.networks.essid.select"
                    essid_select = dgeid(essid_select_id)
                    //essid_select.innerHTML = ""
                    /* let option = document.createElement("option")
                    option.text = "Select SSID"
                    option.value = "Select SSID"
                    option.disabled = true
                    essid_select.appendChild(option) */

                    essid_select.innerHTML = ""
                    let option = document.createElement("option")
                    option.text = "Select SSID"
                    option.value = "Select SSID"
                    option.disabled = true
                    essid_select.appendChild(option)
                    essid_select.selectedIndex = 0

                    essid_list = local_container["essid"]
                    aerial_element = dgeid("system.network.customer.connection.wireless.aerial.enabled")
                    essid_list_element = dgeid("system.network.customer.connection.wireless.networks.essid.list")

                    if (typeof essid_list == 'boolean' && essid_list == false) {
                        aerial_element.style.color = "RED"
                        aerial_element.innerHTML = "Aerial not detected"
                        essid_list_element.innerHTML = ""
                    } else if (typeof essid_list == 'object') {
                        aerial_element.style.color = "GREEN"
                        aerial_element.innerHTML = "Aerial detected"

                        //essid_select_id = "system.network.customer.connection.wireless.networks.essid.select"
                        //essid_select = dgeid(essid_select_id)

                        if (essid_list.length != 0) {
                            essid_list_element.innerHTML = "=> " + String(essid_list.length) + " wifi networks available"
                            for (i = 0; i < essid_list.length; i++) {
                                essid = essid_list[i]
                                let option = document.createElement("option")
                                option.text = essid
                                option.value = essid
                                essid_select.appendChild(option)
                            }
                        } else {
                            //segnalate che non sono state trovate reti wi-fi, forse l'utente ne vuole una nascosta
                            essid_list_element.innerHTML = "=> No wifi networks found "
                        }

                        essid_select.disabled = false
                        /* }else {
                            aerial_element.style.color = "RED"
                            aerial_element.innerHTML = "Aerial not detected" */
                    }

                }

                if ("routes" in local_container) {
                    routes = local_container["routes"]
                    // TODO
                    // PRONBLEM 
                    // routes will appear duplicated, because
                    // this service will calculate newer rules for external pc at every apply,
                    // and then they will be in B configuration
                    // So, when they are read again,
                    // in this list there wiil be routes from pc A that are defined at the section above.
                    // What to do ??? !!!
                    // When creating the table, do not show routes where router is "192.0.2.1"
                    // Is it enough?
                    // no if ip "192.0.2.1" changes
                }

                if ("ALIAS" in local_container) {
                    ALIAS = local_container["ALIAS"]

                    alias_table_id = "system.network.customer.alias"
                    checkifnotchecked(alias_table_id + ".div.update")

                    alias_table = dgeid(alias_table_id)
                    alias_list = []
                    alias_keys = Object.keys(ALIAS)
                    alias_len = alias_keys.length

                    if (alias_len > 0) {
                        for (key in ALIAS) {
                            alias_list.push([key, ALIAS[key]])
                        }
                        emptytable(alias_table_id)
                        conftotable(alias_list, alias_table)
                    }
                }

                if ("PORTS_TCP_SERVER_WAN" in local_container) {
                    PORTS_TCP_SERVER_WAN = local_container["PORTS_TCP_SERVER_WAN"]
                    input_table_id = "system.network.customer.input.wan.tcp"
                    checkifnotchecked(input_table_id + ".div.update")

                    input_table = dgeid(input_table_id)
                    input_list = []
                    input_keys = Object.keys(PORTS_TCP_SERVER_WAN)
                    input_len = input_keys.length

                    if (input_len > 0) {
                        for (key in PORTS_TCP_SERVER_WAN) {
                            value = PORTS_TCP_SERVER_WAN[key]

                            if (Array.isArray(value)) {
                                for (let j = 0; j < value.length; j++) {
                                    value_j = value[j]

                                    input_list.push([key, value_j])
                                }
                            } else {
                                input_list.push([key, value])
                            }
                        }

                        emptytable(input_table_id)
                        conftotable(input_list, input_table)
                    }
                }

                /**
                 * the property is named INPUT_NAT, but indicates the input ports that are forwarded to machine network via nat forward
                 */
                if ("INPUT_NAT" in local_container) {
                    INPUT_NAT = local_container["INPUT_NAT"]
                    forward_table_id = "system.network.customer.nat.forward"
                    checkifnotchecked(forward_table_id + ".div.update")

                    forward_table = dgeid(forward_table_id)
                    forward_list = []
                    forward_len = INPUT_NAT.length

                    if (forward_len > 0) {
                        for (var i = 0; i < forward_len; i++) {
                            element = INPUT_NAT[i]

                            IP_EXT = ("IP_EXT" in element) ? element["IP_EXT"] : ""
                            PORT_EXT = ("PORT_EXT" in element) ? element["PORT_EXT"] : ""
                            IP_DST = ("IP_DST" in element) ? element["IP_DST"] : ""
                            PORT_DST = ("PORT_DST" in element) ? element["PORT_DST"] : ""
                            SOURCE = ("SOURCE" in element) ? element["SOURCE"] : []

                            if (Array.isArray(SOURCE)) {
                                for (let j = 0; j < SOURCE.length; j++) {
                                    forward_list.push([IP_EXT, PORT_EXT, IP_DST, PORT_DST, SOURCE[j]])
                                }
                            } else forward_list.push([IP_EXT, PORT_EXT, IP_DST, PORT_DST, SOURCE])
                        }

                        emptytable(forward_table_id)
                        conftotable(forward_list, forward_table)
                    }
                }

                if ("firewall_enabled" in local_container) {
                    document.getElementById("system.network.customer.firewall.enabled").checked = local_container["firewall_enabled"]
                    checkifnotchecked("system.network.customer.firewall.enabled.div.update")
                    fw_enabled();
                }

            }
        }

        /**
         * reads both hostnames from configuration and puts it in the title attribute (hint box that appears on hover)
         * if two hostnames are equal, hostname html field is populated with the string, otherwise is left empty
         */
        if ("hostname" in conf["system"]) {
            hostname_element = document.getElementById("system.hostname")

            temp = hostname_element.getAttribute("title")

            if ("industrial" in conf["system"]["hostname"]) {
                hostname = conf["system"]["hostname"]["industrial"]

                temp += "hostname on internal side now is " + hostname + "\n"

                hostname_internal = hostname
            }

            if ("customer" in conf["system"]["hostname"]) {
                hostname = conf["system"]["hostname"]["customer"]

                temp += "hostname on external side now is " + hostname

                hostname_external = hostname
            }

            hostname_element.setAttribute("title", temp)

            if (hostname_external == hostname_internal != "") {
                hostname_element.value = hostname_external

                checkifnotchecked("system.hostname.div.update")
            }

        }

        if ("a4updater_version" in conf["system"]) {
            if ("industrial" in conf["system"]["a4updater_version"]) {
                last_version = conf["system"]["a4updater_version"]["industrial"]
                if (last_version != "") dgeid("internal.version").innerText = "Last a4updater version ⇨ " + last_version
            }

            if ("customer" in conf["system"]["a4updater_version"]) {
                last_version = conf["system"]["a4updater_version"]["customer"]
                if (last_version != "") dgeid("external.version").innerText = "Last a4updater version ⇨ " + last_version
            }
        }
    }

    if ("services" in conf) {
        local_container = conf["services"]

        if ("kepware" in local_container) {
            if ("trial" in local_container["kepware"]) {
                document.getElementById("services.kepware.trial").checked = local_container["kepware"]["trial"]
                checkifnotchecked("services.kepware.trial.div.update")
            }
        }

        if ("sitemanager" in conf["services"]) {
            local_container = conf["services"]["sitemanager"]
            /* sme_enabled(); */


            if ("connected" in local_container) {
                isConnectedElementID = "services.sitemanager.is_connected"
                isConnectedElement = dgeid(isConnectedElementID)
                isConnected = local_container["connected"]
                if (isConnected == true) {
                    isConnectedElement.style.color = "green"
                    isConnectedElement.innerHTML = "CONNECTED!"
                } else {
                    isConnectedElement.style.color = "red"
                    isConnectedElement.innerHTML = "NOT CONNECTED!"

                }
            }

            if ("domain" in local_container) {
                document.getElementById("services.sitemanager.domain").value = local_container["domain"]
                checkifnotchecked("services.sitemanager.domain.div.update")
            }

            if ("name" in local_container) {
                document.getElementById("services.sitemanager.name").value = local_container["name"]
                checkifnotchecked("services.sitemanager.name.div.update")
                /* uncheckifchecked("services.sitemanager.nameashostname") */
                sme_nameashostname();
            }

            if ("enabled" in local_container) {
                document.getElementById("services.sitemanager.enabled").checked = local_container["enabled"]
                checkifnotchecked("services.sitemanager.enabled.div.update")
                sme_enabled();
            }

            if ("server" in local_container) {
                document.getElementById("services.sitemanager.server").value = local_container["server"]
                checkifnotchecked("services.sitemanager.server.div.update")
            }

            if ("onlybidir" in local_container) {
                document.getElementById("services.sitemanager.onlybidir").checked = local_container["onlybidir"]
                checkifnotchecked("services.sitemanager.onlybidir.div.update")
            }

            if ("nameashostname" in local_container) {
                document.getElementById("services.sitemanager.nameashostname").checked = local_container["nameashostname"]
                checkifnotchecked("services.sitemanager.nameashostname.div.update")

            }

            if ("usentp" in local_container) {
                if (local_container["usentp"] == true) {
                    checkifnotchecked("system.network.customer.ntp.gatemanager")
                    checkifnotchecked("system.network.customer.ntp.gatemanager.div.update")
                } else {
                    uncheckifchecked("system.network.customer.ntp.gatemanager")
                    checkifnotchecked("system.network.customer.ntp.gatemanager.div.update")
                }

            }

            if ("agents" in local_container) {

                agents = local_container['agents']

                agents_list_name = []

                agents_list = []

                //agents_keys = Object.keys(agents)

                for (key in agents) {
                    //for (i=0; i < agents_keys.length; i++){
                    agent_name = key
                    type = agents[agent_name]["agent"]
                    device_name = agents[agent_name]["name"]
                    sn = agents[agent_name]["sn"]
                    cfg = agents[agent_name]["cfg"]

                    agents_list.push([agent_name, sn, device_name, type, cfg])
                }
                /* for (agent_name of Object.keys(agents)) {
                    ag_name = agent_name
                    type = agents[agent_name]["agent"]
                    device_name = agents[agent_name]["name"]
                    sn = agents[agent_name]["sn"]
                    cfg = agents[agent_name]["cfg"]

                    agents_list.push([ag_name, sn, device_name, type, cfg])
                } */

                if (agents_list.length > 0) {
                    sme_agents_table_id = "services.sitemanager.agents"
                    sme_agents_table = dgeid(sme_agents_table_id)

                    emptytable(sme_agents_table_id)
                    conftotable(agents_list, sme_agents_table)
                }

                checkifnotchecked("services.sitemanager.agents.div.update")

            }


        }

        if ("thingworx" in conf["services"]) {
            local_container = conf["services"]["thingworx"]


            if ("connected" in local_container) {
                isConnectedElementID = "services.thingworx.is_connected.div"
                isConnected = local_container["connected"]
                if (isConnected == true) {
                    dgeid(isConnectedElementID).style.color = "green"
                    dgeid(isConnectedElementID).innerHTML = "Connected to Thingworx"
                } else {
                    dgeid(isConnectedElementID).style.color = "red"
                    dgeid(isConnectedElementID).innerHTML = "NOT connected to Thingworx"
                }
            }

            if ("version" in local_container) {
                versionElementID = "services.thingworx.version.div"
                version = local_container["version"]
                dgeid(versionElementID).innerHTML = "Agent version => " + version

            } else {
                versionElementID = "services.thingworx.version.div"
                dgeid(versionElementID).innerHTML = "Agent version not available"
            }

            if ("host" in local_container) {
                document.getElementById("services.thingworx.host").value = local_container["host"]
                checkifnotchecked("services.thingworx.host.div.update")
            }

            if ("appkey" in local_container) {
                app_key_value = local_container["appkey"]
                dgeid("services.thingworx.appkey").value = app_key_value

                if (app_key_value.trim() != "") checkifnotchecked("services.thingworx.appkey.div.update")
            }

            if ("enabled" in local_container) {
                enabled = local_container["enabled"]
                dgeid("services.thingworx.enabled").checked = enabled
                checkifnotchecked("services.thingworx.enabled.div.update");
                tgw_enabled();

                //aggiunta per utilizzare lo stesso valore nella sezione Fast Data(PTC)
                element = dgeid("services.ftp.ptc.info.twagent.enabled")
                if (enabled) {
                    element.innerHTML = "Enabled"
                    element.style.color = "green"
                } else {
                    element.innerHTML = "NOT enabled"
                    element.style.color = "red"
                }

            }

            if ("things" in local_container) {
                things = local_container["things"]
                //things_table_id = "services.thingworx.things"
                things_table_id = "services.thingworx.things.http"

                things_table = document.getElementById(things_table_id)

                things_list = []

                /*
                    things is something like
                    thing1 : 
                    {
                        iotgw1_1 : topic1_1
                        iotgw1_2 : topic1_2
                    }
                    thing2 : 
                    {
                        iotgw2_1 : topic2_1
                        iotgw2_2 : topic2_2
                    }


                */

                //usato quando l'invio era fatto con MQTT
                /* for (thing_name in things) {
                    for (iotgw_name in things[thing_name]) {
                        topic_name = things[thing_name][iotgw_name]
                        things_list.push([iotgw_name, topic_name, thing_name])
                    }
                } */

                for (thing_name in things) {
                    for (iotgw_name in things[thing_name]) {
                        things_list.push([iotgw_name, thing_name])
                    }
                }

                /* console.log(things_list) */

                if (things_list.length > 0) {
                    emptytable(things_table_id)
                    conftotable(things_list, things_table)
                }

                //checkifnotchecked("services.thingworx.things.div.update") //usato quando l'invio era fatto con MQTT
                checkifnotchecked("services.thingworx.things.http.div.update")
            }

        }


        if ("backchannel" in conf["services"]) {
            if ("topics" in conf["services"]["backchannel"]) {
                topics_list = conf["services"]["backchannel"]["topics"]
                topics_table = document.getElementById("services.backchannel.topics")

                if (topics_list.length > 0) {
                    emptytable("services.backchannel.topics")
                    conftotable(topics_list, topics_table)
                }
            }

            if ("files" in conf["services"]["backchannel"]) {
                files_list = conf["services"]["backchannel"]["files"]
                files_table = document.getElementById("services.backchannel.files")

                if (files_list.length > 0) {
                    emptytable("services.backchannel.files")
                    conftotable(files_list, files_table)
                }
            }
        }

        if ("opcua" in conf["services"]) {
            local_container = conf["services"]["opcua"]




            if ("enabled" in local_container) {
                document.getElementById("services.opcua.enabled").checked = local_container["enabled"]
                checkifnotchecked("services.opcua.enabled.div.update");
                opcua_enabled();
            }

            if ("shift_property_from_kepware" in local_container) {
                document.getElementById("services.opcua.shift_property_from_kepware").value = local_container["shift_property_from_kepware"]
                checkifnotchecked("services.opcua.shift_property_from_kepware.div.update")
            }

            if ("shift_property_to_kepware" in local_container) {
                document.getElementById("services.opcua.shift_property_to_kepware").value = local_container["shift_property_to_kepware"]
                checkifnotchecked("services.opcua.shift_property_to_kepware.div.update")
            }

            if ("opcua" in local_container) {
                if ("custom_port_enable" in local_container["opcua"]) {
                    document.getElementById("services.opcua.custom_port_enable").checked = local_container["opcua"]["custom_port_enable"]
                    checkifnotchecked("services.opcua.custom_port_enable.div.update")
                    if ("custom_port" in local_container["opcua"]) {
                        document.getElementById("services.opcua.custom_port").value = local_container["opcua"]["custom_port"]
                        checkifnotchecked("services.opcua.custom_port.div.update")
                        opcua_custom_tcp_port();

                    }
                }
            }

            if ("security" in local_container) {
                if ("user_auth" in local_container["security"]) {
                    document.getElementById("services.opcua.user_auth").checked = local_container["security"]["user_auth"]
                    checkifnotchecked("services.opcua.user_auth.div.update");
                    usersAuth();
                    if ("users" in local_container["security"]) {
                        users_table = document.getElementById("services.opcua.users")
                        users_matrix = []
                        users = local_container["security"]["users"]
                        for (user in users) {
                            users_matrix.push([user, users[user]])
                        }
                        if (users_matrix.length > 0) {
                            emptytable("services.opcua.users")
                        }
                        conftotable(users_matrix, users_table)
                        checkifnotchecked("services.opcua.users.div.update")
                    }

                }
            }

            if ('iotgw' in local_container) {
                checkifnotchecked("services.opcua.things.div.update")
                iotgw = local_container['iotgw']
                if ('from' in iotgw) {
                    from = iotgw['from']
                    if (from.length > 0) {
                        emptytable("services.opcua.things.fromkepware")
                        conftotable(from, dgeid("services.opcua.things.fromkepware"))
                    }
                }
                if ('to' in iotgw) {
                    to = iotgw['to']
                    if (to.length > 0) {
                        emptytable("services.opcua.things.tokepware")
                        conftotable(to, dgeid("services.opcua.things.tokepware"))
                    }
                }
            }

        }

        //Configurazione dell'FTP che arriva da PC B
        if ("ftp" in conf["services"]) {

            local_container = conf["services"]["ftp"]

            ftp_prefix = "services.ftp."

            if ("enabled" in local_container) {
                a4ftp_enabled = local_container["enabled"]

                dgeid(ftp_prefix + "B.enabled").checked = a4ftp_enabled
                checkifnotchecked(ftp_prefix + "B.enabled.div" + cb_update_suffix)

                if (a4ftp_enabled) {
                    if ("cloud_provider" in local_container) {
                        cloud_provider = local_container["cloud_provider"].toLowerCase().trim()
                        cloud_provider_onA = "";
                        if (dgeid("services.ftp.cloud.ptc").checked) cloud_provider_onA = "ptc"
                        else cloud_provider_onA = "microsoft"

                        if (cloud_provider_onA == cloud_provider) {
                            dgeid(ftp_prefix + "cloud.div" + cb_update_suffix).checked = true
                        } else {
                            dgeid(ftp_prefix + "cloud.div" + cb_update_suffix).checked = false
                            alert("Cloud provider set on A is " + cloud_provider_onA + " but cloud provider on B is " + cloud_provider)
                        }
                    }
                    if ("http_port" in local_container) {
                        /* alert(local_container["http_port".toString()]); */
                        http_port = local_container["http_port"]
                        http_port_onA = dgeid(ftp_prefix + "http_port").value
                        if (http_port == http_port_onA != "") {
                            checkifnotchecked(ftp_prefix + "http_port.div" + cb_update_suffix)
                        }
                    }
                }
                if (!InternalPC_FTP_error) {
                    dgeid("loaded.ftp").innerHTML = "All configurations loaded"
                    dgeid("loaded.ftp").style.color = "green"
                } else {
                    alert('Error: unable to load configuration from PCA')
                }



            }

            if ("iotedge" in local_container) {
                if ("services" in local_container["iotedge"]) {
                    if ("edgeAgent" in local_container["iotedge"]["services"]) {
                        isRunning = local_container["iotedge"]["services"]["edgeAgent"]
                        element = dgeid("services.ftp.iotedge.info.agent")
                        if (isRunning) {
                            element.innerHTML = "Running"
                            element.style.color = "green"
                        } else {
                            element.innerHTML = "NOT Running"
                            element.style.color = "red"
                        }
                    }
                    if ("edgeBlobs" in local_container["iotedge"]["services"]) {
                        isRunning = local_container["iotedge"]["services"]["edgeBlobs"]
                        element = dgeid("services.ftp.iotedge.info.blobs")
                        if (isRunning) {
                            element.innerHTML = "Running"
                            element.style.color = "green"
                        } else {
                            element.innerHTML = "NOT Running"
                            element.style.color = "red"
                        }
                    }
                    if ("edgeHub" in local_container["iotedge"]["services"]) {
                        isRunning = local_container["iotedge"]["services"]["edgeHub"]
                        element = dgeid("services.ftp.iotedge.info.hub")
                        if (isRunning) {
                            element.innerHTML = "Running"
                            element.style.color = "green"
                        } else {
                            element.innerHTML = "NOT Running"
                            element.style.color = "red"
                        }
                    }
                }
            }

            if ("ptc_file_transfer" in local_container) {
                isEnabled = local_container["ptc_file_transfer"]
                element = dgeid("services.ftp.ptc.info.twagent.fileTransfer")
                if (isEnabled) {
                    element.innerHTML = "Enabled"
                    element.style.color = "green"
                } else {
                    element.innerHTML = "NOT enabled"
                    element.style.color = "red"
                }
            }

        }
        //Configurazione dell'FTP che arriva da PC B

    }



    //FTP info da pc A
    if ("ftp" in conf) {

        local_container = conf["ftp"]
        console.log(JSON.stringify(local_container, null, 4));


        ftp_prefix = "services.ftp."

        /*  if ("enabled_onA" in local_container){
             dgeid(ftp_prefix + "A.enabled").checked = local_container["enabled_onA"]
             checkifnotchecked(ftp_prefix + "A.enabled.div" + cb_update_suffix)
         } */

        if ("server" in local_container) {
            server_cfg = local_container["server"]


            if ("custom_port" in server_cfg) {
                custom_port_enable = server_cfg["custom_port"]

                dgeid(ftp_prefix + "custom_port_enable").checked = custom_port_enable

                checkifnotchecked(ftp_prefix + "custom_port_enable.div" + cb_update_suffix)
                ftp_server_custom_port();

            }

            if ("port" in server_cfg) {
                dgeid(ftp_prefix + "custom_port").innerHTML = server_cfg["port"]
                //checkifnotchecked(ftp_prefix + "custom_port.div.update")
            }

            if ("sentFile_folder_max_bytes" in server_cfg) {
                dgeid(ftp_prefix + "folders.sent.size").innerHTML = server_cfg["sentFile_folder_max_bytes"]
                checkifnotchecked(ftp_prefix + "folders.sent.size.div" + cb_update_suffix)
            }

            if ("sentFile_days_expire" in server_cfg) {
                dgeid(ftp_prefix + "folders.sent.days").innerHTML = server_cfg["sentFile_days_expire"]
                checkifnotchecked(ftp_prefix + "folders.sent.days.div" + cb_update_suffix)
            }

            if ("NOTsentFile_folder_max_bytes" in server_cfg) {
                dgeid(ftp_prefix + "folders.sent.size").innerHTML = server_cfg["sentFile_folder_max_bytes"]
                checkifnotchecked(ftp_prefix + "folders.not_sent.size.div" + cb_update_suffix)
            }

            if ("NOTsentFile_days_expire" in server_cfg) {
                dgeid(ftp_prefix + "folders.sent.days").innerHTML = server_cfg["sentFile_days_expire"]
                checkifnotchecked(ftp_prefix + "folders.not_sent.days.div" + cb_update_suffix)
            }

            if ("historyFile_folder_max_bytes" in server_cfg) {
                dgeid(ftp_prefix + "folders.history.size").innerHTML = server_cfg["historyFile_folder_max_bytes"]
                checkifnotchecked(ftp_prefix + "folders.history.size.div" + cb_update_suffix)
            }

            if ("historyFile_days_expire" in server_cfg) {
                dgeid(ftp_prefix + "folders.sent.days").innerHTML = server_cfg["sentFile_days_expire"]
                checkifnotchecked(ftp_prefix + "folders.history.days.div" + cb_update_suffix)
            }

            if ("max_cons" in server_cfg) {
                dgeid(ftp_prefix + "max_cons").innerHTML = server_cfg["max_cons"]
                checkifnotchecked(ftp_prefix + "max_cons.div" + cb_update_suffix)
            }

            if ("max_cons_per_ip" in server_cfg) {
                dgeid(ftp_prefix + "max_cons_per_ip").innerHTML = server_cfg["max_cons_per_ip"]
                checkifnotchecked(ftp_prefix + "max_cons_per_ip.div" + cb_update_suffix)
            }

            if ("users" in server_cfg) {

                if ("anonymus_login" in server_cfg) {
                    anonymus_login_cfg = server_cfg["anonymus_login"]
                    if ("enable" in anonymus_login_cfg) {
                        dgeid(ftp_prefix + "users.anonymus").checked = anonymus_login_cfg["enable"]
                        checkifnotchecked(ftp_prefix + "users.anonymus.div" + cb_update_suffix)
                    }
                    if ("shared_folder" in anonymus_login_cfg) {
                        dgeid(ftp_prefix + "users.anonymus.folder").value = anonymus_login_cfg["shared_folder"]
                        checkifnotchecked(ftp_prefix + "users.anonymus.folder.div" + cb_update_suffix)
                    }
                   
                    ftp_anonymus_cfg();
                }

                users_table = dgeid(ftp_prefix + "users")
                users_matrix = []
                users = server_cfg["users"]

                for (i = 0; i < users.length; i++) {
                    username = users[i]["username"]
                    password = users[i]["password"]
                    shared_folder = users[i]["shared_folder"]
                    users_matrix.push([username, password, shared_folder])
                }

                if (users_matrix.length > 0) {
                    emptytable(ftp_prefix + "users")
                }

                conftotable(users_matrix, users_table)
                /* checkifnotchecked(ftp_prefix + "users.div" + cb_update_suffix) */

            }

        }

        if ("a4ftp" in local_container) {

            service_cfg = local_container["a4ftp"]

            if ("http_port" in service_cfg) dgeid(ftp_prefix + "http_port").value = service_cfg["http_port"]



            if ("processExistingFiles" in service_cfg) {
                dgeid(ftp_prefix + "processExisting").checked = service_cfg["processExistingFiles"]
                checkifnotchecked(ftp_prefix + "processExisting.div" + cb_update_suffix)
            }

            if ("add_timestamp_to_filename" in service_cfg) {
                dgeid(ftp_prefix + "add_timestamp").checked = service_cfg["add_timestamp_to_filename"]
                checkifnotchecked(ftp_prefix + "add_timestamp.div" + cb_update_suffix)
            }

            if ("cloud_provider" in service_cfg) {
                cloud_provider = service_cfg["cloud_provider"].toLowerCase()
                //checkifnotchecked(ftp_prefix + "cloud.div" + cb_update_suffix)
                if (cloud_provider == "microsoft") dgeid(ftp_prefix + "cloud.microsoft").checked = true
                else if (cloud_provider == "ptc") dgeid(ftp_prefix + "cloud.ptc").checked = true
                else {
                    alert("On configuration file the Cloud Provider is not set to PTC or Microsoft. Please set one of these")
                    dgeid(ftp_prefix + "cloud.div" + cb_update_suffix).checked = false
                }
                ptc_enabled()
            }

            if ("azure_SAS" in service_cfg) {
                dgeid(ftp_prefix + "microsoft.sas").value = service_cfg["azure_SAS"]
                checkifnotchecked(ftp_prefix + "microsoft.sas.div" + cb_update_suffix)

            }

            if ("azure_LSA" in service_cfg) {
                dgeid(ftp_prefix + "microsoft.lsa").value = service_cfg["azure_LSA"]
                checkifnotchecked(ftp_prefix + "microsoft.lsa.div" + cb_update_suffix)

            }

            if ("azure_blobContainer" in service_cfg) {
                dgeid(ftp_prefix + "microsoft.blob_container").value = service_cfg["azure_blobContainer"]
                checkifnotchecked(ftp_prefix + "microsoft.blob_container.div" + cb_update_suffix)

            }

        }


    }
    //FTP info da pc A

}


/**
 * this function reads all configurations from the html view and returns an object 
 * with all the relevant properties.
 * Transformation form html elements to configuration is done inside this function
 */
function htmltoconf() {
    fromA = {}
    fromA["system"] = {}
    fromA["services"] = {}
    fromA["users"] = {}
    fromA["system"]["network"] = {}
    fromA["debug"] = debug

    if (version != null) fromA["version"] = version

    try {
        if ("SYSTEM") {
            local_container = fromA["system"]
            local_container["reboot"] = document.getElementById("system.reboot").checked
            local_container["toProduction"] = document.getElementById("system.toProduction").checked
            local_container["onlyinternal"] = document.getElementById("system.onlyinternal").checked


            if (document.getElementById("system.hostname.div" + cb_update_suffix).checked) {
                const hostname = document.getElementById("system.hostname").value
                if (hostname.trim() != "") {
                    local_container["hostname"] = {}
                    local_container["hostname"]["industrial"] = local_container["hostname"]["customer"] = hostname
                } else throw new Error("Hostname field is empty!")
            }
        }

        if ("NETWORK_A") {
            fromA["system"]["network"]["industrial"] = {}
            local_container = fromA["system"]["network"]["industrial"]
            local_path = "system.network.industrial."

            if (document.getElementById(local_path + "dhcp.div" + cb_update_suffix).checked) {
                dhcp = document.getElementById(local_path + "dhcp").checked

                local_container["dhcp"] = dhcp

                ipv4_list = []
                ipv4_broadcastAddress_list = []

                if (!dhcp) {
                    if (document.getElementById(local_path + "ip.div" + cb_update_suffix).checked) {
                        ipv4_list = document.getElementById(local_path + "ip").value

                        ipv4_list = ipv4_list.split(",")

                        local_container["ip"] = []

                        ipv4_list.forEach(function (element) {
                            element = element.trim()
                            if (element != "") {
                                if (!verifyIPCIDR(element)) throw new Error("ERROR:\nin section \"Internal PC\"/\"IP/MASK\": " + element + " is not a valid IP in CIDR notation")

                                if (!verifyIPnotbroadcast(element)) throw new Error("ERROR:\nin section \"Internal PC\"/\"IP/MASK\": looks like " + element + " is a broadcast IP address")

                                local_container["ip"].push(element)
                            } else throw new Error("ERROR:\nin section \"Internal PC\"/\"IP/MASK\": one of the IP address is an empty string")
                        })
                    }

                    if (ipv4_list.length != 0) {
                        ipv4_list.forEach(function (ip_with_netmask) {
                            broadcastAddress = getIpRangeFromAddressAndNetmask(ip_with_netmask)[1]
                            ipv4_broadcastAddress_list.push(broadcastAddress)
                        })
                        //ipv4_broadcastAddress_list = [...new Set(ipv4_broadcastAddress_list)]     //delete duplicate in list (not supported by IE)
                        ipv4_broadcastAddress_list = removeDuplicates(ipv4_broadcastAddress_list) //delete duplicate in list (supported by IE)
                    }

                }
            }

            if (document.getElementById(local_path + "routes.div" + cb_update_suffix).checked) {
                routes_table = dgeid("system.network.industrial.routes")

                routes_list = tabletoconf(routes_table)

                routes = {}

                routes_list.forEach(function (element) {
                    remote_net = element[0].trim()
                    next_hop = element[1].trim()

                    if (!verifyIPCIDR(remote_net)) {
                        throw new Error("ERROR:\nin section \"Internal PC\"/\"Routes\": " + remote_net + " is not a valid IP address in CIDR notation")
                    }

                    if (!verifyIP(next_hop)) throw new Error("ERROR:\nin section \"Internal PC\"/\"Routes\": " + next_hop + " is not a valid IP address")
                    else {
                        //check se il gateway inserito per una rotta fa parte della subnet corrispondente
                        remote_net_mask = remote_net.split('/')[1]
                        remote_net_broadcastAddress = getIpRangeFromAddressAndNetmask(remote_net)[1]
                        broadcastAddress_gw = getIpRangeFromAddressAndNetmask(next_hop + "/" + remote_net_mask)[1]
                        if (remote_net_broadcastAddress != broadcastAddress_gw) throw new Error("ERROR:\nin section \"Internal PC\"/\"Routes\": " +
                            next_hop + " is not in " + remote_net + " network")

                        //check se per la subnet inserita nelle rotte si ha almeno un IP sulla scheda di rete del pc A appartenente a quella rete                                                      
                        if (ipv4_list.length != 0 && ipv4_broadcastAddress_list.length != 0) {
                            //broadcastAddress_gw = remote_net_broadcastAddress
                            if (!ipv4_broadcastAddress_list.includes(broadcastAddress_gw))
                                throw new Error("ERROR:\nin section \"Internal PC\"/\"Routes\": " + remote_net +
                                    " with gw " + next_hop + " is not reachable. You need an IP address on " +
                                    remote_net + " to reach it ")
                        }
                    }

                    if (remote_net in routes) {
                        alert(remote_net + " already inserted in routes table. Gateway is updated")
                    }
                    routes[remote_net] = next_hop

                })

                local_container["routes"] = routes

            }

            if (document.getElementById(local_path + "netwroksscan.div" + cb_update_suffix).checked) {
                networks_table = dgeid("system.network.industrial.netwroksscan")

                netscan_list = tabletoconf(networks_table)

                networks_scan = []

                netscan_list.forEach(function (element) {
                    remote_net = element.trim()

                    if (!verifyIPCIDR(remote_net)) {
                        throw new Error("ERROR:\nin section \"Internal PC\"/\"Networks Scan\": " + remote_net + " is not a valid IP address in CIDR notation")
                    }

                    networks_scan.push(remote_net)

                })

                local_container["net_scan"] = networks_scan

            }

        }

        if ("KEPWARE") {
            fromA["services"]["kepware"] = {}
            local_container = fromA["services"]["kepware"]
            local_path = "services.kepware."

            /*      if (document.getElementById(local_path + "reload").checked) {
                     local_container["reload"] = true
                 } */

            if (document.getElementById(local_path + "trial.div" + cb_update_suffix).checked) {
                local_container["trial"] = document.getElementById(local_path + "trial").checked
            }
        }

        if ("NETWORK_B") {

            fromA["system"]["network"]["customer"] = {}
            local_container = fromA["system"]["network"]["customer"]
            local_path = "system.network.customer."

            dhcp = document.getElementById(local_path + "dhcp").checked

            if (document.getElementById(local_path + "dhcp.div" + cb_update_suffix).checked) local_container["dhcp"] = dhcp

            if (!dhcp) {
                local_container["static"] = {}

                ipv4_list = ""

                if (document.getElementById(local_path + "static.ip.div" + cb_update_suffix).checked) {
                    ipv4_list = document.getElementById(local_path + "static.ip").value

                    ipv4_list = ipv4_list.split(",")

                    local_container["static"]["ip"] = []

                    ipv4_list.forEach(function (element) {
                        element = element.trim()
                        if (element != "") {
                            if (!verifyIPCIDR(element)) throw new Error("ERROR:\nin section \"External PC\"/\"IP/MASK\": " + element + " is not a valid IP in CIDR notation")

                            if (!verifyIPnotbroadcast(element)) throw new Error("ERROR:\nin section \"External PC\"/\"IP/MASK\": looks like " + element + " is a broadcast IP address")

                            local_container["static"]["ip"].push(element)
                        } else throw new Error("ERROR:\nin section \"External PC\"/\"IP/MASK\": one of the IP address is an empty string")
                    })

                }

                if (document.getElementById(local_path + "static.dns.div" + cb_update_suffix).checked) {
                    dns_list = document.getElementById(local_path + "static.dns").value.trim()
                    local_container["static"]["dns"] = []
                    if (dns_list != "") {
                        dns_list = dns_list.split(",")

                        dns_list.forEach(function (element) {
                            element = element.trim()
                            if (element != "") {
                                if (verifyIP(element)) local_container["static"]["dns"].push(element)
                                else throw new Error("ERROR:\nin section \"External PC\"/\"Server DNS\": " + element + " is not a valid IP")
                            } else throw new Error("ERROR:\nin section \"External PC\"/\"Server DNS\": one of the fields is empty")
                        })
                    }
                }

                if (document.getElementById(local_path + "static.dgw.div" + cb_update_suffix).checked) {

                    dgw = document.getElementById(local_path + "static.dgw").value.trim()

                    if (dgw != "") {
                        if (!verifyIP(dgw)) throw new Error("ERROR:\nin section \"External PC\"/\"Default Gateway\": " + dgw + " is not a valid IP address")
                        if (ipv4_list != "") {
                            //per tutti gli ip inseriti, verificare se almeno uno degli ip è nella stessa subnet del gateway
                            isCorrect = false

                            // il check viene fatto su tutti gli ip
                            /* for(var i = 0; i < ipv4_list.length; i++){
                                ip_with_netmask = ipv4_list[i]
                                ip_mask = ip_with_netmask.split('/')[1]
                                ip_range = getIpRangeFromAddressAndNetmask(ip_with_netmask)
                                baseAddress = ip_range[0].trim()
                                broadcastAddress = ip_range[1].trim()
                                gw_range = getIpRangeFromAddressAndNetmask(dgw + '/' + ip_mask)
                                gw_baseAddress = gw_range[0].trim()
                                gw_broadcastAddress = gw_range[1].trim()
                                if (baseAddress == gw_baseAddress && broadcastAddress == gw_broadcastAddress) isCorrect = true
                            } */

                            // prendere il primo ip inserito assumendo che venga inserito l'ip primario
                            ip_with_netmask = ipv4_list[0]
                            ip_mask = ip_with_netmask.split('/')[1]
                            ip_range = getIpRangeFromAddressAndNetmask(ip_with_netmask)
                            //baseAddress = ip_range[0].trim()
                            broadcastAddress = ip_range[1].trim()
                            gw_range = getIpRangeFromAddressAndNetmask(dgw + '/' + ip_mask)
                            //gw_baseAddress = gw_range[0].trim()
                            gw_broadcastAddress = gw_range[1].trim()
                            if ( /*baseAddress == gw_baseAddress &&*/ broadcastAddress == gw_broadcastAddress) isCorrect = true

                            if (!isCorrect) throw new Error("ERROR:\nin section \"External PC\"/\"Default Gateway\": Primary IP " + dgw + " is not an address into " + ip_with_netmask + " subnet")

                        }
                    }

                    local_container["static"]["gateway"] = dgw
                }
            }

            medium = (document.getElementById(local_path + "connection.ethernet").checked) ? "ethernet" : "wireless"

            if (document.getElementById(local_path + "connection.div" + cb_update_suffix).checked) {
                local_container["if_wan_medium"] = medium
            }

            if (medium == "wireless") {
                local_container["wireless"] = {}

                wireless_table_id = "system.network.customer.connection.wireless.networks"
                wireless_table = dgeid(wireless_table_id)

                wireless_list = tabletoconf(wireless_table)

                if (wireless_list.length == 0) throw new Error("ERROR:\n in \"External PC\" Wireless connection has been selected, but there are no SSID/password entries.\nFill at least one line.\nTo use SSID with no password, leave the password field empty")

                for (var i = 0; i < wireless_list.length; i++) {
                    line = wireless_list[i]
                    ssid = line[0]
                    if (ssid == "") throw new Error("ERROR:\nin \"Wireless\" section one of the SSID fields is empty")
                    passsword = line[1]
                    local_container["wireless"][ssid] = passsword
                }
            }

            if (document.getElementById(local_path + "ntp.server.div" + cb_update_suffix).checked) {
                local_container["ntp"] = []
                // if (gmntp update is checked and gmntp is false) or gmntp update is false
                if ((dgeid(local_path + "ntp.gatemanager.div" + cb_update_suffix).checked && !dgeid(local_path + "ntp.gatemanager").checked) || (!dgeid(local_path + "ntp.gatemanager.div" + cb_update_suffix).checked)) {
                    ntp_server_list = document.getElementById(local_path + "ntp.server").value

                    ntp_server_list.split(",").forEach(function (element) {
                        element = element.trim()
                        if (element != "") {
                            if (verifyIP(element)) local_container["ntp"].push(element)
                            else throw new Error("ERROR:\nin section \"External PC\"/\"NTP\": " + element + " is not a valid IP")
                        }
                    })
                }
            }

            if (document.getElementById(local_path + "nat.enabled.div" + cb_update_suffix).checked) {
                local_container["nat"] = document.getElementById(local_path + "nat.enabled").checked
            }

            if (document.getElementById(local_path + "mtoi.div" + cb_update_suffix).checked) {
                local_container["machine_to_internet"] = document.getElementById(local_path + "mtoi").checked
            }

            // firewall alias table
            if (document.getElementById(local_path + "alias.div" + cb_update_suffix).checked) {
                alias_table = dgeid(local_path + "alias")
                alias_list = tabletoconf(alias_table)
                alias = {}

                for (var i = 0; i < alias_list.length; i++) {
                    element = alias_list[i]
                    key = element[0].trim()
                    value = element[1].trim()

                    if (key == "") throw new Error("ERROR:\nin section \"External PC\"/\"Firewalll alias\": at row " + (i + 1) + " alias is empty ")
                    if (isNumeric(key)) throw new Error("ERROR:\nin section \"External PC\"/\"Firewalll alias\": at row " + (i + 1) + " alias is a number. Please do not use a number as alias ")

                    // value is:
                    //  an empty string (accepted here, then ignored by a4firewall)
                    //  a port number, so a number between 1 and 65535 (if that, parseInt is used to avoid floats)
                    //  an IP address
                    //  a network in CIDR notation
                    if (!(value == "" || (isPortNumber(value) && (value = parseInt(value))) || verifyIP(value) || verifyIPCIDR(value))) {
                        throw new Error("ERROR:\nin section \"External PC\"/\"Firewalll alias\": at row " + (i + 1) + " value " + value + " is neither a valid port number, nor an IP nor an IP in CIDR notation")
                    }

                    if (key in alias) alert("INFO:\nin section \"External PC\"/\"Firewalll alias\": at row " + (i + 1) + " alias " + key + " is a duplicate. Ignoring value " + value)
                    else alias[key] = value
                }

                local_container["ALIAS"] = alias
            }

            // tcp input table
            if (document.getElementById(local_path + "input.wan.tcp.div" + cb_update_suffix).checked) {
                input_tcp_table = dgeid(local_path + "input.wan.tcp")

                input_tcp_list = tabletoconf(input_tcp_table)

                input_tcp = {}

                for (var i = 0; i < input_tcp_list.length; i++) {
                    element = input_tcp_list[i]
                    port = element[0].trim()
                    source = element[1].trim()

                    // port (or alias for port) must be an integer between 1 and 65535
                    if (isPortNumber(port)) {
                        port = parseInt(port)
                    } else {
                        // could be an alias
                        if (!("ALIAS" in local_container && port in local_container["ALIAS"] && isPortNumber(local_container["ALIAS"][port]))) {
                            // alias in not there or alias is not a port
                            throw new Error("ERROR:\nin section \"External PC\"/\"TCP ports input\": at row " + (i + 1) + " value " + port + " is not a valid port number or alias")
                        }
                    }

                    // source (or alias or source) must be a network in CIDR notation
                    if (!verifyIPCIDR(source)) {
                        // could be an alias
                        if (!("ALIAS" in local_container && source in local_container["ALIAS"] && verifyIPCIDR(local_container["ALIAS"][source]))) {
                            // alias in not there or alias is not cidr
                            throw new Error("ERROR:\nin section \"External PC\"/\"TCP ports input\":: at row " + (i + 1) + " value " + source + " or it's alias is not a valid network identifier in CIDR notation")
                        }
                    }

                    if (!(port in input_tcp)) input_tcp[port] = []
                    input_tcp[port].push(source)
                }

                local_container["PORTS_TCP_SERVER_WAN"] = input_tcp
            }

            // forward table
            if (document.getElementById(local_path + "nat.forward.div" + cb_update_suffix).checked) {
                forward_input_table = dgeid(local_path + "nat.forward")

                forward_input_list = tabletoconf(forward_input_table)

                forward_input = []

                for (var i = 0; i < forward_input_list.length; i++) {
                    element = forward_input_list[i]
                    IP_EXT = element[0].trim() // can be empty
                    PORT_EXT = element[1].trim()
                    IP_DST = element[2].trim()
                    PORT_DST = element[3].trim() // can be empty
                    SOURCE = element[4].trim()

                    // IP_EXT (if alias or not) must be a valid ip or empty
                    if (!(IP_EXT == "" ||
                        verifyIP(IP_EXT) ||
                        (
                            "ALIAS" in local_container &&
                            IP_EXT in local_container["ALIAS"] &&
                            (
                                verifyIP(local_container["ALIAS"][IP_EXT]) ||
                                local_container["ALIAS"][IP_EXT] == ""
                            )
                        )
                    )) {
                        throw new Error("ERROR:\nin section \"External PC\"/\"Forward TCP ports\": at row " + (i + 1) + " value " + IP_EXT + " is not a valid alias or IP address")
                    }

                    // PORT_EXT (if alias or not) must be a valid port number
                    if (isPortNumber(PORT_EXT)) {
                        PORT_EXT = parseInt(PORT_EXT)
                    } else {
                        if (!("ALIAS" in local_container && PORT_EXT in local_container["ALIAS"] && isPortNumber(local_container["ALIAS"][PORT_EXT])))
                            throw new Error("ERROR:\nin section \"External PC\"/\"Forward TCP ports\": at row " + (i + 1) + " value " + PORT_EXT + " is not a valid port number for field \"External port\"")
                    }

                    // IP_DST (if alias or not) must be a valid ip address
                    if (!(verifyIP(IP_DST) || ("ALIAS" in local_container && IP_DST in local_container["ALIAS"] && verifyIP(local_container["ALIAS"][IP_DST])))) {
                        throw new Error("ERROR:\nin section \"External PC\"/\"Forward TCP ports\": at row " + (i + 1) + " value " + IP_DST + " is not a valid IP address for field \"Destination IP\"")
                    }

                    // PORT_DST (if alias or not)  must be a valid port number or empty
                    if (isPortNumber(PORT_DST)) {
                        PORT_DST = parseInt(PORT_DST)
                    } else {
                        if (!(PORT_DST == "" || ("ALIAS" in local_container && PORT_DST in local_container["ALIAS"] && isPortNumber(local_container["ALIAS"][PORT_DST])))) {
                            throw new Error("ERROR:\nin section \"External PC\"/\"Forward TCP ports\": at row " + (i + 1) + " value " + PORT_DST + " is not a valid alias or port number for field \"Destination port\"")
                        }
                    }

                    // source (if alias or not), must be a network in cidr notation 
                    if (!(verifyIPCIDR(SOURCE) || ("ALIAS" in local_container && SOURCE in local_container["ALIAS"] && verifyIPCIDR(local_container["ALIAS"][SOURCE])))) {
                        throw new Error("ERROR:\nin section \"External PC\"/\"Forward TCP ports\": at row " + (i + 1) + " value " + SOURCE + " is not a valid value for field \"Source\" . Must be an alias or network in CIDR notation")
                    }

                    // since SOURCE in the JSON must be an array, we need to check if 4 elements already exist
                    //  if already exist, extract source and append the actual source
                    //  if do not exist, create source as an array of only actual source
                    var added = false
                    for (var j = 0; j < forward_input.length; j++) {
                        key = forward_input[j]

                        if ((key["IP_EXT"] == IP_EXT) && (key["PORT_EXT"] == PORT_EXT) && (key["IP_DST"] == IP_DST) && (key["PORT_DST"] == PORT_DST)) {
                            added = true
                            // add only if not already present as source
                            // avoid duplicates
                            if (!key["SOURCE"].includes(SOURCE)) {
                                key["SOURCE"].push(SOURCE)
                            }
                        }
                    }

                    if (added == false) {
                        forward_input.push({
                            "IP_EXT": IP_EXT,
                            "PORT_EXT": PORT_EXT,
                            "IP_DST": IP_DST,
                            "PORT_DST": PORT_DST,
                            "SOURCE": [SOURCE]
                        })
                    }
                    added = false
                }

                local_container["INPUT_NAT"] = forward_input
            }

            if (document.getElementById(local_path + "firewall.enabled.div" + cb_update_suffix).checked) {
                local_container["firewall_enabled"] = document.getElementById(local_path + "firewall.enabled").checked
            }
        }

        if ("SITEMANAGER") {

            fromA["services"]["sitemanager"] = {}
            local_container = fromA["services"]["sitemanager"]
            local_path = "services.sitemanager."


            if (document.getElementById(local_path + "domain.div" + cb_update_suffix).checked) {
                const sme_domain = document.getElementById(local_path + "domain").value

                if (sme_domain != "") local_container["domain"] = sme_domain
                else throw new Error("ERROR:\nin \"SiteManager\" section GateManager domain field is empty!")
            }

            if (document.getElementById(local_path + "server.div" + cb_update_suffix).checked) {
                const sme_server = document.getElementById(local_path + "server").value

                if (sme_server != "") local_container["server"] = sme_server
                else throw new Error("ERROR:\nin \"SiteManager\" section GateManager server field is empty!")
            }

            if (document.getElementById(local_path + "onlybidir.div" + cb_update_suffix).checked) {
                local_container["onlybidir"] = document.getElementById(local_path + "onlybidir").checked
            }

            if (document.getElementById(local_path + "enabled.div" + cb_update_suffix).checked) {
                local_container["enabled"] = document.getElementById(local_path + "enabled").checked
            }

            if (document.getElementById(local_path + "nameashostname.div" + cb_update_suffix).checked) {
                local_container["nameashostname"] = document.getElementById(local_path + "nameashostname").checked
                if (local_container["nameashostname"] == false) {
                    sme_name = document.getElementById(local_path + "name").value

                    if (sme_name != "") local_container["name"] = sme_name
                    else throw new Error("ERROR:\nin \"SiteManager\" section SiteManager name field is empty!")
                }
            }

            /*    if (document.getElementById(local_path + "command.div" + cb_update_suffix).checked) {
                   command = null
   
                   if (document.getElementById(local_path + "command.restart").checked) command = "restart"
   
                   if (document.getElementById(local_path + "command.stop").checked) command = "stop"
   
                   if (document.getElementById(local_path + "command.start").checked) command = "start"
   
                   local_container["command"] = command
               } */

            if (document.getElementById("system.network.customer.ntp.gatemanager.div" + cb_update_suffix).checked) {
                local_container["usentp"] = document.getElementById("system.network.customer.ntp.gatemanager").checked
            }

            if (document.getElementById(local_path + "resetuid.div" + cb_update_suffix).checked) {
                local_container["resetuid"] = document.getElementById(local_path + "resetuid").checked
            }

            if (document.getElementById(local_path + "agents.div" + cb_update_suffix).checked) {
                local_container["resetuid"] = document.getElementById(local_path + "resetuid").checked
            }

            if (document.getElementById(local_path + "agents.div" + cb_update_suffix).checked) {
                local_container["agents"] = {}
                agents_table = document.getElementById(local_path + "agents")

                list_as_array = tabletoconf(agents_table)

                agents = {}

                for (i = 0; i < list_as_array.length; i++) {
                    //for(element of list_as_array) {

                    element = list_as_array[i]
                    agent_name = element[0]
                    sn = element[1]
                    name = element[2]
                    agent = element[3]
                    cfg = element[4]

                    if (name.trim() != "") {

                        if (cfg.trim() != "") {

                            ag_name = local_container["agents"] = {}
                            ag_name["agent"] = agent
                            ag_name["name"] = name
                            ag_name["sn"] = sn
                            ag_name["cfg"] = cfg

                            agents[agent_name] = ag_name
                            //console.log(local_container["agents"][agent_name])

                        } else throw new Error("ERROR:\nin \"SiteManager\"/\"SME Agents\" table, at line with\n" + "Device Type -> " + agent +
                            "\nthe \"Device IP & Parameters\" field is empty. Please fill it")

                    } else throw new Error("ERROR:\nin \"SiteManager\"/\"SME Agents\" table, at line with\n" + "Device Type -> " + agent +
                        "\nthe \"Device name\" field is empty. Please fill it")

                }

                local_container["agents"] = agents

            }
        }

        if ("TW") {

            fromA["services"]["thingworx"] = {}
            local_container = fromA["services"]["thingworx"]
            local_path = "services.thingworx."


            if (document.getElementById(local_path + "host.div" + cb_update_suffix).checked) {
                const tw_host = document.getElementById(local_path + "host").value

                if (tw_host != "") local_container["host"] = tw_host
                else throw new Error("ThingWorx Server field is empty!")
            }

            if (document.getElementById(local_path + "appkey.div" + cb_update_suffix).checked) {
                const tw_appkey = document.getElementById(local_path + "appkey").value

                if (tw_appkey != "") local_container["appkey"] = tw_appkey
                else throw new Error("ThingWorx AppKey field is empty!")

            }

            /*   if (document.getElementById(local_path + "command.div" + cb_update_suffix).checked) {
                  command = null
  
                  if (document.getElementById(local_path + "command.restart").checked) command = "restart"
  
                  if (document.getElementById(local_path + "command.stop").checked) command = "stop"
  
                  if (document.getElementById(local_path + "command.start").checked) command = "start"
  
                  if (command != null) local_container["command"] = command
              } */

            if (document.getElementById(local_path + "enabled.div" + cb_update_suffix).checked) {
                local_container["enabled"] = document.getElementById("services.thingworx.enabled").checked
            }


            if (document.getElementById(local_path + "things.http.div" + cb_update_suffix).checked) {
                things_table = dgeid(local_path + "things.http")

                list_as_array = tabletoconf(things_table)

                things = {}
                list_as_array.forEach(function (element) {
                    // row has columns iotgw, topic, thing
                    // iotgw -> element[0]
                    // thing -> element[2]
                    temp_iotgw = element[0]
                    temp_thing = element[1]

                    // console.log("just read. Row is ", temp_iotgw, temp_thing )

                    // if thing field is still empty, an exception is thrown
                    if (temp_thing != "") {
                        if (!(temp_thing in things)) things[temp_thing] = {}
                        temp = things[temp_thing]
                        temp[temp_iotgw] = iotgw_topic_prefix_no_rep + temp_thing
                    } else throw new Error("ERROR:\nin \"ThingWorx\"/\"Things\" table, at line with\n" + "IoT Gateway -> " + temp_iotgw + "\nthe \"Thing name\" field is empty. Please fill it")

                    // console.log("after second review, tble things is", things)
                })

                local_container["things"] = things
            }
        }

        if ("BACKCHANNEL") {
            fromA["services"]["backchannel"] = {}
            local_container = fromA["services"]["backchannel"]
            local_path = "services.backchannel."

            if (document.getElementById(local_path + "topics.div" + cb_update_suffix).checked) {
                topics_table = document.getElementById(local_path + "topics")
                local_container["topics"] = tabletoconf(topics_table)
            }

            if (document.getElementById(local_path + "files.div" + cb_update_suffix).checked) {
                files_table = document.getElementById(local_path + "files")
                local_container["files"] = tabletoconf(files_table)
            }

        }

        if ("OPCUA") {
            fromA["services"]["opcua"] = {}
            local_container = fromA["services"]["opcua"]
            local_path = "services.opcua."

            if (document.getElementById(local_path + "enabled.div" + cb_update_suffix).checked) {
                enabled = document.getElementById(local_path + "enabled").checked
                local_container["enabled"] = enabled


            }
            /* 
                        if (document.getElementById(local_path + "command.div" + cb_update_suffix).checked) {
                            command = null
            
                            if (document.getElementById(local_path + "command.restart").checked) command = "restart"
            
                            if (document.getElementById(local_path + "command.stop").checked) command = "stop"
            
                            if (document.getElementById(local_path + "command.start").checked) command = "start"
            
                            if (command != null) local_container["command"] = command
                        } */

            if (document.getElementById(local_path + "shift_property_from_kepware.div" + cb_update_suffix).checked) {
                shift_from = document.getElementById(local_path + "shift_property_from_kepware").value
                local_container["shift_property_from_kepware"] = shift_from
            }

            if (document.getElementById(local_path + "shift_property_to_kepware.div" + cb_update_suffix).checked) {
                shift_to = document.getElementById(local_path + "shift_property_to_kepware").value
                local_container["shift_property_to_kepware"] = shift_to
            }

            if (document.getElementById(local_path + "custom_port_enable.div" + cb_update_suffix).checked) {
                if (!("opcua" in local_container)) {
                    local_container["opcua"] = {}
                }
                custom_port_enable = document.getElementById(local_path + "custom_port_enable").checked
                local_container["opcua"]["custom_port_enable"] = custom_port_enable
                if (custom_port_enable == true) {
                    custom_port = document.getElementById(local_path + "custom_port").value
                    local_container["opcua"]["custom_port"] = custom_port
                }
            }

            if (document.getElementById(local_path + "user_auth.div" + cb_update_suffix).checked) {
                if (!("security" in local_container)) {
                    local_container["security"] = {}
                }
                user_auth = document.getElementById(local_path + "user_auth").checked
                local_container["security"]["user_auth"] = user_auth

                users_table = document.getElementById(local_path + "users")
                users_list = tabletoconf(users_table)
                users = {}
                for (var i = 0; i < users_list.length; i++) {
                    username = users_list[i][0].trim()
                    if (username == "") {
                        throw new Error("ERROR:\nin \"OPCUA\"/\"Users\" table, at line " + (i + 1) + "\n username field is empty ")
                    }

                    password = users_list[i][1].trim()
                    if (password == "") {
                        throw new Error("ERROR:\nin \"OPCUA\"/\"Password\" table, at line " + (i + 1) + "\n password field is empty ")
                    }

                    users[username] = password
                }

                local_container["security"]["users"] = users
            }

            if (document.getElementById(local_path + "things.div" + cb_update_suffix).checked) {

                local_container["iotgw"] = {}

                things_table = document.getElementById(local_path + "things.fromkepware")
                things_list = tabletoconf(things_table)
                local_container["iotgw"]["from"] = things_list

                things_table = document.getElementById(local_path + "things.tokepware")
                things_list = tabletoconf(things_table)
                local_container["iotgw"]["to"] = things_list
            }
        }

        if ("FTP") {
            fromA["services"]["ftp"] = {}
            fromA["services"]["ftp"]["A"] = {}
            fromA["services"]["ftp"]["B"] = {}
            local_container_A = fromA["services"]["ftp"]["A"]
            local_container_B = fromA["services"]["ftp"]["B"]
            local_container_A["a4ftp"] = {}
            local_container_A["server"] = {}
            local_container_A["server"]["anonymus_login"] = {}
            local_container_A["server"]["users"] = []
            //local_container_A["server"]["anonymus_login"]["shared_folder"] = false
            //local_container_A["server"]["anonymus_login"]["shared_folder"] = ""

            local_path = "services.ftp."

            if (document.getElementById(local_path + "A.enabled.div" + cb_update_suffix).checked) {
                enabled = document.getElementById(local_path + "A.enabled").checked
                local_container_A["enabled"] = enabled
            }

            if (document.getElementById(local_path + "B.enabled.div" + cb_update_suffix).checked) {
                enabled = document.getElementById(local_path + "B.enabled").checked
                local_container_B["enabled"] = enabled
            }

            /* if (document.getElementById(local_path + "command.div" + cb_update_suffix).checked) {
                command = null

                if (document.getElementById(local_path + "command.restart").checked) command = "restart"

                if (document.getElementById(local_path + "command.stop").checked) command = "stop"

                if (document.getElementById(local_path + "command.start").checked) command = "start"

                if (command != null) {
                    local_container_A["command"] = command
                    local_container_B["command"] = command
                }
            } */

            if (dgeid(local_path + "cloud.div" + cb_update_suffix).checked) {

                cloud_provider = null

                if (dgeid(local_path + "cloud.ptc").checked) cloud_provider = "ptc"
                else if (dgeid(local_path + "cloud.microsoft").checked) cloud_provider = "microsoft"

                if (cloud_provider != null) {
                    local_container_A["a4ftp"]["cloud_provider"] = cloud_provider
                    local_container_B["cloud_provider"] = cloud_provider
                }

                if (cloud_provider == "microsoft") {
                    if (dgeid(local_path + "microsoft.sas.div" + cb_update_suffix).checked) {
                        azure_SAS = dgeid(local_path + "microsoft.sas").value
                        local_container_A["a4ftp"]["azure_SAS"] = azure_SAS
                    }
                    if (dgeid(local_path + "microsoft.lsa.div" + cb_update_suffix).checked) {
                        azure_LSA = dgeid(local_path + "microsoft.lsa").value
                        local_container_A["a4ftp"]["azure_LSA"] = azure_LSA
                    }
                    if (dgeid(local_path + "microsoft.blob_container.div" + cb_update_suffix).checked) {
                        azure_blobContainer = dgeid(local_path + "microsoft.blob_container").value
                        local_container_A["a4ftp"]["azure_blobContainer"] = azure_blobContainer
                    }
                }

            }

            if (dgeid(local_path + "processExisting.div" + cb_update_suffix).checked) {
                enabled = dgeid(local_path + "processExisting").checked
                local_container_A["a4ftp"]["processExistingFiles"] = enabled
            }

            if (dgeid(local_path + "add_timestamp.div" + cb_update_suffix).checked) {
                enabled = dgeid(local_path + "add_timestamp.div").checked
                local_container_A["a4ftp"]["add_timestamp_to_filename"] = enabled
            }

            if (dgeid(local_path + "http_port.div" + cb_update_suffix).checked) {
                port = parseInt(dgeid(local_path + "http_port").value)

                if (0 < port < 65535) {
                    local_container_A["a4ftp"]["http_port"] = port
                    local_container_B["http_port"] = port
                } else {
                    throw new Error("ERROR:\nin \"Fast Data\"/\"HTTP Port\" input, \n port " + port + " is not in port range ")
                }
            }

            if (dgeid(local_path + "custom_port_enable.div" + cb_update_suffix).checked) {
                custom_port_enable = dgeid(local_path + "custom_port_enable").checked
                local_container_A["server"]["custom_port"] = custom_port_enable
                if (custom_port_enable) {
                    if (dgeid(local_path + "custom_port.div" + cb_update_suffix).checked) {
                        custom_port = parseInt(dgeid(local_path + "custom_port").value)
                        if (0 < custom_port < 65535) {
                            local_container_A["server"]["port"] = port
                        } else {
                            throw new Error("ERROR:\nin \"Fast Data\"/\"FTP Server Port\" input, \n port " + port + " is not in port range ")
                        }
                    } else {
                        local_container_A["server"]["port"] = 21
                    }

                } else local_container_A["server"]["port"] = 21
            }
            if (dgeid(local_path + "max_cons.div" + cb_update_suffix).checked) {
                max_cons = parseInt(dgeid(local_path + "max_cons").value)
                if (max_cons <= 0 || max_cons > 256) throw new Error("ERROR:\nin \"Fast Data\"/\"Max connections \" " + max_cons + " is too high or too low")

                local_container_A["server"]["max_cons"] = max_cons
            }

            if (dgeid(local_path + "max_cons_per_ip.div" + cb_update_suffix).checked) {
                max_cons_per_ip = parseInt(dgeid(local_path + "max_cons_per_ip").value)
                if (max_cons_per_ip <= 0 || max_cons_per_ip > 256) throw new Error("ERROR:\nin \"Fast Data\"/\"Max connections for IP\" " + max_cons_per_ip + " is too high or too low")

                local_container_A["server"]["max_cons_per_ip"] = max_cons_per_ip
            }

            if (dgeid(local_path + "folders.history.size.div" + cb_update_suffix).checked) {
                historyFile_folder_max_bytes = parseInt(dgeid(local_path + "folders.history.size").value)
                if (historyFile_folder_max_bytes >= 0) local_container_A["server"]["historyFile_folder_max_bytes"] = historyFile_folder_max_bytes
                else throw new Error("ERROR:\nin \"Fast Data\"/\"Received file folder max size bytes\" input, \n size can't be negative ")
            }

            if (dgeid(local_path + "folders.history.days.div" + cb_update_suffix).checked) {
                historyFile_days_expire = parseInt(dgeid(local_path + "folders.history.days").value)
                if (historyFile_days_expire >= 0) local_container_A["server"]["historyFile_days_expire"] = historyFile_days_expire
                else throw new Error("ERROR:\nin \"Fast Data\"/\"Received file folder old days limit\" input, \n days can't be negative ")
            }

            if (dgeid(local_path + "folders.sent.size.div" + cb_update_suffix).checked) {
                sentFile_folder_max_bytes = parseInt(dgeid(local_path + "folders.sent.size").value)
                if (sentFile_folder_max_bytes >= 0) local_container_A["server"]["sentFile_folder_max_bytes"] = sentFile_folder_max_bytes
                else throw new Error("ERROR:\nin \"Fast Data\"/\"Sent file folder max size bytes\" input, \n size can't be negative ")
            }

            if (dgeid(local_path + "folders.sent.days.div" + cb_update_suffix).checked) {
                sentFile_days_expire = parseInt(dgeid(local_path + "folders.sent.days").value)
                if (sentFile_days_expire >= 0) local_container_A["server"]["sentFile_days_expire"] = sentFile_days_expire
                else throw new Error("ERROR:\nin \"Fast Data\"/\"Sent file folder old days limit\" input, \n days can't be negative ")
            }

            if (dgeid(local_path + "folders.not_sent.size.div" + cb_update_suffix).checked) {
                NOTsentFile_folder_max_bytes = parseInt(dgeid(local_path + "folders.not_sent.size").value)
                if (NOTsentFile_folder_max_bytes >= 0) local_container_A["server"]["NOTsentFile_folder_max_bytes"] = NOTsentFile_folder_max_bytes
                else throw new Error("ERROR:\nin \"Fast Data\"/\"NOT sent file folder max size bytes\" input, \n size can't be negative ")
            }

            if (dgeid(local_path + "folders.not_sent.days.div" + cb_update_suffix).checked) {
                NOTsentFile_days_expire = parseInt(dgeid(local_path + "folders.not_sent.days").value)
                if (NOTsentFile_days_expire >= 0) local_container_A["server"]["NOTsentFile_days_expire"] = NOTsentFile_days_expire
                else throw new Error("ERROR:\nin \"Fast Data\"/\"NOT sent file folder old days limit\" input, \n days can't be negative ")
            }
            if (dgeid(local_path + "users.anonymus.div" + cb_update_suffix).checked) {
                anonymus_login_enabled = dgeid(local_path + "users.anonymus").checked
                local_container_A["server"]["anonymus_login"]["enable"] = anonymus_login_enabled

                if (anonymus_login_enabled) {
                    if (dgeid(local_path + "users.anonymus.folder.div" + cb_update_suffix).checked) {
                        anonymus_folder = dgeid(local_path + "users.anonymus.folder").value.trim()
                        if (anonymus_folder.includes(" ")) throw new Error("ERROR:\nin \"Fast Data\"/\"Anonymus Folder\" input, \n Folder can't contains spaces ")
                        else {
                            local_container_A["server"]["anonymus_login"]["shared_folder"] = anonymus_folder
                        }
                    }
                  

                }

            }
           

            users_table = document.getElementById(local_path + "users")
            users_list = tabletoconf(users_table)
            users = []
            for (var i = 0; i < users_list.length; i++) {
                /* username = users_list[i][0].trim()
                if (username == "") {
                    throw new Error("ERROR:\nin \"OPCUA\"/\"Users\" table, at line " + (i + 1) + "\n username field is empty ")
                } */

                /* password = users_list[i][1].trim()
                if (password == "") {
                    throw new Error("ERROR:\nin \"OPCUA\"/\"Password\" table, at line " + (i + 1) + "\n password field is empty ")
                } */

                username = users_list[i][0].trim()
                password = users_list[i][1].trim()
                shared_folder = users_list[i][2].trim()

                users.push({
                    "username": username,
                    "password": password,
                    "shared_folder": shared_folder
                })
            }

            local_container_A["server"]["users"] = users

            /*   if (dgeid(local_path + "users.div" + cb_update_suffix).checked) {
  
                  
  
              } */

            /* fromA["services"]["ftp"]["A"] = local_container_A
            fromA["services"]["ftp"]["B"] = local_container_B */
          
        }
    

    } catch (e) {
        console.error(e)
    }

    // suspended because it cleans routes if routes are empty...
    // cleans fromA
    // every object with no properties is deleted  
    // clearEmpties(fromA)

    return fromA
}



/**
 * automatically adds a checkbox to a div if the div has the class
 * "update_class_last" or "update_class_second"
 */

function add_cb() {
    let update_slave = document.getElementsByClassName("update_class_last")

    for (let i = 0; i < update_slave.length; i++) {
        chkbx = document.createElement("INPUT");
        chkbx.setAttribute("type", "checkbox");
        chkbx.setAttribute("id", update_slave[i].id + cb_update_suffix)
        chkbx.setAttribute("class", "update_cb")



        update_slave[i].insertBefore(chkbx, update_slave[i].firstChild);

        /* update_slave[i].appendChild(chkbx) */


        /* var label = document.createElement('label')
        label.htmlFor = chkbx.id */
        /* label.appendChild(document.createTextNode('Update')); */
        /* update_slave[i].appendChild(label); */
    }

    let update_master = document.getElementsByClassName("update_class_second")

    for (let i = 0; i < update_master.length; i++) {
        let h4 = document.createElement("span")
        h4.setAttribute("class", "inline")
        h4.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;"

        chkbx = document.createElement("INPUT");
        chkbx.setAttribute("type", "checkbox");
        chkbx.setAttribute("id", update_master[i].id + cb_update_suffix);
        chkbx.setAttribute("class", "update_cb");
        /* chkbx.setAttribute("onclick", 'cb_update(this);'); */


        h4.appendChild(chkbx)



        /* label = document.createElement('label')
        label.htmlFor = chkbx.id
        label.appendChild(document.createTextNode(''));

        label.setAttribute("class", "label_cb");
        h4.appendChild(label); */

        // add in second position
        //update_master[i].firstElementChild.after(h4)
        update_master[i].insertBefore(h4, update_master[i].children[1]);
    }

}

/**
 * handles click on the "Update" checkbox
 * 
 * what is referred below as tree is the hierarchy of checkboxes in the view.
 * The HTML page has been built to have a tree structure divided in main sections as "system" and "services",
 * and each subsection has it's own properties. To configure a property, the relative checkbox "Update" must be selected  
 * 
 * this function searches for checkboxs below in the tree and checks or unchecks the below ones
 * if the current one has been checked or not
 * 
 * after the below section, it searches for the parent checkboxes in the tree and applies check if all below are checked, 
 * removes check if all below are unchecked
 */
/* function cb_update(cb) {
    const checked = cb.checked
    let parent = cb.parentNode

    // below in the tree
    while (parent.nodeName != "DIV") parent = parent.parentNode
    Array.from(parent.getElementsByClassName("update_cb")).forEach(function (element) {
        element.checked = checked
    })

    // above in the tree
    do {
        let checkbox_child = null
        do {
            parent = parent.parentNode
            if (parent.nodeName == "BODY") break
            checkbox_child = document.getElementById(parent.id + cb_update_suffix)


        } while (checkbox_child == null)


        const update_cbs = Array.from(parent.getElementsByClassName("update_cb"))
            .filter(function (element) {

                if (element && element.hasAttribute("id")) return element.id != checkbox_child.id && element.checked == false
                else return false
            })

        checkbox_child.checked = (update_cbs.length == 0)


    }
    while (parent != null)

} */


/**
 * enables or disables static configuration for external pc when DHCP checkbox is toggled
 */



function dhcp_industrial(value) {
    var chkbx = document.getElementById("system.network.industrial.ip.div" + cb_update_suffix)
    if (value) {
        document.getElementById("system.network.industrial.dhcp").checked = value;
        document.getElementById("system.network.industrial.staticIP").checked = !value;
        var my_div = document.getElementById("system.network.industrial.ip.div");
        my_div.className = 'grey_class_last';
        chkbx.style.display = 'none';

    } else {
        document.getElementById("system.network.industrial.dhcp").checked = value;
        document.getElementById("system.network.industrial.staticIP").checked = !value;
        document.getElementById("system.network.industrial.ip.div").className = 'update_class_last';
        chkbx.style.display = 'flex';








    }
    document.getElementById("system.network.industrial.ip").disabled = value;




}

function dhcp_customer(value) {
    var my_div_ip = document.getElementById("system.network.customer.static.ip.div");
    var my_div_dgw = document.getElementById("system.network.customer.static.dgw.div");
    var my_div_dns = document.getElementById("system.network.customer.static.dns.div");

    var chkbx_ip = document.getElementById(my_div_ip.id + cb_update_suffix);
    var chkbx_dgw = document.getElementById(my_div_dgw.id + cb_update_suffix);
    var chkbx_dns = document.getElementById(my_div_dns.id + cb_update_suffix);



    if (value) {
        document.getElementById("system.network.customer.dhcp").checked = value;
        document.getElementById("system.network.customer.static").checked = !value;


        my_div_ip.className = 'grey_class_last';
        my_div_dgw.className = 'grey_class_last';
        my_div_dns.className = 'grey_class_last';

        chkbx_ip.style.display = 'none';
        chkbx_dgw.style.display = 'none';
        chkbx_dns.style.display = 'none';

    } else {
        document.getElementById("system.network.customer.dhcp").checked = value;
        document.getElementById("system.network.customer.static").checked = !value;

        my_div_ip.className = 'update_class_last';
        my_div_dgw.className = 'update_class_last';
        my_div_dns.className = 'update_class_last';

        chkbx_ip.style.display = 'flex';
        chkbx_dgw.style.display = 'flex';
        chkbx_dns.style.display = 'flex';
    }
}


/**
 * enables or disables static ip section when internal DHCP checkbox is toggled
 */





/**
 * hides or shows external pc wireless SSID table
 * table is hidden and not disables because developer did not know how to do it
 */
function ethernet_enabled() {

    const checked = document.getElementById("system.network.customer.connection.ethernet").checked;



    dgeid("system.network.customer.connection.wireless.networks").style.display = checked ? "none" : ""

    dgeid("system.network.customer.connection.wireless.networks.essid.select").style.display = checked ? "none" : ""

    dgeid("system.network.customer.connection.wireless.networks.essid.button").style.display = checked ? "none" : ""

    dgeid("system.network.customer.connection.wireless.networks.essid.select.label").style.display = checked ? "none" : ""

    dgeid("system.network.customer.connection.wireless.aerial.enabled").style.display = checked ? "none" : ""

    dgeid("system.network.customer.connection.wireless.networks.essid.list").style.display = checked ? "none" : ""
}



function sme_enabled() {

    let sme_enabled_checkbox = dgeid("services.sitemanager.enabled");
    let e = dgeid("services.sitemanager.enabled.div");
    if (sme_enabled_checkbox.checked) {

        while (e = e.nextElementSibling) {
            if (e.classList.contains("hidden")) {
                e.classList.remove("hidden");
            }
        }
        sme_nameashostname();


    } else if (!sme_enabled_checkbox.checked) {

        while (e = e.nextElementSibling) {

            e.classList.add("hidden");

        }
    }

}


function sme_nameashostname() {
    let sme_set_hostname = dgeid("services.sitemanager.nameashostname");
    let sme_enable_checkbox = dgeid("services.sitemanager.enabled");
    let sme_name_div = dgeid("services.sitemanager.name.div");
    let sme_name = dgeid("services.sitemanager.name");
    if (sme_set_hostname.checked == true) {
        sme_name.disabled = true;
        sme_name_div.className = 'grey_class_last';
        dgeid('services.sitemanager.name.div' + cb_update_suffix).style.display = 'none'
    } else if (sme_set_hostname.checked == false && sme_enable_checkbox.checked) {
        sme_name_div.className = 'update_class_last';
        sme_name.disabled = false;
        dgeid('services.sitemanager.name.div' + cb_update_suffix).style.display = 'flex'
    }

}




function tgw_enabled() {



    let tgw_enabled_checkbox = dgeid("services.thingworx.enabled");
    let e = dgeid("services.thingworx.enabled.div");
    if (tgw_enabled_checkbox.checked) {

        while (e = e.nextElementSibling) {
            if (e.classList.contains("hidden")) {
                e.classList.remove("hidden");
            }
        }


    } else if (!tgw_enabled_checkbox.checked) {

        while (e = e.nextElementSibling) {

            e.classList.add("hidden");

        }
    }




}

function fw_enabled() {


    let fw_enabled_checkbox = dgeid("system.network.customer.firewall.enabled");
    let e = dgeid("system.network.customer.firewall.enabled.div");
    if (fw_enabled_checkbox.checked) {

        while (e = e.nextElementSibling) {
            if (e.classList.contains("hidden")) {
                e.classList.remove("hidden");
            }
        }


    } else if (!fw_enabled_checkbox.checked) {

        while (e = e.nextElementSibling) {

            e.classList.add("hidden");

        }
    }

    /* alias_div = dgeid("system.network.customer.alias.div");
    tcp_ports_div = dgeid("system.network.customer.input.wan.tcp.div");
    customer_nat_div = dgeid("system.network.customer.nat.div");
    customer_nat_enable_div = dgeid("system.network.customer.nat.enabled.div");
    customer_mtoi_div = dgeid("system.network.customer.mtoi.div");
    tcp_from_exttom_div = dgeid("system.network.customer.nat.forward.div");


    customer_nat = dgeid("system.network.customer.nat.enabled");
    customer_mtoi = dgeid("system.network.customer.mtoi");




    alias_chkbx = dgeid(alias_div.id + cb_update_suffix);
    tcp_ports_chkbx = dgeid(tcp_ports_div.id + cb_update_suffix);
    customer_nat_enable_chkbx = dgeid(customer_nat_enable_div.id + cb_update_suffix);
    customer_mtoi_chbkx = dgeid(customer_mtoi_div.id + cb_update_suffix);
    tcp_from_exttom_chkbx = dgeid(tcp_from_exttom_div.id + cb_update_suffix);
    customer_nat_chkbx = dgeid(customer_nat_div.id + cb_update_suffix);





    fw_service_checkbox = dgeid("system.network.customer.firewall.enabled");
    if (fw_service_checkbox.checked) {

        alias_div.className = 'update_class_second';
        tcp_ports_div.className = 'update_class_second';
        customer_nat_enable_div.className = "update_class_last";
        customer_mtoi_div.className = "update_class_last";
        tcp_from_exttom_div.className = "update_class_second";


        customer_nat.disabled = false;
        customer_mtoi.disabled = false;




        alias_chkbx.style.display = 'flex';
        tcp_ports_chkbx.style.display = 'flex';
        customer_nat_enable_chkbx.style.display = 'flex';
        customer_mtoi_chbkx.style.display = 'flex';
        tcp_from_exttom_chkbx.style.display = 'flex';
        customer_nat_chkbx.style.display = 'flex';


    } else {

        alias_div.className = 'grey_class_second';
        tcp_ports_div.className = 'grey_class_second';
        customer_nat_enable_div.className = "grey_class_last";
        customer_mtoi_div.className = "grey_class_last";
        tcp_from_exttom_div.className = "grey_class_second";

        customer_nat.disabled = true;
        customer_mtoi.disabled = true;


        alias_chkbx.style.display = 'none';
        tcp_ports_chkbx.style.display = 'none';
        customer_nat_enable_chkbx.style.display = 'none';
        customer_mtoi_chbkx.style.display = 'none';
        customer_nat_chkbx.style.display = 'none';
        tcp_from_exttom_chkbx.style.display = 'none';
    } */

}
function opcua_custom_tcp_port() {

    let custom_tcp_port = dgeid('services.opcua.custom_port_enable');
    let port_number_div = dgeid("services.opcua.custom_port.div");
    let port_number = dgeid("services.opcua.custom_port");
    let opcua_enable_checkbox = dgeid("services.opcua.enabled");
    if (custom_tcp_port.checked == false && opcua_enable_checkbox.checked) {

        port_number.disabled = true;
        port_number_div.className = "grey_class_last";
        dgeid(port_number_div.id + cb_update_suffix).style.display = 'none';

    } else if (custom_tcp_port.checked && opcua_enable_checkbox.checked) {
        port_number.disabled = false;
        port_number_div.className = "update_class_last";
        dgeid(port_number_div.id + cb_update_suffix).style.display = 'flex';
    }

}

function usersAuth() {
    let usersAuth = dgeid('services.opcua.user_auth')
    let usersTable = dgeid('services.opcua.users.div');
    if (usersAuth.checked) {
        if (usersTable.classList.contains('hidden'))
            usersTable.classList.remove('hidden');
    } else if (!usersAuth.checked) {
        usersTable.classList.add('hidden');
    }

}

function opcua_enabled() {

    let opcua_enabled_checkbox = dgeid("services.opcua.enabled");
    let e = dgeid("services.opcua.enabled.div");
    if (opcua_enabled_checkbox.checked) {

        while (e = e.nextElementSibling) {
            if (e.classList.contains("hidden")) {
                e.classList.remove("hidden");
            }
        }
        opcua_custom_tcp_port();
        usersAuth();


    } else if (!opcua_enabled_checkbox.checked) {

        while (e = e.nextElementSibling) e.classList.add("hidden");
    }



}



function ntpserverswitch(cb) {
    checked = cb.checked
    var chkbx = dgeid("system.network.customer.ntp.server.div.update");
    /* dgeid("system.network.customer.ntp.server").disabled = checked */
    var server_input = dgeid("system.network.customer.ntp.server");

    if (checked) {
        dgeid("system.network.customer.ntp.server.div").className = 'grey_class_last';

        server_input.disabled = true;

        chkbx.style.display = 'none';

    } else {
        dgeid("system.network.customer.ntp.server.div").className = 'update_class_last';
        dgeid("system.network.customer.ntp.server").disabled = false;
        chkbx.style.display = 'flex';

    }

}

function enable_apply() {
    dgeid('apply').disabled = false
}

/**
 * loads conf from html with the function "htmltoconf" and then
 * and tries to send the text to external pc via MQTT message
 * 
 * laerts the user if there is going to be a network change.
 * Alert is blocking, so execution will not go on unless "ok" is not clicked
 */
function sendconf() {
    mydebug("sendconf()")


    // not ready yet for that, we should clear every field that is for pc B....
    //    if( isBready != true)
    //    {
    //        throw new Error("a4GATE external side is not ready to rece")
    //    }

    dgeid('apply').disabled = true
    setTimeout(enable_apply, 5000)

    try {


        fromA = htmltoconf()



        if (debug) {
            console.log(fromA);
        }

        // if you're here, fromA may go back to a4GATE

        // guess if user is going to lose connection to a4gate
        // and newer see the reply on 4conf
        updating_internal_network = false

        if ("system" in fromA) {
            if ("network" in fromA["system"]) {
                if ("industrial" in fromA["system"]["network"]) {
                    if ("dhcp" in fromA["system"]["network"]["industrial"]) {
                        updating_internal_network = true
                    }

                    if ("static" in fromA["system"]["network"]["industrial"]) {
                        if ("ip" in fromA["system"]["network"]["industrial"]["static"]) {
                            updating_internal_network = true
                        }
                    }
                }
            }
        }
        if (updating_internal_network == true) alert("INFO:\nNetwork configuration on internal PC will be updated.\nYou may lose access to tihs session")

        let xhr = new XMLHttpRequest();

        let endpoint = "/post"
        if (debug) endpoint += "/debug"

        xhr.open('POST', endpoint)

        xhr.onload = function () {
            rc = xhr.status

            if (rc >= 200 && rc < 300) alert("Information forwarded to a4GATE")
            else alert("Something went wrong.\nPlease contact a4GATE support")

            /*   if (debug) {
                  mydebug("rc is:" + rc)
  
                  now = new Date().toISOString().split(".")[0].replaceAll("-", "").replaceAll(":", "").replace("T", "_")
                  downloadafilewithIE(JSON.stringify(fromA, null, 3), "a4conf_" + now + ".json")
              } */
        };

        xhr.onerror = function () {
            console.log("sendconf() -> network Error")
            alert("sendconf() -> network Error");
        }

        xhr.onprogress = function (event) {
            console.log("sendconf() -> Received", event.loaded, event.total);
        }

        xhr.send(JSON.stringify(fromA))

    } catch (e) {
        console.error(); (e)
    }
}

/**
 * loads conf from html with the function "htmltoconf" and then
 * forces the browser to downlaod the file locally.
 * Again, only the configurations marked by the "Update" checkbox are exported
 */
function conftofile() {
    mydebug("conftofile()")


    try {
        fromA = htmltoconf()
        now = new Date().toISOString().split(".")[0].replaceAll("-", "").replaceAll(":", "").replace("T", "_")
        downloadafilewithIE(JSON.stringify(fromA, null, 3), "a4conf_" + now + ".json")
    } catch (e) {
        alert(e.message)
    }
}

/**
 * this function is invoked when the "Upload file" button is pressed
 * it asks the user to upload a file, then opens the file and tries to parse the configuration
 * 
 * works with json text, 
 * .tar.gz was a project but has been excluded to keep service simple
 */
function conffromfile() {
    var file = document.createElement("input");
    file.setAttribute("type", "file")
    file.setAttribute("accept", ".json,.tar.gz")
    document.body.appendChild(file);
    file.style.display = "none";

    file.onchange = function (event) {
        uploaded_file = file.files[0];

        uploaded_file_type = uploaded_file.type

        mydebug("uploaded file -> " + uploaded_file.name + "; type -> " + uploaded_file_type)

        switch (uploaded_file_type) {
            case "application/json":

                var fr = new FileReader();
                fr.onload = function (e) {
                    try {
                        console.log("trying to load configuration uploaded as file")
                        conf = JSON.parse(e.target.result)
                        conftohtml(conf, "")
                    } catch (e) {
                        console.error(e)
                    }
                };
                console.log("trying to read the file uploaded")
                fr.readAsText(uploaded_file);
                break;
            case "application/x-gzip":
                alert("tar.gz files not fully supported yet.\nIn the meanwhile you can simply upload the json inside the tar.gz file")
                break;
            default:
                alert("File format not supported!")
        }

        if (false) {
            var fr = new FileReader();
            fr.onload = function (e) {
                console.log(e.target.result)
            };
            fr.readAsText(uploaded_file);
        }
    }

    file.click()

    document.body.removeChild(file)
}

/* function loadiotgws() {
    get_xhr("loadiotgws", "/iotgwmqtt", loadiotgws_handler)
} */

function loadiotgws_opcua(direction) {

    if (direction === 'from') {
        get_xhr("loadiotgws", "/iotgwhttp", loadiotgws_handler_opcua_from)

    } else {
        get_xhr("loadiotgws", "/iotgwhttpserver", loadiotgws_handler_opcua_to)
    }
}

/* function loadiotgws_handler(text) {
    try {
        iotgwmqtt = JSON.parse(text)

        mydebug("iotgwmqtt -> " + iotgwmqtt)

        select = "services.thingworx.things.select"
        select_element = dgeid(select)
        select_element.disabled = false

        select_element.innerHTML = ""

        for (name in iotgwmqtt) {
            var opt = document.createElement('option');
            opt.value = name;
            opt.innerHTML = name;
            select_element.appendChild(opt);
        }
    } catch (e) {
        console.error(e)
    }
} */


function loadiotgws_handler_opcua_from(text) {
    try {
        iotgwhttp = JSON.parse(text)

        mydebug("iotgwhttp -> " + text)

        select_list = ["services.opcua.fromkepware.select", "services.thingworx.things.http.select"]
        select_list_len = select_list.length

        for (i = 0; i < select_list_len; i++) {
            let select_element = dgeid(select_list[i])

            if (select_element.disabled == true) {
                select_element.disabled = false;
            }
            select_element.innerHTML = ""


            for (name in iotgwhttp) {
                var opt = document.createElement('option');
                opt.value = name;
                opt.innerHTML = name;
                select_element.appendChild(opt);

            }


        }



    } catch (e) {
        console.error(e)
    }
}



function loadiotgws_handler_opcua_to(text) {
    try {
        iotgwhttp = JSON.parse(text)

        mydebug("iotgwhttp -> " + iotgwhttp)

        select = "services.opcua.tokepware.select"
        let select_element = dgeid(select)
        select_element.disabled = false

        select_element.innerHTML = ""

        for (name in iotgwhttp) {
            var opt = document.createElement('option');
            opt.value = name;
            opt.innerHTML = name;
            select_element.appendChild(opt);
        }
    } catch (e) {
        console.error(e)
    }
}

function loadDeviceVendor() {
    /* inserire il caricamento dei nomi dei vari vendor nella select
    questa funzione dovrà essere chiamata nella on_load() */

    vendor_select_id = "services.sitemanager.agents.vendor.select"
    vendor_select = dgeid(vendor_select_id)

    for (i = 0; i < agents_vendor_list.length; i++) {
        vendor = agents_vendor_list[i]
        let option = document.createElement("option")
        option.text = vendor
        option.value = vendor
        vendor_select.appendChild(option)
    }

    vendor_select.disabled = false

    //confirm_vendor_select_id = "services.sitemanager.agents.vendor.button"
    //dgeid(confirm_vendor_select_id).disabled = false

}

function loadDeviceType() {
    vendor_select_id = "services.sitemanager.agents.vendor.select"
    type_select_id = "services.sitemanager.agents.type.select"
    type_select = dgeid(type_select_id)

    /* var i, L = type_select.options.length - 1;  //pulire la dropdown list, altrimenti per visualizzare il cambio di selezione corretto
    for(i = L; i >= 0; i--) {
        type_select.remove(i);
    } */
    type_select.innerHTML = ""

    vendor_select = dgeid(vendor_select_id)
    if (vendor_select.selectedIndex != 0) {
        let vendor = vendor_select.options[vendor_select.selectedIndex].text

        type_select.disabled = false

        vendor_enable_type = agent_vendor_device_type[vendor]

        //senza questo blocco non riesco a selezionare il primo device type di ogni vendor
        let default_option = document.createElement("option")
        default_option.disabled = true
        default_option.text = 'Choose a device type'
        default_option.value = 'Choose a device type'
        type_select.appendChild(default_option)

        for (i = 0; i < vendor_enable_type.length; i++) {
            //for (device_type of vendor_enable_type){
            device_type = vendor_enable_type[i]
            let option = document.createElement("option")
            option.text = device_type
            option.value = device_type
            type_select.appendChild(option)
        }

        /* let vendor_prefix = "TYPE_"
        for(let i = 1; i <= 10; i++){
                        
            let option = document.createElement("option")
            option.text = vendor_prefix + i
            option.value = vendor_prefix + i
            type_select.appendChild(option)
        } */

        //quando si avrà la corrispondenza device type-sigla
        /* for (device_type of device_type_list){
            let option = document.createElement("option")
            option.text = device_type
            option.value = device_type
            type_select.appendChild(option)
        } */

        confirm_type_select_id = "services.sitemanager.agents.type.button"
        dgeid(confirm_type_select_id).disabled = false



        /* per la variabile vendor relativa caricare i tipi di device che possono essere selezionati(come su gate manager) */

    }

}

function addSmeAgent() {
    vendor_select_id = "services.sitemanager.agents.vendor.select"
    vendor_select_element = dgeid(vendor_select_id)
    type_select_id = "services.sitemanager.agents.type.select"
    type_select_element = dgeid(type_select_id)

    if (type_select_element.selectedIndex != 0 && vendor_select_element.selectedIndex != 0) {
        let type = type_select_element.options[type_select_element.selectedIndex].text
        let vendor = vendor_select_element.options[vendor_select_element.selectedIndex].text

        sme_table_id = "services.sitemanager.agents"
        sme_table_element = dgeid(sme_table_id)

        //get parent element
        /* parent=document.getElementById("services.sitemanager.agents");
        //get all tags inside this element
        childs=parent.getElementsByTagName("Agent"); */

        matrix = tabletoconf(dgeid("services.sitemanager.agents"))
        names = []
        agent = 'Agent'
        counter = 1
        found = false
        new_name = ""

        for (i = 0; i < matrix.length; i++) {
            names.push(matrix[i][0])
        }

        while (found == false) {
            new_name = agent + counter
            sub_found = false
            for (i = 0; i < names.length; i++) {
                if (names[i] == new_name) {
                    sub_found = true
                }
            }
            if (sub_found == true) {
                counter++
            } else {
                found = true
            }

        }

        addtotable([new_name, "", "", vendor + ":" + type, ""], sme_table_element)
    }

}

function addESSID() { //aggiungere alla tabella dove si inserisce SSID e Password l'SSID selezionato

    essid_table_id = "system.network.customer.connection.wireless.networks"
    essid_table_element = dgeid(essid_table_id)
    essid_select_id = "system.network.customer.connection.wireless.networks.essid.select"
    essid_select_element = dgeid(essid_select_id)

    emptytable(essid_table_id) //utilizzata per ovviare al problema dell'inserimento di più reti wifi. ogni volta che si aggiunge una riga, a meno che la rete wifi scelta non sia già nella tabella

    if (essid_select_element.selectedIndex != 0) {
        let essid = essid_select_element.options[essid_select_element.selectedIndex].text
        addtotable([essid, ""], essid_table_element)
    }

    // questa sezione era presente prima della decisione di permettere di inserire soltanto una rete wifi nella tabella
    /* //creare la lista per verificare se l'SSID selezionato non è già nella tabella
    table_conf = tabletoconf(essid_table_element)
    table_conf_ssid = []    //lista dove sono inseriti gli ssid già presenti nella tabella
    for(i = 0; i <= table_conf.length; i++){
        const [ssid, ...rest] = (table_conf[i] + "").split(',')
        if (ssid != "undefined") table_conf_ssid.push(ssid)
    }
 
    if (essid_select_element.selectedIndex != 0 ) {
        let essid = essid_select_element.options[essid_select_element.selectedIndex].text
 
        if (table_conf_ssid.includes(essid)){   //verificare se l'SSID selezionato non è già nella tabella utilizzando la lista precedentemente creata
            alert("SSID '" + essid + "' is already in the wireless table")
        }else{
            //if (table_conf.length > 0){
            //    emptytable(essid_table_id)
            //}
            addtotable([essid, ""], essid_table_element)
        }
    } */

}

function addLine_ESSID_Table(th) {
    //utilizzata per ovviare al problema dell'inserimento di più reti wifi. ogni volta che si aggiunge una riga, viene pulita la tabella
    essid_table_id = "system.network.customer.connection.wireless.networks"
    essid_table_element = dgeid(essid_table_id)
    //table_conf = tabletoconf(essid_table_element)

    //if (table_conf.length > 0) emptytable(essid_table_id)
    emptytable(essid_table_id)

    addEmptyToTable(th)
}

function enableESSID_button() {
    //abilitare il pulsante per confermare dopo che si è selezionato un SSID dalla select
    essid_confirm_button_id = "system.network.customer.connection.wireless.networks.essid.button"
    essid_confirm_button_element = dgeid(essid_confirm_button_id)
    essid_confirm_button_element.disabled = false
}

function saveKepwareProject() {
    button_id = "services.kepware.div.backup"
    dgeid(button_id).disabled = true
    setTimeout(enable_button, 5000, [button_id])
    get_xhr("saveKepwareProject()", "/kepware/backup", saveKepwareProject_handler)
}

function saveKepwareProject_handler(fileContent) {

    if (fileContent.trim() != "") {
        now = new Date().toISOString().split(".")[0].replaceAll("-", "").replaceAll(":", "").replace("T", "_")
        file_name = "Kepware_" + now + ".json"
        downloadafilewithIE(fileContent, file_name)
        alert("Backup saved with name " + file_name)
    } else {
        alert("Backup exception is detected. Retry")
    }

}





function addiotgw() {
    iot_gw_select = "services.thingworx.things.select"
    select_element = dgeid(iot_gw_select)

    things_table_id = "services.thingworx.things"
    things_table_element = dgeid(things_table_id)

    iot_gw_selected = select_element.value

    // mqtt topic or http endpoint
    kepware_destination = ""

    if (iot_gw_selected in iotgwmqtt) kepware_destination = iotgwmqtt[iot_gw_selected]

    addtotable([iot_gw_selected, kepware_destination], things_table_element)
}

function addiotgw_opcua(direction) {

    if (direction == 'from') {

        iot_gw_select = "services.opcua.fromkepware.select"

        things_table_id = "services.opcua.things.fromkepware"

    } else if (direction == 'to') {

        iot_gw_select = "services.opcua.tokepware.select"

        things_table_id = "services.opcua.things.tokepware"

    } else {

        iot_gw_select = "services.thingworx.things.http.select"

        things_table_id = "services.thingworx.things.http"

    }



    select_element = dgeid(iot_gw_select)

    things_table_element = dgeid(things_table_id)

    iot_gw_selected = select_element.value



    addtotable([iot_gw_selected], things_table_element)

}

function createiotgw(type) {

    if (typeof type == 'undefined') {
        type = 'twa'
    }

    createiotgw_twa_id = "services.kepware.createiotgw.button"
    createiotgw_opcua_id = "services.kepware.createiotgw_opcua.button"
    dgeid(createiotgw_twa_id).disabled = true
    dgeid(createiotgw_opcua_id).disabled = true
    setTimeout(enable_button, 5000, [createiotgw_twa_id])
    setTimeout(enable_button, 5000, [createiotgw_opcua_id])

    select = "services.kepware.createiotgw"
    select_element = dgeid(select)
    selected = select_element.value

    // alert(selected)

    selected_obj = JSON.parse(selected)

    //get_xhr("createiotgwfromchannel", "/channeltoiotgw?channel=" + selected, createiotgwfromchannel_hanlder)

    if ("channel" in selected_obj) {
        channel = selected_obj["channel"]
        path = "channel=" + channel

        if ("device" in selected_obj) {
            device = selected_obj["device"]
            path = path + "&device=" + device
        }

        path += "&type=" + type
        get_xhr("createiotgw", "/createiotgw?" + path, createiotgw_hanlder, createiotgw_hanlder_error)
    }
}

function createiotgw_hanlder(text) {
    try {
        result = JSON.parse(text)

        mydebug("createiotgwfromchannel_hanlder, result -> " + result)

        if ("time" in result && "iotgw" in result) {
            if (result["time"] >= 0) {
                alert("INFO:\nCreation of IoT Gateway " + result["iotgw"] + " took " + result["time"] + " seconds")
            } else alert("Channel not found")
        }
    } catch (e) {
        console.error(e)
    }
}

function createiotgw_hanlder_error() {
    alert("Error occurred while trying to create an IoT Gateway")
}

function loaddevices() {
    get_xhr("loaddevices", "/kepwaredevices", loaddevices_handler)
}

function loaddevices_handler(text) {
    try {
        channels = JSON.parse(text)

        mydebug("channels -> " + channels)

        select = "services.kepware.createiotgw"
        select_element = dgeid(select)
        select_element.disabled = false

        select_element.innerHTML = ""

        for (channel_name in channels) {
            var opt = document.createElement('option');
            opt.value = JSON.stringify({
                "channel": channel_name
            })
            opt.innerHTML = channel_name
            select_element.appendChild(opt)

            channel = channels[channel_name]

            for (device_index in channel) {
                device = channel[device_index]
                var opt = document.createElement('option');
                opt.value = JSON.stringify({
                    "channel": channel_name,
                    "device": device
                })
                opt.innerHTML = channel_name + " -> " + device
                select_element.appendChild(opt)
            }
        }

    } catch (e) {
        console.error(e)
    }
}

function opcua_custom_port() {
    opcua_checked = document.getElementById("services.opcua.custom_port_enable").checked
    if (opcua_checked == true) {
        document.getElementById("services.opcua.custom_port").disabled = false
    } else {
        document.getElementById("services.opcua.custom_port").disabled = true
    }
}











/*Below I have some functions who manage the appearing and disappearing logic of my html page's part in the most simple way. By clicking a button on my main menu I set style.display = 'none/block'.*/

function showHome() {
    document.getElementById("HomeSection").style.display = "block";
    document.getElementById("PCASection").style.display = "none";
    document.getElementById("PCBSection").style.display = "none";
    document.getElementById("FastDataSection").style.display = "none";
    document.getElementById("PasswGateSection").style.display = "none";
    document.getElementById("BackChannelSection").style.display = "none";
    document.getElementById("Logs").style.display = "none";

    document.getElementById("Home_li").setAttribute('class', 'nav__item__active');
    document.getElementById("PCA_li").setAttribute('class', 'nav__item');
    document.getElementById("PCB_li").setAttribute('class', 'nav__item');
    document.getElementById("FastData_li").setAttribute('class', 'nav__item');
    document.getElementById("BackChannel_li").setAttribute('class', 'nav__item');
    document.getElementById("Logs_li").setAttribute('class', 'nav__item');
    document.getElementById("Manual_li").setAttribute('class', 'nav__item');



}

function showPCA() {

    document.getElementById("HomeSection").style.display = "none";
    document.getElementById("PCASection").style.display = "block";
    document.getElementById("PCBSection").style.display = "none";
    document.getElementById("FastDataSection").style.display = "none";
    document.getElementById("BackChannelSection").style.display = "none";
    document.getElementById("PasswGateSection").style.display = "none";
    document.getElementById("Logs").style.display = "none";

    document.getElementById("Home_li").setAttribute('class', 'nav__item');
    document.getElementById("PCA_li").setAttribute('class', 'nav__item__active');
    document.getElementById("PCB_li").setAttribute('class', 'nav__item');
    document.getElementById("FastData_li").setAttribute('class', 'nav__item');
    document.getElementById("BackChannel_li").setAttribute('class', 'nav__item');
    document.getElementById("Logs_li").setAttribute('class', 'nav__item');
    document.getElementById("Manual_li").setAttribute('class', 'nav__item');

}

function showPCB() {
    document.getElementById("HomeSection").style.display = "none";
    document.getElementById("PCASection").style.display = "none";
    document.getElementById("PCBSection").style.display = "block";
    document.getElementById("FastDataSection").style.display = "none";

    document.getElementById("BackChannelSection").style.display = "none";
    document.getElementById("PasswGateSection").style.display = "none";
    document.getElementById("Logs").style.display = "none";

    document.getElementById("Home_li").setAttribute('class', 'nav__item');
    document.getElementById("PCA_li").setAttribute('class', 'nav__item');
    document.getElementById("PCB_li").setAttribute('class', 'nav__item__active');
    document.getElementById("FastData_li").setAttribute('class', 'nav__item');
    document.getElementById("BackChannel_li").setAttribute('class', 'nav__item');
    document.getElementById("Logs_li").setAttribute('class', 'nav__item');
    document.getElementById("Manual_li").setAttribute('class', 'nav__item');


}

function showNetWorkPCA() {
    showPCA();
    document.getElementById("NetWorkPCABtn").className = "active";
    document.getElementById("KepwarePCABtn").className = "";
    document.getElementById("InfoPCABtn").className = "";
    document.getElementById("MorePCABtn").className = "";

    document.getElementById("NetWorkPCA").style.display = "block";
    document.getElementById("KepwarePCA").style.display = "none";
    document.getElementById("InfoPCA").style.display = "none";
    document.getElementById("MorePCA").style.display = "none";
}

function showKepWarePCA() {
    showPCA();

    document.getElementById("NetWorkPCABtn").className = "";
    document.getElementById("KepwarePCABtn").className = "active";
    document.getElementById("InfoPCABtn").className = "";
    document.getElementById("MorePCABtn").className = "";

    document.getElementById("NetWorkPCA").style.display = "none";
    document.getElementById("KepwarePCA").style.display = "block";
    document.getElementById("InfoPCA").style.display = "none";
    document.getElementById("MorePCA").style.display = "none";

}

function showMorePCA() {
    showPCA();

    document.getElementById("NetWorkPCABtn").className = "";
    document.getElementById("KepwarePCABtn").className = "";
    document.getElementById("InfoPCABtn").className = "";
    document.getElementById("MorePCABtn").className = "active";

    document.getElementById("NetWorkPCA").style.display = "none";
    document.getElementById("KepwarePCA").style.display = "none";
    document.getElementById("InfoPCA").style.display = "none";
    document.getElementById("MorePCA").style.display = "block";


}

function showInfoPCA() {
    showPCA();
    document.getElementById("NetWorkPCABtn").className = "";
    document.getElementById("KepwarePCABtn").className = "";
    document.getElementById("InfoPCABtn").className = "active";
    document.getElementById("MorePCABtn").className = "";

    document.getElementById("NetWorkPCA").style.display = "none";
    document.getElementById("KepwarePCA").style.display = "none";
    document.getElementById("InfoPCA").style.display = "block";
    document.getElementById("MorePCA").style.display = "none";


}

function showNetWorkPCB() {
    showPCB();
    document.getElementById("NewWorkPCBBtn").className = "active";
    document.getElementById("SiteManagerPCBBtn").className = "";
    document.getElementById("ThingWorxPCBBtn").className = "";
    document.getElementById("FireWallPCBBtn").className = "";
    document.getElementById("OPCUAPCBBtn").className = "";
    document.getElementById("InfoPCBBtn").className = "";
    document.getElementById("MorePCBBtn").className = "";

    document.getElementById("NetWorkPCB").style.display = "block";
    document.getElementById("SiteManagerPCB").style.display = "none";
    document.getElementById("ThingWorxPCB").style.display = "none";
    document.getElementById("FireWallPCB").style.display = "none";
    document.getElementById("OPCUAPCB").style.display = "none";
    document.getElementById("InfoPCB").style.display = "none";
    document.getElementById("MorePCB").style.display = "none";
}

function showSiteManagerPCB() {
    showPCB();
    document.getElementById("NewWorkPCBBtn").className = "";
    document.getElementById("SiteManagerPCBBtn").className = "active";
    document.getElementById("ThingWorxPCBBtn").className = "";
    document.getElementById("FireWallPCBBtn").className = "";
    document.getElementById("OPCUAPCBBtn").className = "";
    document.getElementById("InfoPCBBtn").className = "";
    document.getElementById("MorePCBBtn").className = "";

    document.getElementById("NetWorkPCB").style.display = "none";
    document.getElementById("SiteManagerPCB").style.display = "block";
    document.getElementById("ThingWorxPCB").style.display = "none";
    document.getElementById("FireWallPCB").style.display = "none";
    document.getElementById("OPCUAPCB").style.display = "none";
    document.getElementById("InfoPCB").style.display = "none";
    document.getElementById("MorePCB").style.display = "none";

}

function showThingWorxPCB() {
    showPCB();
    document.getElementById("NewWorkPCBBtn").className = "";
    document.getElementById("SiteManagerPCBBtn").className = "";
    document.getElementById("ThingWorxPCBBtn").className = "active";
    document.getElementById("FireWallPCBBtn").className = "";
    document.getElementById("OPCUAPCBBtn").className = "";
    document.getElementById("InfoPCBBtn").className = "";
    document.getElementById("MorePCBBtn").className = "";

    document.getElementById("NetWorkPCB").style.display = "none";
    document.getElementById("SiteManagerPCB").style.display = "none";
    document.getElementById("ThingWorxPCB").style.display = "block";
    document.getElementById("FireWallPCB").style.display = "none";
    document.getElementById("OPCUAPCB").style.display = "none";
    document.getElementById("InfoPCB").style.display = "none";
    document.getElementById("MorePCB").style.display = "none";

}

function showFireWallPCB() {
    showPCB();
    document.getElementById("NewWorkPCBBtn").className = "";
    document.getElementById("SiteManagerPCBBtn").className = "";
    document.getElementById("ThingWorxPCBBtn").className = "";
    document.getElementById("FireWallPCBBtn").className = "active";
    document.getElementById("OPCUAPCBBtn").className = "";
    document.getElementById("InfoPCBBtn").className = "";
    document.getElementById("MorePCBBtn").className = "";

    document.getElementById("NetWorkPCB").style.display = "none";
    document.getElementById("SiteManagerPCB").style.display = "none";
    document.getElementById("ThingWorxPCB").style.display = "none";
    document.getElementById("FireWallPCB").style.display = "block";
    document.getElementById("OPCUAPCB").style.display = "none";
    document.getElementById("InfoPCB").style.display = "none";
    document.getElementById("MorePCB").style.display = "none";

}

function showOPCUAPCB() {
    showPCB();
    document.getElementById("NewWorkPCBBtn").className = "";
    document.getElementById("SiteManagerPCBBtn").className = "";
    document.getElementById("ThingWorxPCBBtn").className = "";
    document.getElementById("FireWallPCBBtn").className = "";
    document.getElementById("OPCUAPCBBtn").className = "active";
    document.getElementById("InfoPCBBtn").className = "";
    document.getElementById("MorePCBBtn").className = "";

    document.getElementById("NetWorkPCB").style.display = "none";
    document.getElementById("SiteManagerPCB").style.display = "none";
    document.getElementById("ThingWorxPCB").style.display = "none";
    document.getElementById("FireWallPCB").style.display = "none";
    document.getElementById("OPCUAPCB").style.display = "block";
    document.getElementById("InfoPCB").style.display = "none";
    document.getElementById("MorePCB").style.display = "none";

}

function showInfoPCB() {
    showPCB();
    document.getElementById("NewWorkPCBBtn").className = "";
    document.getElementById("SiteManagerPCBBtn").className = "";
    document.getElementById("ThingWorxPCBBtn").className = "";
    document.getElementById("FireWallPCBBtn").className = "";
    document.getElementById("OPCUAPCBBtn").className = "";
    document.getElementById("InfoPCBBtn").className = "active";
    document.getElementById("MorePCBBtn").className = "";

    document.getElementById("NetWorkPCB").style.display = "none";
    document.getElementById("SiteManagerPCB").style.display = "none";
    document.getElementById("ThingWorxPCB").style.display = "none";
    document.getElementById("FireWallPCB").style.display = "none";
    document.getElementById("OPCUAPCB").style.display = "none";
    document.getElementById("InfoPCB").style.display = "block";
    document.getElementById("MorePCB").style.display = "none";
}

function showMorePCB() {
    showPCB();
    document.getElementById("NewWorkPCBBtn").className = "";
    document.getElementById("SiteManagerPCBBtn").className = "";
    document.getElementById("ThingWorxPCBBtn").className = "";
    document.getElementById("FireWallPCBBtn").className = "";
    document.getElementById("OPCUAPCBBtn").className = "";
    document.getElementById("InfoPCBBtn").className = "";
    document.getElementById("MorePCBBtn").className = "active";

    document.getElementById("NetWorkPCB").style.display = "none";
    document.getElementById("SiteManagerPCB").style.display = "none";
    document.getElementById("ThingWorxPCB").style.display = "none";
    document.getElementById("FireWallPCB").style.display = "none";
    document.getElementById("OPCUAPCB").style.display = "none";
    document.getElementById("InfoPCB").style.display = "none";
    document.getElementById("MorePCB").style.display = "block";

}

function showFastData() {
    document.getElementById("HomeSection").style.display = "none";
    document.getElementById("PCASection").style.display = "none";
    document.getElementById("PCBSection").style.display = "none";
    document.getElementById("FastDataSection").style.display = "block";
    document.getElementById("BackChannelSection").style.display = "none";
    document.getElementById("PasswGateSection").style.display = "none";
    document.getElementById("Logs").style.display = "none";


    document.getElementById("Home_li").setAttribute('class', 'nav__item');
    document.getElementById("PCA_li").setAttribute('class', 'nav__item');
    document.getElementById("PCB_li").setAttribute('class', 'nav__item');
    document.getElementById("FastData_li").setAttribute('class', 'nav__item__active');
    document.getElementById("BackChannel_li").setAttribute('class', 'nav__item');
    document.getElementById("Logs_li").setAttribute('class', 'nav__item');
    document.getElementById("Manual_li").setAttribute('class', 'nav__item');

}

function showFTPServerFastData() {
    showFastData();
    document.getElementById("FTPServer").style.display = "block";
    document.getElementById("Fast_Data_Users").style.display = "none";

    document.getElementById("FTPServer_li").className = "active";
    document.getElementById("Users_li").className = "";

}

function showUsersFastData() {
    showFastData();
    document.getElementById("FTPServer").style.display = "none";
    document.getElementById("Fast_Data_Users").style.display = "block";

    document.getElementById("FTPServer_li").className = "";
    document.getElementById("Users_li").className = "active";
}

function showPasswGate() {
    document.getElementById("HomeSection").style.display = "none";
    document.getElementById("PCASection").style.display = "none";
    document.getElementById("PCBSection").style.display = "none";
    document.getElementById("FastDataSection").style.display = "none";
    document.getElementById("PasswGateSection").style.display = "block";
    document.getElementById("BackChannelSection").style.display = "none";
    document.getElementById("Logs").style.display = "none";

    document.getElementById("Home_li").setAttribute('class', 'nav__item');
    document.getElementById("PCA_li").setAttribute('class', 'nav__item');
    document.getElementById("PCB_li").setAttribute('class', 'nav__item');
    document.getElementById("FastData_li").setAttribute('class', 'nav__item');
    document.getElementById("BackChannel_li").setAttribute('class', 'nav__item__active');
    document.getElementById("Logs_li").setAttribute('class', 'nav__item');
    document.getElementById("Manual_li").setAttribute('class', 'nav__item');



}

function showLogs() {
    document.getElementById("HomeSection").style.display = "none";
    document.getElementById("PCASection").style.display = "none";
    document.getElementById("PCBSection").style.display = "none";
    document.getElementById("FastDataSection").style.display = "none";
    document.getElementById("BackChannelSection").style.display = "none";
    document.getElementById("PasswGateSection").style.display = "none";
    document.getElementById("Logs").style.display = "block";

    document.getElementById("Home_li").setAttribute('class', 'nav__item');
    document.getElementById("PCA_li").setAttribute('class', 'nav__item');
    document.getElementById("PCB_li").setAttribute('class', 'nav__item');
    document.getElementById("FastData_li").setAttribute('class', 'nav__item');
    document.getElementById("BackChannel_li").setAttribute('class', 'nav__item');
    document.getElementById("Logs_li").setAttribute('class', 'nav__item__active');
    document.getElementById("Manual_li").setAttribute('class', 'nav__item');

}

function verifyPassword() {
    var pw = document.getElementById("pswd").value;
    //check empty password field  
    if (pw == "") {
        document.getElementById("message").innerHTML = "**Fill the password please!";

        return false;
    }
    if (pw == "nirmal purja") {

        alert("Password is correct");
        document.getElementById("HomeSection").style.display = "none";
        document.getElementById("PCASection").style.display = "none";
        document.getElementById("PCBSection").style.display = "none";
        document.getElementById("FastDataSection").style.display = "none";
        document.getElementById("PasswGateSection").style.display = "none";
        document.getElementById("BackChannelSection").style.display = "block";
        document.getElementById("Logs").style.display = "none";
        /*     document.getElementById("ConsoleDiv").style.display = "block"; */
        document.getElementById("pswd").innerHTML.text = "";



        return false;



    } else {
        document.getElementById("message").innerHTML = "**Password is wrong";
        return false;
    }

}

function openManual() {
    const strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    window.open("./libs/a4GATE-User-Guide-v.1.5_ENG.html", "Manual", strWindowFeatures)
}


/* function futureDevelopment() {
    alert("Be Patient! We are working for new features and solutions.")
} */

function get_bidir_info() {
    get_xhr("get_bidir_info()", "/a4gate/bidir", get_bidir_info_handler)

}


function get_bidir_info_handler(res) {
    var ind_comma = res.toString().indexOf(',');
    var time = res.toString().substring(17, ind_comma);
    var bidir_enabled = res.toString().search('true');



    if (bidir_enabled == -1) {
        document.getElementById("bidir_info").style.color = 'red';
        document.getElementById("bidir_info").innerHTML = "CLOSED";
        /* document.getElementById("bidir_icon").style.color = 'red'; */
    } else {
        var bidir_info = document.getElementById("bidir_info")
        bidir_info.innerHTML = time + ' minutes';
        bidir_info.style.fontWeight = '600';
        /*  document.getElementById("bidir_icon").style.color = 'green' */
        var bidir_text = document.getElementById("bidir_text");
        bidir_text.innerHTML = "Bidirectionality remaining time:";
        bidir_text.style.color = 'green';

    }


    /* document.getElementById("bidir_info").innerHTML = time */

}

function ftp_server_custom_port() {
    opcua_checked = dgeid("services.ftp.custom_port_enable").checked;
    custom_port_div = dgeid("services.ftp.custom_port.div");
    custom_tcp_port_ckhbx = dgeid(custom_port_div.id + cb_update_suffix);

    if (opcua_checked == true) {
        dgeid("services.ftp.custom_port").disabled = false;
        dgeid("services.ftp.custom_port.div").className = 'update_class_last';
        custom_tcp_port_ckhbx.style.display = 'flex';
    } else {
        dgeid("services.ftp.custom_port").disabled = true;
        dgeid("services.ftp.custom_port.div").className = 'grey_class_last';
        custom_tcp_port_ckhbx.style.display = 'none';
    }
}
/*??*/

function getValueFromRadioButton(name) {
    //Get all elements with the name
    var buttons = document.getElementsByName(name);
    for (var i = 0; i < buttons.length; i++) {
        //Check if button is checked
        var button = buttons[i];
        if (button.checked) {
            //Return value
            return button.id;
        }
    }
    //No radio button is selected. 
    return null;
}
/*??*/

function ftp_anonymus_cfg() {
    //alert(getValueFromRadioButton("cloud_provider"))
    var chkbx = document.getElementById("services.ftp.users.anonymus.folder.div" + cb_update_suffix)
    anonymus_login_checked = dgeid("services.ftp.users.anonymus").checked
    if (anonymus_login_checked) {
        dgeid("services.ftp.users.anonymus.folder").disabled = false
        dgeid("services.ftp.users.anonymus.folder.div").className = 'update_class_last';
        chkbx.style.display = 'flex'
    }
    else {
        dgeid("services.ftp.users.anonymus.folder").disabled = true;
        dgeid("services.ftp.users.anonymus.folder.div").className = 'grey_class_last';
        chkbx.style.display = 'none'
    }

}
function show_access_signature() {
    dgeid("services.ftp.microsoft.sas").setAttribute("type", "text");
}
function hide_access_signature() {
    dgeid("services.ftp.microsoft.sas").setAttribute("type", "password");
}

function ptc_enabled() {
    const checked = document.getElementById("services.ftp.cloud.ptc").checked
    IotEdge_ftp_div = dgeid("services.ftp.iotedge.info.div");
    PTC_ftp_div = dgeid("services.ftp.ptc.info.div");


    dgeid("services.ftp.microsoft.sas.div").style.display = checked ? "none" : "block"
    dgeid("services.ftp.microsoft.lsa.div").style.display = checked ? "none" : "block"
    dgeid("services.ftp.microsoft.blob_container.div").style.display = checked ? "none" : "block"
    /* dgeid("services.ftp.iotedge.info.div").style.display = checked ? "none" : "" */
    //dgeid("services.ftp.B.enabled.div").style.display = !checked ? "none" : ""
    /* dgeid("services.ftp.ptc.info.div").style.display = !checked ? "none" : "" */

    if (getValueFromRadioButton("cloud_provider") == services_ftp_cloud_prefix + "ptc") {
        IotEdge_ftp_div.style.display = "none";
        PTC_ftp_div.style.display = "block";


    } else if (getValueFromRadioButton("cloud_provider") == services_ftp_cloud_prefix + "microsoft") {
        IotEdge_ftp_div.style.display = "block";
        PTC_ftp_div.style.display = "none";

    }


}

function get_a4monitor_log() {
    get_xhr("get_a4monitor_log()", "/monitor/logs/isWorking", get_a4monitor_log_handler)
    get_xhr("get_a4monitor_log()", "/monitor/logs/table", get_a4monitor_log_handler_table)
}

function get_a4monitor_log_handler(res) {

    var answ = res.replaceAll("{", "").replaceAll("}", "").replaceAll('"', '')
    var a4mon_logs = dgeid("logsDiv");
    let my_date_time = new Date().toUTCString()
    let indexOfCutting = my_date_time.indexOf('GMT')
    let timeStamp = my_date_time.substring(0, indexOfCutting)

    if (a4monitor_isWorking && readyToGo == true) {
        a4mon_logs.insertAdjacentHTML("beforeend", "<p class='con con-log'><span style='color:lightgray;'>> </span>" + answ + " ; " + timeStamp + "</p>");

    } else if (a4monitor_isWorking == false && readyToGo == true) {
        a4mon_logs.insertAdjacentHTML("beforeend", "<p class='con con-log'><span style='color:lightgray;'>> </span>" + 'Error: A4MONITOR is not working...' + "</p>");
    }
    var mosquitto = dgeid('mosquitto');
    var home_table_bc = dgeid("home_table_bc");
    var http_xfer = dgeid("http_xfer");
    var cfgmng = dgeid("cfgmng");
    if (a4monitor_isWorking) {
        if (answ.indexOf('mosquitto: true') != -1) {

            mosquitto.innerHTML = '&#11044;';
            mosquitto.style.color = "green";
        } else {
            mosquitto.innerHTML = 'Error';
            mosquitto.style.color = "red";
        }
        if (answ.indexOf('tf_bchnld: true') != -1) {

            home_table_bc.innerHTML = '&#11044;';
            home_table_bc.style.color = "green";
        } else {
            home_table_bc.innerHTML = 'Error';
            home_table_bc.style.color = "red";
        }
        if (answ.indexOf('tf_http_xfer: true') != -1) {

            http_xfer.innerHTML = '&#11044;';
            http_xfer.style.color = "green";
        } else {
            http_xfer.innerHTML = 'Error';
            http_xfer.style.color = "red";
        }
        if (answ.indexOf('tf_cfgmng: true') != -1) {

            cfgmng.innerHTML = '&#11044;';
            cfgmng.style.color = "green";
        } else {
            cfgmng.innerHTML = 'Error';
            cfgmng.style.color = "red";
        }
    } else {
        mosquitto.innerHTML = '???';
        home_table_bc.innerHTML = '???';
        http_xfer.innerHTML = '???';
        cfgmng.innerHTML = '???';
    }

}

function get_a4monitor_log_handler_table(res) {

    var answ = res.replaceAll("{", "").replaceAll("}", "").replaceAll('"', '').replace("mosquitto:", "mosquitto: <br/>").replace("tf_bchnld:", "<br/> <br/> tf_bchnld: <br/>").replace("tf_http_xfer:", "<br/> <br/> tf_http_xfer: <br/>").replace("tf_cfgmng:", "<br/> <br/> tf_cfgmng: <br/>")
    var a4mon_logs = dgeid("logsDiv");
    if (a4monitor_isWorking == true && readyToGo == true && res.trim() != "") {
        a4mon_logs.insertAdjacentHTML("beforeend", "<p class='con con-log'><span style='color:lightgray;'>> </span>" + answ + "</p>");
    }
}



function uploadKepwareProject() {

    uploadKepware_button_id = "services.kepware.div.upload"

    var file = document.createElement("input");
    file.setAttribute("type", "file")
    file.setAttribute("accept", ".json")
    document.body.appendChild(file);
    file.style.display = "none";

    file.onchange = function (event) {
        uploaded_file = file.files[0];

        uploaded_file_type = uploaded_file.type

        mydebug("uploaded file -> " + uploaded_file.name + "; type -> " + uploaded_file_type)

        dgeid(uploadKepware_button_id).disabled = true
        setTimeout(enable_button, 20000, [uploadKepware_button_id])

        switch (uploaded_file_type) {
            case "application/json":

                var fr = new FileReader();
                fr.onload = function (e) {
                    try {
                        console.log("trying to load configuration uploaded as file")
                        //conf = JSON.parse(e.target.result)

                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", '/kepware/upload', true);

                        //Send the proper header information along with the request
                        //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                        xhr.onreadystatechange = function () { // Call a function when the state changes.
                            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                                file_uploaded = xhr.response
                                if (file_uploaded == "True") {
                                    alert('Kepware project uploaded')
                                } else {
                                    alert('Kepware project NOT uploaded')
                                }
                            }
                        }
                        xhr.send(body = e.target.result);

                    } catch (e) {
                        console.error('Kepware project NOT uploaded => ' + String(e))
                    }
                };
                console.log("trying to read the file uploaded")
                fr.readAsText(uploaded_file);
                break;
            default:
                alert("File format not supported!")
        }

        if (false) {
            var fr = new FileReader();
            fr.onload = function (e) {
                //console.log ( e.target.result )
            };
            fr.readAsText(uploaded_file);
        }
    }

    file.click()

    document.body.removeChild(file)

}

/*Enable  button*/
function enable_button(id) {
    dgeid(id).disabled = false
}


function refreshLogs() {
    document.getElementById('logsDiv').innerHTML = "";
}




function reloadA4monitor() {
    get_xhr('reloadA4monitor()', "/monitor/logs/reload", a4monitor_reload_handler)
}

function a4monitor_reload_handler(res) {
    alert(res);

}

function a4monitorStatus() {
    get_xhr('a4monitorStatus()', "/monitor/logs/status", a4monitor_status_handler)
}

function a4monitor_status_handler(res) {

    var a4monitor_status = dgeid('a4monitor_status');


    if (res.indexOf('OK') != -1) {
        a4monitor_status.innerHTML = '&#11044;';
        a4monitor_status.style.color = 'green';
        a4monitor_isWorking = true;


    } else if (res.indexOf('Not monitored') != -1) {
        a4monitor_status.innerHTML = '&#11044;';
        a4monitor_status.style.color = 'red';
        a4monitor_isWorking = false;

    }


}

function reload_kepware() {
    alert('RESTART KEPSERVER RUNTIME: please wait until the operation gets completely done')
    let reload_switch = dgeid("services.kepware.reload");
    reload_switch.disabled = true;
    get_xhr("reload_kepware()", "/reload_kepware_now", reload_kepware_handler)
}
function enable_kepware_switch() {
    let reload_switch = dgeid("services.kepware.reload");
    reload_switch.disabled = false;
    reload_switch.checked = false;
}
function reload_kepware_handler(res) {
    alert(res);
    setTimeout(enable_kepware_switch, 5000);
}


/*Gear interaction to show Manage Area*/

/* function manageGears(my_div_id) {
    manage_div = dgeid(my_div_id.parentNode.parentNode.parentNode.id + manage_suffix);
    my_gear = dgeid(my_div_id.parentNode.parentNode.id);
    if (my_gear.className == 'h-divider') {
        my_gear.className = 'h-divider-active';
        manage_div.className = 'showed-manage';

    } else if (my_gear.className == 'h-divider-active') {
        my_gear.className = 'h-divider';
        manage_div.className = 'hidden';

    }

} */

/*Event listeners for PCB services commands*/

/* function prova(){
    alert(JSON.stringify(sitemanager_commands))
} */
/* sitemanager_commands.forEach(function(e) {
    e.addEventListener("click", function() {
        alert(e.value);
    });
}); */




/* sitemanager_commands.forEach(function(e) {
    e.addEventListener("change", function() {
        alert(e.value);
    });
}); */
