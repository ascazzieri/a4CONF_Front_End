#!/usr/bin/python3 -u

import os
import pathlib

script_directory = os.path.dirname( os.path.realpath(__file__) )
os.chdir(script_directory)

init_script = os.path.join(script_directory, "init.sh")
# immedtatly run init script
os.system( init_script + " &" )
# run init script after 3 minutes
os.system( "( sleep 180; " + init_script + " ) &" )
# run init script after other 5 minutes
os.system( "( sleep 480; " + init_script + " ) &" )

from http.server import BaseHTTPRequestHandler
import threading
import json
import time
import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from pytz import utc
import sys
import helper_pca as pca
import helper_ftp as ftp
import helper_http_server as http_help
from helper_mqtt import helper_mqtt
import helper_kepware as kepware

if "mytime" not in globals(): import mytime
if "mycolors" not in globals(): import mycolors
if "common" not in globals(): import common

http_server_port = 80
http_server_ip = "0.0.0.0"
http_services = [   "/version", "/confA", "/confB" , "/iotgwmqtt" ,
                    "/iotgwhttp", "/createiotgw" , "/kepwaredevices",
                    "/kepware/backup", "/ready", "/iotgwhttpserver",
                    "/a4gate/bidir" , "/kepware/upload", "/monitor/logs/isWorking", "/monitor/logs/table", "/monitor/logs/reload", "/monitor/logs/status", "/ftp/conf", "/reload_kepware_now"]

seconds_between_backup = 86400

mqtt_client = None
mqtt_broker_ip = "127.0.0.1"
mqtt_broker_port = 7883
mqtt_topic_hwsw_local = 'monitor/hwsw/json'
mqtt_topic_hwsw = 'rep/monitor/hwsw/'
mqtt_topic_updater_A = f"{mqtt_topic_hwsw}a4GATE.A.a4updater"
mqtt_topic_confbackup = f"{mqtt_topic_hwsw}a4GATE.A.conf"
mqtt_topic_confget = "rep/conf/get"
mqtt_topic_confset = "rep/conf/set"
mqtt_topic_confset_fromB = "conf/set"
mqtt_topic_keepalive_fromB = "conf/keepalive"
mqtt_topic_monitor_logs = "monitor/logs"
mqtt_topic_monitor_isWorking = mqtt_topic_monitor_logs + '/isWorking'
mqtt_topic_monitor_table = mqtt_topic_monitor_logs + '/table'
mqtt_topic_monitor_reload = mqtt_topic_monitor_logs + '/reload'
mqtt_topic_monitor_status = mqtt_topic_monitor_logs + '/status'



mqtt_topic_keepalive_request = "rep/" + mqtt_topic_keepalive_fromB
mqtt_topics_subscribe = [ mqtt_topic_confset_fromB , mqtt_topic_keepalive_fromB, mqtt_topic_hwsw_local, mqtt_topic_monitor_isWorking, mqtt_topic_monitor_table, mqtt_topic_monitor_reload, mqtt_topic_monitor_status]
mqtt_topic_tw_template = ["rep/conf/file/", "/tw_template/"]
mqtt_topic_opc_template = ["rep/conf/file/", "/opcua_from_template/"]
mqtt_topic_opcto_template = ["rep/conf/file/", "/opcua_to_template/"]

bidir_rt = 0
bidir_enabled = False

monitor_logs_table = str()
monitor_logs_isWorking = ''
monitor_logs_status = ''
monitor_logs_reload = ''




mqtt_qos = 2
last_keepalive = 0

mqtt_broker_connection_timeout = 1
mqtt_broker_keepalive = 60
mqtt_seconds_before_retry_conn = 2
mqtt_client_reconnect_delay = 10
mqtt_client = None
mqtt_client_id = "a4conf_" + mytime.now_second_pretty()

# iot gw template kepware
sleep_time_between_mqtt_topic = 0.5
mqtt_byte_limit_per_message = 60000
# iot gw template kepware

methodAB = "mqtt" # "mqtt|http"

# older name, might be ambiguous, everything in /srv should be "fromB"...
# a4confB.json should be more clear on the content of the file
# fromB="/srv/fromB.json"
fromB = "/srv/a4confB.json"
fromB_lock = threading.Lock()

set_history = []

ip_router_pc_A = "192.0.2.1"

def log_prefix(): return f"{mycolors.ENDC}{mytime.log()}{mycolors.LightMagenta}A4CONF -> "

class S(BaseHTTPRequestHandler):

    # always end headers before starting body.....
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def _set_headers_notfound(self):
        self.send_response(404)
        self.end_headers()
        self.wfile.write( "not found".encode("utf8") )

    def reply_with_text_json(self, text):
        self.send_response(200)
        resp = ( text ).encode( "utf8" )
        self.send_header("Content-Length", str(len(resp)))
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write( resp )

    def do_GET(self):
        path = self.path.replace("%20", " ").split("?")


        if path[0] in http_services:
            #check if service or file

            # start services section
            try:
                if path[0] == "/version": resp = pca.getversion()

                elif path[0] == "/confA": resp = ( common.dumpjsonnospaces( pca.getConf() ))

                elif path[0] == "/iotgwmqtt": resp = ( common.dumpjsonnospaces( kepware.getIotGW() ))

                elif path[0] == "/iotgwhttp": resp = ( common.dumpjsonnospaces( kepware.getIotGW("http") ))

                elif path[0] == "/iotgwhttpserver": resp = ( common.dumpjsonnospaces( kepware.getIotGW("http_server") ))

                elif path[0] == "/kepwaredevices":  resp = ( common.dumpjsonnospaces( kepware.getAllDevices() ))

                elif path[0] == "/kepware/backup": resp = kepware.kepwareBackup()

                elif path[0] == "/confB": resp = confB()

                elif path[0] == "/ready": resp = common.dumpjsonnospaces( { "ready" : isBready() } )

                elif path[0] == "/a4gate/bidir": resp = common.dumpjsonnospaces( { "a4GATE.U2U.RT" : bidir_rt, "a4GATE.U2U.BIDIR" : bidir_enabled } )

                elif path[0] == "/ftp/conf": resp = common.dumpjsonnospaces( ftp.getConf() )

                elif path[0] == "/reload_kepware_now":

                    pca.reloadKepware()
                    resp = "Kepware runtime has been correctly reloaded."


                elif path[0] == "/monitor/logs/isWorking": resp = str(monitor_logs_isWorking)

                elif path[0] == "/monitor/logs/table" : resp = str(monitor_logs_table)

                elif path[0] == "/monitor/logs/reload" :

                    resp = "Reloading A4MONITOR... the operation will take a while. A4MONITOR will resume at around 15-20 s, the other services around 45 s to 1 min."
                    os.system('sudo monit restart a4monitor_tf')


                elif path[0] == "/monitor/logs/status" :
                    global monitor_logs_status
                    monitor_logs_status = os.popen(''' monit status a4monitor_tf |grep status |grep -v monitoring |awk '{print $2  " " $3}' ''').read()
                    resp = monitor_logs_status



                elif path[0] == "/createiotgw":

                    parameters = {}
                    for line in path[1].split("&"):
                        temp = line.split("=")
                        parameters[temp[0]] = temp[1]
                    channelname = ""
                    devicename = None
                    if "channel" in parameters: channelname = parameters["channel"]
                    if "device" in parameters: devicename = parameters["device"]
                    if "type" in parameters: type_name = parameters["type"]
                    else: type_name = 'twa'

                    resp = ( common.dumpjsonnospaces( kepware.channeldevicetoiotgw(type_name, channelname, devicename) ))

                # if service is here, no exception have been raised, so http code is 200
                self.send_response(200)
            except Exception as e:
                self.send_response(500)
                resp = common.dumpjsonnospaces( { "Exception" : str(e) } )

            self.send_header('Content-type', 'application/json')
            if type(resp) is not bytes: resp = resp.encode("utf-8")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            if resp: self.wfile.write( resp )
            return

            # end services section

        # start file section
        elif path[0] == '/' or path[0] == "/debug": filename = 'index.html'

        else: filename = path[0]

        filename_parts = []
        # I don't want to serve files that are not in www folder
        filename_parts[:] = ( part for part in filename.split("/") if part != ".." and part != "." and part != "" )
        #filename = os.path.basename(filename)
        filename = os.path.join(".", "www", *filename_parts)

        if os.path.exists(filename):

            self.send_response(200)

            if filename[-4:] == '.css':
                self.send_header('Content-type', 'text/css')
            elif filename[-5:] == '.json':
                self.send_header('Content-type', 'application/json')
            elif filename[-3:] == '.js':
                self.send_header('Content-type', 'application/javascript')
            elif filename[-4:] == '.ico':
                self.send_header('Content-type', 'image/x-icon')
            else:
                self.send_header('Content-type', 'text/html')

            self.end_headers()

            with open(filename, 'rb') as filecontent: self.wfile.write(filecontent.read())
        else: self._set_headers_notfound()
        # end file section
    # END GET HANDLER

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        self.data_string = self.rfile.read(int(self.headers["Content-Length"]))

        if self.path == "/post" or self.path == "/post/debug":

            try:
                checkJSONandsend( self.data_string )
                print(f"{log_prefix()}configuration parsed with no error", flush = True)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(bytearray('{"status":"data forwarded"}', "utf8"))
            except Exception as e:
                # try went bad
                print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} while trying to set configuration -> {e} {mycolors.ENDC}")
                self.send_response(503)
                self.end_headers()
                self.wfile.write(bytearray('{"status":"error forwarding data"}', "utf8"))

        elif self.path == "/kepware/upload":
            res = kepware.kepwareUpload(self.data_string)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(str(res).encode("utf-8"))

        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(bytearray('{"status":"wrong path"}', "utf8"))
            print("path unknown")

def checkJSONandsend(text):
    """

    """
    try:
        fromA = json.loads(text)

    except Exception as e:
        raise Exception(f"{log_prefix()}{mycolors.FAIL}Error while parsing JSON") from e

    try:
        now_string = mytime.now_second_pretty()
        fromA_name = "./history/a4conf_" + now_string + ".json"

        print(f"{log_prefix()}fromA\n", common.dumpjsonpretty(fromA) )

        with open(fromA_name, 'w') as file_object: file_object.write( common.dumpjsonpretty(fromA) )

        # parameter set in web interface. Sets if configuration is limited to PC A, or data must reach also PC B
        onlyinternal = False
        if "system" in fromA:
            if "onlyinternal" in fromA["system"]:
                onlyinternal = fromA["system"]["onlyinternal"]
            if "network" in fromA["system"]:
                if "industrial" in fromA["system"]["network"]:
                    if "net_scan" in fromA["system"]["network"]["industrial"]:
                        net_scan = fromA["system"]["network"]["industrial"]["net_scan"]
                        pca.update_networks_scan(net_scan)

        # internal pc settings that don't need sync on external pc
        if "services" in fromA:
            services = fromA["services"]

            if "kepware" in services:

                #if "reload" in services["kepware"]:
                    #reload = services["kepware"]["reload"]
                    #if reload: pca.reloadKepware()

                if "trial" in services["kepware"]:
                    pca.setKepwareTrial(services["kepware"]["trial"])

            if "backchannel" in services:
                if "topics" in services["backchannel"]:
                    topics = services["backchannel"]["topics"]
                    pca.set_backchannel_topics(topics)
                if "files" in services["backchannel"]:
                    files = services["backchannel"]["files"]
                    pca.set_backchannel_files(files)

        #fast data configuration --> se anche viene selezionato la configurazione per il pc A e basta, per questo servizio dato che deve essere funzionante
        #su entrambi i pc per svolgere la sua funzione, viene inviata la config anche su B

            if "ftp" in services:
                if "A" in services["ftp"]:
                    conf = services["ftp"]["A"]
                    ftp.set(conf)

        #fast data configuration --> se anche viene selezionato la configurazione per il pc A e basta, per questo servizio dato che deve essere funzionante
        #su entrambi i pc per svolgere la sua funzione, viene inviata la config anche su B

        any_news_from_external = False
        # all code that must be run to send data to a4conf B
        if not onlyinternal:
            if isBready():
                # start SEND THINGWORX AGENT CONFIGURATION
                iotgws_twa = []
                if "services" in fromA:
                    if "thingworx" in fromA["services"]:
                        if "things" in fromA["services"]["thingworx"]:
                            things_obj = fromA["services"]["thingworx"]["things"]
                            #print("things_obj ->", dumpjsonpretty(things_obj))
                            for thing in things_obj:
                                #print("in first foreach, thingname is", thing)
                                for iotgw in things_obj[thing]:
                                    #print("in second foreach, iotgw is", iotgw)
                                    iotgws_twa.append(iotgw)
                #print( len(iotgws_twa))
                if len(iotgws_twa) > 0:
                    proto = "http" # "mqtt" || "http"
                    iotgw_avaiable = kepware.getIotGW(proto)
                    #print( "iotgw_avaiable are", dumpjsonpretty(iotgw_avaiable))
                    for iotgw in iotgws_twa:
                        #print("going to check if" , iotgw, "is defined in kepware")
                        if iotgw in iotgw_avaiable:
                            #print(iotgw, "is defined in kepware! Doing stuff")
                            vars = kepware.iot_gw_to_template_twa(iotgw, proto)
                            text = common.dumpjsonnospaces(vars)
                            topic_temp = mqtt_topic_tw_template[0] + "create" + mqtt_topic_tw_template[1] + iotgw + ".json"
                            mqtt_client.publish( topic_temp , " ") # you can write everything you want here, create message is used to empty/touch the file
                            time.sleep( sleep_time_between_mqtt_topic )
                            topic_temp = mqtt_topic_tw_template[0] + "append" + mqtt_topic_tw_template[1] + iotgw + ".json"
                            for i in range(0, len(text), mqtt_byte_limit_per_message):
                                mqtt_client.publish( topic_temp , text[i:mqtt_byte_limit_per_message+i])
                                time.sleep( sleep_time_between_mqtt_topic )

                # end SEND THINGWORX AGENT CONFIGURATION

                # start SEND OPCUA Server CONFIGURATION
                from_opcua = []
                to_opcua = []
                if "services" in fromA:
                    if "opcua" in fromA["services"]:
                        if "iotgw" in fromA["services"]["opcua"]:
                            iotgws_opcua = fromA["services"]["opcua"]["iotgw"]
                            #print("iotgws_opcua ->", common.dumpjsonpretty(iotgws_opcua))
                            if 'from' in iotgws_opcua: from_opcua = iotgws_opcua['from']
                            if 'to' in iotgws_opcua: to_opcua = iotgws_opcua['to']

                #print( len(iotgws_opcua))
                if len(from_opcua) > 0:
                    proto = "mqtt" # "mqtt" || "http"
                    iotgw_avaiable = kepware.getIotGW(proto)
                    #print( "iotgw_avaiable are", common.dumpjsonpretty(iotgw_avaiable))
                    for iotgw in from_opcua:
                        #print("going to check if" , iotgw, "is defined in kepware")
                        if iotgw in iotgw_avaiable:
                            #print(iotgw, "is defined in kepware! Doing stuff")
                            vars = kepware.iot_gw_to_template_opcua(iotgw, proto)
                            text = common.dumpjsonnospaces(vars)
                            topic_temp = mqtt_topic_opc_template[0] + "create" + mqtt_topic_opc_template[1] + iotgw + ".json"
                            mqtt_client.publish( topic_temp , " ") # you can write everything you want here, create message is used to empty/touch the file
                            time.sleep( sleep_time_between_mqtt_topic )
                            #time.sleep(5)
                            topic_temp = mqtt_topic_opc_template[0] + "append" + mqtt_topic_opc_template[1] + iotgw + ".json"
                            for i in range(0, len(text), mqtt_byte_limit_per_message):
                                mqtt_client.publish( topic_temp , text[i:mqtt_byte_limit_per_message+i])
                                time.sleep( sleep_time_between_mqtt_topic )

                if len(to_opcua) > 0:
                    proto = "http_server" # "mqtt" || "http"
                    iotgw_avaiable = kepware.getIotGW(proto)
                    #print( "iotgw_avaiable are", common.dumpjsonpretty(iotgw_avaiable))
                    for iotgw in to_opcua:
                        #print("going to check if" , iotgw, "is defined in kepware")
                        if iotgw in iotgw_avaiable:
                            #print(iotgw, "is defined in kepware! Doing stuff")
                            vars = kepware.iot_gw_to_template_opcua(iotgw, proto)
                            text = common.dumpjsonnospaces(vars)
                            topic_temp = mqtt_topic_opcto_template[0] + "create" + mqtt_topic_opcto_template[1] + iotgw + ".json"
                            mqtt_client.publish( topic_temp , " ") # you can write everything you want here, create message is used to empty/touch the file
                            time.sleep( sleep_time_between_mqtt_topic )
                            topic_temp = mqtt_topic_opcto_template[0] + "append" + mqtt_topic_opcto_template[1] + iotgw + ".json"
                            for i in range(0, len(text), mqtt_byte_limit_per_message):
                                mqtt_client.publish( topic_temp , text[i:mqtt_byte_limit_per_message+i])
                                time.sleep( sleep_time_between_mqtt_topic )

            # end SEND OPCUA Server CONFIGURATION

            #### STATIC ROUTES FOR EXTERNAL PC
            # network on internal pc is set only if external pc has received messagge correctly
            # here we create the list of routes for external pc
            """
            Use following variable to store if routes from pc A need to be sent again to pc B.
            It is needed if reoutes set before are no longer valid. It could be because on internal pc user has changed:
            - static routes;
            - static ips;
            - dhcp configuration.
            """
            need_send_routes_to_B = False
            routes_to_B = {}

            if "system" in fromA:
                if "network" in fromA["system"]:
                    if "industrial" in fromA["system"]["network"]:
                        network_industrial = fromA["system"]["network"]["industrial"]
                        if "routes" in network_industrial:
                            routes = network_industrial["routes"]
                            # pca.updateStaticRoutes(routes) # do not apply here. At this point, we don't know if routes are going on the other side
                            # _old_ routes_to_B += routes.keys()
                            for route in routes: routes_to_B[route] = ip_router_pc_A
                            need_send_routes_to_B = True
                        else:
                            for route in pca.getStaticRoutes(): routes_to_B[route] = ip_router_pc_A

                        if "ip" in network_industrial:
                            for route in pca.ips_to_nets_cidr(network_industrial["ip"]) : routes_to_B[route] = ip_router_pc_A
                            need_send_routes_to_B = True
                        if "dhcp" in network_industrial: need_send_routes_to_B = True

            if need_send_routes_to_B:
                print(f"{log_prefix()}Following routes are going to External pc\n{routes_to_B}")
                if "system" not in fromA: fromA["system"] = {}
                if "network" not in fromA["system"]: fromA["system"]["network"] = {}
                if "customer" not in fromA["system"]["network"]: fromA["system"]["network"]["customer"] = {}
                fromA["system"]["network"]["customer"]["routes"] = routes_to_B
            #### STATIC ROUTES FOR EXTERNAL PC

            # save if mqtt has received a response
            if methodAB == "mqtt":
                any_news_from_external = sendtoBmqtt(fromA)
        else: print(f"{log_prefix()}{mycolors.WARNING}Configuration is just for PC A, ignoring code to create and send configuration to PC B")
        # this section of code is run if:
        #   configuration was sent to pc B and a4conf B sent good feedback
        #   configuration is only for PC A
        if any_news_from_external or onlyinternal:
            # UPDATE A
            if "system" in fromA:
                system = fromA["system"]

                # create file to avoid web server on all IP addresses
                if "toProduction" in system:
                    toProduction = system["toProduction"]
                    if toProduction is True:
                        pca.setToProduction()

                # apply newer hostname
                if "hostname" in system:
                    if "industrial" in system["hostname"]:
                        hostname = system["hostname"]["industrial"]
                        pca.sethostname(hostname)

                if "network" in system:
                    # UPDATE IP A
                    if "industrial" in system["network"]:
                        if "routes" in system["network"]["industrial"]:
                            routes = system["network"]["industrial"]["routes"]
                            pca.updateStaticRoutes(routes)
                        if "dhcp" in system["network"]["industrial"]:

                            dhcp = system["network"]["industrial"]["dhcp"]

                            if dhcp: pca.setnetworkonPCA(dhcp=True)
                            else:
                                if "ip" in system["network"]["industrial"]:
                                    ips_A = system["network"]["industrial"]["ip"]

                                    ips_A[:] = (ip for ip in ips_A if pca.check_ip(ip))

                                    pca.setnetworkonPCA(ips = ips_A)
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception (type = {type(e)}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise Exception from e

def sendtoBmqtt(payload):
    """
    this function takes a dictionary as input, transforms it to text with and object in JSON format
    and tries to send via mqtt to a4conf B.\n
    In order to understand if message reached a4conf B, this function adds to the message a property namd "id".\n
    If the same id is sent back in the next 15 seconds, this function returns True as a4conf B acknowleged the message.\n
    If the id is not received back in 15 seconds, this function returns a False, a4conf B may not be running properly or pc B may be offline...
    """
    payload["id"] = str( mytime.unix_now() )
    try:
        time.sleep(sleep_time_between_mqtt_topic)
        #payload_str = common.dumpjsonnospaces(payload)
        payload_str = json.dumps(payload)

        mqtt_client.publish( topic = mqtt_topic_confset , msg = payload_str )
        #os.system(f'''mosquitto_pub -p 7883 -t "rep/conf/set" -m '{payload_str}' ''')

        counter = 15
        while counter > 0:
            counter -= 1
            if str(payload["id"]) in set_history:
                print(f"{log_prefix()}function sendtoBmqtt did find the needed \"id\" in time, returning True")
                return True
            time.sleep(1)
        print(f"{log_prefix()}function sendtoBmqtt did NOT find the needed \"id\" in time, returning False")
        return False

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception (type = {type(e)}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise Exception from e

def confB():
    """
        returns a string containing the actual configuration of pc B.
            The configuration is sent from a4conf B to a4conf A via
            a text file. The text represents a JSON object with all configurations.
            This function actively waits for the creation of the file on /srv folder.
            If the file does not appear in 20 seconds, the default value is returned.
            The return value is set by default to {}, so even if there is an error while reading the
            file, an empty JSON object is returned.
            After reading the file, this function deletes it from file system. Why? To avoid using older configurations.
    """
    mqtt_client.publish( topic = mqtt_topic_confget , msg = "confB" )
    data = "{}"
    counter = 0

    while not os.path.exists(fromB) and counter < 20:
        time.sleep(1)
        counter+=1

    try:
        with fromB_lock:
            if os.path.exists(fromB):
                # if necessary, give bchnld some time to complete creation of file.
                time.sleep(1)
                with open(fromB, 'r') as file: data = file.read()
                print(f"{log_prefix()}fromB\n", data)
                os.remove(fromB)
    except Exception as e: print(f"{log_prefix()}{mycolors.FAIL}Exception (type = {type(e)}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)

    return data

def askforKeepalive():
    """
    this function sends a message to a4conf B to request keepalive.

    If a4conf B receives the message, will start sending
    back MQTT messages with "keepalive" information.
    The messages from a4conf B will arrive for a limited time, in order not to clog up backchannel
    """
    try:
        print(f"{log_prefix()}Asking a4conf B to send keepalive messages")
        mqtt_client.publish( topic = mqtt_topic_keepalive_request , msg = "" )
    except Exception as e: print(f"Exception (type = {type(e)}) at line {sys.exc_info()[-1].tb_lineno} -> {e}", flush = True)

def isBready():
    """
    returns True if a keepalive has been received from a4confB in last 60 seconds
        if last keepalive is older than 30 seconds, a request is sent to a4confB
        to restart sending keepalive messages.
        before returning a False, this script first waits for
    """
    diff = mytime.unix_now() - last_keepalive

    if diff > 30: askforKeepalive()

    result = diff < 60

    if result: return result

    for x in range(2):
        time.sleep(1)
        result = ( mytime.unix_now() - last_keepalive ) < 60
        if result: return result

    return result

def backupConf():
    """
        creates a backup of pc A configuration and sends it in JSON format via MQTT
    """
    print(f"{log_prefix()}Sending backup of running configuration")
    conf = pca.getConf()
    mqtt_client.publish( mqtt_topic_confbackup, common.dumpjsonnospaces(conf) ) if mqtt_client != None else print(f"{log_prefix()}backup: skipping backup because mqtt is None")

def mqtt_on_message_handler(topic, message):
    """
        handles messages reveiced on different topics via mqtt
        defined here so that mqtt library can be generic and used in other places
    """
    try:
        global monitor_logs_table


        if topic == mqtt_topic_keepalive_fromB:
            global last_keepalive
            if message == "true": last_keepalive = mytime.unix_now()
            elif message == "false": last_keepalive = 0

        elif topic == mqtt_topic_confset_fromB:
            #global set_history
            set_history.append( message )

        elif topic == mqtt_topic_hwsw_local:

                message = json.loads(message)
                if "a4GATE.U2U.RT" in message.keys():
                    value = message["a4GATE.U2U.RT"]
                    global bidir_rt
                    bidir_rt = value
                elif "a4GATE.U2U.BIDIR" in message.keys():
                    value = bool(message["a4GATE.U2U.BIDIR"])
                    global bidir_enabled
                    bidir_enabled = value



        elif topic == mqtt_topic_monitor_isWorking:
            global monitor_logs_isWorking
            monitor_logs_isWorking = message
            #(all(json.loads(monitor_logs_isWorking).values()))
            if all(json.loads(monitor_logs_isWorking).values()): monitor_logs_table = ""


        elif topic == mqtt_topic_monitor_table:
            monitor_logs_table = message




    except Exception as e: print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}")


def send_neighbours_to_pcb():
    neighbours = pca.network_scan()
    if neighbours is not None: mqtt_client.publish(pca.network_scan_topic, common.dumpjsonnospaces( neighbours ) )
    else: print(f'{mytime.log()}{mycolors.FAIL}NETWORK SCAN -> result NOT sent to "{mycolors.WARNING}{pca.network_scan_topic}{mycolors.LightMagenta}" {mycolors.ENDC}')

def send_a4updater_to_cloud(): mqtt_client.publish(mqtt_topic_updater_A, pca.get_last_a4updater()) if mqtt_client != None else print(f"{log_prefix()}a4updater version publish: skipping backup because mqtt is None")
if __name__ == "__main__":
    from sys import argv

    try:

        success = pca.applyStaticRoutes()

        print(f"Tried to apply static routes. Result -> {success}")

        mqtt_client = helper_mqtt( client_id = mqtt_client_id,
                    broker = mqtt_broker_ip,
                    port = mqtt_broker_port,
                    client_reconnect_delay = mqtt_client_reconnect_delay,
                    broker_connection_timeout = mqtt_broker_connection_timeout,
                    broker_keepalive = mqtt_broker_keepalive,
                    on_message_handler = mqtt_on_message_handler,
                    topics = mqtt_topics_subscribe)

        if len(argv) == 2: http_server_port = int(argv[1])

        if os.path.isfile( pca.to_localhost_file ): http_server_ip = "127.0.0.1"

        http_server = http_help.SimpleHttpServer(ip = http_server_ip,
                                                port = http_server_port,
                                                handler = S,
                                                ssl_on = False)

        print(f"{http_help.log_prefix()}Starting http server")

        http_server.start()

        askforKeepalive()

        now = mytime.now()
        in15minutes = now + datetime.timedelta(minutes = 15)
        in30minutes = now + datetime.timedelta( minutes = 30 )
        #in45minutes = now + datetime.timedelta( minutes = 45 )

        sched = BackgroundScheduler(daemon = True,  timezone = utc)
        sched.add_job(func = backupConf, trigger = 'interval', seconds = seconds_between_backup , next_run_time = in30minutes )
        sched.add_job(func = send_a4updater_to_cloud, trigger = 'interval', seconds = seconds_between_backup , next_run_time = in15minutes )

        #sched.add_job(func = send_neighbours_to_pcb, trigger = 'interval', days = 1, next_run_time = in45minutes )
        #send_neighbours_to_pcb()

        sched.start()

        confB()

        # nothing better?!
        while True: time.sleep( 65521 )

    except KeyboardInterrupt: pass
    except Exception as e: print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}")