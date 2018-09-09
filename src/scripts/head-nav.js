const menuTransition = '0.4s';

document.addEventListener("DOMContentLoaded",function() {
  const headNavEl = document.querySelector('.js-head-nav');
  const headNavElHeight = headNavEl.clientHeight;
  let yOffsetPrev = 0;

  window.addEventListener('scroll', function(){
    const yOffset = window.pageYOffset;

    if (yOffset <= 0) {
      headNavEl.classList.remove('scrolled', 'hidden')
    } else if (yOffset > headNavElHeight) {
      yOffset < yOffsetPrev
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
    if(window.innerWidth > 900 ) { menuSlideOut(event) }
  });

  mobileMenuTouchSlider.createSlidePanel('#js-nav-container');

  document.querySelector('.js-sandwich').addEventListener('click', function(event) {
    menuSlideIn(event);
  });
  document.querySelector('.js-cover').addEventListener('click', function(event) {
    menuSlideOut(event);
  });
});


const mobileMenuTouchSlider = {
	log: function(msg) {
		// var p = document.getElementById('log');
		// p.innerHTML = p.innerHTML + "<br>" + msg;
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

		// this.log("startRight: " + this.startRight);
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
    return parseInt(elem.style.right, 10);
	},

	doSlide: function(elem, event) {
    const right = this.getRight(elem);

		Math.abs(right) < (this.width / 2)
      ? menuSlideIn(event)
      : menuSlideOut(event)

		this.startX = null;
		this.startY = null;
	}
}

function menuSlideIn(event) {
  document.querySelector('.js-cover').classList.add('active');
  document.querySelector('#js-nav-container').style.cssText =
    `height: auto; right: 0px; transition: right ${menuTransition};`;
  document.querySelector('body').classList.add('noscroll');
}

function menuSlideOut(event) {
  const panelElWidth = document.querySelector('#js-nav-container .js-nav-box').clientWidth;

  document.querySelector('.js-cover').classList.remove('active');
  document.querySelector('#js-nav-container').style.cssText =
    `height: 100vh; right: ${-panelElWidth - 1}px; transition: right ${menuTransition};`;
    document.querySelector('body').classList.remove('noscroll');
}
