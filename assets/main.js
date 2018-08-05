'use strict';

$(document).ready(function () {
  var $body = $('body');
  var $title = $('.title');

  var $header = $('.header');
  var $hamburger = $header.find('.hamburger');
  var $info = $header.find('.info');

  var $arrowDown = $('.arrow_down');
  var $arrowUp = $('.arrow_up');
  var $arrowLeft = $('.arrow_left');
  var $arrowRight = $('.arrow_right');

  var $photos = $('.photos');
  var $photosSections = $('.photos__section');
  var $sliderContainers = $('.photos__slider-wrapper');

  var state = {};

  var initialState = {
    fullScreenAnimationInProgress: false,
    fullScreenMode: true,
    isMenuOpened: false,
    currentSectionIndex: 0,
    sectionsAmount: $photosSections.length,
    imagesAmountBySection: $photosSections.map(function (i, photosSection) {
      return $(photosSection).find('.photos__image').length;
    }),
    currentSlideBySection: $photosSections.map(function () {
      return 0;
    })
  };

  $photos.fullpage({
    sectionSelector: '.photos__section',
    controlArrows: false,
    lazyLoading: false, // implementing own lazy-loading
    loopTop: true,
    afterRender: function () {
      updateState(initialState);
    },
    onLeave: function (index, nextIndex) {
      if (state.fullScreenMode) {
        initAnimation();
        return false;
      } else if (state.fullScreenAnimationInProgress || state.isMenuOpened) {
        return false;
      } else if (index === 1 && nextIndex === $photosSections.length) {
          restoreFullScreen();
          return false;
      } else {
        updateState({
          currentSectionIndex: nextIndex - 1
        });
      }
    }
  });

  $body.swipe({
    swipe: function (event, direction) {
      var directionHandlers = {
        up: moveToSectionDown,
        down: moveToSectionUp,
        left: moveToNextSlide,
        right: moveToPreviousSlide
      };

      if (!state.isMenuOpened) {
        directionHandlers[direction]();
      }
    }
  });

  $hamburger.on('click', function () {
    updateState({
      isMenuOpened: !state.isMenuOpened
    });
  });

  $body.on('click', function (e) {
    var $target = $(e.target);

    if ($target.closest($hamburger).length === 0 && $target.closest($info).length === 0) {
      updateState({
        isMenuOpened: false
      })
    }
  });

  $title.on('click', function () {
    initAnimation();
  });

  $sliderContainers.slick({
    arrows: false
  });

  $sliderContainers.each(function (i, sliderContainer) {
    $(sliderContainer).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      var newCurrentSlideBySection = state.currentSlideBySection;

      newCurrentSlideBySection[i] = nextSlide;

      updateState({
        currentSlideBySection: newCurrentSlideBySection
      });
    });
  });

  $arrowDown.on('click', moveToSectionDown);
  $arrowUp.on('click', moveToSectionUp);
  $arrowLeft.on('click', moveToPreviousSlide);
  $arrowRight.on('click', moveToNextSlide);

  function moveToNextSlide() {
    $sliderContainers.eq(state.currentSectionIndex).slick('slickNext');
  }

  function moveToPreviousSlide() {
    $sliderContainers.eq(state.currentSectionIndex).slick('slickPrev');
  }

  function moveToSectionUp() {
    $.fn.fullpage.moveSectionUp();
  }

  function moveToSectionDown() {
    $.fn.fullpage.moveSectionDown();
  }

  function updateState(newState) {
    Object.assign(state, newState);

    $body.toggleClass('header-visible', !state.fullScreenMode);
    $photos.toggleClass('photos_with-menu', !state.fullScreenMode);

    $body.toggleClass('is-info-open', state.isMenuOpened);
    $hamburger.toggleClass('is-active', state.isMenuOpened);

    $arrowDown.toggleClass('arrow_visible', state.sectionsAmount - 1 !== state.currentSectionIndex);
    $arrowUp.toggleClass('arrow_visible', state.sectionsAmount - 1 === state.currentSectionIndex);
    $arrowLeft.toggleClass('arrow_visible', !state.fullScreenMode);
    $arrowRight.toggleClass('arrow_visible', !state.fullScreenMode);

    loadNextImages();
  }

  function initAnimation() {
    updateState({
      fullScreenMode: false,
      fullScreenAnimationInProgress: true
    });

    waitForFullScreenAnimationFinishes();
  }

  function restoreFullScreen() {
    updateState({
      fullScreenMode: true,
      fullScreenAnimationInProgress: true
    });

    waitForFullScreenAnimationFinishes();
  }

  function waitForFullScreenAnimationFinishes() {
    setTimeout(function () {
      updateState({
        fullScreenAnimationInProgress: false
      });
    }, 1000);
  }

  function loadNextImages() {
    var closestVisibleImages = [];

    var currentSlideIndex = state.currentSlideBySection[state.currentSectionIndex];
    var maxSlideInSectionIndex = state.imagesAmountBySection[state.currentSectionIndex] - 1;

    addClosestVisibleImages(state.currentSectionIndex, currentSlideIndex);
    addClosestVisibleImages(state.currentSectionIndex, currentSlideIndex === 0 ? maxSlideInSectionIndex : currentSlideIndex - 1);
    addClosestVisibleImages(state.currentSectionIndex, currentSlideIndex + 1);
    addClosestVisibleImages(state.currentSectionIndex + 1, 0);

    closestVisibleImages.forEach(function ($closestVisibleImage) {
      replaceFakeAttributeOnReal($closestVisibleImage);
    });

    function addClosestVisibleImages(sectionIndex, slideIndex) {
      var $currentSection = $photosSections.eq(sectionIndex);

      if ($currentSection.length) {
        var visibleImage = $currentSection.find('.photos__image').filter(function (i, imageElement) {
          return imageElement.dataset.index === slideIndex.toString();
        });

        if (visibleImage) {
          closestVisibleImages.push(visibleImage);
        }
      }
    }

    function replaceFakeAttributeOnReal($element) {
      if ($element && !$element.attr('srcset')) {
        $element.attr('srcset', $element.data('srcset'));

        $element.one('load', function () {
          onInitialLoadImagesHandler();
        });
      }
    }

    var onInitialLoadImagesHandler = (function () {
      var imagesLoadedCounter = 0;

      return function () {
        imagesLoadedCounter++;

        if (imagesLoadedCounter === 4) {
          $('.loader').addClass('loader_hidden');
        }
      }
    })();
  }
});
