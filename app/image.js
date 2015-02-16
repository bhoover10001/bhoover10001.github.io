var workersCount = 4;

function drawToCanvas(imageData, canvas) {
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  getContext(canvas).putImageData(imageData, 0, 0);
}

function getContext(canvas) {
  return canvas.getContext('2d');
}

function calculateEqualization(greyScalePixels, numPixels) {
  var cdf = 0;
  var p = [];
  for (var i = 0; i < 256; i+= 1) {
    cdf += greyScalePixels[i];
    p[i] = Math.floor((cdf - greyScalePixels[0]) * 255 / (numPixels- greyScalePixels[0]));
  }
  return p;
}


function guassian_seed() {
  return (Math.random() * 2 - 1) + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
}

function rnd(mean, stdDev) {
  return Math.round(guassian_seed() * stdDev + mean);
}

Filters = {};

Filters.getPixels = function(img) {
  var c = this.getCanvas(img.width, img.height);
  var ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0,0,c.width, c.height);
}

Filters.getCanvas = function(w, h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

Filters.copyPixels = function(img) {
  var c = this.getCanvas(img.width, img.height);
  var ctx = c.getContext('2d');
  ctx.putImageData(img, 0, 0);
  return ctx.getImageData(0,0,c.width, c.height);
}


Filters.filterImage = function(filter, image, var_args) {
  var args = [this.getPixels(image)];
  for (var i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return filter.apply(null, args);
}

Filters.greyscale = function(pixels, args) {
  var red = parseFloat(args[0]);
  var green = parseFloat(args[1]);
  var blue = parseFloat(args[2]);
  var total = red + green + blue;
  red /= total;
  green /= total;
  blue /= total;
  var d = pixels.data;
  var numPixels = d.length;
  var r,g,b,v;
  for (var i = 0; i < numPixels; i+= 4) {
    r = d[i];
    g = d[i+1];
    b = d[i+2];
    v = Math.floor(red*r + green*g + blue*b);
    d[i] = d[i+1] = d[i+2] = v;
  }
  return pixels;
}

/**
 * puts the same noise on each of the pixels.  This is mostly for the case where the 
 * image is already a grey scale.
 */
Filters.greyscaleguassiannoise = function(pixels, mean, stdev) {
  var d = pixels.data;
  var numPixels = d.length;
  var r,g,b,noise;
  for (var i = 0; i < numPixels; i+= 4) {
   noise = rnd( mean, stdev);
   d[i] += noise;
   d[i+1] += noise;
   d[i+2] += noise;
  }
  return pixels;
}

/**
 * covers the image with white noise.  The chances of a pixel having white noise is the density, which is a number from 0 to 1.
 * args.noiseDensity, from 0...1;
 * args.minValue; 
 * args.maxValue;
 */
Filters.whitenoise = function(pixels, args) {
  var density = args.noiseDensity;
  var minVal = args.minVal;
  var maxVal = args.maxVal;
  var d = pixels.data;
  var numPixels = d.length;
  var r,g,b,noise;
  var noiseWidth = maxVal - minVal;
  for (var i = 0; i < numPixels; i+= 4) {
   for (var j = 0; j < 3; j++) {
     if (Math.random() < density) {
       d[i + j] += Math.random()*noiseWidth + minVal;
     }
   }
  }
  return pixels;
}

/**
 * Computes the histogram, returning a struct with Red, Green, Blue and Grey.  The
 * grey scale balance is set from the arguments.
 */
Filters.histogram = function(pixels, args) {
  var red = parseFloat(args[0]);
  var green = parseFloat(args[1]);
  var blue = parseFloat(args[2]);
  var total = red + green + blue;
  red /= total;
  green /= total;
  blue /= total;
  var d = pixels.data;
  var redArray = new Uint32Array(256);
  var greenArray = new Uint32Array(256);
  var blueArray = new Uint32Array(256);
  var greyArray = new Uint32Array(256);
  var numPixels = d.length;
  for (var i = 0; i < numPixels; i+= 4) {
    redArray[d[i]] ++;
    greenArray[d[i+1]] ++;
    blueArray[d[i+2]] ++;
    greyArray[Math.floor(red*d[i] + green*d[i+1] + blue*d[i+2])] ++;
  }
  return {red: redArray, green: greenArray, blue: blueArray, grey: greyArray};
}

Filters.equalizeGreyScale = function(pixels, args) {
  var greyScaleImgData = Filters.greyscale(pixels, [0.2126, 0.7152, 0.0722]);
  var d = pixels.data;
  var numPixels = d.length;
  var greyDistribution = Filters.histogram(greyScaleImgData, [0.2126, 0.7152, 0.0722]).grey;
  var equalizationTable = calculateEqualization(greyDistribution, numPixels / 4);
  for (var i = 0, n = d.length; i < n; i += 4) {
    d[i] = d[i + 1] = d[i + 2] = equalizationTable[d[i]];
  }
  return pixels;
}

Filters.meansFilter = function(pixels, args) {
  var filter = [];
  var filterSize = args.windowSize;
  var numElements = Math.pow(filterSize,2)
  for (y = 0; y < numElements; y ++) {
    filter[y] = 1;
  }
  return convolve(filter, pixels)
}

Filters.sharpen = function(pixels, args) {
//  var filter = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  var filter = [0, -9, 0, -9, 45, -9, 0, -9, 0];
  return convolve(filter, pixels)
}

Filters.laPlace = function(pixels, args) {
  var filter = [0, 9, 0, 9, -36, 9, 0, 9, 0];
  return convolve(filter, pixels)
}

Filters.medianFilter = function(pixels) {
  var promise = $.Deferred();
  var height = pixels.height;
  var width = pixels.width;
  var window = 3;
  var windowSize = Math.pow(window, 2);
  var redPixels, bluePixels,greenPixels;
  var d = pixels.data;
  var resultCanvasContext = Filters.getCanvas(pixels.width, pixels.height).getContext('2d');
  var blockSize = Math.ceil(pixels.height / workersCount);
  var finished = 0;
  var onWorkEnded = function (e) {
      var canvasData = e.data.result;
      var index = e.data.index;
      resultCanvasContext.putImageData(canvasData, 0, blockSize * index );
      finished++;
      if (finished == workersCount) {
        promise.resolve(resultCanvasContext.getImageData(0,0, pixels.width, pixels.height));
      }
  };
  var remainingPixels = pixels.height;
  var tempContext = Filters.getCanvas(pixels.width, pixels.height).getContext("2d");
  tempContext.putImageData(pixels, 0, 0);
  var tempCanvasData = tempContext.createImageData(pixels.width, blockSize);
  for (var index = 0; index < workersCount; index++) {
    var worker = createWorker("/app/medianWorker.js");
    worker.onmessage = onWorkEnded;
    var startY = Math.max(0, blockSize * index);
    var blockHeight = blockSize;
    if (index === workersCount - 1) {
      blockHeight = remainingPixels;
    }
    var canvasData = tempContext.getImageData(0, startY, pixels.width, blockHeight);
    worker.postMessage({ canvasData: canvasData, tempCanvasData: tempCanvasData, index: index});
    remainingPixels -= blockSize;
  }
  return promise;
}


function convolve(filter, pixels) {
  var promise = $.Deferred();
  var filterSize = Math.sqrt(filter.length);
  var windowOffset = Math.ceil(filterSize /2);
  var len = pixels.width * pixels.height * 4;
  var finished = 0;
  var segmentLength = len / workersCount;
  var blockSize = Math.ceil(pixels.height / workersCount);
  var resultCanvas = Filters.getCanvas(pixels.width, pixels.height);
  var resultContext = resultCanvas.getContext('2d');
  var onWorkEnded = function (e) {
      var canvasData = e.data.result;
      var index = e.data.index;
      resultContext.putImageData(canvasData, 0, blockSize * index );
      finished++;
      if (finished == workersCount) {
        promise.resolve(resultContext.getImageData(0,0, pixels.width, pixels.height));
      }
  };
  var tempContext = Filters.getCanvas(pixels.width, pixels.height).getContext("2d");
  tempContext.putImageData(pixels, 0, 0);
  var tempCanvasData = tempContext.createImageData(pixels.width, blockSize);
  var remainingPixels = pixels.height;
  for (var index = 0; index < workersCount; index++) {
    var worker = createWorker("/app/convolutionWorker.js");
    worker.onmessage = onWorkEnded;
    var startY = Math.max(0, blockSize * index - windowOffset);
    var blockHeight = blockSize + filterSize;
    if (index === workersCount - 1) {
      blockHeight = remainingPixels;
    }
    var canvasData = tempContext.getImageData(0, startY, pixels.width, blockHeight);
    if (startY !== 0) {
      startY = windowOffset;
    }
    worker.postMessage({ canvasData: canvasData, tempCanvasData: tempCanvasData, index: index, length: segmentLength, filter: filter, startY: startY });
    remainingPixels -= blockSize;
  }
  return promise;
}

function createWorker(workerScript) {
  return new Worker(workerScript);
}