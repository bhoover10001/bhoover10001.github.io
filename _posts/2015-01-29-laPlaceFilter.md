---
layout: page
title: LaPlace Filter
date: 29-Jan-2015
---
<div id="app" ng-app="imageApp" ng-controller="imageAppCtl">
  An implementation of the laPlace filter, for enhancing edges.
  <fieldset><legend>Original Image</legend>
    <img id="originalImg" 
      sb-load 
      ng-src="{(img_url)}" 
      ng-init="img_url = '{{ page.base_url }}/img/camouflage08.jpg'">
  </fieldset>
  <fieldset><legend>Laplace Filter</legend>
    <canvas id="laPlaceFilter"></canvas>
  </fieldset>
  <fieldset><legend>Sharpen Image</legend>
    <canvas id="sharpenedFilter"></canvas>
  </fieldset>
  <fieldset><legend>Choose your own image</legend>
    <div file-select="file"></div>
  </fieldset>
</div>
<script src="{{ page.base_url }}/app/imageApp.js" ></script>

<script>
  imageApp.constant('defaultParameters', {
    parameters: {
    }, 
    watchGroup: ['']
  });

  imageApp.service('imageService', function(defaultParameters) { 
    var laPlaceCanvas = document.getElementById('laPlaceFilter');
    var sharpened = document.getElementById('sharpenedFilter');
    
    this.process =  function(imgData, parameters) {
      if (imgData === '') {
        return;
      }
      Filters.filterImage(Filters.sharpen, imgData)
        .then(function(data) {
        drawToCanvas(data, sharpened);
      });
      Filters.filterImage(Filters.laPlace, imgData)
        .then(function(data) {
        drawToCanvas(data, laPlaceCanvas);
      });
    }
  });
</script>