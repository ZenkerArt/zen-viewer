"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', { api: index_1.api });
