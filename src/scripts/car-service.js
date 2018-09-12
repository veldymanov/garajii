document.addEventListener("DOMContentLoaded", function() {

  const firstSlideEl = document.querySelector('.js-first-slide');
  const iphoneSliderEl = document.querySelector('.js-iphone-slider');
  const photoListEl = document.querySelector('.js-photo-list');
  const photoWrapperEl = document.querySelector('.js-photo-wrapper');
  const slidesQuantity = document.querySelectorAll('.js-slide').length;
  const mobViewWidth = 767;

  let slideHeight = 0;

  window.addEventListener('scroll', function() {
    if (window.innerWidth >= mobViewWidth) {
      slideHeight = firstSlideEl.offsetHeight;

      firstSlideElBackgroundAdjust();
      iphoneSliderElPositionAdjust();
      doSlide();
    }
  });


  function firstSlideElCss(trasp) {
    return `background: linear-gradient(rgba(34, 34, 34, ${trasp}), rgba(34, 34, 34, ${trasp})),
              center / cover no-repeat url("../assets/images/shutterstock.png") rgb(0, 0, 0);`
  }

  function firstSlideElBackgroundAdjust() {
    if(window.scrollY <= (slideHeight / 4)) {
      firstSlideEl.style.cssText = firstSlideElCss(0);
    } else if(window.scrollY <= (slideHeight / 3)) {
      firstSlideEl.style.cssText = firstSlideElCss(0.4);
    } else if(window.scrollY <= (slideHeight / 2.5)) {
      firstSlideEl.style.cssText = firstSlideElCss(0.6);
    } else if(window.scrollY <= (slideHeight / 2.1)) {
      firstSlideEl.style.cssText = firstSlideElCss(0.8);
    } else if(window.scrollY <= (slideHeight / 1.8)) {
      firstSlideEl.style.cssText = firstSlideElCss(0.9);
    } else if(window.scrollY <= (slideHeight)) {
      firstSlideEl.style.cssText = firstSlideElCss(1);
    }
  }

  function iphoneSliderElPositionAdjust() {
    if(window.scrollY > ((slidesQuantity - 1) * slideHeight)) {
      iphoneSliderEl.style.cssText = `top: ${((slidesQuantity - 1) * slideHeight) - window.scrollY}px`;
    } else {
      iphoneSliderEl.style.cssText = `top: 0px`;
    }
  }

  function doSlide() {
    const photoHeight = photoWrapperEl.offsetHeight;

    if(window.scrollY <= 2 * slideHeight) {
      photoListEl.style.cssText = `top: 0px`;
    } else if(window.scrollY <=  2.8 * slideHeight) {
      photoListEl.style.cssText = `top: ${-photoHeight}px`;
    } else if(window.scrollY <=  3.8 * slideHeight) {
      photoListEl.style.cssText = `top: ${-2 * photoHeight}px`;
    } else if(window.scrollY <=  4.8 * slideHeight) {
      photoListEl.style.cssText = `top: ${-3 * photoHeight}px`;
    } else if(window.scrollY <=  5.8 * slideHeight) {
      photoListEl.style.cssText = `top: ${-4 * photoHeight}px`;
    }
  }
});


