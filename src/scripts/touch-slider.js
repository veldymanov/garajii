const touchSlider = {
	log: function(msg) {
		const p = document.getElementById('log');
		p.innerHTML = p.innerHTML + "<br>" + msg;
  },

  settings: {
    cellWidth: 366,
    cellPadding: 16,
    elSelector: '.js-touch-list'
  },

	createSlidePanel: function() {
		const el = document.querySelector(this.settings.elSelector);
		const padding = this.settings.cellPadding || 0;
		let x = this.settings.cellPadding / 2;

		//<div class="js-touch-box">
		el.parentElement.style.cssText = 'margin: 0 auto; overflow: hidden;';

		//<ul class='js-touch-list'> === gridid
		el.style.cssText = 'left: 0px; list-style-type: none; margin: 0; padding: 0; position: relative;';

		//<li class='js-touch-list-item'>
		const touchListItems = Array.from(el.querySelectorAll('.js-touch-list-item'));
		touchListItems.forEach( item => {
			item.style.cssText = `height: 95%; left: ${x}px; position: absolute; width: ${this.settings.cellWidth}px`;
      x += this.settings.cellWidth + this.settings.cellPadding;
    });

		touchSlider.width = x;
		touchSlider.padding = this.settings.cellPadding;
		touchSlider.colWidth = this.settings.cellWidth + this.settings.cellPadding;

    touchSlider.makeTouchable(el);
    touchSlider.touchAreaSize(el);

    window.addEventListener('resize', function() {
      touchSlider.touchAreaSize(el);
    })

    // Sliding by click
    touchSlider.prevBtn = el.parentElement.querySelector('.js-prev');
    touchSlider.nextBtn = el.parentElement.querySelector('.js-next');

    touchSlider.prevBtn.addEventListener('click', function(){
      touchSlider.prevClick(el);
    });
    touchSlider.nextBtn.addEventListener('click', function(){
      touchSlider.nextClick(el);
    });
    //Activate managing buttons/arrows
    touchSlider.doSlide(el, 0, '0s');
	},

	prevClick: function(el){ //to left
		let left = parseInt(el.style.left, 10);
		const maxDelta = this.width - el.parentElement.offsetWidth;

		//No click during sliding
		if ( (left % this.colWidth) === 0) {
			left -=  this.colWidth;

			if (Math.abs(left) <= Math.abs(maxDelta)) {
				this.doSlide(el, left, '0.5s');
			}
		}
	},

	nextClick: function(el){ //to right
		let left = parseInt(el.style.left, 10);

		//No click during sliding
		if ( (left % this.colWidth) === 0) {
			left +=  this.colWidth;

			if(left <= 0){
				this.doSlide(el, left, '0.5s');
			}
		}
	},

	// Fit Touch Area to Elements Quantity
	touchAreaSize: function(el){
		el.parentElement.style.width = '100%';
		const touchAreaWidth100 = el.parentElement.offsetWidth;
		const elNumber = Math.floor( touchAreaWidth100 / touchSlider.colWidth);
		const touchAreaWidth = elNumber * touchSlider.colWidth;

		el.parentElement.style.width = touchAreaWidth100  + 'px'; // touchAreaWidth
		touchSlider.hiddenWidth = touchSlider.width - touchAreaWidth100; // touchAreaWidth
	},

	makeTouchable: function(el) {
		el.addEventListener('touchstart', function(event) { touchSlider.touchStart(this, event); }, false);
		el.addEventListener('touchmove', function(event) { touchSlider.touchMove(this, event); }, false);
		el.addEventListener('touchend', function(event) { touchSlider.touchEnd(this, event); }, false);
	},

	touchStart: function(/*element*/ el, /*event*/ e) {
		el.style.transition = 'left 0s';

		this.startX = e.targetTouches[0].clientX;
		this.startY = e.targetTouches[0].clientY;
		this.slider = 0; // Starting sliding position
		this.startLeft = parseInt(el.style.left, 10);
		this.touchStartTime = new Date().getTime();
	},

	touchMove: function(el, event) {
		var deltaX = event.targetTouches[0].clientX - this.startX;
		var deltaY = event.targetTouches[0].clientY - this.startY;

		if (
      (this.slider === 0) &&
      (Math.abs(deltaY) > Math.abs(deltaX))
    ) {
			this.slider = -1;	//Default sliding position
		} else if (this.slider != -1) {
			event.preventDefault();
			this.slider = 1; //this sliding position

			const left = deltaX + this.startLeft;
			el.style.left = left + 'px';

			this.startX > event.targetTouches[0].clientX
				? this.slidingLeft = true
			  : this.slidingLeft = false;
		}
	},

	touchEnd: function(el,  event) {
		if ( parseInt(el.style.left, 10) > 0) {
      // This means they dragged to the right past the first item
			this.doSlide(el, 0, '1s');
			this.startX = null;
		} else if ( Math.abs( parseInt(el.style.left, 10) )  > this.hiddenWidth ) {
			// This means they dragged to the left past the last item
			this.doSlide(el, (-this.hiddenWidth + this.padding / 2), '1s');
			this.startX = null;
		} else {
			// This means they were just dragging within the bounds of the grid
			// and we just need to handle the momentum and snap to the grid.
			this.slideMomentum(el, event);
		}
	},

	doSlide: function(el, /*int*/ x, /*string*/ duration) {
		el.style.left = x + 'px';
		el.style.transition = 'left ' + duration;

		//next, prev buttons activity
		if (x === 0) {
			this.nextBtn.classList.remove('is-active');
			if ( Math.abs(x) < (this.hiddenWidth - this.padding/2) ) {
				this.prevBtn.classList.add('is-active');
			}
		} else if ( Math.abs(x) >=  (this.hiddenWidth - this.padding/2) ){
			this.prevBtn.classList.remove('is-active');
			this.nextBtn.classList.add('is-active');
		} else {
			this.prevBtn.classList.add('is-active');
			this.nextBtn.classList.add('is-active');
		}
	},

	/**
	 * If the user drags their finger really fast we want to push
	 * the slider a little farther since they were pushing a large
	 * amount.
	*/
	slideMomentum: function(/*element*/ el, /*event*/ e) {
		let slideAdjust = (new Date().getTime() - this.touchStartTime) * 65;
		const left = parseInt(el.style.left, 10);

		/*
		 * We calculate the momentum by taking the amount of time they were sliding
		 * and comparing it to the distance they slide.  If they slide a small distance
		 * quickly or a large distance slowly then they have almost no momentum.
		 * If they slide a long distance fast then they have a lot of momentum.
		*/
		const changeX = 12000 * (Math.abs(this.startLeft) - Math.abs(left));

		slideAdjust = Math.round(changeX / slideAdjust);

		let newLeft = left + slideAdjust;

		/*
		 * We need to calculate the closest column so we can figure out
		 * where to snap the grid to.
		 */
		const t = newLeft % this.colWidth;

		Math.abs(t) > (this.colWidth / 2)
			? newLeft -= (this.colWidth - Math.abs(t)) // Show the next cell
			: newLeft -= t; //Stay on the current cell


		if (this.slidingLeft) {
			const maxLeft = -this.hiddenWidth;
			this.doSlide(el, Math.max(maxLeft, newLeft), '0.5s'); // Sliding to the left
		} else {
			this.doSlide(el, Math.min(0, newLeft), '0.5s'); //Sliding to the right
		}

		this.startX = null;
	}
}


document.addEventListener("DOMContentLoaded", function(event) {
  touchSlider.createSlidePanel();
});