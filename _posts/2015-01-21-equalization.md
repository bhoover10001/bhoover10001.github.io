---
layout: page
title: Greyscale Equalization
date: 21-Jan-2015
---

Let's play around with equalization.  This takes a little more work.  First we have to get the grey scale and the equalization lookup
table.  Once we've done that, it's just about going pixel by pixel and transforming the image to spread out the distribution.

I found out that my cat's picture wasn't a really good start for this, because the image already was pretty well distributed.


<canvas id="greyScale" />

<canvas id="equalizedCanvas" />

<div id="histogram" style="width:100%; height:400px;">
</div>

<br />
{% highlight JavaScript %}
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
  for (var i = 0; i <= 256; i+= 1) {
    cdf += greyScalePixels[i];
    p[i] = Math.floor((cdf - greyScalePixels[0]) * 255 / (numPixels- greyScalePixels[0]));
  }
  return p;
}
{% endhighlight %}


<script src="{{ page.base_url }}/assets/js/image.js"></script>
<script>
  var img = new Image();   // Create new img element
  var greyScaleCanvas = document.getElementById('greyScale');
  var equalizedCanvas = document.getElementById('equalizedCanvas');
  img.addEventListener("load", function() {
    setToCanvas(img, greyScaleCanvas);
    convertToGreyScale(greyScaleCanvas);
    setToCanvas(img, equalizedCanvas);
    convertToGreyScale(equalizedCanvas);
    equalizeGreyScale(equalizedCanvas);
    var originalImageHistogram = calculateHistogram(greyScaleCanvas);
    var equalizedImageHistogram = calculateHistogram(equalizedCanvas);
    plot(originalImageHistogram.grey, equalizedImageHistogram.grey);
  }, false);
  
  img.src = '{{ page.base_url }}/img/LenaDark.png'; // Set source path
  
    function plot(origianlGrey, equalizedGrey) {
     var greyPlot = [];
     var equalizedGreyPlot = [];
     for (var i = 0; i < 256; i += 1) {
      greyPlot.push([i, origianlGrey[i]]);
      equalizedGreyPlot.push([i, equalizedGrey[i]]);
     }
    
    $.plot("#histogram", [ 
      { label: 'OriginalGrey', data: greyPlot, color: 'red'},
      { label: 'EqualizedGrey', data: equalizedGreyPlot, color: 'green'}],
      { series: { lines: {show:true}},
        yaxis: {
          axisLabel: "Number of Pixels",
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
          axisLabelPadding: 5
        },
        grid: {
          labelMargin: 10
        }
      });
var xaxisLabel = $("<div class='axisLabel xaxisLabel'></div>")
  .text("Color Value")
  .appendTo($('#histogram'));

var yaxisLabel = $("<div class='axisLabel yaxisLabel'></div>")
  .text("Number of Pixels")
  .appendTo($('#histogram'));
    }
</script>