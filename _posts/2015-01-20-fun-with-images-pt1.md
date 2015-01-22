---
layout: page
title: Image Processing and the Canvas
tags: JavaScript, Image Processing, Canvas
date: 20-Jan-2015
---

This is a quick little JavaScript utility for getting the color distribution for an image.  The image has to 
be served from the local server or getImageData will fail because of cross domain security.
<canvas id="imageProcessing" />
<div>
My cat - the Tigress.
</div>

<div>
The color distribution
</div>
<div id="histogram" style="width:100%; height:400px;">
</div>
<br />
{% highlight JavaScript %}
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
{% endhighlight %}
<script src="{{ page.base_url }}/assets/js/image.js"></script>
<script>
  var img = new Image();   // Create new img element
  var canvas = document.getElementById("imageProcessing");
  img.addEventListener("load", function() {
      
    setToCanvas(img, canvas);
    var histogram = calculateHistogram(canvas);
    plot(histogram.red, histogram.green, histogram.blue, histogram.grey);
  }, false);
  
  img.src = '{{ page.base_url }}/img/Ferocious_Tammy.png'; // Set source path

  
  function plot(red, green, blue, grey) {
     var redPlot = [];
     var greenPlot = [];
     var bluePlot = [];
     var greyPlot = [];
     for (var i = 0; i < 256; i += 1) {
      redPlot.push([i, red[i]]);
      greenPlot.push([i, green[i]]);
      bluePlot.push([i, blue[i]]);
      greyPlot.push([i, grey[i]]);
     }
    
    $.plot("#histogram", [ 
      { label: 'Red', data: redPlot, color: 'red'},
      { label: 'Green', data: greenPlot, color: 'green'},
      { label: 'Blue', data:bluePlot, color: 'blue'},
      { label: 'Grey', data:greyPlot, color: 'silver'}],
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