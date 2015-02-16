importScripts("/app/convolution.js");

self.onmessage = function (e) {
    var canvasData = e.data.canvasData;
    var tempCanvasData = e.data.tempCanvasData;
    var filter = e.data.filter;
    var startY = e.data.startY;
    var index = e.data.index;
    tempCanvasData = median(canvasData, tempCanvasData);

    self.postMessage({ result: tempCanvasData, index: index });
};

