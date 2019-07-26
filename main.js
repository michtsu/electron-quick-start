// Modules to control application life and create native browser window
const {app, Menu, MenuItem, BrowserWindow} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let sharedWorkers

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // Don't show the window until it ready, this prevents any white flickering
    show: false,    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Show window when page is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  buildMenuOptions();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

function buildSharedWorkerMenuOptions(focusedWindow) {
    let sharedWorkerMenu = [];
    if (focusedWindow) {
      const sharedWorkers = focusedWindow.webContents.getAllSharedWorkers();
      sharedWorkers.forEach((sharedWorker) => {
        console.log('Appending menu item for shared worker ' + sharedWorker.url);
        sharedWorkerMenu.push({
          label: 'Debug shared worker ' + sharedWorker.id,
          click (item, focusedWindow) {
            focusedWindow.webContents.inspectSharedWorkerById(sharedWorker.id)
          }      
        });
      });
      const template = [
        {
          label: 'Debug shared workers',
          submenu: sharedWorkerMenu
        }
      ];
      const menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)      
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function buildMenuOptions() {
  const template = [
    {
      label: 'Teams',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
        {
          label: 'Debug shared workers',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+S',
          click (item, focusedWindow) {
            if (focusedWindow) {
              buildSharedWorkerMenuOptions(focusedWindow);
            }
          }
        },
      ]
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}