$(function () {

    module("tabs")

      test("should provide no conflict", function () {
        var tab = $.fn.tab.noConflict()
        ok(!$.fn.tab, 'tab was set back to undefined (org value)')
        $.fn.tab = tab
      })

      test("should be defined on jquery object", function () {
        ok($(document.body).tab, 'tabs method is defined')
      })

      test("should return element", function () {
        ok($(document.body).tab()[0] == document.body, 'document.body returned')
      })

      test("should activate element by tab id", function (assert) {
        var tabsHTML =
            '<ul class="tabs">'
          + '<li><a href="#home">Home</a></li>'
          + '<li><a href="#profile">Profile</a></li>'
          + '</ul>'

        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo("#qunit-fixture")

        $(tabsHTML).find('li:last a').tab('show')
        assert.equal($("#qunit-fixture").find('.active').attr('id'), "profile")

        $(tabsHTML).find('li:first a').tab('show')
        assert.equal($("#qunit-fixture").find('.active').attr('id'), "home")
      })

      test("should activate element by tab id", function (assert) {
        var pillsHTML =
            '<ul class="pills">'
          + '<li><a href="#home">Home</a></li>'
          + '<li><a href="#profile">Profile</a></li>'
          + '</ul>'

        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo("#qunit-fixture")

        $(pillsHTML).find('li:last a').tab('show')
        assert.equal($("#qunit-fixture").find('.active').attr('id'), "profile")

        $(pillsHTML).find('li:first a').tab('show')
        assert.equal($("#qunit-fixture").find('.active').attr('id'), "home")
      })
})
