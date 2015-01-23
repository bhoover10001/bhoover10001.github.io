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
  var minValue = 0;
  for (var i = 0; i < 256; i+= 1) {
    if (greyScalePixels[i] > 0) {
      minValue = i;
      break;
    }
  }
  var maxValue = 0;
  for (var i = 255; i > 0; i -= 1) {
    if (greyScalePixels[i] > 0) {
      maxValue = i;
      break;
    }
  }
  for (var i = 0; i <= 256; i+= 1) {
    cdf += greyScalePixels[i];
    p[i] = Math.floor(cdf * 255 / numPixels);
  }
  return p;
}
