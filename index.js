const { app, BrowserWindow, Menu } = require('electron'); 
// electron 모듈을 읽어드리고, app 인스턴스 와 BrowserWindow 클래스를 추출
// app 인스턴스는 애플리케이션의 생명주기 조작 등을 담당하고 Electron 애플리케이션 
// 실행 때 자동으로 인스턴스가 생성된다. app 인스턴스는 Electron 애플리케시션 전체에서 
// 인스턴스가 1개밖에 없는 싱글톤 객체이다.
// BrowserWindow 클래스의 인스턴스는 Renderer 프로세스를 만들어 웹페이지를 출력한다.
// BrowserWindow 인스턴스 1개는 웹 페이지 1개를 의미한다.

const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
});

let win;

function createWindow() {
    win = new BrowserWindow({ 
        webPreferences: {
            nodeIntegration: true,  // html 에서 require 실행됨
            contextIsolation: false // html 에서 require 실행됨
        }
     });
    win.loadURL(`file://${__dirname}/index.html`);
    win.on("closed", () => { win = null; });
}

app.on("ready", createWindow); // Electron 애플리케이션이 실행되고 초기화가 완료되었을 때
app.on("window-all-closed", () => { // 모든 윈도우가 닫혔을 때
    if(process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => { // Electron이 비활성화 상태에서 활성화 되었을 때(macOS만 지원)
    if(win === null) {
        createWindow();
    }
});

const appMenu = Menu.buildFromTemplate(
    [
        {
            label: "File",
            submenu: [
                { 
                  label: "New Window", 
                  accelerator: "CmdOrCtrl+N", 
                  click: createWindow 
                },
                { 
                  type: "separator" 
                },
                { 
                  label: "Close", 
                  accelerator: "CmdOrCtrl+W", 
                  role: "close" 
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
              {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
              },
              {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
              },
              {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
              },
              {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
              },
            ]
        },
        {
        label: 'View',
        submenu: [
            {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: (item, focusedWindow) => focusedWindow && focusedWindow.reload()
            },
            {
            label: 'Toggle DevTools',
            accelerator: process.platform === 'darwin' ? "Alt+Command+I" : "F12",
            click: (item, focusedWindow) => focusedWindow && focusedWindow.toggleDevTools()
            }
        ]
        },
        {
            role: 'window',
            submenu: [
                {role: 'minimize'},
                {role: 'zoom'}
            ]
        }
    ]
);

Menu.setApplicationMenu(appMenu);