import {api} from './index'

const {contextBridge} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {api})