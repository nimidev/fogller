'use strict';

$(document).ready(function () {
  var menuIsShown = false;
  var $header = $('.header');
  var $hamburger = $header.find('.hamburger');
  var $info = $('.info');
  var $body = $('body');
  var $arrowDown = $('.arrow_down');
  var $arrowUp = $('.arrow_up');
  var $arrowLeft = $('.arrow_left');
  var $arrowRight = $('.arrow_right');
  var slidesAmountBySection = [];
  var currentSlideBySection = [];

   $('.photos__section').each(function (i) {
     slidesAmountBySection[i] = $(this).find('.photos__slide').length;
     currentSlideBySection[i] = 0;
  });

  $('.photos').fullpage({
    sectionSelector: '.photos__section',
    slideSelector: '.photos__slide',
    controlArrows: false,
    loopHorizontal: false,
    afterRender: function () {
      $arrowDown.on('click', function () {
        $.fn.fullpage.moveSectionDown();
      });

      $arrowUp.on('click', function () {
        $.fn.fullpage.moveSectionUp();
      });

      $arrowLeft.on('click', function () {
        $.fn.fullpage.moveSlideLeft();
      });

      $arrowRight.on('click', function () {
        $.fn.fullpage.moveSlideRight();
      });
    },
    onLeave: function (index, nextIndex) {
      if (!menuIsShown) {
        $('.photos').addClass('photos_with-menu');
        $body.addClass('header-visible');
        $arrowRight.addClass('arrow_visible');

        setTimeout(function () {
          menuIsShown = true;
        }, 1000);

        return false;
      }

      manageArrowsVisibility(nextIndex, currentSlideBySection[nextIndex - 1]);
    },
    onSlideLeave: function (anchorLink, index, slideIndex, direction, nextSlideIndex) {
      currentSlideBySection[index - 1] = nextSlideIndex;
      manageArrowsVisibility(index, nextSlideIndex);
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
      $hamburger.removeClass('is-active');
    }
  });


  function manageArrowsVisibility(index, slideIndex) {
    if (slidesAmountBySection.length === index) {
      $arrowDown.removeClass('arrow_visible');
      $arrowUp.addClass('arrow_visible');
    } else {
      $arrowDown.addClass('arrow_visible');
      $arrowUp.removeClass('arrow_visible');
    }

    slideIndex === 0 ? $arrowLeft.removeClass('arrow_visible') : $arrowLeft.addClass('arrow_visible');
    slidesAmountBySection[index - 1] === slideIndex + 1 ? $arrowRight.removeClass('arrow_visible') : $arrowRight.addClass('arrow_visible');
  }
});
