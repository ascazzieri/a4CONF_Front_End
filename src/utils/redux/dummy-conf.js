let dummy_config = {
  system: {
    network: {
      industrial: {
        dhcp: false,
        ip: ["192.168.112.2/24", "192.168.112.21/24"],
        routes: {},
        net_scan: [],
      },
      customer: {
        dhcp: false,
        static: {
          ip: ["192.168.111.21/24"],
          dns: ["10.10.90.40"],
          gateway: "192.168.111.1",
          connected: false,
          mac: "macaddress1234",
        },
        if_wan_medium: "wireless",
        wireless: {
          WiFi_Ima_Sec: "prova",
        },
        essid: ["wireless1", "wireless2", "wireless3"],
        routes: {},
        ntp: ["127.123.123.123"],
        nat: true,
        machine_to_internet: true,
        ALIAS: {
          any_ip: "0.0.0.0/0",
          syslog_server: "",
          PORT_SSH: 22,
          PORT_DNS: 53,
          PORT_DHCP: 67,
          PORT_BOOTP: 68,
          PORT_HTTP: 80,
          PORT_NTP: 123,
          PORT_HTTPS: 443,
          PORT_SMB: 445,
          PORT_SYSLOG: 514,
          PORT_ALTSSH: 1022,
          PORT_OPCUA: 4840,
          PORT_ALTHTTP: 8080,
          PORT_ALTHTTPS: 8443,
          vscode_server: 8008,
        },
        PORTS_TCP_SERVER_WAN: {
          PORT_SSH: ["any_ip"],
          PORT_ALTSSH: ["any_ip"],
          PORT_OPCUA: ["any_ip"],
          vscode_server: ["any_ip"],
        },
        INPUT_NAT: [
          {
            IP_EXT: "",
            PORT_EXT: 3389,
            IP_DST: "192.0.2.1",
            PORT_DST: "",
            SOURCE: ["any_ip"],
          },
          {
            IP_EXT: "",
            PORT_EXT: 4040,
            IP_DST: "192.0.2.2",
            PORT_DST: "",
            SOURCE: ["any_ip", "10.10.10.10"],
          },
        ],
        firewall_enabled: true,
      },
    },
    reboot: false,
    toProduction: false,
    onlyinternal: false,
    hostname: {
      customer: "A207560000-0032",
      industrial: "A207560000-0032",
    },
    a4updater_version: {
      industrial: "123456789",
      customer: "123456789",
    },
  },
  services: {
    kepware: {
      trial: true,
    },
    sitemanager: {
      domain: "Talea.Devices.a4GATE.a4g_ufficio",
      server: "gm.ima.it 10.10.83.66 81.208.52.93",
      onlybidir: false,
      enabled: true,
      nameashostname: true,
      usentp: false,
      resetuid: false,
      connected: false,
      agents: {
        Agent1: {
          agent: "GENERIC:Desktop PC",
          name: "Full Access",
          sn: "#A1",
          cfg: "PC",
        },
        Agent2: {
          agent: "GENERIC:Secure Shell (SSH)",
          name: "Agent 2",
          sn: "#01",
          cfg: "PC",
        },
        Agent3: {
          agent: "GENERIC:Desktop PC",
          name: "PC A",
          sn: "#02",
          cfg: "192.0.2.1",
        },
        Agent4: {
          agent: "Secomea:SiteManager Embedded",
          name: "Agent 4",
          sn: "#03",
          cfg: "127.0.0.1",
        },
        Agent5: {
          agent: "GENERIC:Secure Shell (SSH)",
          name: "Agent 5",
          sn: "#04",
          cfg: "127.0.0.1",
        },
      },
    },
    thingworx: {
      host: "ima-dev.cloud.thingworx.com",
      appkey: "1d59bd5b-b4a3-48e1-98a8-d19bd5133429", //fai un trim() per sicurezza
      enabled: true,
      connected: false,
      version: "123456789", //altrimenti: Agent version not available
      thing_names: [
      ],
      things: {
        rt_testFede: {
          test_opcua: "fromkepware/rt_testFede",
        },
      },
    },
    backchannel: {
      topics: ["monitor/tf", "rep/rep/monitor/tf", "monitor/tailgate"],
      files: [
        "tf_http_xfer_channels_a.json",
        "tf_http_xfer_a.json",
        "filename.json",
      ],
    },
    opcua: {
      enabled: false,
      shift_property_from_kepware: "0",
      shift_property_to_kepware: "0",
      opcua: {
        custom_port_enable: true,
        custom_port: "4841",
      },
      security: {
        user_auth: false,
        users: {
          user1: "pass1",
          user2: "pass1",
        },
      },
      iotgw: {
        from: ["from1", "from2", "from3"],
        to: ["to1", "to2", "to3"],
      },
    },
    ftp: {
      A: {
        a4ftp: {
          cloud_provider: "microsoft",
          azure_SAS:
            "sv=2020-10-02&st=2022-06-21T14%3A10%3A53Z&se=2070-06-22T14%3A10%3A00Z&sr=c&sp=racwdl&sig=wWZb9eG%2BYKO4hSkCJO47yDXpnmA0X%2B%2FobDLJZdYyY6I%3D",
          azure_LSA: "a4gate0094blobs",
          azure_blobContainer: "blobs-1",
          processExistingFiles: true,
          http_port: 11002,
        },
        server: {
          anonymus_login: {},
          users: [],
          custom_port: false,
          port: 21,
          historyFile_folder_max_bytes: 1048576,
          historyFile_days_expire: 1,
          sentFile_folder_max_bytes: 1048576,
          sentFile_days_expire: 1,
          NOTsentFile_folder_max_bytes: 1048576,
          NOTsentFile_days_expire: 1,
        },
      },
      B: {
        enabled: true,
        cloud_provider: "microsoft",
        http_port: 11002,
      },
    },
  },
  timestamp: 111111111,
  users: {},
  debug: false,
  version: "2.9",
};

export { dummy_config };
