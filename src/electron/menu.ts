import { app, BrowserWindow, Menu } from "electron";
import { ipcWebContentsSend } from "./util";

const name = app.getName();

export function createMenu(bw: BrowserWindow) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: name,
            submenu: [
                {
                    label: 'Settings'
                },
                {
                    label: 'Source',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://github.com/mucaca1/urbarik')
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        }
    ]));
};