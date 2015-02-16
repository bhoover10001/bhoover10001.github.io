---
layout: page
title: Converting an image to grey scale
date: 21-Jan-2015
---

<div id="app" ng-app="imageApp" ng-controller="imageAppCtl">
  A quick little utility for converting an image to grey scale.  All this is doing is taking the original image and 
  averaging the RGB values for each pixels and then redrawing the image in the lower canvas.
  
  <fieldset><legend>Original Image</legend>
    <img id="originalImg" 
      sb-load 
      ng-src="{(img_url)}" 
      ng-init="img_url = '{{ page.base_url }}/img/Ferocious_Tammy.png'">
  </fieldset>
  
  <fieldset class="slider-group"><legend>Conversion</legend>
    By default, this is going to use a weighted average of the RGB values to create the grey scale, as documented on <a href="http://en.wikipedia.org/wiki/Grayscale">Wikipedia</a>.<br />
    Note that the RGB values are not absolute.  Their value will be normalized to 1.
      
    <label for="red">Red</label>
    <input id="red" 
      value = "0.2126"
      ng-model="parameters.red"
      class="slider"
      data-slider-id="redSlider"
      type="text"
      data-slider-min="0" 
      data-slider-max="1" 
      data-slider-step="0.0001" 
      data-slider-value="0.2126"><br />
    <label for="green">Green</label>
    <input id="green" 
      value = "0.7152"
      class="slider"
      ng-model="parameters.green"
      data-slider-id="greenSlider"
      type="text"
      data-slider-min="0" 
      data-slider-max="1" 
      data-slider-step="0.0001" 
      data-slider-value="0.7152"><br />
    <label for="blue">Blue</label>
    <input id="blue" 
      value = "0.0722"
      class="slider"
      ng-model="parameters.blue"
      data-slider-id="blueSlider"
      type="text"
      data-slider-min="0" 
      data-slider-max="1" 
      data-slider-step="0.0001" 
      data-slider-value="0.0722"><br />
    Red: {( parameters.red | displayNumber: 4 )} 
    Green: {( parameters.green | displayNumber: 4 )} 
    Blue: {( parameters.blue | displayNumber: 4 )}
  </fieldset>
  <fieldset><legend>Grey Scale</legend>
    <canvas id="greyScale"></canvas>
  </fieldset>
  
  <fieldset><legend>Choose your own image</legend>
    <div file-select="file"></div>
  </fieldset>
</div>
<fieldset><legend>Code Explanation</legend>
   This is a very simple filter.  The arguments are the Red/Green/Blue balance that should be used to create the grey scale.  The 
  filter than goes through and sets the Red, Green and Blue pixels of the img to the same value for all three, resulting in a grey scale image.
{% highlight JavaScript %}
Filters.greyscale = function(pixels, args) {
  var red = parseFloat(args[0]);
  var green = parseFloat(args[1]);
  var blue = parseFloat(args[2]);
  var total = red + green + blue;
  red /= total;
  green /= total;
  blue /= total;
  var d = pixels.data;
  var numPixels = d.length;
  var r,g,b,v;
  for (var i = 0; i < numPixels; i+= 4) {
    r = d[i];
    g = d[i+1];
    b = d[i+2];
    v = Math.floor(red*r + green*g + blue*b);
    d[i] = d[i+1] = d[i+2] = v;
  }
  return pixels;
}
{% endhighlight %}
</fieldset>
<script src="{{ page.base_url }}/app/imageApp.js" ></script>

<script>
  
  $(function() {
    $('.slider').slider({
      formater: function(value) {
        return value.toFixed(4);
      }
    }).on('slideStop', function(ev) {
      $(ev.target).trigger('change');
    });
    $('#redSlider .slider-handle').css('background','red');
    $('#greenSlider .slider-handle').css('background','green');
    $('#blueSlider .slider-handle').css('background','blue');
  });

  imageApp.constant('defaultParameters', {
    parameters: {
      red: 0.2126,
      green: 0.7152,
      blue: 0.0722
    }, 
    watchGroup: ['parameters.red','parameters.green','parameters.blue']
  });

  imageApp.service('imageService', function(defaultParameters) { 
    var greyScaleCanvas = document.getElementById('greyScale');
    
    this.process =  function(imgData, parameters) {
      if (imgData === '') {
        return;
      }
      drawToCanvas(Filters.filterImage(Filters.greyscale, imgData, [parameters.red, parameters.green, parameters.blue]), greyScaleCanvas);
    }
  });
</script>