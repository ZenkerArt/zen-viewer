"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProtocol = void 0;
const net_1 = require("net");
class DataProtocol {
    _port = 8083;
    _ip = '127.0.0.1';
    shutdownServer = () => {
        return this.sendText('shutdownServer', '');
    };
    sendText = (name, text) => {
        const client = new net_1.Socket();
        let header = '';
        const h = {
            type: 'text',
            name
        };
        Object.entries(h).forEach(([key, value]) => {
            header += `${key}:${value}\n`;
        });
        client.connect(this._port, this._ip, function () {
            client.write(`${header}\n${text}`);
        });
        return new Promise((resolve, reject) => {
            const chunks = [];
            client.on('close', function () {
                resolve(chunks);
            });
            client.on('error', (err) => {
                reject(err);
            });
            client.on('data', function (data) {
                chunks.push(data);
            });
        });
    };
    sendJson = (event, data) => {
        return this.sendText(event, JSON.stringify(data));
    };
    ping = () => {
        return this.sendText('ping', '');
    };
    requestImage = async (path, resize) => {
        const image = await this.sendJson('requestImage', {
            path,
            resize
        });
        return new Blob(image, {
            type: 'image/jpeg'
        });
    };
}
exports.DataProtocol = DataProtocol;
