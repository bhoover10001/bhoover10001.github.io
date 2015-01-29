function setToCanvas(image, canvas) {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  getContext(canvas).drawImage(image, 0, 0);
}

function calculateHistogram(canvas) {
  var pixels = getContext(canvas).getImageData(0,0, canvas.width, canvas.height).data
  var red = new Uint32Array(256);
  var green = new Uint32Array(256);
  var blue = new Uint32Array(256);
  var alpha = new Uint32Array(256);
  var grey = new Uint32Array(256);
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    red[pixels[i]] +=1;
    green[pixels[i+1]] +=1;
    blue[pixels[i+2]] +=1;
    alpha[pixels[i+3]] += 1;
    grey[Math.floor((pixels[i] + pixels[i+1] + pixels[i+2]) /3)] += 1;
  }
  return {red: red, green: green, blue: blue, grey: grey, alpha: alpha};
}

function getContext(canvas) {
	return canvas.getContext('2d');
}

function convertToGreyScale(canvas) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  var pixels = map.data;
  var red, green, blue, grey;
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    red = pixels[i];
    green = pixels[i+1];
    blue = pixels[i+2];
    grey = Math.floor((red + green + blue) /3);
    pixels[i] = pixels[i + 1] = pixels[i + 2] = grey;
  }
  getContext(canvas).putImageData(map, 0, 0);
}

function equalizeGreyScale(canvas) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  var pixels = map.data;
  var greyScalePixels = calculateHistogram(canvas).grey;
  var numPixels = canvas.width * canvas.height;
  var conversion = calculateEqualization(greyScalePixels, numPixels);
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    red = pixels[i];
    green = pixels[i+1];
    blue = pixels[i+2];
    grey = Math.floor((red + green + blue) /3);
    pixels[i] = pixels[i + 1] = pixels[i + 2] = conversion[grey];
  }
  getContext(canvas).putImageData(map, 0, 0);
}

function calculateEqualization(greyScalePixels, numPixels) {
  var cdf = 0;
  var p = [];
  console.log(numPixels)
  for (var i = 0; i < 256; i+= 1) {
    cdf += greyScalePixels[i];
    p[i] = Math.floor((cdf - greyScalePixels[0]) * 255 / (numPixels- greyScalePixels[0]));
  }
  return p;
}

function localMeansGreyScale(canvas, blockSize) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  var pixels = map.data;
  var window = Math.floor(blockSize /2);
  if (blockSize > 1) {
    for (var y = 0; y < canvas.height; y += 1) {
      for (var x = 0; x < canvas.width; x += 1) {
        var startY = Math.max(0, y - window);
        var startX = Math.max(0, x - window);
        var endY = Math.min(canvas.height -1, y + window);
        var endX = Math.min(canvas.width -1, x + window);
        var greyScalePixels = [];
        for (var y1 = startY; y1 <= endY; y1 += 1) {
           for (var x1 = startX; x1 <= endX; x1 +=1) {
             greyScalePixels.push(pixels[(y1 * canvas.width * 4) + x1 * 4]);
           }
        }
        setGreyPixels(pixels, currentPixelArrayLocation(y, x, canvas.width), mean(greyScalePixels));
      }
    }
  }
  getContext(canvas).putImageData(map, 0, 0);
}

function medianFilterGreyScale(canvas) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  var pixels = map.data;
  var window = 1;
  for (var y = 0; y < canvas.height; y += 1) {
    for (var x = 0; x < canvas.width; x += 1) {
      var startY = Math.max(0, y - window);
      var startX = Math.max(0, x - window);
      var endY = Math.min(canvas.height -1, y + window);
      var endX = Math.min(canvas.width -1, x + window);
      var greyScalePixels = [];
      for (var y1 = startY; y1 <= endY; y1 += 1) {
         for (var x1 = startX; x1 <= endX; x1 +=1) {
           greyScalePixels.push(pixels[(y1 * canvas.width * 4) + x1 * 4]);
         }
      }
      setGreyPixels(pixels, currentPixelArrayLocation(y, x, canvas.width), median(greyScalePixels));
    }
  }
  getContext(canvas).putImageData(map, 0, 0);
}

function setGreyPixels(pixels, arrayLocation, value) {
  pixels[arrayLocation] = pixels[arrayLocation + 1] = pixels[arrayLocation + 2] = value;
}

function mean(pixelArray) {
  var total = pixelArray.reduce(function(a,b) {return a+b});
  return Math.floor(total/pixelArray.length);
}

function median(pixelArray) {
  pixelArray.sort(function(a,b) {return a - b;});
  var half = Math.floor(pixelArray.length/2);
  if (pixelArray.length % 2) {
    return pixelArray[half];
  }
  return pixelArray[half-1];
}

/**
 * Generates a random noise, with a density, that really the probability that any 
 * pixel is noisy.  This adds the exact same noise to all the RGB channels, hence the "greyScale" label.
 * Density should be between 0 and 1.
 * @param canvas
 * @param density
 */
function greyScaleWhiteNoiseGenerator(canvas, density) {
  var map = getContext(canvas).getImageData(0,0, canvas.width, canvas.height);
  var pixels = map.data;
  for (var y = 0; y < canvas.height; y += 1) {
    for (var x = 0; x < canvas.width; x += 1) {
      if (Math.random() > density) {
        continue;
      }
      var noise = Math.floor(Math.random() * 256);
      var currentRedPixel = currentPixelArrayLocation(y, x, canvas.width);
      pixels[currentRedPixel] = pixels[currentRedPixel + 1] = pixels[currentRedPixel + 2] = (pixels[currentRedPixel] + noise) % 256;
    }
  }
  getContext(canvas).putImageData(map, 0, 0);
}

function currentPixelArrayLocation(y, x, imageWidth) {
  return (y * imageWidth * 4) + x * 4;
}