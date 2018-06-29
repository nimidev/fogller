'use strict';

$(document).ready(function () {
  var menuIsShown = false;
  var $header = $('.header');
  var $hamburger = $header.find('.hamburger');
  var $info = $('.info');
  var $title = $('.title');
  var $body = $('body');
  var $arrowDown = $('.arrow_down');
  var $arrowUp = $('.arrow_up');
  var $arrowLeft = $('.arrow_left');
  var $arrowRight = $('.arrow_right');
  var slidesAmountBySection = [];
  var currentSlideBySection = [];
  var imagesBySection = [];

   $('.photos__section').each(function (i) {
     slidesAmountBySection[i] = $(this).find('.photos__slide').length;
     currentSlideBySection[i] = 0;
     imagesBySection[i] = $(this).find('.photos__slide img').map(function () {
       return this;
     });
   });

  loadNextImages(1, 0);

  $(window).on('load', function () {
    $('.loader').addClass('loader_hidden');
  });

  $('.photos').fullpage({
    sectionSelector: '.photos__section',
    slideSelector: '.photos__slide',
    controlArrows: false,
    loopHorizontal: false,
    lazyLoading: false,
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
        initAnimation();

        return false;
      }

      manageArrowsVisibility(nextIndex, currentSlideBySection[nextIndex - 1]);
      loadNextImages(nextIndex, currentSlideBySection[nextIndex - 1]);
    },
    onSlideLeave: function (anchorLink, index, slideIndex, direction, nextSlideIndex) {
      currentSlideBySection[index - 1] = nextSlideIndex;
      manageArrowsVisibility(index, nextSlideIndex);
      loadNextImages(index, nextSlideIndex);
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

  $title.on('click', function () {
    initAnimation();
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

  function initAnimation() {
    $('.photos').addClass('photos_with-menu');
    $body.addClass('header-visible');
    $arrowRight.addClass('arrow_visible');

    setTimeout(function () {
      menuIsShown = true;
    }, 1000);
  }

  function loadNextImages(sectionIndex, slideIndex) {
    replaceFakeAttributeOnReal(imagesBySection[sectionIndex - 1][slideIndex]);
    replaceFakeAttributeOnReal(imagesBySection[sectionIndex - 1][slideIndex + 1]);

    if (imagesBySection[sectionIndex]) {
      replaceFakeAttributeOnReal(imagesBySection[sectionIndex][0]);
    }

    function replaceFakeAttributeOnReal(element) {
      if (element && !element.srcset) {
        element.srcset = element.dataset.srcset;
      }
    }
  }
});
