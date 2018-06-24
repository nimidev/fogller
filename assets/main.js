'use strict';

$(document).ready(function () {
  var menuIsShown = false;
  var $header = $('.header');
  var $hamburger = $header.find('.hamburger');

  $('.photos').fullpage({
    sectionSelector: '.photos__section',
    slideSelector: '.photos__slide',
    onLeave: function () {
      if (!menuIsShown) {
        $('.photos').addClass('photos_with-menu');
        $header.addClass('header_visible');

        setTimeout(function () {
          menuIsShown = true;
        }, 1000);

        return false;
      }
    }
  });

  $hamburger.on('click', function () {
    $hamburger.toggleClass('is-active');
  })
});
