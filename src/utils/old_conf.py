#!/usr/bin/python3 -u

import os
import logging

# logging.basicConfig(format = '%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s', level = logging.INFO, handlers = [logging.StreamHandler()])

SCRIPT_DIRECTORY = os.path.dirname( os.path.realpath(__file__) )
os.chdir(SCRIPT_DIRECTORY)

import sys
import json
import time
import datetime
import requests
import threading
from pytz import utc
from http.server import BaseHTTPRequestHandler
from apscheduler.schedulers.background import BackgroundScheduler

# a4modules
import helper_http_server as http_help
import helper_kepware as kepware
import helper_ftp as ftp
import helper_pca as pca
import helper_mqtt
import mycolors
import mytime
import common

# HTTP SERVER INFO
http_server_port = 80
http_server_ip = "0.0.0.0"
HTTP_SERVICES = [   "/version", "/confA", "/confB" , "/iotgwmqtt" , "/iotgw/http/client/enabled", 
                    "/iotgwhttp", "/createiotgw" , "/kepwaredevices", "/iotgw/http/server/enabled",
                    "/kepware/backup", "/ready", "/iotgwhttpserver", "/iotgw/http/client/tags", "/iotgw/http/server/tags",
                    "/a4gate/bidir" , "/kepware/upload", "/monitor/logs/isWorking",
                    "/monitor/logs/table", "/monitor/logs/reload", "/machine/connections",
                    "/monitor/logs/status", "/reload_kepware_now", "/conf/twx/diagnostic",
                    "/iotgw/http/client/enable", "/iotgw/http/server/enable", "/iotgw/http/client/disabled", "/channel/device/tags/tree",
                    "/iotgws/http/endpoint", "/post", "/post/debug", "/iotgw/http/server/disabled", "/ftp/conf", # da eliminare !!!!!!
                    "/iotgw/http/client/enabled/opcua_from", "/iotgw/http/client/disabled/opcua_from",
                    "/iotgw/http/server/enabled/opcua_to", "/iotgw/http/server/disabled/opcua_to",
                    "/iotgw/http/client/enabled/fastdata_matrix", "/iotgw/http/client/disabled/fastdata_matrix"
                    ]
# HTTP SERVER INFO

TOPIC_ACROSS_DATA_DIODE_MAX_LENGTH = 67

SECONDS_BETWEEN_BACKUP = 86400

# MQTT CLIENT INFO
mqtt_client = None
MQTT_BROKER_IP = "127.0.0.1"
MQTT_BROKER_PORT = 7883
MQTT_TOPIC_HWSW_LOCAL = 'monitor/hwsw/json'
MQTT_TOPIC_HWSW = 'rep/monitor/hwsw/'
MQTT_TOPIC_MACHINE_CONNECTED = f"{MQTT_TOPIC_HWSW}a4GATE.A.machines_connected"
MQTT_TOPIC_UPDATER_A = f"{MQTT_TOPIC_HWSW}a4GATE.A.a4updater"
MQTT_TOPIC_CONF_BACKUP = f"{MQTT_TOPIC_HWSW}a4GATE.A.conf"
MQTT_TOPIC_CONF_GET = "rep/conf/get"
MQTT_TOPIC_CONF_SET = "rep/conf/set"
MQTT_TOPIC_CONF_SET_FROM_B = "conf/set"
MQTT_TOPIC_CONF_KEEPALIVE_FROM_B = "conf/keepalive"
MQTT_TOPIC_MONITOR_LOGS = "monitor/logs"
MQTT_TOPIC_MONITOR_ISWORKING = MQTT_TOPIC_MONITOR_LOGS + '/isWorking'
MQTT_TOPIC_MONITOR_TABLE = MQTT_TOPIC_MONITOR_LOGS + '/table'
MQTT_TOPIC_MONITOR_RELOAD = MQTT_TOPIC_MONITOR_LOGS + '/reload'
MQTT_TOPIC_MONITOR_STATUS = MQTT_TOPIC_MONITOR_LOGS + '/status'

MQTT_TOPIC_KEEPALIVE_REQUEST = "rep/" + MQTT_TOPIC_CONF_KEEPALIVE_FROM_B
MQTT_TOPICS_SUBSCRIBE = [ MQTT_TOPIC_CONF_SET_FROM_B , MQTT_TOPIC_CONF_KEEPALIVE_FROM_B, MQTT_TOPIC_HWSW_LOCAL, MQTT_TOPIC_MONITOR_ISWORKING, MQTT_TOPIC_MONITOR_TABLE, MQTT_TOPIC_MONITOR_RELOAD, MQTT_TOPIC_MONITOR_STATUS]
MQTT_TOPIC_TW_TEMPLATE = ["rep/conf/file/", "/tw_template/"]
MQTT_TOPIC_OPC_FROM_TEMPLATE = ["rep/conf/file/", "/opcua_from_template/"]
MQTT_TOPIC_OPC_TO_TEMPLATE = ["rep/conf/file/", "/opcua_to_template/"]

# topic sul quale inviare le richieste per ricevere un feedback sulla connessione a twx
MQTT_TOPIC_TWX_CONN_CHECK = "rep/conf/twx/diagnostic"

# file nel quale scrivere info da far arrivare al PC A senza necessità di fare una get di tutta la configurazione. ESEMPIO: da a4conf su A mi viene richiesta lo stato della connessione verso twx
BCHNLD_FILENAME_FOR_INFO = "/srv/fromB.json"

MQTT_BROKER_CONNECTION_TIMEOUT = 1
MQTT_BROKER_KEEPALIVE = 60
MQTT_SECONDS_BEFORE_RETRY_CONN = 2
MQTT_CLIENT_RECONNECT_DELAY = 10
MQTT_CLIENT_ID = "a4conf_" + mytime.now_second_pretty()
MQTT_QOS = 2
# MQTT CLIENT INFO

# BIDIRECTIONALITY DEFAULT VALUE
bidir_rt = 0
bidir_enabled = False
# BIDIRECTIONALITY DEFAULT VALUE

monitor_logs_table = str()
monitor_logs_isWorking = ''
monitor_logs_status = ''
monitor_logs_reload = ''

last_keepalive = 0

# iot gw template kepware
SLEEP_TIME_BETWEEN_MQTT_TOPIC = 0.5
MQTT_BYTE_LIMIT_PER_MESSAGE = 60000
# iot gw template kepware

METHODAB = "http" # "mqtt|http"

WAITING_B_CONF_TIME = 15    # tempo massimo in secondi entro il quale ci si aspetta che arrivi la configurazione da B oppure le info

SLEEP_TIME_BETWEEN_HTTP_REQUESTS = 0.5
HTTP_PORT_TO_B_SIDE = 11006
HTTP_PATH_TO_B_SIDE_SET = "/conf/set"
HTTP_PATH_TO_B_SIDE_GET = "/conf/get"
HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_TWA = "/conf/file/tw_template/"
HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_OPCUA_FROM = "/conf/file/opcua_from_template/"
HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_OPCUA_TO = "/conf/file/opcua_to_template/"

# older name, might be ambiguous, everything in /srv should be "FROMB"...
# a4confB.json should be more clear on the content of the file
# FROMB="/srv/FROMB.json"
FROMB = "/srv/a4confB.json"
fromB_lock = threading.Lock()

set_history = list()    # lista dove vengono aggiunti gli ID per il check della ricezione della conf da parte del PC B

IP_ROUTER_PC_A = "192.0.2.1"

def log_prefix():
    return f"{mycolors.ENDC}{mytime.log()}{mycolors.LightMagenta}A4CONF -> "

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

    def reply_with_text_json(self, text: str):
        self.send_response(200)
        resp = text.encode("utf8")
        self.send_header("Content-Length", str(len(resp)))
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write( resp )

    def do_GET(self):
        path = self.path.replace("%20", " ").split("?")

        if path[0] in HTTP_SERVICES:
            #check if service or file

            # start services section
            try:
                if path[0] == "/version":
                    """ GET per ottenere la versione di a4conf """
                    resp = pca.getversion()

                elif path[0] == "/confA":
                    """ GET per ottenere la confgurazione di A """
                    resp = common.dumpjsonnospaces(pca.get_conf())

                elif path[0] == "/kepwaredevices":
                    """ GET per ottenere tutti i Device presenti su Kepware """
                    resp = common.dumpjsonnospaces(kepware.get_all_devices())

                elif path[0] == "/kepware/backup":
                    """ GET per ottenere il bckup del progetto Kepware """
                    resp = kepware.kepwareBackup()

                elif path[0] == "/confB":
                    """ GET per ottenere le configurazione di B """
                    resp = confB()

                elif path[0] == "/conf/twx/diagnostic":
                    """ GET per ottenere un feedback sullo stato di connessione a twx """
                    resp = get_twx_conn_diagnostic()

                elif path[0] == "/ready":
                    """ GET per ottendere se i due pc riescono correttamente a scambiarsi messaggi. Se così fosse, allora il pc B sarebbe in stato "ready" per ricevere nuove configurazioni """
                    resp = common.dumpjsonnospaces({"ready" : isBready()})

                elif path[0] == "/a4gate/bidir":
                    """ GET per ottenere lo stato della bidirezionalità e l'eventuale tempo rimanente  """
                    resp = common.dumpjsonnospaces({"a4GATE.U2U.RT" : bidir_rt, "a4GATE.U2U.BIDIR" : bidir_enabled})

                elif path[0] == "/iotgwmqtt":
                    """ GET per ottenedere gli iot gw di tipo mqtt client """
                    resp = common.dumpjsonnospaces(kepware.get_iotgw_by_protocol("mqtt"))

                elif path[0] == "/iotgwhttp":
                    """ GET per ottenedere gli iot gw di tipo http client """
                    resp = common.dumpjsonnospaces(kepware.get_iotgw_by_protocol("http_client"))

                elif path[0] == "/iotgwhttpserver":
                    """ GET per ottenedere gli iot gw di tipo http server """
                    resp = common.dumpjsonnospaces(kepware.get_iotgw_by_protocol("http_server"))

                elif path[0] == "/iotgw/http/client/disabled":
                    """ GET degli iot gw di tipo http client disabilitati """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_client_from_status(enabled = False))

                elif path[0] == "/iotgw/http/server/disabled":
                    """ GET degli iot gw di tipo http server disabilitati """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_server_from_status(enabled = False))
                
                elif path[0] == "/iotgw/http/client/enabled":
                    """ GET degli iot gw di tipo http client abilitati """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_client_from_status(enabled = True))

                elif path[0] == "/iotgw/http/server/enabled":
                    """ GET degli iot gw di tipo http server abilitati """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_server_from_status(enabled = True))

                elif path[0] == "/iotgw/http/client/enabled/opcua_from":
                    """ GET degli iot gw di tipo http client abilitati che servono per inviare i dati in sola lettura al server OPCUA """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_client_for_opcua_from(enabled = True))
                
                elif path[0] == "/iotgw/http/client/disabled/opcua_from":
                    """ GET degli iot gw di tipo http client disabilitati che servono per inviare i dati in sola lettura al server OPCUA """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_client_for_opcua_from(enabled = False))

                elif path[0] == "/iotgw/http/server/enabled/opcua_to":
                    """ GET degli iot gw di tipo http client abilitati che servono per inviare i dati in lettura e scrittura al server OPCUA """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_client_for_opcua_to(enabled = True))
                
                elif path[0] == "/iotgw/http/server/disabled/opcua_to":
                    """ GET degli iot gw di tipo http client disabilitati che servono per inviare i dati in lettura e scrittura al server OPCUA """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_client_for_opcua_to(enabled = False))

                elif path[0] == "/iotgw/http/client/enabled/fastdata_matrix":
                    """ GET degli iot gw di tipo http client abilitati che servono per inviare i fastdata """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_client_for_fastdata_matrix(enabled = True))
                
                elif path[0] == "/iotgw/http/client/disabled/fastdata_matrix":
                    """ GET degli iot gw di tipo http client disabilitati che servono per inviare i fastdata """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_client_for_fastdata_matrix(enabled = False))

                elif path[0] == "/iotgw/http/client/tags":
                    """ GET dei tag contenuti in un iot gw di tipo http client """

                    parameters = dict()
                    for line in path[1].split("&"):
                        temp = line.split("=")
                        parameters[temp[0]] = temp[1]
                    
                    iotgw_name = parameters["iotgw_name"] if "iotgw_name" in parameters else ""
                    resp = common.dumpjsonnospaces(kepware.get_iotgw_http_client_tags(iotgw_name = iotgw_name))

                elif path[0] == "/iotgw/http/server/tags":
                    """ GET dei tag contenuti in un iot gw di tipo http server """

                    parameters = dict()
                    for line in path[1].split("&"):
                        temp = line.split("=")
                        parameters[temp[0]] = temp[1]
                    
                    iotgw_name = parameters["iotgw_name"] if "iotgw_name" in parameters else ""
                    resp = common.dumpjsonnospaces(kepware.get_iotgw_http_server_tags(iotgw_name = iotgw_name))

                elif path[0] == "/iotgw/http/client/enable":
                    """ GET per abilitare un iotgw di tipo http client """

                    parameters = dict()
                    for line in path[1].split("&"):
                        temp = line.split("=")
                        parameters[temp[0]] = temp[1]
                    
                    iotgw_name = parameters["iotgw_name"] if "iotgw_name" in parameters else ""

                    resp = common.dumpjsonnospaces(kepware.enable_iotgw_http_client(iotgw_name))
                
                elif path[0] == "/iotgw/http/server/enable":
                    """ GET per abilitare un iotgw di tipo http server """

                    parameters = dict()
                    for line in path[1].split("&"):
                        temp = line.split("=")
                        parameters[temp[0]] = temp[1]
                    
                    iotgw_name = parameters["iotgw_name"] if "iotgw_name" in parameters else ""

                    resp = common.dumpjsonnospaces(kepware.enable_iotgw_http_server(iotgw_name))
                
                elif path[0] == "/iotgw/http/client/disable":
                    """ GET per disabilitare un iotgw di tipo http client """

                    parameters = dict()
                    for line in path[1].split("&"):
                        temp = line.split("=")
                        parameters[temp[0]] = temp[1]
                    
                    iotgw_name = parameters["iotgw_name"] if "iotgw_name" in parameters else ""

                    resp = common.dumpjsonnospaces(kepware.disable_iotgw_http_client(iotgw_name))
                
                elif path[0] == "/iotgw/http/server/disable":
                    """ GET per disabilitare un iotgw di tipo http server """

                    parameters = dict()
                    for line in path[1].split("&"):
                        temp = line.split("=")
                        parameters[temp[0]] = temp[1]
                    
                    iotgw_name = parameters["iotgw_name"] if "iotgw_name" in parameters else ""

                    resp = common.dumpjsonnospaces(kepware.disable_iotgw_http_server(iotgw_name))

                elif path[0] == "/iotgws/http/endpoint":
                    """ GET per ottenere gli iotgw di tipo http e i relativi endpoint sulla quale inviano i dati """
                    resp = common.dumpjsonnospaces(kepware.get_iotgws_http_with_endpoint())

                elif path[0] == "/reload_kepware_now":
                    """ GET per riavviare il runtime di Kepware """
                    reload_result = kepware.reloadKepware()
                    #DONE restituire un dizionario del tipo "{res : True / False}" e poi da interfaccia scrivere in base al boolean se il comando di riavvio è andato a buon fine oppure no
                    resp = common.dumpjsonnospaces({"res" : reload_result})
                
                elif path[0] == "/monitor/logs/isWorking":
                    """ GET per ottenere quali servizi di a4monitor_tf stanno funzionando """
                    resp = str(monitor_logs_isWorking)

                elif path[0] == "/monitor/logs/table":
                    """ GET per ottenere il JSON dai log di a4monitor_tf dove sono mostrati gli stati di monitoraggio dei diversi servizi di Terafence """
                    resp = str(monitor_logs_table)

                elif path[0] == "/machine/connections":
                    """ GET per ottenere un JSON dove ci sono le info sullo stato delle connessioni alle macchine dal PC A(Kepware) """
                    resp = common.dumpjsonnospaces(kepware.machine_connected())

                elif path[0] == "/monitor/logs/reload":
                    """ GET per riavviare a4monitor_tf """
                    
                    resp = "Reloading A4MONITOR... the operation will take a while. A4MONITOR will resume at around 15-20 s, the other services around 45 s to 1 min."
                    os.system('sudo monit restart a4monitor_tf')

                elif path[0] == "/monitor/logs/status":
                    """ GET per ottenere lo stato del servizio di a4monitor_tf """

                    global monitor_logs_status
                    monitor_logs_status = os.popen('''monit status a4monitor_tf | grep status | grep -v monitoring |awk '{print $2  " " $3}' ''').read().strip()
                    resp = monitor_logs_status

                elif path[0] == "/createiotgw":
                    """ GET per creare un iotgw con tutti i tag presenti in un canale/canale+device """

                    parameters = dict()
                    for line in path[1].split("&"):
                        temp = line.split("=")
                        parameters[temp[0]] = temp[1]

                    channelname = parameters["channel"] if "channel" in parameters else ""
                    devicename = parameters["device"] if "device" in parameters else None
                    type_name = parameters["type"] if "type" in parameters else "twa"
                    thing_name = parameters["thing_name"] if "thing_name" in parameters else "rt_MATRICOLA_MACCHINA"
                    folder = parameters["folder"] if "folder" in parameters else "matrix"
                    publish_rate_ms = parameters["publish_rate_ms"] if "publish_rate_ms" in parameters else 1000
                    items_scan_rate = parameters["items_scan_rate"] if "items_scan_rate" in parameters else 1000

                    resp = common.dumpjsonnospaces(kepware.create_iot_gw_all_tags(type_name, channelname, devicename, thing_name, folder, publish_rate_ms, items_scan_rate))

                elif path[0] == "/channel/device/tags/tree":
                    """ GET per ottenere l'alberatura dei tags dentro un device di uno specifico channel """

                    parameters = dict()
                    for line in path[1].split("&"):
                        temp = line.split("=")
                        parameters[temp[0]] = temp[1]

                    if "channel" and "device" in parameters:
                        channel = parameters["channel"]
                        device = parameters["device"]
                        resp = common.dumpjsonnospaces(kepware.get_device_and_tags_tree(channel, device))
                    else:
                        resp = json.dumps({})

                # DA ELIMINARE!!!!!!
                elif path[0] == "/ftp/conf":
                    resp = "{}"

                # if service is here, no exception have been raised, so http code is 200
                self.send_response(200)
            
            except Exception as e:
                print( f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e}", flush = True)
                self.send_response(500)
                resp = common.dumpjsonnospaces( { "Exception" : str(e) } ) 

            self.send_header('Content-type', 'application/json')
            if type(resp) is not bytes:
                resp = resp.encode("utf-8")
            
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            
            if resp:
                self.wfile.write(resp)
            
            return

            # end services section

        # start file section
        elif path[0] == '/' or path[0] == "/debug":
            filename = 'index.html'
        
        else:
            filename = path[0]
 
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

            with open(filename, 'rb') as filecontent:
                self.wfile.write(filecontent.read())
        else:

            #print(f"{log_prefix()}{mycolors.FAIL}Path {path[0]} not defined", flush = True)
            self._set_headers_notfound()
        # end file section
        
    # END GET HANDLER

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        self.data_string = self.rfile.read(int(self.headers["Content-Length"]))

        path = self.path.replace("%20", " ").split("?")

        if path[0] in HTTP_SERVICES:

            if path[0] == "/post" or path[0] == "/post/debug":
                """ POST per settare le configurazioni su A e per inviare le configurazioni su B """

                try:
                    checkJSONandsend(self.data_string)
                    print(f"{log_prefix()}configuration parsed with no error", flush = True)
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(bytearray('{"status":"data forwarded"}', "utf8"))
                except Exception as e:
                    # try went bad
                    print( f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e}", flush = True)
                    self.send_response(503)
                    self.end_headers()
                    self.wfile.write(bytearray('{"status":"error forwarding data"}', "utf8"))
            
            elif path[0] == "/kepware/upload":
                """ POST per fare l'upload del proegetto Kepware """

                res = kepware.kepwareUpload(self.data_string)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(str(res).encode("utf-8"))

            elif path[0] == "/createiotgw":
                """ POST per creare un iot gw con i tag specificati """

                try:

                    parameters = dict()
                    for line in self.path[1].split("&"):
                        temp = line.split("=")
                        parameters[temp[0]] = temp[1]

                    channelname = parameters["channel"] if "channel" in parameters else ""
                    devicename = parameters["device"] if "device" in parameters else ""
                    type_name = parameters["type"] if "type" in parameters else "twa"
                    thing_name = parameters["thing_name"] if "thing_name" in parameters else "rt_MATRICOLA_MACCHINA"
                    folder = parameters["folder"] if "folder" in parameters else "matrix"
                    publish_rate_ms = parameters["publish_rate_ms"] if "publish_rate_ms" in parameters else 1000
                    items_scan_rate = parameters["items_scan_rate"] if "items_scan_rate" in parameters else 1000

                    tag_list = json.loads(self.data_string)

                    res = common.dumpjsonnospaces(kepware.create_iot_gw_custom_tags(channelname, devicename, tag_list, type_name, thing_name, folder, publish_rate_ms, items_scan_rate)) if len(tag_list) > 0 else common.dumpjsonnospaces(kepware.create_iot_gw_all_tags(type_name, channelname, devicename, thing_name, folder, publish_rate_ms, items_scan_rate))

                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(str(res).encode("utf-8"))

                except Exception as e:
                    # try went bad
                    print( f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e}", flush = True)
                    self.send_response(503)
                    self.end_headers()
                    self.wfile.write(bytearray('{"status":"error forwarding data"}', "utf8"))

            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(bytearray('{"status":"wrong path"}', "utf8"))
                print(f"{log_prefix()}{mycolors.FAIL}path unknown", flush = True)

        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(bytearray('service not into HTTP_SERVICES', "utf8"))
            print(f"{log_prefix()}{mycolors.FAIL}path unknown", flush = True)

def get_twx_conn_diagnostic():

    # check esistenza vecchio file di info nella cartella. se esiste, lo elimino
    if os.path.exists(BCHNLD_FILENAME_FOR_INFO):
        print(f"{log_prefix()}{mycolors.WARNING} old file '{BCHNLD_FILENAME_FOR_INFO}' detected. Deleting it ")
        os.remove(BCHNLD_FILENAME_FOR_INFO)

    # richiesta del test di connessione via MQTT
    send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = MQTT_TOPIC_TWX_CONN_CHECK, mqtt_msg = "twx", mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)

    data = "{}"
    counter = 0

    while not os.path.exists(BCHNLD_FILENAME_FOR_INFO) and counter < WAITING_B_CONF_TIME:
        time.sleep(1)
        counter += 1

    if os.path.exists(BCHNLD_FILENAME_FOR_INFO):
        try:
            with fromB_lock:
                # if necessary, give bchnld some time to complete creation of file.
                time.sleep(1)
                with open(BCHNLD_FILENAME_FOR_INFO, 'r') as file:
                    data = file.read()
                    
                print(f"{log_prefix()}FROMB INFO ->", flush = True)
                print(f"{log_prefix()}{data}", flush = True)
                
                os.remove(BCHNLD_FILENAME_FOR_INFO)
        
        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception (type = {type(e)}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)

    else:
        print(f"{log_prefix()}{mycolors.FAIL}FIle '{BCHNLD_FILENAME_FOR_INFO}' does not exists")
    
    return data

def checkJSONandsend(text):
    """
    
    """
    try:
        fromA = json.loads(text)
      
    except Exception as e:
        raise Exception(f"{log_prefix()}{mycolors.FAIL}Error while parsing JSON") from e

    try:
        fromA_name = f"./history/a4conf_{mytime.now_second_pretty()}.json"

        # print(F"{log_prefix()}fromA ->\n{common.dumpjsonpretty(fromA)}", flush = True)

        with open(fromA_name, 'w') as file_object:
            file_object.write(common.dumpjsonpretty(fromA))

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

            kepware_conf(services)
            back_channel_conf(services)    

        any_news_from_external = False
        # all code that must be run to send data to a4conf B
        if not onlyinternal:
            fromA = not_only_internal_conf(fromA)
            any_news_from_external = sendtoBmqtt(fromA)
        else:
            print(f"{log_prefix()}{mycolors.WARNING}Configuration is just for PC A, ignoring code to create and send configuration to PC B", flush = True)
        
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
                    if toProduction:
                        pca.set_to_production()

                # apply newer hostname
                if "hostname" in system:
                    if "industrial" in system["hostname"]:
                        hostname = system["hostname"]["industrial"]
                        pca.set_hostname(hostname)

                if "network" in system:
                    # UPDATE IP A
                    if "industrial" in system["network"]:
                        if "routes" in system["network"]["industrial"]:
                            routes = system["network"]["industrial"]["routes"]
                            pca.update_static_routes(routes)
                        if "dhcp" in system["network"]["industrial"]:
                        
                            dhcp = system["network"]["industrial"]["dhcp"]

                            if dhcp:
                                pca.set_pcA_network(dhcp = True)
                            else:
                                if "ip" in system["network"]["industrial"]:
                                    ips_A = system["network"]["industrial"]["ip"]
                                    ips_A[:] = (ip for ip in ips_A if pca.check_ip(ip))

                                    pca.set_pcA_network(ips = ips_A)
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception (type = {type(e)}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise Exception from e

def kepware_conf(services: dict):

    if "kepware" in services:

        #if "reload" in services["kepware"]:
            #reload = services["kepware"]["reload"]
            #if reload: pca.reloadKepware()
            
        if "trial" in services["kepware"]:
            pca.set_kepware_trial(services["kepware"]["trial"])
    
def back_channel_conf(services: dict):

    if "backchannel" in services:
        if "topics" in services["backchannel"]:
            topics = list(set(services["backchannel"]["topics"]))
            pca.set_backchannel_topics_to_db(topics)
        if "files" in services["backchannel"]:
            files = list(set(services["backchannel"]["files"]))
            pca.set_backchannel_files_to_db(files)

def thingworx_template_conf(fromA: dict):

    print(f"{log_prefix()}Handling Thingworx template", flush = True)

    # start SEND THINGWORX AGENT CONFIGURATION
    iotgws_twa = list()
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
    if len(iotgws_twa) <= 0:
        print(f"{log_prefix()}{mycolors.WARNING}No IoT gw selected for Sentinel tags", flush = True)
    else:

        print(f"{log_prefix()}{mycolors.INFO}No IoT gw selected for Sentinel tags are {', '.join(iotgws_twa)}", flush = True)
        proto = "http" # "mqtt" || "http"

        try:

            iotgw_avaiable = kepware.get_iotgws_http_client_name()
            #   print( "iotgw_avaiable are", common.dumpjsonpretty(iotgw_avaiable))
            for iotgw in iotgws_twa:
                #print("going to check if" , iotgw, "is defined in kepware")
                if iotgw in iotgw_avaiable:
                    #print(iotgw, "is defined in kepware! Doing stuff")
                    vars = kepware.iot_gw_to_template_twa(iotgw, proto)
                    text = common.dumpjsonnospaces(vars)

                    if METHODAB == "mqtt":
                        topic_temp = MQTT_TOPIC_TW_TEMPLATE[0] + "create" + MQTT_TOPIC_TW_TEMPLATE[1] + iotgw + ".json"
                        if len(topic_temp) > TOPIC_ACROSS_DATA_DIODE_MAX_LENGTH:
                            print(f"{log_prefix()}{mycolors.FAIL}Topic '{topic_temp}' is too long. MQTT msg for IoT gw '{iotgw}' template won't pass into data diode ", flush = True)
                        
                        send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = topic_temp, mqtt_msg = " ", mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)  # you can write everything you want here, create message is used to empty/touch the file
                        time.sleep(SLEEP_TIME_BETWEEN_MQTT_TOPIC)

                        topic_temp = MQTT_TOPIC_TW_TEMPLATE[0] + "append" + MQTT_TOPIC_TW_TEMPLATE[1] + iotgw + ".json"
                        if len(topic_temp) > TOPIC_ACROSS_DATA_DIODE_MAX_LENGTH:
                            print(f"{log_prefix()}{mycolors.FAIL}Topic '{topic_temp}' is too long. MQTT msg for IoT gw '{iotgw}' template won't pass into data diode ", flush = True)

                        for i in range(0, len(text), MQTT_BYTE_LIMIT_PER_MESSAGE):
                            send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = topic_temp, mqtt_msg = text[i:MQTT_BYTE_LIMIT_PER_MESSAGE+i], mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)
                            #mqtt_client.publish( topic_temp , text[i:MQTT_BYTE_LIMIT_PER_MESSAGE+i])
                            time.sleep(SLEEP_TIME_BETWEEN_MQTT_TOPIC)
                    else:
                        # invio dei template via http
                            
                        # invio del contenuto del file del template
                        res = requests.post(f"http://127.0.0.1:{HTTP_PORT_TO_B_SIDE}{HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_TWA}{iotgw}.json", json = vars, headers = {"content-type" : "application/json"}, timeout = 3)
                        if res.ok:
                            print(f"{log_prefix()}{mycolors.SUCCESS}Request to path '{HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_TWA}{iotgw}.json' on port {HTTP_PORT_TO_B_SIDE} has been sent ", flush = True)
                            time.sleep(SLEEP_TIME_BETWEEN_HTTP_REQUESTS)
                        else:
                            print(f"{log_prefix()}{mycolors.FAIL}Request to path '{HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_TWA}{iotgw}.json' on port {HTTP_PORT_TO_B_SIDE} has NOT been sent ", flush = True)

                else:
                    print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{iotgw}' is not available", flush = True)

        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
            raise

    # end SEND THINGWORX AGENT CONFIGURATION

def opcua_template_conf(fromA: dict):

    print(f"{log_prefix()}Handling OPCUA server template", flush = True)

    # start SEND OPCUA Server CONFIGURATION
    from_opcua = list() 
    to_opcua = list()
    if "services" in fromA:
        if "opcua" in fromA["services"]:
            if "iotgw" in fromA["services"]["opcua"]:
                iotgws_opcua = fromA["services"]["opcua"]["iotgw"]
                if 'from' in iotgws_opcua:
                    from_opcua = iotgws_opcua['from']
                if 'to' in iotgws_opcua:
                    to_opcua = iotgws_opcua['to']
                

    if len(from_opcua) <= 0:
        print(f"{log_prefix()}{mycolors.WARNING}No IoT gw selected for readable OPC Server tags", flush = True)
    else:

        print(f"{log_prefix()}{mycolors.INFO}No IoT gw selected for OPCUA server readable tags are {', '.join(from_opcua)}", flush = True)
        proto = "http" # "mqtt" || "http"

        try:

            iotgw_avaiable = kepware.get_iotgws_http_client_name()
            # print( "iotgw_avaiable are", common.dumpjsonpretty(iotgw_avaiable))
            for iotgw in from_opcua:
                #print("going to check if" , iotgw, "is defined in kepware")
                if iotgw in iotgw_avaiable:
                    # print(iotgw, " is defined in kepware! Doing stuff")
                    vars = kepware.iot_gw_to_template_opcua(iotgw, proto)
                    text = common.dumpjsonnospaces(vars)

                    if METHODAB == "mqtt":
                        topic_temp = MQTT_TOPIC_OPC_FROM_TEMPLATE[0] + "create" + MQTT_TOPIC_OPC_FROM_TEMPLATE[1] + iotgw + ".json"
                        if len(topic_temp) > TOPIC_ACROSS_DATA_DIODE_MAX_LENGTH:
                            print(f"{log_prefix()}{mycolors.FAIL}Topic '{topic_temp}' is too long. MQTT msg for IoT gw '{iotgw}' template won't pass into data diode ", flush = True)

                        send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = topic_temp, mqtt_msg = " ", mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)  # you can write everything you want here, create message is used to empty/touch the file
                        #mqtt_client.publish( topic_temp , " ") 
                        time.sleep( SLEEP_TIME_BETWEEN_MQTT_TOPIC )
                        
                        topic_temp = MQTT_TOPIC_OPC_FROM_TEMPLATE[0] + "append" + MQTT_TOPIC_OPC_FROM_TEMPLATE[1] + iotgw + ".json"
                        if len(topic_temp) > TOPIC_ACROSS_DATA_DIODE_MAX_LENGTH:
                            print(f"{log_prefix()}{mycolors.FAIL}Topic '{topic_temp}' is too long. MQTT msg for IoT gw '{iotgw}' template won't pass into data diode ", flush = True)

                        for i in range(0, len(text), MQTT_BYTE_LIMIT_PER_MESSAGE):
                            send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = topic_temp, mqtt_msg = text[i:MQTT_BYTE_LIMIT_PER_MESSAGE+i], mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)
                            #mqtt_client.publish( topic_temp , text[i:MQTT_BYTE_LIMIT_PER_MESSAGE+i])
                            time.sleep( SLEEP_TIME_BETWEEN_MQTT_TOPIC )
                    else:
                        # invio per la creazione del file del template per i tag in scrittura
                        res = requests.post(f"http://127.0.0.1:{HTTP_PORT_TO_B_SIDE}{HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_OPCUA_FROM}{iotgw}.json", json = vars, headers = {"content-type" : "application/json"}, timeout = 3)
                        if res.ok:
                            print(f"{log_prefix()}{mycolors.SUCCESS}Request to path '{HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_OPCUA_FROM}{iotgw}.json' on port {HTTP_PORT_TO_B_SIDE} has been sent ", flush = True)
                            time.sleep(SLEEP_TIME_BETWEEN_HTTP_REQUESTS)
                        else:
                            print(f"{log_prefix()}{mycolors.FAIL}Request to path '{HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_OPCUA_FROM}{iotgw}.json' on port {HTTP_PORT_TO_B_SIDE} has NOT been sent ", flush = True)

                else:
                    print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{iotgw}' is not available", flush = True)

        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
            raise

    if len(to_opcua) <= 0:
        print(f"{log_prefix()}{mycolors.WARNING}No IoT gw selected for writable OPC Server tags", flush = True)
    else:

        print(f"{log_prefix()}{mycolors.INFO}No IoT gw selected for OPCUA server readable and writable tags are {', '.join(from_opcua)}", flush = True)
        proto = "http_server" # "mqtt" || "http"

        try:

            iotgw_avaiable = kepware.get_iotgws_http_server_name()
            # print("iotgw_avaiable are ", common.dumpjsonpretty(iotgw_avaiable))
            for iotgw in to_opcua:
                # print("going to check if ", iotgw, " is defined in kepware")
                if iotgw in iotgw_avaiable:
                    # print(iotgw, " is defined in kepware! Doing stuff")
                    vars = kepware.iot_gw_to_template_opcua(iotgw, proto)
                    text = common.dumpjsonnospaces(vars)

                    if METHODAB == "mqtt":
                        topic_temp = MQTT_TOPIC_OPC_TO_TEMPLATE[0] + "create" + MQTT_TOPIC_OPC_TO_TEMPLATE[1] + iotgw + ".json"
                        if len(topic_temp) > TOPIC_ACROSS_DATA_DIODE_MAX_LENGTH:
                            print(f"{log_prefix()}{mycolors.FAIL}Topic '{topic_temp}' is too long. MQTT msg for IoT gw '{iotgw}' template won't pass into data diode ", flush = True)

                        send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = topic_temp, mqtt_msg = " ", mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)  # you can write everything you want here, create message is used to empty/touch the file
                        time.sleep(SLEEP_TIME_BETWEEN_MQTT_TOPIC)

                        topic_temp = MQTT_TOPIC_OPC_TO_TEMPLATE[0] + "append" + MQTT_TOPIC_OPC_TO_TEMPLATE[1] + iotgw + ".json"
                        if len(topic_temp) > TOPIC_ACROSS_DATA_DIODE_MAX_LENGTH:
                            print(f"{log_prefix()}{mycolors.FAIL}Topic '{topic_temp}' is too long. MQTT msg for IoT gw '{iotgw}' template won't pass into data diode ", flush = True)

                        for i in range(0, len(text), MQTT_BYTE_LIMIT_PER_MESSAGE):
                            send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = topic_temp, mqtt_msg = text[i:MQTT_BYTE_LIMIT_PER_MESSAGE+i], mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)
                            time.sleep(SLEEP_TIME_BETWEEN_MQTT_TOPIC)
                    else:
                        # invio per la creazione del file del template per i tag in lettura e scrittura
                        res = requests.post(f"http://127.0.0.1:{HTTP_PORT_TO_B_SIDE}{HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_OPCUA_TO}{iotgw}.json", json = vars, headers = {"content-type" : "application/json"}, timeout = 3)
                        if res.ok:
                            print(f"{log_prefix()}{mycolors.SUCCESS}Request to path '{HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_OPCUA_TO}{iotgw}.json' on port {HTTP_PORT_TO_B_SIDE} has been sent ", flush = True)
                            time.sleep(0.5)
                        else:
                            print(f"{log_prefix()}{mycolors.FAIL}Request to path '{HTTP_PATH_TO_B_SIDE_SEND_TEMPLATE_OPCUA_TO}{iotgw}.json' on port {HTTP_PORT_TO_B_SIDE} has NOT been sent ", flush = True)

                else:
                    print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{iotgw}' is not available", flush = True)

        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
            raise
    # end SEND OPCUA Server CONFIGURATION

def not_only_internal_conf(fromA: dict):

    if isBready():
        thingworx_template_conf(fromA)
        opcua_template_conf(fromA)
    else:
        print(f"{log_prefix()}{mycolors.FAIL}B side is not ready. Skip sending templates fro Thingworx and OPCUA server", flush = True)

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
    routes_to_B = dict()

    if "system" in fromA:
        if "network" in fromA["system"]:
            if "industrial" in fromA["system"]["network"]:
                network_industrial = fromA["system"]["network"]["industrial"]
                if "routes" in network_industrial:
                    routes = network_industrial["routes"]
                    # pca.update_static_routes(routes) # do not apply here. At this point, we don't know if routes are going on the other side
                    # _old_ routes_to_B += routes.keys()
                    for route in routes:
                        routes_to_B[route] = IP_ROUTER_PC_A
                    need_send_routes_to_B = True
                else:
                    for route in pca.get_static_routes():
                        routes_to_B[route] = IP_ROUTER_PC_A

                if "ip" in network_industrial:
                    for route in pca.ips_to_nets_cidr(network_industrial["ip"]):
                        routes_to_B[route] = IP_ROUTER_PC_A
                    need_send_routes_to_B = True

                if "dhcp" in network_industrial:
                    need_send_routes_to_B = True

    # se si devono inviare nuove rotte statiche a B, aggiornare il fromA che verrà inviato
    if need_send_routes_to_B:
        print(f"{log_prefix()}Following routes are going to External pc\n{routes_to_B}", flush = True)

        if "system" not in fromA:
            fromA["system"] = dict()
        if "network" not in fromA["system"]:
            fromA["system"]["network"] = dict()
        if "customer" not in fromA["system"]["network"]:
            fromA["system"]["network"]["customer"] = dict()

        fromA["system"]["network"]["customer"]["routes"] = routes_to_B
    #### STATIC ROUTES FOR EXTERNAL PC

    # save if mqtt has received a response
    # if METHODAB == "mqtt":
    
    return fromA

def sendtoBmqtt(payload):
    """
    this function takes a dictionary as input, transforms it to text with and object in JSON format 
    and tries to send via mqtt to a4conf B.
    In order to understand if message reached a4conf B, this function adds to the message a property namd "id".\n
    If the same id is sent back in the next 15 seconds, this function returns True as a4conf B acknowleged the message.\n
    If the id is not received back in 15 seconds, this function returns a False, a4conf B may not be running properly or pc B may be offline...
    """

    payload["id"] = str(mytime.unix_now())
    
    try:
        #payload_str = common.dumpjsonnospaces(payload)
        payload_str = json.dumps(payload)

        if METHODAB == "mqtt":
            time.sleep(SLEEP_TIME_BETWEEN_MQTT_TOPIC)
            send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = MQTT_TOPIC_CONF_SET, mqtt_msg = payload_str, mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)
            counter = 15
            while counter > 0:
                counter -= 1
                if str(payload["id"]) in set_history:
                    print(f"{log_prefix()}{mycolors.SUCCESS}function sendtoBmqtt did find the needed 'id' in time", flush = True)
                    return True
                time.sleep(1)
            print(f"{log_prefix()}{mycolors.FAIL}function sendtoBmqtt did NOT find the needed 'id' in time", flush = True)
            return False
        
        else:
            print(f"{log_prefix()}{mycolors.INFO}Trying to send configuration to B side", flush = True)
            res = requests.post(f"http://127.0.0.1:{HTTP_PORT_TO_B_SIDE}{HTTP_PATH_TO_B_SIDE_SET}", data = payload_str, headers = {"content-type" : "application/json"}, timeout = 3)
            if 200 <= res.status_code < 300:
                print(f"{log_prefix()}{mycolors.INFO}Message to TF sw on port {HTTP_PORT_TO_B_SIDE} to path '{HTTP_PATH_TO_B_SIDE_SET}' has been sent")
                counter = 15
                while counter > 0:
                    counter -= 1
                    if str(payload["id"]) in set_history:
                        print(f"{log_prefix()}function sendtoBmqtt did find the needed \"id\" in time, returning True", flush = True)
                        return True
                    time.sleep(1)
                print(f"{log_prefix()}{mycolors.FAIL}function sendtoBmqtt did NOT find the needed \"id\" in time, returning False", flush = True)
                return False
            else:
                print(f"{log_prefix()}{mycolors.FAIL}Message to TF sw on port {HTTP_PORT_TO_B_SIDE} to path '{HTTP_PATH_TO_B_SIDE_SET}' has NOT been sent")
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

    # check esistenza vecchio file di configurazione nella cartella. se esiste, lo elimino
    if os.path.exists(FROMB):
        print(f"{log_prefix()}{mycolors.WARNING} old file '{FROMB}' detected. Deleting it ")
        os.remove(FROMB)

    # LA "GET" della configurazione di B è mantenuta via MQTT 
    send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = MQTT_TOPIC_CONF_GET, mqtt_msg = "confB", mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)

    data = "{}"
    counter = 0

    while not os.path.exists(FROMB) and counter < WAITING_B_CONF_TIME:
        time.sleep(1)
        counter += 1

    if os.path.exists(FROMB):
        try:
            with fromB_lock:
                # if necessary, give bchnld some time to complete creation of file.
                time.sleep(1)
                with open(FROMB, 'r') as file:
                    data = file.read()
                    
                print(f"{log_prefix()}FROMB ->", flush = True)
                print(f"{log_prefix()}{data}")
                
                os.remove(FROMB)
        
        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception (type = {type(e)}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)

    else:
        print(f"{log_prefix()}{mycolors.FAIL}FIle '{FROMB}' does not exists")
    
    return data

def askforKeepalive():
    """
    this function sends a message to a4conf B to request keepalive.

    If a4conf B receives the message, will start sending
    back MQTT messages with "keepalive" information.
    The messages from a4conf B will arrive for a limited time, in order not to clog up backchannel
    """
    try:
        print(f"{log_prefix()}Asking a4conf B to send keepalive messages", flush = True)
        send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = MQTT_TOPIC_KEEPALIVE_REQUEST, mqtt_msg = "keepalive", mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception (type = {type(e)}) at line {sys.exc_info()[-1].tb_lineno} -> {e}", flush = True)

def isBready():
    """
    returns True if a keepalive has been received from a4confB in last 60 seconds
        if last keepalive is older than 30 seconds, a request is sent to a4confB
        to restart sending keepalive messages.
        before returning a False, this script first waits for
    """
    diff = mytime.unix_now() - last_keepalive

    if diff > 30:
        askforKeepalive()

    result = diff < 60

    if result:
        return result

    for _ in range(2):
        time.sleep(1)
        result = ( mytime.unix_now() - last_keepalive ) < 60
        if result:
            return result

    return result

def backupConf():
    """
        creates a backup of pc A configuration and sends it in JSON format via MQTT
    """
    print(f"{log_prefix()}Sending backup of running configuration", flush = True)
    conf = pca.get_conf()
    send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = MQTT_TOPIC_CONF_BACKUP, mqtt_msg = common.dumpjsonnospaces(conf), mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)

def send_mqtt_msg(mqtt_client: helper_mqtt.helper_mqtt or None, mqtt_topic: str, mqtt_msg: str, mqtt_broker: str = "127.0.0.1", mqtt_port: int = 7883, mqtt_qos: int = 2):
    """
    Invio dei messaggi MQTT con client Python.
    Se il client non è inizializzato oppure non pubblica correttamente il messaggio
    viene invocata la funzione per inviare il messaggio con i mosquitto clients
    """

    assert 0 <= mqtt_qos <= 2, "Insert valid QOS(from 0 to 2)"
    assert 1 <= mqtt_port <= 65535, "Insert valid port(from 1 to 65535)"

    try:

        if mqtt_client == None or mqtt_client.publish(mqtt_topic, mqtt_msg) != 0:
            send_mqtt_msg_with_mosquitto_client(mqtt_topic, mqtt_msg, mqtt_broker, mqtt_port, mqtt_qos)

    except Exception as e:
        print( f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e}", flush = True)

def send_mqtt_msg_with_mosquitto_client(mqtt_topic: str, mqtt_msg: str, mqtt_broker: str = "127.0.0.1", mqtt_port: int = 7883, mqtt_qos: int = 2):
    """ Invio messaggio MQTT utilizzando i mosquitto clients """
    
    try:
        if os.popen("dpkg -s mosquitto-clients | head -n 2 | tail -n 1 | awk '{print $4}'").read().strip() == "installed":
            
            res = os.popen(f"mosquitto_pub -h {mqtt_broker} -p {mqtt_port} -t '{mqtt_topic}' -q {mqtt_qos} -m '{mqtt_msg}' ").read().strip()

            print(f"{helper_mqtt.log_prefix()}Messagge sent to topic '{mqtt_topic}' with os library", flush = True) if res == "" else print(f"{helper_mqtt.log_prefix()}{mycolors.FAIL}Fail to send message to topic '{mqtt_topic}' with os library. Error is '{res}' ", flush = True)
        
        else:
            print(f"{helper_mqtt.log_prefix()}{mycolors.FAIL}mosquitto-clients are not installed. Fail to send message to topic '{mqtt_topic}' with os library ", flush = True)
    
    except Exception as e:
        print( f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} ", flush = True)

def mqtt_on_message_handler(topic, message):
    """
        handles messages reveiced on different topics via mqtt
        defined here so that mqtt library can be generic and used in other places
    """
    try:
        global monitor_logs_table

        if topic == MQTT_TOPIC_CONF_KEEPALIVE_FROM_B:
            global last_keepalive
            last_keepalive = mytime.unix_now() if message == "true" else 0
        
        elif topic == MQTT_TOPIC_CONF_SET_FROM_B:
            set_history.append(message)

        elif topic == MQTT_TOPIC_HWSW_LOCAL:

                message = json.loads(message)
                if "a4GATE.U2U.RT" in message.keys():
                    value = message["a4GATE.U2U.RT"]
                    global bidir_rt
                    bidir_rt = value

                elif "a4GATE.U2U.BIDIR" in message.keys():
                    value = bool(message["a4GATE.U2U.BIDIR"])
                    global bidir_enabled
                    bidir_enabled = value
        
        elif topic == MQTT_TOPIC_MONITOR_ISWORKING:
            global monitor_logs_isWorking
            monitor_logs_isWorking = message
            #(all(json.loads(monitor_logs_isWorking).values()))
            if all(json.loads(monitor_logs_isWorking).values()):
                monitor_logs_table = ""

        elif topic == MQTT_TOPIC_MONITOR_TABLE:
            monitor_logs_table = message
            
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)

def send_neighbours_to_cloud():
    neighbours = pca.network_scan()
    if neighbours != None:
        send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = MQTT_TOPIC_UPDATER_A, mqtt_msg = common.dumpjsonnospaces(neighbours), mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)
    else:
        print(f'{pca.log_prefix()}{mycolors.FAIL}NETWORK SCAN -> result NOT sent to cloud" {mycolors.ENDC}', flush = True)

def send_a4updater_to_cloud():
    a4updater_version = pca.get_last_a4updater()
    if a4updater_version != None:
        send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = MQTT_TOPIC_UPDATER_A, mqtt_msg = a4updater_version, mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)
    else:
        print(f'{pca.log_prefix()}{mycolors.FAIL}Get A4Updater release -> result NOT sent to cloud" {mycolors.ENDC}', flush = True)

def send_machine_connected_to_cloud():
    machine_connected = common.dumpjsonnospaces(kepware.machine_connected())
    send_mqtt_msg(mqtt_client = mqtt_client, mqtt_topic = MQTT_TOPIC_MACHINE_CONNECTED, mqtt_msg = machine_connected, mqtt_broker = MQTT_BROKER_IP, mqtt_port = MQTT_BROKER_PORT, mqtt_qos = MQTT_QOS)

if __name__ == "__main__":
    from sys import argv

    try:
        if len(argv) == 2:
            http_server_port = int(argv[1])

        if os.path.isfile(pca.to_localhost_file):
            http_server_ip = "127.0.0.1"

        http_server = http_help.SimpleHttpServer(ip = http_server_ip,
                                                port = http_server_port,
                                                handler = S,
                                                ssl_on = False)

        print(f"{http_help.log_prefix()}Starting http server", flush = True)

        http_server.start()

        mqtt_client = helper_mqtt.helper_mqtt( client_id = MQTT_CLIENT_ID,
                    broker = MQTT_BROKER_IP,
                    port = MQTT_BROKER_PORT,
                    client_reconnect_delay = MQTT_CLIENT_RECONNECT_DELAY,
                    broker_connection_timeout = MQTT_BROKER_CONNECTION_TIMEOUT,
                    broker_keepalive = MQTT_BROKER_KEEPALIVE,
                    on_message_handler = mqtt_on_message_handler,
                    topics = MQTT_TOPICS_SUBSCRIBE)

        askforKeepalive()

        pca.limit_antivirus_filesystem_access()

        success = pca.set_static_route()

        print(f"{pca.log_prefix()}Tried to apply static routes. Result -> {success}", flush = True)

        init_script = os.path.join(SCRIPT_DIRECTORY, "init.sh")
        if os.path.exists(init_script):
            # immedtatly run init script
            os.system( init_script + " &" )
            # run init script after 3 minutes
            os.system( "( sleep 180; " + init_script + " ) &" )
            # run init script after other 5 minutes
            os.system( "( sleep 480; " + init_script + " ) &" )
        else:
            print(f"{log_prefix()}{mycolors.WARNING}Script '{init_script}' does NOT exists. Skip sending topic to TF sw ", flush = True)
        
        now = mytime.now()
        in60seconds = now + datetime.timedelta(seconds = 60)
        in15minutes = now + datetime.timedelta(minutes = 15)
        in30minutes = now + datetime.timedelta( minutes = 30 )
        # in45minutes = now + datetime.timedelta( minutes = 45 )

        sched = BackgroundScheduler(daemon = True,  timezone = utc)
        sched.add_job(func = backupConf, trigger = 'interval', seconds = SECONDS_BETWEEN_BACKUP , next_run_time = in30minutes)
        sched.add_job(func = send_a4updater_to_cloud, trigger = 'interval', seconds = SECONDS_BETWEEN_BACKUP , next_run_time = in15minutes)
        sched.add_job(func = send_machine_connected_to_cloud, trigger = 'interval', seconds = 60, next_run_time = in60seconds)
        sched.add_job(func = send_neighbours_to_cloud, trigger = 'interval', days = 1, next_run_time = in15minutes )
        
        #send_neighbours_to_cloud()
        
        sched.start()

        confB()

        # nothing better?!
        while True:
            time.sleep(65521)

    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
