// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var worker1 = new SharedWorker('shared-worker1.js');
var worker2 = new SharedWorker('shared-worker2.js');

worker1.port.start();
worker2.port.start();