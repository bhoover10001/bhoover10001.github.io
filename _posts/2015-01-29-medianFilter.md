---
layout: page
title: Median Filter
date: 29-Jan-2015
---
This is a median filter, that looks for the median of a 3x3 block for each pixel.
<canvas id="original" />

The noise density - This is the percentage of the image that is covered in white noise.<br />
<input id="noiseDensity" 
  value = "0.1"
  data-slider-id='ex1Slider' 
  type="text" 
  data-slider-min="0" 
  data-slider-max="0.4" 
  data-slider-step="0.005" 
  data-slider-value="0.1"/>&nbsp;
  <input id="go" type="submit" value="Go" />
  
<div>
  The noisy image<br />
</div>
<canvas id="greyScale" />

  
<div>
  The Median Filtered<br />
</div>

<canvas id="medianAveraging" />


{% highlight JavaScript %}  
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
{% endhighlight %}

<script>
  var img = new Image();   // Create new img element
  var originalCanvas = document.getElementById('original');
  var greyScaleCanvas = document.getElementById('greyScale');
  var medianCanvas = document.getElementById('medianAveraging');
  img.addEventListener("load", function() {
    setToCanvas(img, originalCanvas);
    convertToGreyScale(originalCanvas);
     generateImages($('#noiseDensity').val());
  }, false);
  
  img.src = '{{ page.base_url }}/img/Ferocious_Tammy.png'; // Set source path
  
  function generateImages(noiseDensity) {
    setToCanvas(img, greyScaleCanvas);
    convertToGreyScale(greyScaleCanvas);
    greyScaleWhiteNoiseGenerator(greyScaleCanvas, noiseDensity);
    setToCanvas(img, medianCanvas);
    convertToGreyScale(medianCanvas);
    greyScaleWhiteNoiseGenerator(medianCanvas, noiseDensity);
    medianFilterGreyScale(medianCanvas);
  }
  
  $('#go').click(function() {
    generateImages($('#noiseDensity').val());
  });
  
  $(function() {
    $('#noiseDensity').slider({
      formatter: function(value) {
        return 'Current value: ' + value;
      }
    });
  });
</script>