---
layout: page
title: Median Filter
date: 29-Jan-2015
---
<div id="app" ng-app="imageApp" ng-controller="imageAppCtl">
  This is a simple routine to blur an image, by averaging pixels over a window.  By default, the window size is 3.
  This can take a while, if the window size gets over about 10 pixels or so.
  <fieldset><legend>Original Image</legend>
    <img id="originalImg" 
      sb-load 
      ng-src="{(img_url)}" 
      ng-init="img_url = '{{ page.base_url }}/img/Ferocious_Tammy.png'">
  </fieldset>
  <fieldset><legend>Noise Density</legend>
    <label for="noiseDesnity">Noise Density</label>
    <input id="noiseDensity" 
      value = "0.05"
      ng-model="parameters.noiseDensity"
      class="slider"
      data-slider-id="noiseDesitySlider"
      type="text"
      data-slider-min="0" 
      data-slider-max="0.2" 
      data-slider-step=".001" 
      data-slider-value="0.05"><br />
  </fieldset>
  <fieldset><legend>Image with Noise</legend>
    <canvas id="noiseCanvas"></canvas>
  </fieldset>
  <fieldset><legend>Noised Image After Median Filter</legend>
    <canvas id="median"></canvas>
  </fieldset>
  <fieldset><legend>Choose your own image</legend>
    <div file-select="file"></div>
  </fieldset>
</div>
<script src="{{ page.base_url }}/app/imageApp.js" ></script>

<script>

  imageApp.service('imageService', function(defaultParameters) { 
    var noiseCanvas = document.getElementById('noiseCanvas');
    var medianCanvas = document.getElementById('median');
    
    this.process =  function(imgData, parameters) {
      if (imgData === '') {
        return;
      }
      var noisyData = Filters.filterImage(Filters.whitenoise, imgData, {noiseDensity: parameters.noiseDensity, minVal: 0, maxVal: 255});
      drawToCanvas(noisyData, noiseCanvas);
      Filters.medianFilter(noisyData).then(function(data) { 
        drawToCanvas(data, medianCanvas);
      });
    }
  });
  
  $(function() {
    $('#noiseDensity').slider({
      formater: function(value) {
        return (value * 100).toFixed(1) + '%';
      }
    }).on('slideStop', function(ev) {
      $(ev.target).trigger('change');
    });
  });
  imageApp.constant('defaultParameters', {
    parameters: {
      noiseDensity: 0.05
    },
    watchGroup: ['parameters.noiseDensity']
  });
</script>