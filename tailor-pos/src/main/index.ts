import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Database from 'better-sqlite3'
import fs from 'fs'

// Initialize Database
const dbPath = join(app.getPath('userData'), 'shop_data.db')
const db = new Database(dbPath)

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    date TEXT,
    lambayi TEXT,
    tira TEXT,
    astain TEXT,
    astainType TEXT,
    colar TEXT,
    colarType TEXT,
    width TEXT,
    widthType TEXT,
    chati TEXT,
    shalwar TEXT,
    painsa TEXT,
    frontPocket TEXT,
    sidePocket TEXT,
    patti TEXT,
    remarks TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`)

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC Handlers
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('export-backup', async (event) => {
    try {
      const mainWindow = BrowserWindow.fromWebContents(event.sender)
      if (!mainWindow) throw new Error('Could not find main window')

      const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
        title: 'Export Database Backup',
        defaultPath: 'tailor_backup_data.db',
        filters: [{ name: 'SQLite Database', extensions: ['db'] }]
      })

      if (canceled || !filePath) {
        return { success: false, error: 'Canceled by user' }
      }

      fs.copyFileSync(dbPath, filePath)
      return { success: true }
    } catch (error: any) {
      console.error('Backup Error:', error)
      return { success: false, error: error?.message || 'Unknown backup error' }
    }
  })

  ipcMain.handle('save-order', async (_event, data) => {
    try {
      // 1. Insert or get Customer
      const upsertCustomer = db.prepare(`
        INSERT INTO customers (name, phone)
        VALUES (?, ?)
        ON CONFLICT(phone) DO UPDATE SET name=excluded.name
        RETURNING id
      `)
      const customer = upsertCustomer.get(data.customerName, data.phoneNumber) as { id: number } | undefined
      
      if (!customer) {
        throw new Error('Failed to create or retrieve customer.')
      }

      const customerId = customer.id

      // 2. Insert Order
      const insertOrder = db.prepare(`
        INSERT INTO orders (
          customer_id, date, lambayi, tira, astain, astainType, 
          colar, colarType, width, widthType, chati, shalwar, 
          painsa, frontPocket, sidePocket, patti, remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      insertOrder.run(
        customerId,
        new Date().toISOString(),
        data.lambayi,
        data.tira,
        data.astain,
        data.astainType,
        data.colar,
        data.colarType,
        data.width,
        data.widthType,
        data.chati,
        data.shalwar,
        data.painsa,
        data.frontPocket,
        data.sidePocket,
        data.patti,
        data.remarks
      )

      return { success: true }
    } catch (error: any) {
      console.error('Database Error:', error)
      return { success: false, error: error?.message || 'Unknown database error' }
    }
  })

  ipcMain.handle('search-orders', async (_event, searchTerm) => {
    try {
      const query = `
        SELECT o.*, c.name as customerName, c.phone as phoneNumber
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE c.name LIKE ? OR c.phone LIKE ?
        ORDER BY o.date DESC
      `
      const results = db.prepare(query).all(`%${searchTerm}%`, `%${searchTerm}%`)
      return { success: true, data: results }
    } catch (error: any) {
      console.error('Search Error:', error)
      return { success: false, error: error?.message || 'Unknown search error' }
    }
  })

  ipcMain.handle('delete-order', async (_event, orderId) => {
    try {
      const deleteStmt = db.prepare('DELETE FROM orders WHERE id = ?')
      deleteStmt.run(orderId)
      return { success: true }
    } catch (error: any) {
      console.error('Delete Error:', error)
      return { success: false, error: error?.message || 'Unknown delete error' }
    }
  })

  ipcMain.handle('update-order', async (_event, data) => {
    try {
      const upsertCustomer = db.prepare(`
        INSERT INTO customers (name, phone)
        VALUES (?, ?)
        ON CONFLICT(phone) DO UPDATE SET name=excluded.name
        RETURNING id
      `)
      const customer = upsertCustomer.get(data.customerName, data.phoneNumber) as { id: number } | undefined
      
      if (!customer) throw new Error('Failed to create or retrieve customer.')
      
      const updateOrder = db.prepare(`
        UPDATE orders SET
          customer_id = ?, lambayi = ?, tira = ?, astain = ?, astainType = ?, 
          colar = ?, colarType = ?, width = ?, widthType = ?, chati = ?, shalwar = ?, 
          painsa = ?, frontPocket = ?, sidePocket = ?, patti = ?, remarks = ?
        WHERE id = ?
      `)

      updateOrder.run(
        customer.id,
        data.lambayi, data.tira, data.astain, data.astainType,
        data.colar, data.colarType, data.width, data.widthType,
        data.chati, data.shalwar, data.painsa, data.frontPocket,
        data.sidePocket, data.patti, data.remarks,
        data.id
      )

      return { success: true }
    } catch (error: any) {
      console.error('Update Error:', error)
      return { success: false, error: error?.message || 'Unknown update error' }
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

