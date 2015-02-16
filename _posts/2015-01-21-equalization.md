---
layout: page
title: Greyscale Equalization
description: Use JavaScript to equalize the greyscale color of an image.
date: 21-Jan-2015
---
<div id="app" ng-app="imageApp" ng-controller="imageAppCtl">
  Let's play around with equalization.  This takes a little more work.  First we have to get the grey scale and the equalization lookup
  table.  Once we've done that, it's just about going pixel by pixel and transforming the image to spread out the distribution.
  
  I found out that my cat's picture wasn't a really good start for this, because the image already was pretty well distributed.
  
  This is a several step process.  First the image is converted to a grey scale image.  Then we calculate the greyscale distribution of the image.
  
  Then we calculate the equalization lookup table.  This is a probability distribution that tries to equalize the distribution of the probability of a grey scale value.  
  
  <fieldset><legend>Original Image</legend>
    <img id="originalImg" 
      sb-load 
      ng-src="{(img_url)}"
      ng-init="img_url = '{{ page.base_url }}/img/LenaDark.png'">
  </fieldset>
  <fieldset><legend>The Equalized Image</legend>
    <canvas id="equalizedCanvas"></canvas>
  </fieldset>
  <fieldSet><legend>The greyscale distributions</legend>
    <div id="histogram" style="width:100%; height:400px;"> </div>
  </fieldset>
    
  <fieldset><legend>Choose your own image</legend>
    <div file-select="file"></div>
  </fieldset>
  
  <br />
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
    var equalizedCanvas = document.getElementById('equalizedCanvas');
    this.process =  function(imgData, parameters) {
      if (imgData === '') {
        return;
      }
      var originalGreyDistribution = Filters.filterImage(Filters.histogram, imgData, [parameters.red, parameters.green, parameters.blue]).grey;
      var equalizedImageData = Filters.filterImage(Filters.equalizeGreyScale, imgData);
      drawToCanvas(equalizedImageData, equalizedCanvas);
      var equalizedImageGreyDistribution = Filters.histogram(equalizedImageData, [parameters.red, parameters.green, parameters.blue]).grey;
      plot(originalGreyDistribution, equalizedImageGreyDistribution);
    }
  });
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