document.addEventListener("DOMContentLoaded",function() {
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
    this.width = elem.clientWidth;;
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
      ? menuSlideIn(event) // elem.style.right = 0 + 'px'
      : menuSlideOut(event) // elem.style.right = -this.width + 'px';

		this.startX = null;
		this.startY = null;
	}
}

function menuSlideIn(event) {
  document.querySelector('.js-cover').classList.add('active');
  document.querySelector('#js-nav-container').style.cssText = 'right: 0px; transition: right 0.5s;';
  document.querySelector('body').style.overflow = 'hidden'; // Stop Scroll Propagation
}

function menuSlideOut(event) {
  document.querySelector('.js-cover').classList.remove('active');
  document.querySelector('#js-nav-container').style.cssText = 'right: -250px; transition: right 0.5s;';
  document.querySelector('body').style.overflow = 'auto';
}
