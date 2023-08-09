#!/usr/bin/python3 -u

from urllib.parse import quote
from base64 import b64encode
import http.client
# import threading
import requests
#import pathlib
import typing
import shutil
import random
import json
import math
import time
import sys
import re
import os

import helper_pca
import mycolors
import mytime
import common

SCRIPT_DIRECTORY = os.path.dirname(os.path.realpath(__file__))

NET_EXE = "/mnt/c/Windows/System32/net.exe"

KEPWARE_API_PATH_GET_PROJECT_UPLOAD = "/config/v1/project/services/ProjectLoad"
KEPWARE_API_PATH_BACKUP_PROJECT = "/config/v1/project/services/ProjectSave"
KEPWARE_API_PATH_MQTT_CLIENTS = "/config/v1/project/_iot_gateway/mqtt_clients/"
KEPWARE_API_PATH_HTTP_CLIENTS = "/config/v1/project/_iot_gateway/rest_clients/"
KEPWARE_API_PATH_HTTP_SERVERS = "/config/v1/project/_iot_gateway/rest_servers/"
KEPWARE_API_PATH_CHANNELS = "/config/v1/project/channels/"
KEPWARE_API_PATH_ALIASES = "/config/v1/project/aliases/"
KEPWARE_API_PATH_DEVICES = "/devices/"
KEPWARE_API_PATH_IOT_ITEMS = "/iot_items"
PATH_TAGGROUPS = "/tag_groups/"
PATH_TAGS = "/tags/"

CONF_FILE = f"{SCRIPT_DIRECTORY}/conf.json"
KEPWARE_API_USERNAME = "administrator"
KEPWARE_API_PASSWORD = ""
KEPWARE_API_PORT = 57412

KEPWARE_BACKUP_FOLDER = "/mnt/c/ProgramData/Kepware/KEPServerEX/V6/backups/"
LOCAL_UPLOADS_FOLDER = "/usr/local/a4gate/conf/kepware/uploads"
LOCAL_BACKUPS_FOLDER = "/usr/local/a4gate/conf/kepware/backups"

#pathlib.Path(LOCAL_UPLOADS_FOLDER).mkdir(parents = True, exist_ok = True)
#pathlib.Path(LOCAL_BACKUPS_FOLDER).mkdir(parents = True, exist_ok = True)

os.makedirs(LOCAL_UPLOADS_FOLDER, exist_ok = True)
os.makedirs(LOCAL_BACKUPS_FOLDER, exist_ok = True)

PREFIX_IOTGW_MQTT = "MQTT_"  # per tutti i channel MQTT, non solo per TWA8
PREFIX_IOTGW_HTTP = "HTTP_" # per tutti i channel HTTP
PREFIX_IOTGW_OPCUA_FROM = "OPCUA_FROM_"   # prefisso per la creazione di iotgw per inviare dati sul server opcua
PREFIX_IOTGW_OPCUA_TO = "OPCUA_TO_"   # prefisso per la creazione di iotgw per ricevere dati dal server opcua
PREFIX_IOTGW_TWX = "TWX_"   # prefisso per la creazione di iotgw per inviare dati su Sentinel
PREFIX_IOTGW_FASTDATA = "FD_"   # prefisso per la creazione di iotgw per inviare i dati veloci su Blob

TW_HTTP_PORT = 8001

def log_prefix():
    return f"{mycolors.ENDC}{mytime.log()}{mycolors.LightMagenta}KEPWARE -> "

#TRY TO LOAD CONFIGURATIONS FROM JSON. IF ANY ERROR, DEFAULT VALUES ARE USED
try:

    with open(CONF_FILE, "r") as conf_text:
        conf = json.loads(conf_text.read())
        if "kepware" in conf:
            if "api" in conf["kepware"]:
                if "username" in conf["kepware"]["api"]:
                    KEPWARE_API_USERNAME = conf["kepware"]["api"]["username"]
                if "password" in conf["kepware"]["api"]:
                    KEPWARE_API_PASSWORD = conf["kepware"]["api"]["password"]
                if "port" in conf["kepware"]["api"]:
                    KEPWARE_API_PORT = conf["kepware"]["api"]["port"]

except Exception as e:
    print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} while trying to open file {CONF_FILE} and parse configurations. Using default configurations -> {e} {mycolors.ENDC}", flush = True)

kepware_api_authstring = b64encode( ( KEPWARE_API_USERNAME  + ":" + KEPWARE_API_PASSWORD ).encode('utf-8') ).decode("ascii")
kepware_headers = {"Accept":"application/json", "Authorization": f"Basic {kepware_api_authstring}"}

boolean_const = "BOOLEAN"
string_const = "STRING"
number_const = "NUMBER"
tw_types = [boolean_const, string_const, number_const]

data_types = {  "-1":string_const,
                "0":string_const,
                "1":boolean_const,
                "2":string_const,
                "3":number_const,
                "4":number_const,
                "5":number_const,
                "6":number_const,
                "7":number_const,
                "8":number_const,
                "9":number_const,
                "10":number_const,
                "11":number_const,
                "12":string_const,
                "13":number_const,
                "14":number_const,
                "20":string_const,
                "21":string_const,
                "22":string_const,
                "23":string_const,
                "24":string_const,
                "25":string_const,
                "26":string_const,
                "27":string_const,
                "28":string_const,
                "29":string_const,
                "30":string_const,
                "31":string_const,
                "32":string_const,
                "33":string_const,
                "34":string_const}

## TYPE ASSOCIATION
data_types_opcua = {
    "-1": "String",
    "0" : "String",
    "1" : "Boolean",
    "2" : "Char",
    "3" : "Byte",
    "4" : "Short",
    "5" : "Word",
    "6" : "Long",
    "7" : "DWord",
    "8" : "Float",
    "9" : "Double",
    "10" : "BDC",
    "11" : "LBCD",
    "12" : "Date",
    "13" : "LLong",
    "14" : "QWord",
    "20" : "String_Array",
    "21" : "Boolean_Array",
    "22" : "Char_Array",
    "23" : "Byte_Array",
    "24" : "Short_Array",
    "25" : "Word_Array",
    "26" : "Long_Array",
    "27" : "DWord_Array",
    "28" : "Float_Array",
    "29" : "Double_Array",
    "30" : "BCD_Array",
    "31" : "LBCD_Array",
    "32" : "Date_Array",
    "33" : "LLong_Array",
    "34" : "QWord_Array"
} 

def simple_http_request(body = None, headers = {}, path = "", port = 80, ip = "127.0.0.1", timeout = 10, method = "GET"):
    """
    general purpose function to execute http requests
    """
    conn = http.client.HTTPConnection( ip, port, timeout )
    try:
        if body is not None :
            method = "POST"

        path = path.replace(" ", "%20")

        conn.request(method, path, body, headers)
        
        response = conn.getresponse()
        rc_status = response.status

        if rc_status < 200 or rc_status >= 400:
            return "{}"
        else:
            responde_body = response.read()
        
        return responde_body
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        #print(e, file=sys.stderr)
        raise e
    finally:
        conn.close()

def get_channels():
    """
    returns list of strings containing names of kepware channels
    """
    
    try:
        #text = simple_http_request(headers = kepware_headers, path = KEPWARE_API_PATH_CHANNELS, port = KEPWARE_API_PORT)
        #to_obj = json.loads(text)

        to_obj = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_CHANNELS}", headers = kepware_headers, timeout = 5).json()
        
        return [channel["common.ALLTYPES_NAME"] for channel in to_obj]
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e

def get_devices(channel):
    """
    given a channel name, returns list of strings containing the names of the devices contained in the channel
    """

    try:
        #path = KEPWARE_API_PATH_CHANNELS + quote(channel, safe = "") + KEPWARE_API_PATH_DEVICES
        #text = simple_http_request(headers = kepware_headers, path = path, port = KEPWARE_API_PORT)
        #to_obj = json.loads(text)
        
        to_obj = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_CHANNELS}{quote(channel, safe = '')}{KEPWARE_API_PATH_DEVICES}", headers = kepware_headers, timeout = 5).json()

        return [device["common.ALLTYPES_NAME"] for device in to_obj]
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        #print(e, file=sys.stderr)
        raise e

def get_all_devices():
    """
    returns an object where channel names are keys and values are lists of device names 
    """

    try:
        result = dict()

        channels = get_channels()

        for channel in channels:
            devices = get_devices(channel)

            result[channel] = devices

        return result

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e

def get_tag_groups(channel, device, tag_groups = []):
    """
    given a channel, a device and a list of tag groups, returns the tag groups present in the location specified
    by the input parameter
    """

    try:
        path = KEPWARE_API_PATH_CHANNELS + quote(channel, safe = "") + KEPWARE_API_PATH_DEVICES + quote(device, safe = "") + PATH_TAGGROUPS
        for tag_group in tag_groups:
            path += quote(tag_group, safe = "") + PATH_TAGGROUPS
        
        #text = simple_http_request(headers= kepware_headers, path = path, port = KEPWARE_API_PORT)
        #to_obj = json.loads(text)

        to_obj = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{path}", headers = kepware_headers, timeout = 5).json()

        return [taggroup["common.ALLTYPES_NAME"] for taggroup in to_obj]
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e

def get_tags(channel, device, tag_groups = []):
    """
    given a channel, a device and a list of tag groups, returns the tags present in the location specified
    by the input parameter
    """

    try:
        path = KEPWARE_API_PATH_CHANNELS + quote(channel, safe = "") + KEPWARE_API_PATH_DEVICES + quote(device, safe = "")
        for tag_group in tag_groups:
            path += PATH_TAGGROUPS + quote(tag_group, safe = "")
        path += PATH_TAGS
        
        #text = simple_http_request(headers = kepware_headers, path = path, port = KEPWARE_API_PORT)
        #to_obj = json.loads(text)

        res = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{path}", headers = kepware_headers, timeout = 5)
        to_obj = res.json()

        result = dict()
        
        if res.ok:
            for tag in to_obj:
                result[tag["common.ALLTYPES_NAME"]] = tag["servermain.TAG_DATA_TYPE"]
        
        return result
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e
    
def get_device_and_tags_tree(channel, device, tag_groups = []):
    """
    recursive function:
    given a channel, a device and a list of tag groups, returns an object containing all tags and tag groups 
    available in the location specified by the input parameter
    tag groups are stored with the property "groups"
    tags are stored with the property "tags"
    "tags" is an object. In this object the key is tha full name of the tag, the key is the data type in kepware
    """

    result = dict()
    result["groups"] = dict()
    result["tags"] = dict()

    try:
        #poopulate tag list
        result["tags"] = get_tags(channel, device, tag_groups)
        
        actual_tag_groups = get_tag_groups(channel, device, tag_groups)

        for actual_tag_group in actual_tag_groups:
            result["groups"][actual_tag_group] = get_device_and_tags_tree(channel, device, tag_groups + [actual_tag_group])
    
        return result
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        return {}
            
def get_channel_tree(channel):
    try:
        obj = dict()
        devices = get_devices(channel)

        for device in devices:
            obj[device] = get_device_and_tags_tree(channel, device)
        
        return obj
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e

def get_device_and_tags_list(device, prefix):
    result = dict()
    groups = device["groups"]
    tags = device["tags"]

    for tag in tags:
        result[prefix + "." + tag] = tags[tag]

    for group in groups:
        result.update(get_device_and_tags_list(groups[group], prefix + "." + group))    

    return result

def get_channel_list(channel):
    result = dict()
    obj = get_channel_tree(channel)
    for device in obj:
        prefix = channel + "."  + device
        result.update(get_device_and_tags_list(obj[device], prefix))
    
    return result

def get_device_list(channel, device):
    devicetree = get_device_and_tags_tree(channel, device)
    devicelist = get_device_and_tags_list(devicetree, channel + "." + device)
    return devicelist

def populate_iotgw(channelname, iotgwname, devicename = None, proto = "mqtt"):
    """ popolamento IoT gw con tutti i tag contenuti nel channel+device """

    try:
        variable_obj = dict()
        variable_obj = get_channel_list(channelname) if devicename is None else get_device_list(channelname, devicename)

        request_body = list()

        for tag_name in variable_obj:
            temp = dict()
            #temp["common.ALLTYPES_NAME"] = tag_name.replace(".", "_")
            temp["common.ALLTYPES_NAME"] = tag_name
            temp["common.ALLTYPES_DESCRIPTION"] = ""
            temp["iot_gateway.IOT_ITEM_SERVER_TAG"] = tag_name
            temp["iot_gateway.IOT_ITEM_USE_SCAN_RATE"] = True
            temp["iot_gateway.IOT_ITEM_SCAN_RATE_MS"] = 1000
            temp["iot_gateway.IOT_ITEM_SEND_EVERY_SCAN"] = True
            temp["iot_gateway.IOT_ITEM_DEADBAND_PERCENT"] = 0
            temp["iot_gateway.IOT_ITEM_ENABLED"] = True #False
            temp["iot_gateway.IOT_ITEM_DATA_TYPE"] = int(variable_obj[tag_name])

            request_body.append(temp)

        body_text = json.dumps(request_body, separators = (",", ":"))

        proto_path = KEPWARE_API_PATH_MQTT_CLIENTS if proto == "mqtt" else KEPWARE_API_PATH_HTTP_CLIENTS

        #text = simple_http_request(body = body_text,
        #                headers = kepware_headers,
        #                port = KEPWARE_API_PORT, 
        #                path = proto_path + iotgwname + KEPWARE_API_PATH_IOT_ITEMS)
        
        text = requests.post(f"http://127.0.0.1:{KEPWARE_API_PORT}{proto_path}{iotgwname}{KEPWARE_API_PATH_IOT_ITEMS}", headers = kepware_headers, timeout = 5, data = body_text).text

        return text
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e

    # EXAMPLE BELOW. PROJECT_ID FIELD MUST NOT BE CREATED
    #{
    #    "PROJECT_ID": 1820121553,
    #    "common.ALLTYPES_NAME": "Data Type Examples_16 Bit Device_R Registers_Boolean1",
    #    "common.ALLTYPES_DESCRIPTION": "",
    #    "iot_gateway.IOT_ITEM_SERVER_TAG": "Data Type Examples.16 Bit Device.R Registers.Boolean1",
    #    "iot_gateway.IOT_ITEM_USE_SCAN_RATE": true,
    #    "iot_gateway.IOT_ITEM_SCAN_RATE_MS": 1000,
    #    "iot_gateway.IOT_ITEM_SEND_EVERY_SCAN": true,
    #    "iot_gateway.IOT_ITEM_DEADBAND_PERCENT": 0,
    #    "iot_gateway.IOT_ITEM_ENABLED": true,
    #    "iot_gateway.IOT_ITEM_DATA_TYPE": 1
    #}

def get_iotgws_http_server():
    """ ottenere tutti gli iotgateway di tipo HTTP server creati all'interno di Kepware """

    iotgw_list = list()

    try:
        res = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_SERVERS}", headers = kepware_headers)
        if res.ok:
            iotgw_list = res.json()
        else:
            print(f"{log_prefix()}{mycolors.FAIL}IoT gateways retrieve has NOT been successfull. HTTP response is {res.text}", flush = True)

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) during IOT Gateways get at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        iotgw_list = list()

    return iotgw_list

def get_iotgws_http_client():
    """ ottenere tutti gli iotgateway di tipo HTTP client creati all'interno di Kepware """

    iotgw_list = list()

    try:
        res = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}", headers = kepware_headers)
        if res.ok:
            iotgw_list = res.json()
        else:
            print(f"{log_prefix()}{mycolors.FAIL}IoT gateways retrieve has NOT been successfull. HTTP response is {res.text}", flush = True)

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) during IOT Gateways get at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        iotgw_list = list()

    return iotgw_list

def get_iotgws_mqtt_client():
    """ ottenere tutti gli iotgateway di tipo MQTT client creati all'interno di Kepware """

    iotgw_list = list()

    try:
        res = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_MQTT_CLIENTS}", headers = kepware_headers)
        if 200 <= res.status_code < 300:
            iotgw_list = res.json()
        else:
            print(f"{log_prefix()}{mycolors.FAIL}IoT gateways retrieve has NOT been successfull. HTTP response is {res.text}", flush = True)

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) during IOT Gateways get at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        iotgw_list = list()

    return iotgw_list

def get_iotgws_http_client_name():
    return [iotgw.get("common.ALLTYPES_NAME") for iotgw in get_iotgws_http_client()]

def get_iotgws_mqtt_client_name():
    return [iotgw.get("common.ALLTYPES_NAME") for iotgw in get_iotgws_http_client()]

def get_iotgws_http_server_name():
    return [iotgw.get("common.ALLTYPES_NAME") for iotgw in get_iotgws_http_server()]

def get_iotgws_http_with_endpoint():
    """ ottenere un oggeto chiave valore dove le chiavi sono i nomi degli iotgw di tipo HTTP client e i valori sono i relativi endpoint su cui inviano i dati """

    res = dict()

    iotgws = get_iotgws_http_client()
    if len(iotgws) > 0:
        for iotgw in iotgws:
            try:
                iotgw_name = iotgw["common.ALLTYPES_NAME"] 
                iotgw_endpoint = iotgw["iot_gateway.REST_CLIENT_URL"]
                res[iotgw_name] = iotgw_endpoint
            except Exception as e:
                print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
    
    return res

def get_iotgws_http_client_from_status(enabled: bool):
    """ ottenere tutti gli iotgateway di tipo HTTP client abilitati/disabilitati all'interno di Kepware """

    iotgws = get_iotgws_http_client()
    
    try:
        iotgws_disabled = [iotgw["common.ALLTYPES_NAME"] for iotgw in iotgws if iotgw["iot_gateway.AGENTTYPES_ENABLED"] == enabled] if len(iotgws) > 0 else list()
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        iotgws_disabled = list()

    return iotgws_disabled

def get_iotgws_http_server_from_status(enabled: bool):
    """ ottenere tutti gli iotgateway di tipo HTTP server abilitati/disabilitati all'interno di Kepware """

    iotgws = get_iotgws_http_server()
    
    try:
        iotgws_disabled = [iotgw["common.ALLTYPES_NAME"] for iotgw in iotgws if iotgw["iot_gateway.AGENTTYPES_ENABLED"] == enabled] if len(iotgws) > 0 else list()
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        iotgws_disabled = list()

    return iotgws_disabled

def get_iotgws_http_client_from_status_with_prefix(prefix: str = "", enabled: bool = False):
    """ ottenere gli IoT gw di tipo HTTP client con un certo prefisso """

    iotgws = get_iotgws_http_client_from_status(enabled = enabled)
    return [iotgw for iotgw in iotgws if str(iotgw["common.ALLTYPES_NAME"]).startswith(prefix)]

def get_iotgws_http_server_from_status_with_prefix(prefix: str = "", enabled: bool = False):
    """ ottenere gli IoT gw di tipo HTTP server con un certo prefisso """

    iotgws = get_iotgws_http_server_from_status(enabled = enabled)
    return [iotgw for iotgw in iotgws if str(iotgw["common.ALLTYPES_NAME"]).startswith(prefix)]

def get_iotgws_http_client_for_opcua_from(enabled: bool = False):
    """ ottenere gli iot gw di tipo http server per invio i tag in sola lettura sul server opcua """
    return get_iotgws_http_client_from_status_with_prefix(prefix = PREFIX_IOTGW_OPCUA_FROM, enabled = enabled)

def get_iotgws_http_client_for_opcua_to(enabled: bool = False):
    """ ottenere gli iot gw di tipo http server per invio i tag in lettura e scrittura sul server opcua """
    return get_iotgws_http_server_from_status_with_prefix(prefix = PREFIX_IOTGW_OPCUA_TO, enabled = enabled)

def get_iotgws_http_client_for_fastdata_matrix(enabled: bool = False):
    """ ottenere gli iot gw di tipo http client per invio dei fastdata """
    return get_iotgws_http_client_from_status_with_prefix(prefix = PREFIX_IOTGW_FASTDATA, enabled = enabled)

def get_iotgw_http_client_tags(iotgw_name: str):
    """ GET dei tag contenuti in un iotgw di tipo http client """

    iotgws = get_iotgws_http_client_name()
    if len(iotgws) == 0 or not iotgw_name in iotgws:
        print(f"{log_prefix()}{mycolors.FAIL}IoT Gateway '{iotgw_name}' does not exist into Kepware. Skip getting tags into it {mycolors.ENDC}", flush = True)
        return "{}"
    else:
        res = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}{iotgw_name}{KEPWARE_API_PATH_IOT_ITEMS}", headers = kepware_headers)
        if res.ok:
            return [tag.get("iot_gateway.IOT_ITEM_SERVER_TAG") for tag in res.json()]
        else:
            print(f"{log_prefix()}{mycolors.FAIL}IoT gateway '{iotgw_name}' tags' retrieve has NOT been successfull. HTTP response is {res.text}", flush = True)
            return "{}"
        
def get_iotgw_http_server_tags(iotgw_name: str):
    """ GET dei tag contenuti in un iotgw di tipo http server """

    iotgws = get_iotgws_http_server_name()
    if len(iotgws) == 0 or not iotgw_name in iotgws:
        print(f"{log_prefix()}{mycolors.FAIL}IoT Gateway '{iotgw_name}' does not exist into Kepware. Skip getting tags into it {mycolors.ENDC}", flush = True)
        return "{}"
    else:
        res = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_SERVERS}{iotgw_name}{KEPWARE_API_PATH_IOT_ITEMS}", headers = kepware_headers)
        if res.ok:
            return [tag.get("iot_gateway.IOT_ITEM_SERVER_TAG") for tag in res.json()]
        else:
            print(f"{log_prefix()}{mycolors.FAIL}IoT gateway '{iotgw_name}' tags' retrieve has NOT been successfull. HTTP response is {res.text}", flush = True)
            return "{}"

def get_alias(alias_name: str):
    """ fare la get di un alias """

    try:
        res = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_ALIASES}{alias_name}", headers = kepware_headers)
        return res.json() if res.ok else dict()
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        return dict()
        
def get_fd_aliases():
    """ ottenere gli alias che hanno come prima cifra un numero. gli alias per i nomi delle matrici sono infatti definiti con un numero. così facendo si dovrebbero escludere tutti gli alias auto generati da Kepware """

    alias_list = list()

    try:
        res = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_ALIASES}", headers = kepware_headers)
        if res.ok:
            alias_list = [alias for alias in res.json() if str(alias['common.ALLTYPES_NAME'])[0].isdigit()]
        else:
            print(f"{log_prefix()}{mycolors.FAIL}Aliases list for FastData retrieve has NOT been successfull. HTTP response is {res.text}", flush = True)

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        alias_list = list()

    return alias_list

def get_fd_aliases_name():
    """ ottenere la lista con i nomi degli alias per i nomi delle matrici """

    return [alias["common.ALLTYPES_NAME"] for alias in get_fd_aliases()]

def get_alias_name_by_path_mapped(mapped_to_path: str):
    
    fd_aliases = get_fd_aliases()
    return [alias.get("common.ALLTYPES_NAME", "") for alias in fd_aliases if alias.get("servermain.ALIAS_MAPPED_TO") == mapped_to_path] if len(fd_aliases) > 0 else list()

def define_alias_struct(name: str, mapped_to_path: str):
    """ restituisce l'oggetto che può essere utilizzato per la creazione di un alias dentro una chiamata con le API di Kepware """

    return {
        "common.ALLTYPES_NAME": name,
        "servermain.ALIAS_MAPPED_TO": mapped_to_path,
        "common.ALLTYPES_DESCRIPTION": "",
        "servermain.ALIAS_SCAN_RATE_MILLISECONDS": 0
    }

def delete_alias(alias_name: str):
    """ eliminazione di un alias """

    res = False

    if alias_name in get_fd_aliases_name():
        try:
            res = requests.delete(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_ALIASES}{alias_name}", headers = kepware_headers)
            if res.ok:
                print(f"{log_prefix()}{mycolors.SUCCESS}Alias '{alias_name}' has been deleted", flush = True)
                res = True
            else:
                print(f"{log_prefix()}{mycolors.FAIL}Alias '{alias_name}' has NOT been deleted. HTTP response is {res.text}", flush = True)
        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) during Alias '{alias_name}' removal at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
            res = False
    else:
        print(f"{log_prefix()}{mycolors.WARNING}Alias '{alias_name}' does not exists {mycolors.ENDC}", flush = True)
        res = True

    return res

def update_alias(alias_name: str, mapped_to_path: str):
    """ update di un alias. il secondo parametro è il nuovo percorso sul quale mappare l'alias """
    
    res = False

    # verifico che l'alias esista
    if alias_name in get_fd_aliases_name():
        # provo ad eliminarlo e successivamente a ricrearlo
        if delete_alias(alias_name):
            # provo a ricrearlo passandogli il nuovo percorso sul quale deve essere mappato
            if create_aliases([{alias_name:mapped_to_path}]) != "{}":
                print(f"{log_prefix()}{mycolors.SUCCESS}Alias '{alias_name}' has been updated. {mycolors.ENDC}", flush = True)
                res = True
            else:
                print(f"{log_prefix()}{mycolors.FAIL}Alias '{alias_name}' has not been created. Skip updating it {mycolors.ENDC}", flush = True)
        else:
            print(f"{log_prefix()}{mycolors.FAIL}Alias '{alias_name}' has not been deleted. Skip updating it {mycolors.ENDC}", flush = True)
    else:
        print(f"{log_prefix()}{mycolors.FAIL}Alias '{alias_name}' does not exists. Skip updating it {mycolors.ENDC}", flush = True)

    return res

def create_aliases(alias_list: typing.List[typing.Dict]):
    """ creazione di alias. deve essere passata una lista di dizionari. per ogni dizionario la chiave deve essere il nome dell'alias che si vuole creare,
     il valore la stringa sull aquale si vuole mappare l'alias """

    try:

        aliases_to_create = [define_alias_struct(key, value) for alias in alias_list for key, value in alias.items()]
        # rimuovere i duplicati
        aliases_to_create = list({frozenset(item.items()) : item for item in aliases_to_create}.values())
        
        res = requests.post(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_ALIASES}", headers = kepware_headers, data = json.dumps(aliases_to_create))

        if res.ok:
            print(f"{log_prefix()}{mycolors.SUCCESS}{aliases_to_create} aliases have been created ", flush = True)
        else:
            print(f"{log_prefix()}{mycolors.FAIL}{aliases_to_create} aliases have NOT been created. {res.content.decode()}", flush = True)
            return "{}"
        
        return aliases_to_create

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        return "{}"

def find_common_prefix(dict_list: typing.List[typing.Dict], key: str = "common.ALLTYPES_NAME"):
    """ prefisso comune fino al "." di un valore corrispondente ad una chiave per una lista di dizionari """

    # se la lista è vuota
    if not dict_list:
        return ""

    # Dividi i nomi utilizzando il punto come separatore
    name_parts_list = [name.get(key, "").split(".") for name in dict_list]

    common_prefix_parts = []
    for parts in zip(*name_parts_list):
        if len(set(parts)) == 1:
            common_prefix_parts.append(parts[0])
        else:
            break

    common_prefix = ".".join(common_prefix_parts)
    return common_prefix

def create_iotgw_http_server(name: str, prefix: str = PREFIX_IOTGW_HTTP):
    """ creazione iot gw di tipo HTTP server """

    try:
    
        prefix = prefix.strip()
        name = name.strip()

        complete_name = prefix + name
        # sostituzione degli spazi bianchi con il _ . A differenza del replace, se ci sono due o più spazi bianchi consecutivi li sostituisce con un solo _
        complete_name = re.sub('\s+', '_', complete_name)

        existing_iotgws = get_iotgws_http_server()

        if len(existing_iotgws) > 0:

            # estrarre tutti i nomi degli iot gw
            existing_iotgws_name = list( filter( None, [iotgw.get("common.ALLTYPES_NAME") for iotgw in existing_iotgws] ) )

            # se esiste già un iotgw con lo stesso nome, lo elimino e poi creo quello nuovo(esempio: update della configurazione)
            if complete_name in existing_iotgws_name:
                print(f"{log_prefix()}{mycolors.WARNING}IoT gw '{complete_name}' already exists. Trying to update it", flush = True)

                # se fallisce l'elimiazione, non procedere con la creazione che tanto non avverrebbe. La PUT aggiorna infatti i valori soltanto aggiungendoli ma se nel channel di cui si vuole creare l'iot gw sono stati eliminati dei tag, la PUT non li toglie dall'iot gw
                if not delete_iotgw_http_server(complete_name):
                    print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{complete_name}' removal has NOT been successfull", flush = True)
                    return '{}'
                    
                else:
                    print(f"{log_prefix()}{mycolors.SUCCESS}IoT gw '{complete_name}' removal has been successfull. Going to re-create it with the new configuration", flush = True)

        # creazione iotgw
        iotgw = dict()

        iotgw = {
            "common.ALLTYPES_NAME": complete_name,
            "common.ALLTYPES_DESCRIPTION": "",
            "iot_gateway.AGENTTYPES_ENABLED": False,
            "iot_gateway.IGNORE_QUALITY_CHANGES": False,
            "iot_gateway.REST_SERVER_NETWORK_ADAPTER": "Localhost only",
            "iot_gateway.REST_SERVER_PORT_NUMBER": 39320,
            "iot_gateway.REST_SERVER_CORS_ALLOWED_ORIGINS": "*",
            "iot_gateway.REST_SERVER_USE_HTTPS": False,
            "iot_gateway.REST_SERVER_ENABLE_WRITE_ENDPOINT": True,
            "iot_gateway.REST_SERVER_ALLOW_ANONYMOUS_LOGIN": True
        }

        body_text = json.dumps([iotgw], separators = (",", ":"))
        
        """ text = simple_http_request( body = body_text,
                        headers = kepware_headers,
                        port = KEPWARE_API_PORT, 
                        path = KEPWARE_API_PATH_HTTP_CLIENTS) """
        
        res = requests.post(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_SERVERS}", headers = kepware_headers, data = body_text)
        if res.ok:
            print(f"{log_prefix()}{mycolors.SUCCESS}IoT gw '{complete_name}' has been created ", flush = True)
        else:
            content = json.loads(res.content)
            print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{complete_name}' has NOT been created. API request: code -> {content['code']}, content -> {content['message']}", flush = True)
            return "{}"
        
        return iotgw

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        return "{}"

def create_iotgw_http_client(name: str, url: str, prefix: str = PREFIX_IOTGW_HTTP, publish_rate_ms: int = 1000):
    """ creazione iot gw di tipo HTTP client """

    try:

        prefix = prefix.strip()
        name = name.strip()

        complete_name = prefix + name
        # sostituzione degli spazi bianchi con il _ . A differenza del replace, se ci sono due o più spazi bianchi consecutivi li sostituisce con un solo _
        complete_name = re.sub('\s+', '_', complete_name)

        existing_iotgws = get_iotgws_http_client()

        if len(existing_iotgws) > 0:

            # estrarre tutti i nomi degli iot gw
            existing_iotgws_name = list(filter( None, [iotgw.get("common.ALLTYPES_NAME") for iotgw in existing_iotgws]))

            # se esiste già un iotgw con lo stesso nome, lo elimino e poi creo quello nuovo(esempio: update della configurazione)
            if complete_name in existing_iotgws_name:
                print(f"{log_prefix()}{mycolors.WARNING}IoT gw '{complete_name}' already exists. Trying to update it", flush = True)

                # se fallisce l'elimiazione, non procedere con la creazione che tanto non avverrebbe. La PUT aggiorna infatti i valori soltanto aggiungendoli ma se nel channel di cui si vuole creare l'iot gw sono stati eliminati dei tag, la PUT non li toglie dall'iot gw
                if not delete_iotgw_http_client(complete_name):
                    print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{complete_name}' removal has NOT been successfull", flush = True)
                    return '{}'
                    
                else:
                    print(f"{log_prefix()}{mycolors.SUCCESS}IoT gw '{complete_name}' removal has been successfull. Going to re-create it with the new configuration", flush = True)

        # creazione iotgw
        iotgw = dict()

        iotgw["common.ALLTYPES_NAME"] = complete_name
        iotgw["common.ALLTYPES_DESCRIPTION"] = ""
        iotgw["iot_gateway.AGENTTYPES_TYPE"] = "REST Client"
        iotgw["iot_gateway.AGENTTYPES_ENABLED"] = False #True
        iotgw["iot_gateway.IGNORE_QUALITY_CHANGES"] = False
        iotgw["iot_gateway.REST_CLIENT_URL"] = url
        iotgw["iot_gateway.REST_CLIENT_METHOD"] = 0
        iotgw["iot_gateway.AGENTTYPES_RATE_MS"] = publish_rate_ms
        iotgw["iot_gateway.AGENTTYPES_PUBLISH_FORMAT"] = 1
        iotgw["iot_gateway.AGENTTYPES_MAX_EVENTS"] = 1000
        iotgw["iot_gateway.AGENTTYPES_TIMEOUT_S"] = 15
        iotgw["iot_gateway.REST_CLIENT_HTTP_HEADER"] = "content-type : application/json\r\n"
        iotgw["iot_gateway.AGENTTYPES_MESSAGE_FORMAT"] = 0
        iotgw["iot_gateway.AGENTTYPES_STANDARD_TEMPLATE"] = "timestamp: |SERVERTIMESTAMP|\r\nvalues: |VALUES|\r\n"
        iotgw["iot_gateway.AGENTTYPES_EXPANSION_OF_VALUES"] = "id: |TAGNAME|\r\nv: |TAGVALUE|\r\n" if prefix != PREFIX_IOTGW_OPCUA_FROM else "id: |TAGNAME|\r\nv: |TAGVALUE|\r\nt: |TAGTIMESTAMP|\r\n"
        iotgw["iot_gateway.AGENTTYPES_ADVANCED_TEMPLATE"] = "{\r\n \"timestamp\": |SERVERTIMESTAMP|,\r\n  \"values\": [\r\n   |#each VALUES|\r\n    {\"id\": \"|TAGNAME|\", \"v\": |VALUE|, \"q\": |QUALITY|, \"t\": |TIMESTAMP| } |#unless @last|,|/unless|\r\n   |/each|\r\n  ]\r\n}"
        iotgw["iot_gateway.REST_CLIENT_PUBLISH_MEDIA_TYPE"] = 0
        iotgw["iot_gateway.REST_CLIENT_USERNAME"] = ""
        iotgw["iot_gateway.REST_CLIENT_PASSWORD"] = ""

        body_text = json.dumps([iotgw], separators = (",", ":"))
        
        """ text = simple_http_request( body = body_text,
                        headers = kepware_headers,
                        port = KEPWARE_API_PORT, 
                        path = KEPWARE_API_PATH_HTTP_CLIENTS) """
        
        res = requests.post(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}", headers = kepware_headers, data = body_text)
        if res.ok:
            print(f"{log_prefix()}{mycolors.SUCCESS}IoT gw '{complete_name}' has been created ", flush = True)
        else:
            content = json.loads(res.content)
            print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{complete_name}' has NOT been created. API request: code -> {content['code']}, content -> {content['message']}", flush = True)
            return "{}"

        return iotgw
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        return "{}"

def create_iotgw_mqtt_client(name: str):
    """ creazione iot gw di tipo MQTT client """

    iotgw = dict()

    complete_name = PREFIX_IOTGW_MQTT + name

    # la seguente parte è commentata a causa del passaggio di invio dati verso l'agent di tw in http invece di mqtt
    twa_prefix = "rep/fromkepware/"

    iotgw["common.ALLTYPES_NAME"] = complete_name
    iotgw["common.ALLTYPES_DESCRIPTION"] = ""
    iotgw["iot_gateway.AGENTTYPES_TYPE"] = "MQTT Client"
    iotgw["iot_gateway.AGENTTYPES_ENABLED"] = False
    iotgw["iot_gateway.IGNORE_QUALITY_CHANGES"] = False
    iotgw["iot_gateway.MQTT_CLIENT_URL"] = "tcp://localhost:7883"
    iotgw["iot_gateway.MQTT_CLIENT_TOPIC"] = twa_prefix + name
    iotgw["iot_gateway.MQTT_CLIENT_QOS"] = 2
    iotgw["iot_gateway.AGENTTYPES_RATE_MS"] = 1000
    iotgw["iot_gateway.AGENTTYPES_PUBLISH_FORMAT"] = 1
    iotgw["iot_gateway.AGENTTYPES_MAX_EVENTS"] = 250
    iotgw["iot_gateway.AGENTTYPES_TIMEOUT_S"] = 5
    iotgw["iot_gateway.AGENTTYPES_MESSAGE_FORMAT"] =  0
    iotgw["iot_gateway.AGENTTYPES_STANDARD_TEMPLATE"] = "timestamp: |SERVERTIMESTAMP|\r\nvalues: |VALUES|\r\n"
    iotgw["iot_gateway.AGENTTYPES_EXPANSION_OF_VALUES"] = "id: |TAGNAME|\r\nv: |TAGVALUE|\r\nq: |TAGQUALITY|\r\nt: |TAGTIMESTAMP|\r\n"
    iotgw["iot_gateway.AGENTTYPES_ADVANCED_TEMPLATE"] = "{\r\n \"timestamp\": |SERVERTIMESTAMP|,\r\n  \"values\": [\r\n   |#each VALUES|\r\n    {\"id\": \"|TAGNAME|\", \"v\": |VALUE|, \"q\": |QUALITY|, \"t\": |TIMESTAMP| } |#unless @last|,|/unless|\r\n   |/each|\r\n  ]\r\n}"
    iotgw["iot_gateway.MQTT_CLIENT_CLIENT_ID"] = complete_name
    iotgw["iot_gateway.MQTT_CLIENT_USERNAME"] = ""
    iotgw["iot_gateway.MQTT_CLIENT_PASSWORD"] = ""
    iotgw["iot_gateway.MQTT_TLS_VERSION"] = 0
    iotgw["iot_gateway.MQTT_CLIENT_CERTIFICATE"] = False
    iotgw["iot_gateway.MQTT_CLIENT_ENABLE_LAST_WILL"] = False
    iotgw["iot_gateway.MQTT_CLIENT_LAST_WILL_TOPIC"] = ""
    iotgw["iot_gateway.MQTT_CLIENT_LAST_WILL_MESSAGE"] = ""
    iotgw["iot_gateway.MQTT_CLIENT_ENABLE_WRITE_TOPIC"] = False
    iotgw["iot_gateway.MQTT_CLIENT_WRITE_TOPIC"] = "iotgateway/write"

    body_text = json.dumps([iotgw], separators = (",", ":"))

    #text = simple_http_request( body = body_text,
    #                headers = kepware_headers,
    #                port = KEPWARE_API_PORT, 
    #                path = KEPWARE_API_PATH_MQTT_CLIENTS)
    
    res = requests.post(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_MQTT_CLIENTS}{iotgw}", headers = kepware_headers, data = body_text)
    if res.ok:
        print(f"{log_prefix()}{mycolors.SUCCESS}IoT gw '{complete_name}' has been created ", flush = True)
    else:
        content = json.loads(res.content)
        print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{complete_name}' has NOT been created. API request: code -> {content['code']}, content -> {content['message']}", flush = True)
        return "{}"

    return iotgw

def create_iotgw_for_twa(name: str, thing_name: str = None):
    """
    given a name, creates an empty Iot Gateway with all the settings ready to send data to Thingworx Agent on external PC 
    """
    rt_name = "rt_MATRICOLA_MACCHINA" if thing_name == None else thing_name
    iotgw = create_iotgw_http_client(name, f"http://127.0.0.1:{TW_HTTP_PORT}/fromkepware?thingName={rt_name}", PREFIX_IOTGW_TWX)

    return iotgw["common.ALLTYPES_NAME"]

def create_iotgw_opcua_server_from(name: str):
    """ creazione iot gw per inviare i dati al nostro server opcua che esponiamo sul pc B """

    iotgw = create_iotgw_http_client(name, "http://127.0.0.1:48400/a4opcserver", PREFIX_IOTGW_OPCUA_FROM)

    if iotgw != "{}":
        return iotgw["common.ALLTYPES_NAME"]
    else:
        print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{PREFIX_IOTGW_OPCUA_FROM}_{name}' has NOT been created {mycolors.ENDC}", flush = True)
        return ""

def create_iotgw_opcua_server_to(name: str):
    """ creazione iot gw per inviare i dati al nostro server opcua che esponiamo sul pc B """

    iotgw = create_iotgw_http_server(name, PREFIX_IOTGW_OPCUA_TO)

    if iotgw != "{}":
        return iotgw["common.ALLTYPES_NAME"]
    else:
        print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{PREFIX_IOTGW_OPCUA_FROM}_{name}' has NOT been created {mycolors.ENDC}", flush = True)
        return ""

def create_iotgw_fastdata_matrix(name: str, folder: str = "matrix", publish_rate_ms: int = 1000):
    """ creazione iot gw per inviare i dati al nostro servizio fastdata per inviare le matrici su cloud """

    # metto una porta random tra la 11002 e la 11005 che sono quelle sul quale devono essere inviati i dati veloci così da splittare i canali
    port = random.randint(11002, 11005)
    iotgw = create_iotgw_http_client(name, f"http://127.0.0.1:{port}/a4fastdata/kepware?folder={folder}", PREFIX_IOTGW_FASTDATA, publish_rate_ms)
    if iotgw != "{}":
        return iotgw["common.ALLTYPES_NAME"]
    else:
        print(f"{log_prefix()}{mycolors.FAIL}IoT gw '{PREFIX_IOTGW_OPCUA_FROM}_{name}' has NOT been created {mycolors.ENDC}", flush = True)
        return ""
    
def enable_iotgw_http_client(iotgw_name: str):
    """ abilitare un IoT Gateway di tipo HTTP client """

    res = dict()
    res["iotgw_name"] = iotgw_name
    res["enabled"] = False

    iotgws_disabled = get_iotgws_http_client_from_status(enabled = False)
    if iotgw_name not in iotgws_disabled:
        print(f"{log_prefix()}{mycolors.WARNING}IoT gw '{iotgw_name}' is already enabled. Skipping... ")
        res["enabled"] = True
    else:
        print(f"{log_prefix()}Trying to activate IOT Gateway {iotgw_name}", flush = True)
        
        try:
            request = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}{iotgw_name}", headers = kepware_headers)
            if request.ok:
                res_text = json.loads(request.text)
                iotgw_enabled = res_text["iot_gateway.AGENTTYPES_ENABLED"]

                if iotgw_enabled:
                    print(f"{log_prefix()}{mycolors.SUCCESS}IOT Gateway {iotgw_name} is already enabled", flush = True)
                    res["enabled"] = True
                else:
                    res_text["iot_gateway.AGENTTYPES_ENABLED"] = True
                    request = requests.put(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}{iotgw_name}", json = res_text, headers = kepware_headers)
                    
                    if request.ok:
                        print(f"{log_prefix()}{mycolors.SUCCESS}IOT Gateway {iotgw_name} activation SUCCESS {mycolors.ENDC}", flush = True)
                        res["enabled"] = True
                    else:
                        print(f"{log_prefix()}{mycolors.FAIL}IOT Gateway {iotgw_name} activation FAILED. rc {request.status_code} --> {request.text} {mycolors.ENDC}", flush = True)

        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) during IOT Gateway {iotgw_name} activation at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)

    return res

def enable_iotgw_http_server(iotgw_name: str):
    """ abilitare un IoT Gateway di tipo HTTP client """

    res = dict()
    res["iotgw_name"] = iotgw_name
    res["enabled"] = False

    iotgws_disabled = get_iotgws_http_server_from_status(enabled = False)
    if iotgw_name not in iotgws_disabled:
        print(f"{log_prefix()}{mycolors.WARNING}IoT gw '{iotgw_name}' is already enabled. Skipping... ")
        res["enabled"] = True
    else:
        print(f"{log_prefix()}Trying to activate IOT Gateway {iotgw_name}", flush = True)
        
        try:
            request = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_SERVERS}{iotgw_name}", headers = kepware_headers)
            if request.ok:
                res_text = json.loads(request.text)
                iotgw_enabled = res_text["iot_gateway.AGENTTYPES_ENABLED"]

                if iotgw_enabled:
                    print(f"{log_prefix()}{mycolors.SUCCESS}IOT Gateway {iotgw_name} is already enabled", flush = True)
                    res["enabled"] = True
                else:
                    res_text["iot_gateway.AGENTTYPES_ENABLED"] = True
                    request = requests.put(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}{iotgw_name}", json = res_text, headers = kepware_headers)
                    
                    if request.ok:
                        print(f"{log_prefix()}{mycolors.SUCCESS}IOT Gateway {iotgw_name} activation SUCCESS {mycolors.ENDC}", flush = True)
                        res["enabled"] = True
                    else:
                        print(f"{log_prefix()}{mycolors.FAIL}IOT Gateway {iotgw_name} activation FAILED. rc {request.status_code} --> {request.text} {mycolors.ENDC}", flush = True)

        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) during IOT Gateway {iotgw_name} activation at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)

    return res

def disable_iotgw_http_client(iotgw_name: str):
    """ disabilitare un IoT Gateway di tipo HTTP client """

    res = dict()
    res["iotgw_name"] = iotgw_name
    res["enabled"] = True

    iotgws_enabled = get_iotgws_http_client_from_status(enabled = True)
    
    if iotgw_name not in iotgws_enabled:
        print(f"{log_prefix()}{mycolors.WARNING}IoT gw '{iotgw_name}' is already disabled. Skipping... ", flush = True)
        res["enabled"] = False
    else:
        print(f"{log_prefix()}Trying to disable IOT Gateway '{iotgw_name}' ", flush = True)
        
        try:
            request = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}{iotgw_name}", headers = kepware_headers)
            if request.ok:
                res_text = json.loads(request.text)
                iotgw_disabled = res_text["iot_gateway.AGENTTYPES_ENABLED"]

                if not iotgw_disabled:
                    print(f"{log_prefix()}{mycolors.SUCCESS}IOT Gateway '{iotgw_name}' is already disabled", flush = True)
                    res["enabled"] = False
                else:
                    res_text["iot_gateway.AGENTTYPES_ENABLED"] = False
                    request = requests.put(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}{iotgw_name}", json = res_text, headers = kepware_headers)
                    
                    if request.ok:
                        print(f"{log_prefix()}{mycolors.SUCCESS}IOT Gateway '{iotgw_name}' disabling SUCCESS {mycolors.ENDC}", flush = True)
                        res["enabled"] = False
                    else:
                        print(f"{log_prefix()}{mycolors.FAIL}IOT Gateway {iotgw_name} disabling FAILED. rc {request.status_code} --> {request.text} {mycolors.ENDC}", flush = True)

        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) during IOT Gateway '{iotgw_name}' disabling at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)

    return res

def disable_iotgw_http_server(iotgw_name: str):
    """ disabilitare un IoT Gateway di tipo HTTP server """

    res = dict()
    res["iotgw_name"] = iotgw_name
    res["enabled"] = True

    iotgws_enabled = get_iotgws_http_server_from_status(enabled = True)

    if iotgw_name not in iotgws_enabled:
        print(f"{log_prefix()}{mycolors.WARNING}IoT gw '{iotgw_name}' is already disabled. Skipping... ", flush = True)
        res["enabled"] = False
    else:
        print(f"{log_prefix()}Trying to disable IOT Gateway '{iotgw_name}' ", flush = True)
        
        try:
            request = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}{iotgw_name}", headers = kepware_headers)
            if request.ok:
                res_text = json.loads(request.text)
                iotgw_disabled = res_text["iot_gateway.AGENTTYPES_ENABLED"]

                if not iotgw_disabled:
                    print(f"{log_prefix()}{mycolors.SUCCESS}IOT Gateway '{iotgw_name}' is already disabled", flush = True)
                    res["enabled"] = False
                else:
                    res_text["iot_gateway.AGENTTYPES_ENABLED"] = False
                    request = requests.put(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}{iotgw_name}", json = res_text, headers = kepware_headers)
                    
                    if request.ok:
                        print(f"{log_prefix()}{mycolors.SUCCESS}IOT Gateway '{iotgw_name}' disabling SUCCESS {mycolors.ENDC}", flush = True)
                        res["enabled"] = False
                    else:
                        print(f"{log_prefix()}{mycolors.FAIL}IOT Gateway {iotgw_name} disabling FAILED. rc {request.status_code} --> {request.text} {mycolors.ENDC}", flush = True)

        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) during IOT Gateway '{iotgw_name}' disabling at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)

    return res

def delete_iotgw_http_client(iotgw_name: str):
    """ eliminazione di un iot gateway di tipo http client"""

    res = False

    try:
        res = requests.delete(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_CLIENTS}{iotgw_name}", headers = kepware_headers)
        if res.ok:
            print(f"{log_prefix()}{mycolors.SUCCESS}IoT gateway '{iotgw_name}' has been deleted", flush = True)
            res = True
        else:
            print(f"{log_prefix()}{mycolors.FAIL}IoT gateway '{iotgw_name}' has NOT been deleted. HTTP response is {res.text}", flush = True)

    except Exception as e:  
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) during IOT Gateway {iotgw_name} removal at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        res = False

    return res

def delete_iotgw_http_server(iotgw_name: str):
    """ eliminazione di un iot gateway di tipo http client"""

    res = False

    try:
        res = requests.delete(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_HTTP_SERVERS}{iotgw_name}", headers = kepware_headers)
        if res.ok:
            print(f"{log_prefix()}{mycolors.SUCCESS}IoT gateway '{iotgw_name}' has been deleted", flush = True)
            res = True
        else:
            print(f"{log_prefix()}{mycolors.FAIL}IoT gateway '{iotgw_name}' has NOT been deleted. HTTP response is {res.text}", flush = True)

    except Exception as e:  
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) during IOT Gateway {iotgw_name} removal at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        res = False

    return res

def create_iot_gw_all_tags_old(typename: str, channelname: str, devicename = None, thing_name: str = None, folder: str = None):
    """ creazione di un iot gw con tutti i tag contenuti in un channl/device. come opzionali ci sono la thing_name per gli iot gw per twx e la folder per gli iotgw per i fastdata """

    try:
        channels = get_channels()

        if channelname in channels:
            new_iotgw_name = channelname
            if devicename is not None:
                new_iotgw_name +=  "_" + devicename

            new_iotgw_name = "_".join(new_iotgw_name.split())   # remove blank spaces
            
            start_time = time.time()

            if typename == 'twa':
                new_name = create_iotgw_for_twa(new_iotgw_name, thing_name)
                proto = 'http'
            elif typename == "opcua_from":
                new_name = create_iotgw_opcua_server_from(new_iotgw_name)
                proto = 'http'
            elif typename == "opcua_to":
                new_name = create_iotgw_opcua_server_from(new_iotgw_name)
                proto = 'http'
            elif typename == "fastdata_matrix":
                new_name = create_iotgw_fastdata_matrix(new_iotgw_name, folder)
                proto = 'http'
            else:
                raise Exception(f"{log_prefix}typename '{typename}' not implemented yet ")

            populate_iotgw(channelname, new_name, devicename, proto = proto)
            
            end_time = time.time()
            total_time = int(math.ceil(end_time - start_time))
            
            return {"iotgw": new_name , "time": total_time} if thing_name == None else {"iotgw": new_name , "time": total_time, "thing_name": thing_name}
        
        else:
            raise Exception(f"{log_prefix}Channel not found while trying to create a new IoT Gateway")
        
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e

def create_iot_gw_all_tags(typename: str, channelname: str, devicename: str, thing_name: str = None, folder: str = None, publish_rate_ms: int = 1000, items_scan_rate: int = 1000):
    """ creazione di un iot gw con tutti i tag contenuti in un channl/device. come opzionali ci sono la thing_name per gli iot gw per twx e la folder per gli iotgw per i fastdata """

    start_time = time.time()

    new_iotgw_name = channelname
    if devicename is not None:
        new_iotgw_name +=  "_" + devicename

    if typename == 'twa':
        new_name = create_iotgw_for_twa(new_iotgw_name, thing_name)
        path_prefix = KEPWARE_API_PATH_HTTP_CLIENTS
    elif typename == "opcua_from":
        new_name = create_iotgw_opcua_server_from(new_iotgw_name)
        path_prefix = KEPWARE_API_PATH_HTTP_CLIENTS
    elif typename == "opcua_to":
        new_name = create_iotgw_opcua_server_to(new_iotgw_name)
        path_prefix = KEPWARE_API_PATH_HTTP_SERVERS
    elif typename == "fastdata_matrix":
        new_name = create_iotgw_fastdata_matrix(new_iotgw_name, folder, publish_rate_ms)
        path_prefix = KEPWARE_API_PATH_HTTP_CLIENTS
    else:
        print(f"{log_prefix()}{mycolors.FAIL}Type name '{typename}' not enabled. Skipping... {mycolors.ENDC}", flush = True)
        return None

    if new_name == "":
        return None

    # populate_iotgw(new_name, devicename, proto = proto)

    # recupero i tag che effettivamente esistono dentro il device passato come parametro
    # rimuovo dall'inizio del nome il prefisso contenente il channel e il device, dato che quando la gui richiederà i tag dentro un canale,
    # verrà restituito dalla funzione "get_device_and_tags_tree" dei nomi dei tag che non contengono il channel e il device.
    # per eliminare "lstrip" da qui e le f string successive, l'interfaccia deve aggiungere la stringa channel.device davanti al nome tag
    existing_tags = {str(tag).lstrip(f"{channelname}.{devicename}").strip() : data_type for tag, data_type in get_device_list(channelname, devicename).items()}

    request_body = list()

    for tag_name in existing_tags:

        temp = {
            "common.ALLTYPES_NAME": f"{channelname}.{devicename}.{tag_name}",
            "common.ALLTYPES_DESCRIPTION": "",
            "iot_gateway.IOT_ITEM_SERVER_TAG": f"{channelname}.{devicename}.{tag_name}",
            "iot_gateway.IOT_ITEM_USE_SCAN_RATE": True,
            "iot_gateway.IOT_ITEM_SCAN_RATE_MS": items_scan_rate,
            "iot_gateway.IOT_ITEM_SEND_EVERY_SCAN": True,
            "iot_gateway.IOT_ITEM_DEADBAND_PERCENT": 0,
            "iot_gateway.IOT_ITEM_ENABLED": True,
            "iot_gateway.IOT_ITEM_DATA_TYPE": int(existing_tags[tag_name])
        }

        #temp = dict()
        #temp["common.ALLTYPES_NAME"] = f"{channelname}.{devicename}.{tag_name}"
        #temp["common.ALLTYPES_DESCRIPTION"] = ""
        #temp["iot_gateway.IOT_ITEM_SERVER_TAG"] = f"{channelname}.{devicename}.{tag_name}"
        #temp["iot_gateway.IOT_ITEM_USE_SCAN_RATE"] = True
        #temp["iot_gateway.IOT_ITEM_SCAN_RATE_MS"] = 1000
        #temp["iot_gateway.IOT_ITEM_SEND_EVERY_SCAN"] = True
        #temp["iot_gateway.IOT_ITEM_DEADBAND_PERCENT"] = 0
        #temp["iot_gateway.IOT_ITEM_ENABLED"] = True
        #temp["iot_gateway.IOT_ITEM_DATA_TYPE"] = int(existing_tags[tag_name])

        request_body.append(temp)

    # se l'iot gw che sto creando è per l'invio di matrici per i fast data, devo creare se possibile degli alias per accorciare i nomi dentro l'iot gw
    if typename == "fastdata_matrix":
        common_prefix = find_common_prefix(request_body)
        # se non c'è un prefisso comune vado avanti
        if common_prefix == "":
            print(f"{log_prefix()}{mycolors.WARNING}No common prefix found creating IoT Gateway '{new_iotgw_name}' for fastdata {mycolors.ENDC}", flush = True)
        else:
            print(f"{log_prefix()}{mycolors.INFO}Common prefix found creating IoT Gateway '{new_iotgw_name}' for fastdata: '{common_prefix}'. Going to create alias or use existing one {mycolors.ENDC}", flush = True)
            existing_alias_name = [int(name) for name in get_fd_aliases_name()]
            # rimozione numeri già presenti da un set di numeri da 0 a 99
            available_numbers = list(set(list(range(1, 100))) - set(existing_alias_name))
            # se non ci sono numeri disponibili, skippo
            if len(available_numbers) == 0:
                print(f"{log_prefix()}{mycolors.WARNING}No number between 0 and 99 left for create alias. Skipping", flush = True)
            else:

                # verificare se esiste già un Alias mappato sullo stesso percorso
                aliases_by_map = get_alias_name_by_path_mapped(common_prefix)
                # se non esiste nessun Alias già mappato sullo stesso percorso lo creo
                if len(aliases_by_map) == 0:
                    """ # scelgo casualmente da quelli disponibili
                    alias_name = str(random.choice(available_numbers)) """
                    # scelgo il primo disponibile in ordine
                    alias_name = str(sorted(available_numbers)[0])
                    
                    new_alias = create_aliases([{alias_name:common_prefix}])

                    # se l'alias non è stato correttamente creato
                    if new_alias == "{}":
                        print(f"{log_prefix()}{mycolors.FAIL}Alias '{alias_name}' not created. Skip reducing tag length", flush = True)
                    # se è stato correttamente creato, modifico il body così da aggiungere i tag con il nome comprensivo di alias dentro l'iot gw
                    else:
                        for tag in request_body:
                            name_without_alias = str(tag["common.ALLTYPES_NAME"])
                            name_with_alias = f"{alias_name}.{name_without_alias.rsplit('.', 1)[1]}"
                            tag["common.ALLTYPES_NAME"] = name_with_alias
                            tag["iot_gateway.IOT_ITEM_SERVER_TAG"] = name_with_alias

                # se esiste, ne prendo uno a caso di quelli già mappati(se tutto fosse fatto correttamente, ne dovrei avere soltanto uno tra quelli già esisstenti mappati su questo percorso)
                else:
                    alias_name = str(random.choice(aliases_by_map))
                    print(f"{log_prefix()}Path '{common_prefix}' has already an alias defined: {alias_name} ", flush = True)
                    for tag in request_body:
                            name_without_alias = str(tag["common.ALLTYPES_NAME"])
                            name_with_alias = f"{alias_name}.{name_without_alias.rsplit('.', 1)[1]}"
                            tag["common.ALLTYPES_NAME"] = name_with_alias
                            tag["iot_gateway.IOT_ITEM_SERVER_TAG"] = name_with_alias

    body_text = json.dumps(request_body, separators = (",", ":"))

    # proto_path = KEPWARE_API_PATH_MQTT_CLIENTS if proto == "mqtt" else KEPWARE_API_PATH_HTTP_CLIENTS

    res = requests.post(f"http://127.0.0.1:{KEPWARE_API_PORT}{path_prefix}{new_name}/iot_items", headers = kepware_headers, data = body_text)
    
    end_time = time.time()
    total_time = int(math.ceil(end_time - start_time))
    
    if not res.ok:
        content = json.loads(res.content)

    return {"iotgw": new_name , "time": total_time} if thing_name == None else ({"iotgw": new_name , "time": total_time, "thing_name": thing_name, "rc": res.status_code} if res.ok else {"iotgw": new_name , "time": total_time, "thing_name": thing_name, "status_code": content['code'], "content": content['message']})

def create_iot_gw_custom_tags(channelname: str, tag_list: typing.List[str], typename: str, devicename: str = None, thing_name: str = None, folder: str = None, publish_rate_ms: int = 1000, items_scan_rate: int = 1000):

    start_time = time.time()

    new_iotgw_name = channelname
    if devicename is not None:
        new_iotgw_name +=  "_" + devicename

    if typename == 'twa':
        new_name = create_iotgw_for_twa(new_iotgw_name, thing_name)
        path_prefix = KEPWARE_API_PATH_HTTP_CLIENTS
    elif typename == "opcua_from":
        new_name = create_iotgw_opcua_server_from(new_iotgw_name)
        path_prefix = KEPWARE_API_PATH_HTTP_CLIENTS
    elif typename == "opcua_to":
        new_name = create_iotgw_opcua_server_to(new_iotgw_name)
        path_prefix = KEPWARE_API_PATH_HTTP_SERVERS
    elif typename == "fastdata_matrix":
        new_name = create_iotgw_fastdata_matrix(new_iotgw_name, folder, publish_rate_ms)
        path_prefix = KEPWARE_API_PATH_HTTP_CLIENTS
    else:
        print(f"{log_prefix()}{mycolors.FAIL}Type name '{typename}' not enabled. Skipping... {mycolors.ENDC}", flush = True)
        return None

    if new_name == "":
        return None

    # populate_iotgw(new_name, devicename, proto = proto)

    # recupero i tag che effettivamente esistono dentro il device passato come parametro
    # rimuovo dall'inizio del nome il prefisso contenente il channel e il device, dato che quando la gui richiederà i tag dentro un canale,
    # verrà restituito dalla funzione "get_device_and_tags_tree" dei nomi dei tag che non contengono il channel e il device.
    # per eliminare "lstrip" da qui e le f string successive, l'interfaccia deve aggiungere la stringa channel.device davanti al nome tag
    existing_tags = {str(tag).lstrip(f"{channelname}.{devicename}").strip() : data_type for tag, data_type in get_device_list(channelname, devicename).items()}

    request_body = list()

    for tag_name in tag_list:
        tag_name = tag_name.strip()
        
        if tag_name in existing_tags:
            # se il tag passato esiste effettivamente nel device lo creo nell'iot gateway, altrimenti no

            temp = {
            "common.ALLTYPES_NAME": f"{channelname}.{devicename}.{tag_name}",
            "common.ALLTYPES_DESCRIPTION": "",
            "iot_gateway.IOT_ITEM_SERVER_TAG": f"{channelname}.{devicename}.{tag_name}",
            "iot_gateway.IOT_ITEM_USE_SCAN_RATE": True,
            "iot_gateway.IOT_ITEM_SCAN_RATE_MS": items_scan_rate,
            "iot_gateway.IOT_ITEM_SEND_EVERY_SCAN": True,
            "iot_gateway.IOT_ITEM_DEADBAND_PERCENT": 0,
            "iot_gateway.IOT_ITEM_ENABLED": True,
            "iot_gateway.IOT_ITEM_DATA_TYPE": int(existing_tags[tag_name])
            }

            request_body.append(temp)
        else:
            print(f"{log_prefix()}{mycolors.WARNING}Tag '{tag_name}' does not exists into channel '{channelname}' and device '{devicename}' {mycolors.ENDC}", flush = True)

    # se l'iot gw che sto creando è per l'invio di matrici per i fast data, devo creare se possibile degli alias per accorciare i nomi dentro l'iot gw
    if typename == "fastdata_matrix":
        common_prefix = find_common_prefix(request_body)
        # se non c'è un prefisso comune vado avanti
        if common_prefix == "":
            print(f"{log_prefix()}{mycolors.WARNING}No common prefix found creating IoT Gateway '{new_iotgw_name}' for fastdata {mycolors.ENDC}", flush = True)
        else:
            print(f"{log_prefix()}{mycolors.INFO}Common prefix found creating IoT Gateway '{new_iotgw_name}' for fastdata: '{common_prefix}'. Going to create alias or use existing one {mycolors.ENDC}", flush = True)
            existing_alias_name = [int(name) for name in get_fd_aliases_name()]
            # rimozione numeri già presenti da un set di numeri da 0 a 99
            available_numbers = list(set(list(range(1, 100))) - set(existing_alias_name))
            # se non ci sono numeri disponibili, skippo
            if len(available_numbers) == 0:
                print(f"{log_prefix()}{mycolors.WARNING}No number between 0 and 99 left for create alias. Skipping", flush = True)
            else:

                # verificare se esiste già un Alias mappato sullo stesso percorso
                aliases_by_map = get_alias_name_by_path_mapped(common_prefix)
                # se non esiste nessun Alias già mappato sullo stesso percorso lo creo
                if len(aliases_by_map) == 0:
                    """ # scelgo casualmente da quelli disponibili
                    alias_name = str(random.choice(available_numbers)) """
                    # scelgo il primo disponibile in ordine
                    alias_name = str(sorted(available_numbers)[0])
                    
                    new_alias = create_aliases([{alias_name:common_prefix}])

                    # se l'alias non è stato correttamente creato
                    if new_alias == "{}":
                        print(f"{log_prefix()}{mycolors.FAIL}Alias '{alias_name}' not created. Skip reducing tag length", flush = True)
                    # se è stato correttamente creato, modifico il body così da aggiungere i tag con il nome comprensivo di alias dentro l'iot gw
                    else:
                        for tag in request_body:
                            name_without_alias = str(tag["common.ALLTYPES_NAME"])
                            name_with_alias = f"{alias_name}.{name_without_alias.rsplit('.', 1)[1]}"
                            tag["common.ALLTYPES_NAME"] = name_with_alias
                            tag["iot_gateway.IOT_ITEM_SERVER_TAG"] = name_with_alias

                # se esiste, ne prendo uno a caso di quelli già mappati(se tutto fosse fatto correttamente, ne dovrei avere soltanto uno tra quelli già esisstenti mappati su questo percorso)
                else:
                    alias_name = str(random.choice(aliases_by_map))
                    print(f"{log_prefix()}Path '{common_prefix}' has already an alias defined: {alias_name} ", flush = True)
                    for tag in request_body:
                            name_without_alias = str(tag["common.ALLTYPES_NAME"])
                            name_with_alias = f"{alias_name}.{name_without_alias.rsplit('.', 1)[1]}"
                            tag["common.ALLTYPES_NAME"] = name_with_alias
                            tag["iot_gateway.IOT_ITEM_SERVER_TAG"] = name_with_alias

    body_text = json.dumps(request_body, separators = (",", ":"))

    # proto_path = KEPWARE_API_PATH_MQTT_CLIENTS if proto == "mqtt" else KEPWARE_API_PATH_HTTP_CLIENTS

    res = requests.post(f"http://127.0.0.1:{KEPWARE_API_PORT}{path_prefix}{new_name}/iot_items", headers = kepware_headers, data = body_text)
    
    end_time = time.time()
    total_time = int(math.ceil(end_time - start_time))
    
    if not res.ok:
        content = json.loads(res.content)

    return {"iotgw": new_name , "time": total_time} if thing_name == None else ({"iotgw": new_name , "time": total_time, "thing_name": thing_name, "rc": res.status_code} if res.ok else {"iotgw": new_name , "time": total_time, "thing_name": thing_name, "status_code": content['code'], "content": content['message']})

""" if __name__ == "__main__":
    create_iot_gw_custom_tags(channelname = "bioTrue", tag_list = [
        "Application.Sentinel.G_SentServoFastMtx[x,y].G_SentServoFastMtx[0,0]", "Application.Sentinel.G_SentServoFastMtx[x,y].G_SentServoFastMtx[0,1]", "Application.Sentinel.G_SentServoFastMtx[x,y].G_SentServoFastMtx[0,2]"
    ],devicename = "L24_792", folder = "pippo", typename = "fastdata_matrix", publish_rate_ms = 1600, items_scan_rate = 800) """

def get_iotgw_by_protocol(proto: str = "mqtt"):
    """
    returns an object that has as key the IoT Gateway name and as value the destination of the IoT Gateway
    """
    
    response = dict()

    if proto == "http_client":
        # proto_path = KEPWARE_API_PATH_HTTP_CLIENTS
        proto_dest = "iot_gateway.REST_CLIENT_URL"

        to_obj = get_iotgws_http_client()

    elif proto == "http_server":
        # proto_path = KEPWARE_API_PATH_HTTP_SERVERS
        proto_dest = "iot_gateway.REST_SERVER_PORT_NUMBER"

        to_obj = get_iotgws_http_server()

    else:
        # proto_path = KEPWARE_API_PATH_MQTT_CLIENTS
        proto_dest = "iot_gateway.MQTT_CLIENT_TOPIC"

        to_obj = get_iotgws_mqtt_client()
    
    try:
        #text = simple_http_request(headers = kepware_headers, path = proto_path, port = KEPWARE_API_PORT)
        #to_obj = json.loads(text)
        
        # i want to return only list with common name and topic
        #return [{"name":iotgw["common.ALLTYPES_NAME"], "dest":iotgw[proto_dest]} for iotgw in to_obj]
        for iotgw in to_obj:
            response[iotgw["common.ALLTYPES_NAME"]] = iotgw[proto_dest]
        
        return response
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e

def get_iotgw_items(iotgw_name: str, proto: str = "mqtt"):
    """
    given an IoT Gateway name, returns the full, unfiltered, output from kepware API service with information about that IoT Gateway
    """

    if proto == "http":
        proto_path = KEPWARE_API_PATH_HTTP_CLIENTS
    elif proto == 'http_server':
        proto_path = KEPWARE_API_PATH_HTTP_SERVERS
    else:
        proto_path = KEPWARE_API_PATH_MQTT_CLIENTS

    try:
        #text = simple_http_request(headers= kepware_headers, path = proto_path + iotgw_name + KEPWARE_API_PATH_IOT_ITEMS , port = KEPWARE_API_PORT)
        #to_obj = json.loads(text)
        
        to_obj = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{proto_path}{iotgw_name}{KEPWARE_API_PATH_IOT_ITEMS}", headers = kepware_headers, timeout = 5).json()
        
        return to_obj
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e

def iot_gw_to_template_twa(iotgw_name: str, proto: str = "mqtt"):
    """
    given an IoT Gateway name, returns an object containing:
    - a property "prefix" with the common prefix for all variables
    - 3 properties, "strings" "numbers" and "booleans", where each property has a list of variables with that type 
    """

    try:
        template = dict()
        items = get_iotgw_items(iotgw_name, proto)
        template_obj = dict()

        for tag_name in items:
            name = tag_name["iot_gateway.IOT_ITEM_SERVER_TAG"]
            kepware_data_type = tag_name["iot_gateway.IOT_ITEM_DATA_TYPE"]
            tw_data_type = data_types[str(kepware_data_type)]
            template_obj[name] = tw_data_type

        prefix = os.path.commonprefix( list(template_obj.keys()))

        template["prefix"] = prefix
        boolean_list = list()
        string_list = list()
        number_list = list()

        for tag_name in template_obj:
            #remember, lstrip is not what looks like
            new_name = tag_name[len(prefix):]
            if template_obj[tag_name] == boolean_const:
                boolean_list.append(new_name)
            elif template_obj[tag_name] == string_const:
                string_list.append(new_name)
            elif template_obj[tag_name] == number_const:
                number_list.append(new_name)

        if len(boolean_list) > 0:
            template[boolean_const] = boolean_list
        if len(string_list) > 0:
            template[string_const] = string_list
        if len(number_list) > 0:
            template[number_const] = number_list

        return template
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e

def iot_gw_to_template_opcua(iotgw_name: str, proto: str = "mqtt"):
    
    try:
        template = dict()
        items = get_iotgw_items(iotgw_name, proto)
        template_obj = dict()
        
        for tag_name in items:
            name = tag_name["iot_gateway.IOT_ITEM_SERVER_TAG"]
            kepware_data_type = tag_name["iot_gateway.IOT_ITEM_DATA_TYPE"]
            opcua_data_type = data_types_opcua[str(kepware_data_type)]
            template_obj[name] = opcua_data_type
        
        prefix = os.path.commonprefix( list(template_obj.keys()))

        template["prefix"] = prefix
        values = template["values"] = dict()

        for tag_name in template_obj:
            #remember, lstrip is not what looks like
            new_name = tag_name[len(prefix):]
            values[new_name] = template_obj[tag_name]

        return template
    
    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        raise e

def iot_mqtt_to_template(iotgw_name: str):
    return iot_gw_to_template_twa(iotgw_name, proto = "mqtt")

def iot_http_to_template(iotgw_name: str):
    return iot_gw_to_template_twa(iotgw_name, proto = "http")

def kepwareBackup() -> str:

    try:

        file_name = f"Kepware_{mytime.now_second_pretty()}.json"

        json_body = { 
                    "common.ALLTYPES_NAME": "ProjectSave", 
                    "servermain.JOB_TIME_TO_LIVE_SECONDS": 30, 
                    "servermain.PROJECT_FILENAME": f"backups/{file_name}" 
                    }   

        # API per fare il backup del progetto
        res = requests.put(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_BACKUP_PROJECT}", json = json_body, headers = kepware_headers)

        if res.ok:

            kepware_backup_file_path = f"{KEPWARE_BACKUP_FOLDER}{file_name}"

            # attendo fino al momento in cui il file viene creato. questo perchè se il progetto è grande, ci vuole un po' di tempo per la creazione del file di backup
            counter = 0
            while not os.path.exists(kepware_backup_file_path) and counter < 30:
                print(f"{log_prefix()}{mycolors.TMP}Waiting for '{kepware_backup_file_path}' creation", flush = True)
                time.sleep(1)
                counter += 1

            # attendo fino al momento in cui il file inizia a essere scritto. questo perchè se il progetto è grande, ci vuole un po' di tempo per la scrittura del file di backup
            counter = 0
            while os.path.getsize(kepware_backup_file_path) == 0 and counter < 20:
                print(f"{log_prefix()}{mycolors.TMP}Waiting for '{kepware_backup_file_path}' filling", flush = True)
                time.sleep(1)
                counter += 1

            # attendo fino al momento in cui il file è completamento scritto
            copying = True
            size2 = -1
            while copying:
                size = os.path.getsize(kepware_backup_file_path)
                if size == size2:
                    copying = False
                    break
                else:
                    print(f"{log_prefix()}Waiting '{kepware_backup_file_path}' file creation", flush = True)
                    size2 = os.path.getsize(kepware_backup_file_path)
                    time.sleep(5)

            if os.path.exists(kepware_backup_file_path):
                # lo copio in una cartella locale per avere i permessi di aprirlo, se non lo faccio mi da errore
                print(f"{log_prefix()}Copying '{kepware_backup_file_path}' to {LOCAL_BACKUPS_FOLDER}", flush = True)
                shutil.copy2(kepware_backup_file_path, f'{LOCAL_BACKUPS_FOLDER}/')

                try:
                    with open(f'{LOCAL_BACKUPS_FOLDER}/{file_name}', encoding = 'utf-8-sig') as f:
                        kepware_conf = json.load(f)
                except json.JSONDecodeError as e:
                    print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
                    return ""

                # lo elimino dalla cartella locale
                os.remove(f'{LOCAL_BACKUPS_FOLDER}/{file_name}')
                
                return json.dumps(kepware_conf)

            else:
                print(f"{log_prefix()}Filename {file_name} not in folder '{KEPWARE_BACKUP_FOLDER}' ", flush = True)
                return ""

        else: 
            print(f"{log_prefix()}{mycolors.FAIL}Response to API request is {res.content}", flush = True)
            return ""

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        return ""

def kepwareUpload(file_content: bytes) -> bool:
    file_content = file_content.decode('utf-8')
    file_name = f"Kepware_{mytime.now_second_pretty()}.json"

    try:

        with open(f"{LOCAL_UPLOADS_FOLDER}/{file_name}", 'w+') as f:
            f.write(file_content)
        
        shutil.copy2(f"{LOCAL_UPLOADS_FOLDER}/{file_name}", '/mnt/c/A4Gate')
        
        res = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_GET_PROJECT_UPLOAD}", headers = kepware_headers)
        project_id = json.loads(res.text)["PROJECT_ID"]

        print(f"{log_prefix()}Setting new Kepware configuration", flush = True)

        json_body = {
                    "PROJECT_ID": project_id,
                    "servermain.PROJECT_FILENAME": "C:\A4Gate\\" + file_name,
                    "servermain.PROJECT_PASSWORD": ""
                    }
    
        res = requests.put(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_GET_PROJECT_UPLOAD}", json = json_body, headers = kepware_headers)

        print(f"{log_prefix()}{res.text}", flush = True)

        # return True if 200 < res.status_code < 300 else False

        return res.ok

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        return False

def reloadKepware():
    print(f"{log_prefix()}Trying to reload Kepware service", flush = True)
    kepware_service = "KEPServerEXV6"
    #kepware_service_iotgw="KEPServerEXIoTGatewayV6"
    
    # os.system( NET_EXE + " stop " + kepware_service )
    # os.system( NET_EXE + " start " + kepware_service )

    res = False

    try:
        stop_res = os.popen(NET_EXE + " stop " + kepware_service).read().strip().lower()

        print(f"{log_prefix()}Stop response is {stop_res}", flush = True)

        if stop_res == "The KEPServerEX 6.9 Runtime service is not started":
            print(f"{log_prefix()}{mycolors.WARNING}KEPServerEX is open and wait for user input to restart. Doing into with script", flush = True)

        start_res = os.popen(NET_EXE + " start " + kepware_service).read().strip().lower().split()[-1]

        print(f"{log_prefix()}Start response is {start_res}", flush = True)

        if start_res == "successfully.":
            res = True

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} while restarting Kepware -> {e} {mycolors.ENDC}", flush = True)
        res = False

    return res

def check_connection_to_machines(channels_list: list) -> list:
    """ cerazione di una lista contenente un dizionario per ogni channel """

    """ channel_type_to_ip_port_correlation = {
                                            "MQTT Client" : ["mqtt_client.CHANNEL_HOST_ADDRESS", "mqtt_client.CHANNEL_PORT_NUMBER"],
                                            "CODESYS": ["CODESYS.DEVICE_IP_ADDRESS", "CODESYS.DEVICE_PORT_NUMBER"],
                                            "OPC UA Client": ["opcuaclient.CHANNEL_UA_SERVER_ENDPOINT_URL"],
                                            "Allen-Bradley ControlLogix Ethernet": ["servermain.DEVICE_ID_STRING", "controllogix_ethernet.DEVICE_PORT_NUMBER"],
                                            "Modbus TCP/IP Ethernet": ["servermain.DEVICE_ID_STRING", "modbus_ethernet.DEVICE_ETHERNET_PORT_NUMBER"],
                                            "Mitsubishi Ethernet": ["servermain.DEVICE_ID_STRING", "mitsubishi_ethernet.DEVICE_PORT_NUMBER"],
                                            "Omron FINS Ethernet": ["servermain.DEVICE_ID_STRING", "omron_fins_ethernet.CHANNEL_PORT_NUMBER"]
                                           } """

    channel_ip_port = list()

    for channel in channels_list:

        try:

            driver_type = channel["servermain.MULTIPLE_TYPES_DEVICE_DRIVER"]
            channel_name = channel['common.ALLTYPES_NAME']

            devices = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_CHANNELS}{channel_name}{KEPWARE_API_PATH_DEVICES}", headers = kepware_headers, timeout = 3).json()

            if driver_type == "MQTT Client":

                ip, port = channel["mqtt_client.CHANNEL_HOST_ADDRESS"], channel["mqtt_client.CHANNEL_PORT_NUMBER"]

                for device in devices:

                    driver_dict = dict()

                    driver_dict["channel"] = channel_name
                    driver_dict["device"] = device["common.ALLTYPES_NAME"]
                    driver_dict["driver_type"] = driver_type
                    driver_dict["ip_address"] = ip
                    driver_dict["port"] = int(port)

                    driver_dict["timestamp"] = int(time.time())
                    
                    driver_dict["connected"] = helper_pca.check_connection_to(ip, int(port))

                    channel_ip_port.append(driver_dict)

            elif driver_type == "OPC UA Client":

                device_id_string = str(channel["opcuaclient.CHANNEL_UA_SERVER_ENDPOINT_URL"])
                ip, port = device_id_string.lstrip("opc.tcp://").split(":", 1)

                for device in devices:

                    driver_dict = dict()

                    driver_dict["channel"] = channel_name
                    driver_dict["device"] = device["common.ALLTYPES_NAME"]
                    driver_dict["driver_type"] = driver_type
                    driver_dict["ip_address"] = ip
                    driver_dict["port"] = int(port)

                    driver_dict["timestamp"] = int(time.time())
                    
                    driver_dict["connected"] = helper_pca.check_connection_to(ip, int(port))

                    channel_ip_port.append(driver_dict)

            elif driver_type == "CODESYS":

                for device in devices:

                    driver_dict = dict()

                    driver_dict["channel"] = channel_name
                    driver_dict["device"] = device["common.ALLTYPES_NAME"]
                    driver_dict["driver_type"] = driver_type

                    ip, port = device['CODESYS.DEVICE_IP_ADDRESS'], device['CODESYS.DEVICE_PORT_NUMBER']
                    driver_dict["ip_address"] = ip
                    driver_dict["port"] = int(port)

                    driver_dict["timestamp"] = int(time.time())

                    driver_dict["connected"] = helper_pca.check_connection_to(ip, int(port))

                    channel_ip_port.append(driver_dict)

            elif driver_type == "Modbus TCP/IP Ethernet":

                for device in devices:

                    driver_dict = dict()

                    driver_dict["channel"] = channel_name
                    driver_dict["device"] = device["common.ALLTYPES_NAME"]
                    driver_dict["driver_type"] = driver_type

                    ip, port = re.findall(r'[^\s<>]+', device["servermain.DEVICE_ID_STRING"])[0], device["modbus_ethernet.DEVICE_ETHERNET_PORT_NUMBER"]
                    driver_dict["ip_address"] = ip
                    driver_dict["port"] = int(port)

                    driver_dict["timestamp"] = int(time.time())

                    driver_dict["connected"] = helper_pca.check_connection_to(ip, int(port))

                    channel_ip_port.append(driver_dict)

            elif driver_type == "Allen-Bradley ControlLogix Ethernet":

                for device in devices:

                    driver_dict = dict()

                    driver_dict["channel"] = channel_name
                    driver_dict["device"] = device["common.ALLTYPES_NAME"]
                    driver_dict["driver_type"] = driver_type
                    
                    ip, port = re.findall(r'[^\s<>]+', device["servermain.DEVICE_ID_STRING"])[0], device["controllogix_ethernet.DEVICE_PORT_NUMBER"]
                    driver_dict["ip_address"] = ip
                    driver_dict["port"] = int(port)

                    driver_dict["timestamp"] = int(time.time())

                    driver_dict["connected"] = helper_pca.check_connection_to(ip, int(port))

                    channel_ip_port.append(driver_dict)
            
            elif driver_type == "Mitsubishi Ethernet":

                for device in devices:
                    
                    driver_dict = dict()

                    driver_dict["channel"] = channel_name
                    driver_dict["device"] = device["common.ALLTYPES_NAME"]
                    driver_dict["driver_type"] = driver_type

                    ip, port = str(device["servermain.DEVICE_ID_STRING"]).split(":", 1)[0], device["mitsubishi_ethernet.DEVICE_PORT_NUMBER"]
                    driver_dict["ip_address"] = ip
                    driver_dict["port"] = int(port)

                    driver_dict["timestamp"] = int(time.time())

                    driver_dict["connected"] = helper_pca.check_connection_to(ip, int(port))

                    channel_ip_port.append(driver_dict)

            elif driver_type == "Omron FINS Ethernet":

                port = channel["omron_fins_ethernet.CHANNEL_PORT_NUMBER"]
            
                for device in devices:
                    
                    driver_dict = dict()

                    driver_dict["channel"] = channel_name
                    driver_dict["device"] = device["common.ALLTYPES_NAME"]
                    driver_dict["driver_type"] = driver_type

                    ip = str(device["servermain.DEVICE_ID_STRING"])
                    driver_dict["ip_address"] = ip
                    driver_dict["port"] = int(port)

                    driver_dict["timestamp"] = int(time.time())

                    driver_dict["connected"] = helper_pca.check_connection_to(ip, int(port))

                    channel_ip_port.append(driver_dict)

            else:
                print(f"{log_prefix()}{mycolors.FAIL}API for driver type '{driver_type}' has not been implemented yet")

        except Exception as e:
            print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) checking connection to the following channel at line {sys.exc_info()[-1].tb_lineno} -> {e}: \n{channel} {mycolors.ENDC}", flush = True)

    return channel_ip_port

def machine_connected() -> str:
    """ utilizzo delle API di Kepware per recuperare i channel per raccogliere i dati dal campo """

    res = list()

    # channel presenti di default nel progetto Kepware di base
    exclusion_channels = ["a4GATE", "MQTTlocalhost7883"]

    try:

        kepware_api_enabled = helper_pca.check_connection_to("127.0.0.1", KEPWARE_API_PORT)

        if kepware_api_enabled:

            channels = requests.get(f"http://127.0.0.1:{KEPWARE_API_PORT}{KEPWARE_API_PATH_CHANNELS}", headers = kepware_headers, timeout = 3).json()
            # print(common.dumpjsonpretty(channels))

            channels_filtered = [channel for channel in channels if channel["common.ALLTYPES_NAME"] not in exclusion_channels]
            # print(common.dumpjsonpretty(channels_filtered))

            if len(channels_filtered) > 0:
                res = check_connection_to_machines(channels_filtered)
                
                n_machine_reachable = list()
                n_machine_not_reachable = list()

                [n_machine_reachable.append(f'{channel["channel"]}_{channel["device"]}') if channel["connected"] else n_machine_not_reachable.append(f'{channel["channel"]}_{channel["device"]}') for channel in res]

                print(f"{log_prefix()}{mycolors.INFO}Machines connected are {len(n_machine_reachable)}" + (": " if len(n_machine_reachable) > 0 else "") + ", ".join(n_machine_reachable) + f". Machines not connected are {len(n_machine_not_reachable)}" + (": " if len(n_machine_not_reachable) > 0 else "") + ", ".join(n_machine_not_reachable))

                with open(f"{SCRIPT_DIRECTORY}/last_machine_check_connection.json", "w+") as f:
                    f.write(common.dumpjsonpretty(res))

            else:
                print(f"{log_prefix()}{mycolors.WARNING}Excluding defaults channles, no one channel has been configured into Kepware", flush = True)
        
        else:
            print(f"{log_prefix()}{mycolors.FAIL}Kepware API on port {KEPWARE_API_PORT} are not enabled", flush = True)

    except Exception as e:
        print(f"{log_prefix()}{mycolors.FAIL}Exception({type(e).__name__}) at line {sys.exc_info()[-1].tb_lineno} -> {e} {mycolors.ENDC}", flush = True)
        res = list()

    return res
