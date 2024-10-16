const server_main_port = 4000;

const server_main_ws = 'ws://localhost:' + server_main_port;
const server_main_http = 'http://localhost:' + server_main_port;

const model_conversation_boundary = [1,-6.5]; //Upper & Lower Boundary For Safe Score
const model_file_boundary = -1.5; //Bigger Is Considered To Be Deepfake Contaminated

const config = {
    server_main_port: server_main_port,
    server_main_ws: server_main_ws,
    server_main_http: server_main_http,
    model_conversation_boundary: model_conversation_boundary,
    model_file_boundary: model_file_boundary
}

module.exports = config;