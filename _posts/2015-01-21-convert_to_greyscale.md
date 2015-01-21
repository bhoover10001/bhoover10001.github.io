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

<script>
  var img = new Image();   // Create new img element
  img.addEventListener("load", function() {
    setToCanvas(img);
  }, false);
  
  img.src = '{{ page.base_url }}/img/Ferocious_Tammy.png'; // Set source path
  function setToCanvas(image) {
    var canvas = document.getElementById('imageProcessing');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    var greyScaleCanvas = document.getElementById('greyScale');
    greyScaleCanvas.width = image.naturalWidth;
    greyScaleCanvas.height = image.naturalHeight;
    var greyScaleCtx = greyScaleCanvas.getContext('2d');
    greyScaleCtx.drawImage(image, 0, 0);
    greyScaleCtx.putImageData(convertToGreyScale(greyScaleCtx.getImageData(0,0, canvas.width, canvas.height)), 0, 0);
  }

  function convertToGreyScale(map) {
    var pixels = map.data;
    var red, green, blue, grey;
    for (var i = 0, n = pixels.length; i < n; i += 4) {
      red = pixels[i];
      green = pixels[i+1];
      blue = pixels[i+2];
      grey = Math.floor((red + green + blue) /3);
      pixels[i] = pixels[i + 1] = pixels[i + 2] = grey;
    }
    return map;
  }
  

</script>