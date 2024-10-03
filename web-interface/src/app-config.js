const server_main_port = 4000;

const server_main_ws = 'ws://localhost:' + server_main_port;
const server_main_http = 'http://localhost:' + server_main_port;

const Agora_AppID = 'YOUR APP ID'; //Your Agora App ID
const Agora_Token = null;
const Agora_Channel = 'main'

const config = {
    server_main_port: server_main_port,
    server_main_ws: server_main_ws,
    server_main_http: server_main_http,
    appId: Agora_AppID,
    token: Agora_Token,
    channel: Agora_Channel
}

module.exports = config;