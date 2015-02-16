---
layout: page
title: Guassian Random Number Generator
date: 04-Feb-2015
---

Ok, we all know that everything on the Internet is true.  So, I found a post at <a href="http://www.protonfish.com/random.shtml">http://www.protonfish.com/random.shtml</a> on how to generate random numbers with a Gaussian Distribution in
JavaScript.  Long story short, I've been burned by random number generators before, so the first thing that anyone should do is make
sure that it actually does work correctly.<br/>

Note that this isn't a fully mathematical proof, just testing to make sure that the random number generator is creating the correct distribution.  There could still be underlying patterns in the generator which makes this an in-appropriate generator.

<div id="histogram" style="width:100%; height:400px;">
</div>

<br />

{% highlight JavaScript %}
function guassian_seed() {
  return (Math.random() * 2 - 1) + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
}

function rnd(mean, stdDev) {
  return Math.round(guassian_seed() * stdDev + mean);
}
{% endhighlight %}
<script>
  $(function() {
    var maxIterations = 1000000,
        stdev = 30,
        mean = 128;
    var distribution = new Uint32Array(256);
    var perfectGaussian = [];
    var distributionArray = [];
    var i, maxValue;
    for (i = 0; i < maxIterations; i++) {
      distribution[rnd(mean, stdev)] ++;
    };

    maxValue = 0;
    for (i = 0; i < 256; i++) {
      distributionArray.push([i, distribution[i]]);
      maxValue = Math.max(maxValue, distribution[i]);
    }
    var g = gaussianFunction(maxValue, mean, stdev);
    for (i = 0; i < 256; i++) {
      perfectGaussian.push([i, Math.round(g(i))]);
    }

    $.plot("#histogram", [ 
      { label: 'Distribution', data: distributionArray, color: 'red'},
      { label: 'Expected Distribution', data: perfectGaussian, color: 'green'}],
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
  });
  
  function gaussianFunction(height, mean, stdev) {
    return function(x) {
      return height*Math.exp(-1*Math.pow(x-mean, 2)/(2* Math.pow(stdev,2)));
    }
  }
</script>