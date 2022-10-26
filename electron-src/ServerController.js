"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerController = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const bins = __dirname.includes('app.asar') ?
    path_1.default.join(__dirname, '../../app.asar.unpacked/bins/image_backend/ImageHandler.exe')
    : path_1.default.join(__dirname, '../bins/image_backend/ImageHandler.exe');
console.log(bins);
class ServerController {
    _dataProto;
    constructor(dataProto) {
        this._dataProto = dataProto;
    }
    startServer = async (path = bins) => {
        try {
            await this._dataProto.ping();
            return;
        }
        catch (e) {
        }
        const process = (0, child_process_1.exec)(path, console.log);
        process.stdout.on('data', (data) => {
            console.log(data);
        });
    };
    stopServer = () => {
        return this._dataProto.shutdownServer();
    };
}
exports.ServerController = ServerController;
