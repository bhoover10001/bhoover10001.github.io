---
layout: page
title: LaPlace Filter
date: 29-Jan-2015
---
This is a median filter, that looks for the median of a 3x3 block for each pixel.
<canvas id="original" />

<div>
  The LaPlace Filtered<br />
</div>

<canvas id="laPlaceFilter" />

<canvas id="sharpened" />

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

<script src="{{ page.base_url }}/assets/js/image.js"></script>
<script>
  var img = new Image();   // Create new img element
  var originalCanvas = document.getElementById('original');
  var laPlaceFilterCanvas = document.getElementById('laPlaceFilter');
  var sharpenedCanvas = document.getElementById('sharpened');
  img.addEventListener("load", function() {
    setToCanvas(img, originalCanvas);
    convertToGreyScale(originalCanvas);
     generateImages();
  }, false);
  
  img.src = '{{ page.base_url }}/img/camouflage08.jpg'; // Set source path
  
  function generateImages() {
    setToCanvas(img, laPlaceFilterCanvas);
    convertToGreyScale(laPlaceFilterCanvas);
    laPlaceFilterGreyScale(laPlaceFilterCanvas);
    equalizeGreyScale(laPlaceFilterCanvas);
    setToCanvas(img, sharpenedCanvas);
    convertToGreyScale(sharpenedCanvas);
    sharpenFilterGreyScale(sharpenedCanvas);
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