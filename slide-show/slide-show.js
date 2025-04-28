class SlideShow extends HTMLElement {
  constructor() {
    super();
    this.slides = this.querySelectorAll('.slide-show__slide');
    this.buttons = this.querySelectorAll('.slide-show__button');
    this.interval = parseInt(this.dataset.interval, 10) || 5000;
    this.currentIndex = 0;
    this.timer = null;
    // To trigger the image transition, but still have the slide visible on page load.
    this.activeSlideClass = 'slide-show__slide--transition';
  }

  connectedCallback() {
    this.init();

    this.addEventListener('mouseenter', () => this.stop());
    this.addEventListener('mouseleave', () => this.start());
    this.addEventListener('touchstart', (e) => this.handleSwipeStart(e));
    this.addEventListener('touchend', (e) => this.handleSwipeEnd(e));

    // Add event listeners for click and drag functionality
    document.addEventListener('mouseup', (e) => this.handleDragEnd(e)); // document incase mouse leaves the element
    this.addEventListener('mousemove', (e) => this.handleDragMove(e));
    this.addEventListener('selectstart', (e) => e.preventDefault()); // Prevent text selection during drag

    // Stop slideshow when focus is within
    this.addEventListener('focusin', () => this.stop());

    // Add keyboard navigation support
    this.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Add event listeners for control buttons
    this.buttons.forEach((button) => {
      button.addEventListener('click', (e) => this.handleControlClick(e));
    });
  }

  init() {
    this.updateAriaAttributes();
    this.start();
    // Slide is visiable on page load, but we still want the image transition.
    setTimeout(() => {
      this.slides[0].classList.add(this.activeSlideClass);
    }, 1);
  }

  start() {
    this.timer = setInterval(() => this.nextSlide(), this.interval);
  }

  stop() {
    clearInterval(this.timer);
  }

  setSlideInactive() {
    this.slides[this.currentIndex].classList.remove(this.activeSlideClass);
    this.slides[this.currentIndex].setAttribute('aria-hidden', 'true');
    this.buttons.forEach((button) => button.removeAttribute('aria-current'));
    // if focus is on or within the current slide, prevent hidden focus
    if (
      document.activeElement === this.slides[this.currentIndex] ||
      this.slides[this.currentIndex].contains(document.activeElement)
    ) {
      this.focus();
    }
  }

  setSlideActive() {
    this.slides[this.currentIndex].classList.add(this.activeSlideClass);
    this.slides[this.currentIndex].setAttribute('aria-hidden', 'false');
    this.buttons.forEach((button) => {
      if (button.name === this.currentIndex.toString()) {
        button.setAttribute('aria-current', 'true');
      }
    });

    this.updateAriaAttributes();
  }

  nextSlide() {
    this.setSlideInactive();
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;

    this.setSlideActive();
  }

  prevSlide() {
    this.setSlideInactive();
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.setSlideActive();
  }

  handleControlClick(e) {
    this.setSlideInactive();
    const name = e.target.name;
    if (name === 'prev') {
      this.prevSlide();
      return;
    }
    if (name === 'next') {
      this.nextSlide();
      return;
    }
    this.currentIndex = parseInt(name, 10);

    this.setSlideActive();
  }

  handleSwipeStart(e) {
    this.stop();
    this.startX = e.touches[0].clientX;
  }

  handleSwipeEnd(e) {
    const endX = e.changedTouches[0].clientX;
    if (this.startX - endX > 50) {
      this.nextSlide();
    } else if (endX - this.startX > 50) {
      this.prevSlide();
    }
  }

  handleDragStart(e) {
    e.preventDefault(); // Prevent default behavior selecting an element
    this.stop(); // Incase stop on mouseenter is disabled
    this.isDragging = true;
    this.startX = e.clientX;
  }

  handleDragMove(e) {
    e.preventDefault();
    if (!this.isDragging) return;
    this.currentX = e.clientX;
  }

  handleDragEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    const endX = e.clientX;
    if (this.startX - endX > 50) {
      this.nextSlide();
    } else if (endX - this.startX > 50) {
      this.prevSlide();
    }
  }

  updateAriaAttributes() {
    this.slides.forEach((slide, index) => {
      const isActive = index === this.currentIndex;
      // Disable links in inactive slides for keyboard navigation and accessibility
      const links = slide.querySelectorAll('a');
      links.forEach((link) => {
        if (isActive) {
          link.removeAttribute('tabindex');
        } else {
          link.setAttribute('tabindex', '-1');
        }
      });
    });
  }

  handleKeydown(e) {
    if (e.key === 'ArrowRight') {
      this.nextSlide();
    } else if (e.key === 'ArrowLeft') {
      this.prevSlide();
    }
  }
}

customElements.define('slide-show', SlideShow);
