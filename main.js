const {app,BrowserWindow} = require('electron');

let ventana;
function createWindow(){
    ventana  = new BrowserWindow({
        width: 800,
        height: 450
    })
    ventana.loadFile('./index.html');
}

app.whenReady().then(createWindow);