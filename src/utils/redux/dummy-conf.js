let dummy_config = {
  system: {
    network: {
      industrial: {
        dhcp: null,
        ip: null,
        routes: null,
        net_scan: null,
      },
      customer: {
        dhcp: null,
        static: {
          ip: null,
          dns: null,
          gateway: null,
          connected: null,
          mac: null,
        },
        if_wan_medium: null,
        wireless: null,
        essid: null,
        routes: null,
        ntp: null,
        nat: null,
        machine_to_internet: null,
        ALIAS: null,
        PORTS_TCP_SERVER_WAN: null,
        INPUT_NAT: null,
        firewall_enabled: null,
        ping: null,
      },
    },
    reboot: null,
    toProduction: null,
    onlyinternal: null,
    hostname: {
      customer: null,
      industrial: null,
    },
    a4updater_version: {
      industrial: null,
      customer: null,
    },
  },
  services: {
    kepware: {
      trial: null,
    },
    sitemanager: {
      domain: null,
      server: null,
      onlybidir: null,
      enabled: null,
      nameashostname: null,
      usentp: null,
      resetuid: null,
      connected: null,
      agents: null,
    },
    thingworx: {
      host: null,
      appkey: null,
      enabled: null,
      connected: null,
      version: null,
      diagnostic: null,
      thing_names: null,
      things: null,
    },
    backchannel: {
      topics: null,
      files: null,
    },
    opcua: {
      enabled: null,
      shift_property_from_kepware: null,
      shift_property_to_kepware: null,
      opcua: {
        custom_port_enable: null,
        custom_port: null,
      },
      security: {
        user_auth: null,
        users: null,
      },
      iotgw: {
        from: null,
        to: null,
      },
    },
    http: {
      enabled: null,
      running: null,
      file_from_kepware: null,
      file_to_kepware: null,
      shift_property_from_kepware: null,
      shift_property_to_kepware: null,

      security: {
        tls: null,
        cert_file: null,
        key_file: null,
        user_auth: null,

        users: {
          pippo: null,
          pluto: null,
        },
      },

      http: {
        custom_port_enable: null,
        custom_port: null,
        http_port: null,
      },
      iotgw: {
        from: null,
        to: null,
      },
      server_name: null,
      namespace: null,
    },
    fastdata: {
      enabled: null,
      running: null,
      industrial: {
        ftp: { enabled: null },
        http: { enabled: null },
      },
      customer: {
        matrix: { enabled: null },
      },
    },
  },
  timestamp: null,
  users: null,
  debug: null,
  version: null,
};

export { dummy_config };
