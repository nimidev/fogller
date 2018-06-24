'use strict';

$(document).ready(function () {
  var menuIsShown = false;
  var $header = $('.header');
  var $hamburger = $header.find('.hamburger');
  var $info = $('.info');
  var $body = $('body');

  $('.photos').fullpage({
    sectionSelector: '.photos__section',
    slideSelector: '.photos__slide',
    controlArrows: false,
    onLeave: function () {
      if (!menuIsShown) {
        $('.photos').addClass('photos_with-menu');
        $body.addClass('header-visible');

        setTimeout(function () {
          menuIsShown = true;
        }, 1000);

        return false;
      }
    }
  });

  $hamburger.on('click', function () {
    $hamburger.toggleClass('is-active');
    $body.toggleClass('is-info-open');
  });

  $body.on('click', function (e) {
    var $target = $(e.target);

    if ($target.closest($hamburger).length === 0 && $target.closest($info).length === 0) {
      $body.removeClass('is-info-open');
    }
  });
});
