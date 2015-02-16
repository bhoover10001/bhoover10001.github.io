$(function () {

    module("collapse")

      test("should provide no conflict", function () {
        var collapse = $.fn.collapse.noConflict()
        ok(!$.fn.collapse, 'collapse was set back to undefined (org value)')
        $.fn.collapse = collapse
      })

      test("should be defined on jquery object", function () {
        ok($(document.body).collapse, 'collapse method is defined')
      })

      test("should return element", function () {
        ok($(document.body).collapse()[0] == document.body, 'document.body returned')
      })

      test("should show a collapsed element", function () {
        var el = $('<div class="collapse"></div>').collapse('show')
        ok(el.hasClass('in'), 'has class in')
        ok(/height/.test(el.attr('style')), 'has height set')
      })

      test("should hide a collapsed element", function () {
        var el = $('<div class="collapse"></div>').collapse('hide')
        ok(!el.hasClass('in'), 'does not have class in')
        ok(/height/.test(el.attr('style')), 'has height set')
      })

      test("should not fire shown when show is prevented", function ( assert ) {
        $.support.transition = false
        $('<div class="collapse"/>')
          .on('show.bs.collapse', function (e) {
            e.preventDefault();
            ok(true,'fired');
          })
          .on('shown.bs.collapse', function () {
            ok(false,'did not fire');
          })
          .collapse('show')
      })

})
