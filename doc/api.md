# API documentation

## fetchData
This function is responsible for making HTTP requests to the server using Axios library. It handles GET and POST requests and includes error handling for non-2xx status codes.

### Parameters:
* `url` (string): The endpoint URL to which the request is made.
* `method` (string): The HTTP request method (GET or POST).
* `body` (object): The request body data for POST requests.
* `noToken` (boolean): A flag indicating whether the request requires authentication token or not.
### Logic:
1. **Set Axios Configuration:**

    - Define the Axios configuration object with the specified method and headers.
    - Include additional configuration for handling HTTPS requests with self-signed certificates.
2. **Handle POST Requests:**

    - If the request method is POST, include the request body in the Axios configuration.
3. **Make Request Function:**

    - Define an inner function makeRequest that handles the actual request.
    - Construct the complete request URL by combining the base URL and endpoint, taking into account the current environment's origin.
    - Use Axios to make the request with the constructed URL and configuration.
    - Handle non-2xx status codes by automatically throwing errors.
4. **Handle Authentication:**

    - If noToken is true, directly add the request to the queue and return.
    - Otherwise, check if the user is authenticated:
        - If not authenticated, log an error and redirect to the login page.
        - If authenticated, wrap the request with authentication headers and add it to the queue.
5. **Error Handling:**

    - Handle errors such as 401 (Unauthorized) and 403 (Forbidden) by clearing the authentication token and redirecting to the login page.
    - Throw an error if any other Axios-related error occurs.
  
**Return Value:**
A Promise that resolves to the response data from the server.

## get_version
### Description:
 Retrieves the version information from the server.
### Endpoint:
 /version
### Method:
 GET
### Returns:
 A string containing the version information.
Throws: Error if an error occurs during the retrieval process.

## get_confA
### Description:
 Retrieves configuration data A from the server.
### Endpoint:
 /confA
### Method:
 GET
### Returns:
 Configuration data A.
Throws: Error if an error occurs during the retrieval process.

## get_confB
### Description:
 Retrieves configuration data B from the server.
### Endpoint:
 /confB
### Method:
 GET
### Returns:
 Configuration data B.
Throws: Error if an error occurs during the retrieval process.
## send_conf
### Description:
 Sends configuration data to the server.
### Endpoint:
 /post
### Method:
 POST
Parameters: data - Configuration data to be sent.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## createiotgw
### Description:
 Creates an IoT gateway with the specified parameters.
### Endpoint:
 /createiotgw
### Method:
 POST
Parameters: Various parameters for creating the IoT gateway.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## multi_tags_to_array
### Description:
 Converts multiple tags to an array format.
### Endpoint:
 /a4gate/kepware/multi_tags_to_array
### Method:
 POST
Parameters: channel, device, tags_list - Channel, device, and list of tags to be converted.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## get_device_tags
### Description:
 Retrieves tags tree for a specific device and channel.
### Endpoint:
 /channel/device/tags/tree
### Method:
 GET
Parameters: channel, device - Channel and device identifiers.
### Returns:
 Tags tree for the specified device and channel.
Throws: Error if an error occurs during the retrieval process.

## loadiotgws
### Description:
 Loads IoT gateways from the server.
### Endpoint:
 /iotgwhttp or /iotgwhttpserver
### Method:
 GET
Parameters: direction - Direction of loading ("from" or "to").
### Returns:
 Response from the server.
Throws: Error if an error occurs during the retrieval process.

## get_twx_gtws_enabled
### Description:
 Retrieves enabled ThingWorx gateway endpoints.
### Endpoint:
 /iotgw/http/client/twx/endpoint/enabled
### Method:
 GET
### Returns:
 Response from the server containing enabled endpoints.
Throws: Error if an error occurs during the retrieval process.

## get_memory_based_tags
### Description:
 Retrieves memory-based tags tree.
### Endpoint:
 /channel/device/tags/tree/memorybased
### Method:
 GET
### Returns:
 Memory-based tags tree.
Throws: Error if an error occurs during the retrieval process.

## add_complex_arrays_to_iot_gateway
### Description:
 Adds complex arrays to an IoT gateway.
### Endpoint:
 /iotgw/http/client/add/tags/memorybased
### Method:
 POST
Parameters: iotgw_name, devicename, tags_list - IoT gateway name, device name, and list of tags.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## get_all_iot_gateways_client
### Description:
 Retrieves all IoT gateways from the client.
### Endpoint:
 /iotgwhttp
### Method:
 GET
### Returns:
 Response from the server containing all IoT gateways.
Throws: Error if an error occurs during the retrieval process.

## get_twx_gtws_disabled
### Description:
 Retrieves disabled ThingWorx gateway endpoints.
### Endpoint:
 /iotgw/http/client/twx/endpoint/disabled
### Method:
 GET
### Returns:
 Response from the server containing disabled endpoints.
Throws: Error if an error occurs during the retrieval process.

## get_iot_gtws_http_client_enabled
### Description:
 Retrieves enabled HTTP client for IoT gateways.
### Endpoint:
 /iotgw/http/client/enabled
### Method:
 GET
### Returns:
 Response from the server containing enabled HTTP clients.
Throws: Error if an error occurs during the retrieval process.

## get_iot_gtws_http_client_disabled
### Description:
 Retrieves disabled HTTP client for IoT gateways.
### Endpoint:
 /iotgw/http/client/disabled
### Method:
 GET
### Returns:
 Response from the server containing disabled HTTP clients.
Throws: Error if an error occurs during the retrieval process.

## get_iot_gtws_enabled_fast_data_matrix
### Description:
 Retrieves enabled fast data matrix for IoT gateways.
### Endpoint:
 /iotgw/http/client/enabled/fastdata_matrix
### Method:
 GET
### Returns:
 Response from the server containing enabled fast data matrices.
Throws: Error if an error occurs during the retrieval process.

## get_iot_gtws_disabled_fast_data_matrix
### Description:
 Retrieves disabled fast data matrix for IoT gateways.
### Endpoint:
 /iotgw/http/client/disabled/fastdata_matrix
### Method:
 GET
### Returns:
 Response from the server containing disabled fast data matrices.
Throws: Error if an error occurs during the retrieval process.

## twx_connection_diagnostic
### Description:
 Retrieves diagnostic information for ThingWorx connection.
### Endpoint:
 /conf/twx/diagnostic
### Method:
 GET
### Returns:
 Diagnostic information for ThingWorx connection.
Throws: Error if an error occurs during the retrieval process.

## get_iot_gtws_http_server_enabled
### Description:
 Retrieves enabled HTTP server for IoT gateways.
### Endpoint:
 /iotgw/http/server/enabled
### Method:
 GET
### Returns:
 Response from the server containing enabled HTTP servers.
Throws: Error if an error occurs during the retrieval process.

## get_iot_gtws_http_server_disabled
### Description:
 Retrieves disabled HTTP server for IoT gateways.
### Endpoint:
 /iotgw/http/server/disabled
### Method:
 GET
### Returns:
 Response from the server containing disabled HTTP servers.
Throws: Error if an error occurs during the retrieval process.

## get_iot_gtws_for_http_server_enabled_read
### Description:
 Retrieves enabled HTTP server read status for IoT gateways.
### Endpoint:
 /iotgw/http/client/enabled/httpserver_from
### Method:
 GET
### Returns:
 Response from the server containing enabled HTTP server read statuses.
Throws: Error if an error occurs during the retrieval process.

## get_iot_gtws_for_http_server_disabled_read
### Description:
 Retrieves disabled HTTP server read status for IoT gateways.
### Endpoint:
 /iotgw/http/client/disabled/httpserver_from
### Method:
 GET
### Returns:
 Response from the server containing disabled HTTP server read statuses.
Throws: Error if an error occurs during the retrieval process.


## get_iot_gtws_for_http_server_enabled_write
### Description:
 Retrieves enabled HTTP server write status for IoT gateways.
### Endpoint:
 /iotgw/http/client/enabled/httpserver_to
### Method:
 GET
### Returns:
 Response from the server containing enabled HTTP server write statuses.
Throws: Error if an error occurs during the retrieval process.


## get_iot_gtws_for_http_server_disabled_write
### Description:
 Retrieves disabled HTTP server write status for IoT gateways.
### Endpoint:
 /iotgw/http/client/disabled/httpserver_to
### Method:
 GET
### Returns:
 Response from the server containing disabled HTTP server write statuses.
Throws: Error if an error occurs during the retrieval process.

## machines_connected
### Description:
 Retrieves data related to connected machines.
### Endpoint:
 /machine/connections
### Method:
 GET
### Returns:
 Response from the server containing machine connection data.
Throws: Error if an error occurs during the retrieval process.


## monitor_logs_isWorking
### Description:
 Retrieves status information indicating if the monitor logs are working.
### Endpoint:
 /monitor/logs/isWorking
### Method:
 GET
### Returns:
 Response from the server containing status information.
Throws: Error if an error occurs during the retrieval process.

## monitor_a4monitor_status
### Description:
 Retrieves status information from the monitor logs.
### Endpoint:
 /monitor/logs/status
### Method:
 GET
### Returns:
 Response from the server containing status information.
Throws: Error if an error occurs during the retrieval process.

## is_B_ready
### Description:
 Retrieves data indicating if resource B is ready.
### Endpoint:
 /ready
### Method:
 GET
### Returns:
 Response from the server indicating readiness.
Throws: Error if an error occurs during the retrieval process.

## get_iot_gtws_opcua_reading_enabled
### Description:
 Retrieves enabled OPC UA reading status for IoT gateways.
### Endpoint:
 /iotgw/http/client/enabled/opcua_from
### Method:
 GET
### Returns:
 Response from the server containing enabled OPC UA reading statuses.
Throws: Error if an error occurs during the retrieval process.


## get_iot_gtws_opcua_reading_disabled
### Description:
 Retrieves disabled OPC UA reading status for IoT gateways.
### Endpoint:
 /iotgw/http/client/disabled/opcua_from
### Method:
 GET
### Returns:
 Response from the server containing disabled OPC UA reading statuses.
Throws: Error if an error occurs during the retrieval process.

## get_iot_gtws_opcua_reading_writing_enabled
### Description:
 Retrieves enabled OPC UA reading and writing status for IoT gateways.
### Endpoint:
 /iotgw/http/server/enabled/opcua_to
### Method:
 GET
### Returns:
 Response from the server containing enabled OPC UA reading and writing statuses.
Throws: Error if an error occurs during the retrieval process.


## enable_http_client_iot_gateway
### Description:
 Enables HTTP client for the specified IoT gateway.
### Endpoint:
 /iotgw/http/client/enable
### Method:
 GET
Parameters: name - Name of the IoT gateway to enable.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.


## disable_http_client_iot_gateway
### Description:
 Disables HTTP client for the specified IoT gateway.
### Endpoint:
 /iotgw/http/client/disable
### Method:
 GET
Parameters: name - Name of the IoT gateway to disable.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.


## enable_http_server_iot_gateway
### Description:
 Enables HTTP server for the specified IoT gateway.
### Endpoint:
 /iotgw/http/server/enable
### Method:
 GET
Parameters: name - Name of the IoT gateway to enable.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.


## disable_http_server_iot_gateway
### Description:
 Disables HTTP server for the specified IoT gateway.
### Endpoint:
 /iotgw/http/server/disable
### Method:
 GET
Parameters: name - Name of the IoT gateway to disable.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## get_iot_gtws_opcua_reading_writing_disabled
### Description:
 Retrieves disabled OPC UA reading and writing status for IoT gateways.
### Endpoint:
 /iotgw/http/server/disabled/opcua_to
### Method:
 GET
### Returns:
 Response from the server containing disabled OPC UA reading and writing statuses.
Throws: Error if an error occurs during the retrieval process.


## check_bidir
### Description:
 Checks bidirectional communication status.
### Endpoint:
 /a4gate/bidir
### Method:
 GET
### Returns:
 Response from the server containing bidirectional communication status.
Throws: Error if an error occurs during the retrieval process.


## uploadKepwareProject
### Description:
 Uploads a Kepware project.
### Endpoint:
 /kepware/upload
### Method:
 POST
Parameters: file - Kepware project file to upload.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.


## uploadKepwareDefaultProject
### Description:
 Uploads the default Kepware project.
### Endpoint:
 /kepware/upload/default
### Method:
 GET
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.


## downloadKepwareProject
### Description:
 Downloads the Kepware project backup.
### Endpoint:
 /kepware/backup
### Method:
 GET
### Returns:
 True if the download is successful, otherwise false.
Throws: Error if an error occurs during the download process.


## get_a4monitor_logs
### Description:
 Retrieves A4 monitor logs.
### Endpoint:
 /monitor/logs/table
### Method:
 GET
### Returns:
 Response from the server containing A4 monitor logs.
Throws: Error if an error occurs during the retrieval process.


## a4monitorStatus
### Description:
 Retrieves status information from A4 monitor logs.
### Endpoint:
 /monitor/logs/status
### Method:
 GET
### Returns:
 Response from the server containing status information.
Throws: Error if an error occurs during the retrieval process.


## reloadA4monitor
### Description:
 Reloads A4 monitor logs.
### Endpoint:
 /monitor/logs/reload
### Method:
 GET
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## loadChannels
### Description:
 Loads channels from the server.
### Endpoint:
 /kepwaredevices
### Method:
 GET
### Returns:
 Response from the server containing loaded channels.
Throws: Error if an error occurs during the retrieval process.


## get_bidir_info
### Description:
 Retrieves bidirectional communication information.
### Endpoint:
 /a4gate/bidir
### Method:
 GET
### Returns:
 Response from the server containing bidirectional communication information.
Throws: Error if an error occurs during the retrieval process.


## reload_kepware
### Description:
 Reloads Kepware.
### Endpoint:
 /reload_kepware_now
### Method:
 GET
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.


## reboot_PCA
### Description:
 Reboots PCA.
### Endpoint:
 /pca/reboot
### Method:
 GET
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## add_recovery_ip
### Description:
 Adds a recovery IP address for PCA.
### Endpoint:
 /pca/recovery_ip_address/set
### Method:
 GET
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## remove_recovery_ip
### Description:
 Removes the recovery IP address for PCA.
### Endpoint:
 /pca/recovery_ip_address/unset
### Method:
 GET
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## downloadJSON
### Description:
 Downloads JSON data.
Parameters: object - JSON object to download.
Parameters: reportName - Name of the report.
Parameters: hostname - Hostname (optional).
### Returns:
 None.
Throws: Error if an error occurs during the download process.


## get_archive
### Description:
 Retrieves archive data.
### Endpoint:
 /conf/archive
### Method:
 GET
### Returns:
 Response from the server containing archive data.
Throws: Error if an error occurs during the retrieval process.


## send_archive
### Description:
 Sends archive data to the server.
### Endpoint:
 /conf/archive/set
### Method:
 POST
Parameters: data - Archive data to be sent.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## delete_archive_note
### Description:
 Deletes an archive note based on its title.
### Endpoint:
 /conf/archive/del?title={title}
### Method:
 GET
Parameters: title - Title of the note to be deleted.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## send_login
### Description:
 Sends login credentials to the server for authentication.
### Endpoint:
 /conf/login
### Method:
 POST
Parameters: data - Login credentials data.
### Returns:
 Response from the server. If successful, it includes an access token, which is stored in the local storage.
Throws: Error if an error occurs during the request process.

## send_register
### Description:
 Sends registration data to the server to create a new user account.
### Endpoint:
 /conf/register
### Method:
 POST
Parameters: data - Registration data.
### Returns:
 Response from the server. If successful, it includes an access token, which is stored in the local storage.
Throws: Error if an error occurs during the request process.

## check_credentials
### Description:
 Checks the credentials of the current user.
### Endpoint:
 /conf/check-credentials
### Method:
 GET
### Returns:
 Response from the server containing information about the current user's credentials.
Throws: Error if an error occurs during the request process.

## test_connection
### Description:
 Tests network connection by pinging a specified destination.
### Endpoint:
 /external/network/ping
### Method:
 POST
Parameters: data - Destination data for the ping test.
### Returns:
 Response from the server containing the result of the ping test.
Throws: Error if an error occurs during the request process.

## get_matrix
### Description:
 Retrieves matrix data.
### Endpoint:
 /fast-data/matrix
### Method:
 GET
### Returns:
 Response from the server containing matrix data.
Throws: Error if an error occurs during the request process.

## get_users
### Description:
 Retrieves user data.
### Endpoint:
 /conf/users
### Method:
 GET
### Returns:
 Response from the server containing user data.
Throws: Error if an error occurs during the request process.

## delete_user
### Description:
 Deletes a user based on their username.
### Endpoint:
 /conf/users/delete?user={user}
### Method:
 GET
Parameters: user - Username of the user to be deleted.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## add_user
### Description:
 Adds a new user.
### Endpoint:
 /conf/users/create
### Method:
 POST
Parameters: data - User data to be added.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## change_password
### Description:
 Changes the password of the current user.
### Endpoint:
 /conf/login/password/update
### Method:
 POST
Parameters: data - New password data.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## ntp_start
### Description:
 Starts NTP time synchronization.
### Endpoint:
 /confA/ntp/timesync/start
### Method:
 POST
Parameters: data - Data related to NTP time synchronization.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## ntp_resinc
### Description:
 Resynchronizes NTP servers.
### Endpoint:
 /confA/ntp/servers/resync
### Method:
 POST
Parameters: data - Data related to NTP server resynchronization.
### Returns:
 Response from the server.
Throws: Error if an error occurs during the request process.

## get_advanced
### Description:
 Retrieves advanced information or performs actions for a specified service.
### Endpoint:
 /pca/services/action?service={service}&command={command}
### Method:
 GET
Parameters:
service - Name of the service.
command - Command to be executed.
### Returns:
 Response from the server containing advanced information or action results.
Throws: Error if an error occurs during the request process.


