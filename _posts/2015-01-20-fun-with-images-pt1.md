---
layout: page
title: Image Processing and the Canvas
date: 20-Jan-2015
---

This is a quick little utility for getting the color distribution for an image.  The image has to 
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
    calculateHistograms(ctx.getImageData(0,0, canvas.width, canvas.height).data);
  }
  
  function calculateHistograms(pixels) {
    var red = new Uint32Array(256);
    var green = new Uint32Array(256);
    var blue = new Uint32Array(256);
    for (var i = 0, n = pixels.length; i < n; i += 4) {
      red[pixels[i]] +=1;
      green[pixels[i+1]] +=1;
      blue[pixels[i+2]] +=1;
    }
    plot(red, green, blue);
  }

  function convertToGreyScale() {
  
  }
  
  function plot(red, green, blue) {
     var redPlot = [];
     var greenPlot = [];
     var bluePlot = [];
     for (var i = 0; i < 256; i += 1) {
      redPlot.push([i, red[i]]);
      greenPlot.push([i, green[i]]);
      bluePlot.push([i, blue[i]]);
     }
//    $.plot("#histogram", [ redPlot, greenPlot, bluePlot ]);
    $.plot("#histogram", [
      { label: 'sin(x)', data: redPlot },
      { label: "cos(x)", data: greenPlot },
      { label: "tan(x)", data: bluePlot }
    ]);
    
    $.plot("#histogram", [ 
      { label: 'Red', data: redPlot, color: 'red'},
      { label: 'Green', data: greenPlot, color: 'green'},
      {label: 'Blue', data:bluePlot, color: 'blue'}],
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