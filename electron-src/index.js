"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const promises_1 = require("node:fs/promises");
const mime_types_1 = require("mime-types");
const path_1 = __importDefault(require("path"));
const electron = __importStar(require("electron"));
const electron_1 = require("electron");
const DataProtocol_1 = require("./DataProtocol");
const ServerController_1 = require("./ServerController");
class FileSys {
    readFile = promises_1.readFile;
    lstat = promises_1.lstat;
    readdir = promises_1.readdir;
    isDir = async (path) => (await (0, promises_1.lstat)(path)).isDirectory();
    contentType = mime_types_1.contentType;
    scanDir = async (p) => (await (0, promises_1.readdir)(p)).map(item => path_1.default.join(p, item));
    showFile = (path) => {
        electron.shell.showItemInFolder(path);
    };
}
class ThisWindow {
    startMove = () => {
        electron_1.ipcRenderer.send('start-drag-window');
    };
    stopMove = () => {
        electron_1.ipcRenderer.send('stop-drag-window');
    };
    alwaysOnTop = (value) => {
        electron_1.ipcRenderer.send('always-on-top', value);
    };
}
const proto = new DataProtocol_1.DataProtocol();
const server = new ServerController_1.ServerController(proto);
electron_1.ipcRenderer.on('quit', () => {
    server.stopServer();
});
server.startServer();
exports.api = {
    fileSys: new FileSys(),
    thisWindow: new ThisWindow(),
    dataProtocol: proto,
    serverController: server
};
