---
layout: page
title: Histograms
tags: JavaScript, Canvas, Image Processing
description: A utility for calculating the color distribution of an image in JavaScript
date: 20-Jan-2015
---
<div id="app" ng-app="imageApp" ng-controller="imageAppCtl">
  A lot of image processing starts with getting the distribution of colors in an image.  This is a quick little JavaScript routine to get the 
  Red, Green, Blue and Grey color distribution.  All it does is go through every pixel, creates a histogram
  <fieldset><legend>Original Image</legend>
    <img id="originalImg" 
      sb-load 
      ng-src="{(img_url)}" 
      ng-init="img_url = '{{ page.base_url }}/img/Ferocious_Tammy.png'">
  </fieldset>
  
  <fieldset><legend>The Color Distribution</legend>
    <div id="histogram" style="width:100%; height:400px;"></div>
  </fieldset>
  <fieldset><legend>Choose your own image</legend>
    <div file-select="file"></div>
  </fieldset>
  <br />
  
  {% highlight JavaScript %}
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
  {% endhighlight %}
</div>
<script src="{{ page.base_url }}/app/imageApp.js" ></script>
<script>
  imageApp.constant('defaultParameters', {
    parameters: {
      red: 0.2126,
      green: 0.7152,
      blue: 0.0722
    }, 
    watchGroup: ['parameters.red','parameters.green','parameters.blue']
  });

  imageApp.service('imageService', function() { 
    this.process =  function(imgData, parameters) {
      if (imgData === '') {
        return;
      }
      var pixelDistribution = Filters.filterImage(Filters.histogram, imgData, [parameters.red, parameters.green, parameters.blue]);
      plot(pixelDistribution.red, pixelDistribution.green, pixelDistribution.blue, pixelDistribution.grey);
    }
  });
  
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