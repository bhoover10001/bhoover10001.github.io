$(function () {

  module("modal")

    test("should provide no conflict", function () {
      var modal = $.fn.modal.noConflict()
      ok(!$.fn.modal, 'modal was set back to undefined (org value)')
      $.fn.modal = modal
    })

    test("should be defined on jquery object", function () {
      var div = $("<div id='modal-test'></div>")
      ok(div.modal, 'modal method is defined')
    })

    test("should return element", function () {
      var div = $("<div id='modal-test'></div>")
      ok(div.modal() == div, 'document.body returned')
      $('#modal-test').remove()
    })

    test("should expose defaults var for settings", function () {
      ok($.fn.modal.Constructor.DEFAULTS, 'default object exposed')
    })

})
