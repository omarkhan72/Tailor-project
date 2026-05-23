import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  saveOrder: (data: any) => ipcRenderer.invoke('save-order', data),
  searchOrders: (searchTerm: string) => ipcRenderer.invoke('search-orders', searchTerm),
  deleteOrder: (orderId: number) => ipcRenderer.invoke('delete-order', orderId),
  updateOrder: (data: any) => ipcRenderer.invoke('update-order', data)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
