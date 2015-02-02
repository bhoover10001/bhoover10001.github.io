---
layout: page
title: Converting an image to grey scale
date: 21-Jan-2015
---

A quick little utility for converting an image to grey scale.  All this is doing is taking the original image and 
averaging the RGB values for each pixels and then redrawing the image in the lower canvas.

<canvas id="imageProcessing" />
<div>
My cat - the Tigress.
</div>

<canvas id="greyScale" />

{% highlight JavaScript %}  
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
{% endhighlight %}

<script>
  var img = new Image();   // Create new img element
  var canvas = document.getElementById('imageProcessing');
  var greyScaleCanvas = document.getElementById('greyScale');
  img.addEventListener("load", function() {
    setToCanvas(img, canvas);
    setToCanvas(img, greyScaleCanvas);
    convertToGreyScale(greyScaleCanvas);
  }, false);
  
  img.src = '{{ page.base_url }}/img/Ferocious_Tammy.png'; // Set source path
</script>