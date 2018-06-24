'use strict';

$(document).ready(function () {
  var menuIsShown = false;

  $('.photos').fullpage({
    sectionSelector: '.photos__section',
    slideSelector: '.photos__slide',
    onLeave: function () {
      if (!menuIsShown) {
        $('.photos').addClass('photos_with-menu');

        setTimeout(function () {
          menuIsShown = true;
        }, 600);

        return false;
      }
    }
  });
});
