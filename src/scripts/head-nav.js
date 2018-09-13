document.addEventListener("DOMContentLoaded", function() {

  const mobileMenu = {
    bodyEl: document.querySelector('body'),
    coverEl: document.querySelector('.js-cover'),
    navContainerEl: document.querySelector('#js-nav-container'),
    navBoxEl: document.querySelector('#js-nav-container .js-nav-box'),
    isOpen: false,
    transition: '0.25s',
    windowScrollY: 0,
    windowInnerWidth: window.innerWidth,
    menuSlideIn: function(event) {
      this.windowScrollY = this.isOpen ? this.windowScrollY : window.scrollY;
      this.coverEl.classList.add('active');
      this.navContainerEl.style.cssText = `height: auto; right: 0px; transition: right ${this.transition};`;

      const bodyWidth = this.bodyEl.offsetWidth;
      this.bodyEl.classList.add('noscroll');
      this.bodyEl.style.top = `${-this.windowScrollY}px`;
      this.bodyEl.style.width = `${bodyWidth}px`;
      this.isOpen = true;

      window.scrollTo(0, this.windowScrollY);
    },
    menuSlideOut: function(event) {
      const panelElWidth = this.navBoxEl.clientWidth;
      this.windowScrollY = this.isOpen ? this.windowScrollY : window.scrollY;
      this.coverEl.classList.remove('active');
      this.navContainerEl.style.cssText =
        `height: 100vh; right: ${-panelElWidth - 1}px; transition: right ${this.transition};`;

      this.bodyEl.classList.remove('noscroll');
      window.scrollTo(0, this.windowScrollY);
      this.bodyEl.style.width = `auto`;
      this.isOpen = false;
    },
  }

  const mobileMenuTouchSlider = {
    log: function(msg) {
      var p = document.getElementById('log');
      p.innerHTML = p.innerHTML + "<br>" + msg;
    },

    createSlidePanel: function(/*selector*/ panelId) {
      const elem = document.querySelector(panelId);
      this.width = elem.clientWidth;
      this.makeTouchable(elem);
    },

    makeTouchable: function(elem) {
      elem.addEventListener('touchstart', function(event) { mobileMenuTouchSlider.touchStart(this, event); }, false);
      elem.addEventListener('touchmove', function(event) { mobileMenuTouchSlider.touchMove(this, event); }, false);
      elem.addEventListener('touchend', function(event) { mobileMenuTouchSlider.touchEnd(this, event); }, false);
    },

    touchStart: function(elem, event) {
      this.startX = event.targetTouches[0].clientX;
      this.startY = event.targetTouches[0].clientY;
      this.slider = 0; // Starting position
      this.startRight = this.getRight(elem);

      // this.log("startRight: " + parseInt(this.startRight, 10));
    },

    touchMove: function(elem, event) {
      elem.style.transition = 'right 0s';

      const deltaX = event.targetTouches[0].clientX - this.startX;
      const deltaY = event.targetTouches[0].clientY - this.startY;

      if (( (this.slider === 0 ) ) && ( Math.abs(deltaY) > Math.abs(deltaX)) ) {
        this.slider = -1; // Default sliding position
      } else if (this.slider != -1) {
        event.preventDefault();
        this.slider = 1; //this sliding position
        let right = this.startRight - deltaX;

        if (right > 0) { right = 0; }

        elem.style.right = right + 'px';
      }
    },

    touchEnd: function(elem, event) {
      this.doSlide(elem, event);
    },

    getRight: function(elem) {
      const elemStyles = window.getComputedStyle(elem);
      return parseInt(elemStyles.getPropertyValue('right'), 10);
    },

    doSlide: function(elem, event) {
      const right = this.getRight(elem);

      Math.abs(right) < (this.width / 2)
        ? mobileMenu.menuSlideIn(event)
        : mobileMenu.menuSlideOut(event);

      this.startX = null;
      this.startY = null;
    }
  }


  runHeadNavMenu();

  function runHeadNavMenu() {
    const headNavEl = document.querySelector('.js-head-nav');
    const headNavElHeight = headNavEl.clientHeight;
    let yOffsetPrev = 0;

    window.addEventListener('scroll', function(){
      const yOffset = window.scrollY;
      if (mobileMenu.isOpen) { return; }

      if (yOffset <= 0) {
        headNavEl.classList.remove('scrolled', 'hidden')
      } else if (yOffset > headNavElHeight) {
        yOffset <= yOffsetPrev
          ? (
              headNavEl.classList.add('scrolled'),
              headNavEl.classList.remove('hidden')
            )
          : (
              headNavEl.classList.remove('scrolled'),
              headNavEl.classList.add('hidden')
            );
      }

      yOffsetPrev = yOffset;
    });

    window.addEventListener('resize', function(event){
      if (mobileMenu.isOpen && (mobileMenu.windowInnerWidth !== window.innerWidth)) {
        mobileMenu.menuSlideOut(event);
      }

      mobileMenu.windowInnerWidth = window.innerWidth;
    });

    document.querySelector('.js-sandwich').addEventListener('click', function(event) {
      mobileMenu.menuSlideIn(event);
    });

    document.querySelector('.js-cover').addEventListener('click', function(event) {
      mobileMenu.menuSlideOut(event);
    });

    mobileMenuTouchSlider.createSlidePanel('#js-nav-container');
  }
});
