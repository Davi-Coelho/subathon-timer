const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('api', {
    saveConfig: (subathonConfig) => {
        ipcRenderer.invoke('store-save-config', subathonConfig)
    },
    saveLanguage: (language) => {
        ipcRenderer.invoke('store-save-language', language)
    },
    loadConfig:  async () => {
        return await ipcRenderer.invoke('store-load-config')
    },
    getLanguage: async () => {
        return await ipcRenderer.invoke('store-load-language')
    }
})
