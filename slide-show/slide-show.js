class SlideShow extends HTMLElement {
  constructor() {
    super();
    this.slides = this.querySelectorAll('.slide');
    this.interval = parseInt(this.dataset.interval, 10) || 5000;
    this.currentIndex = 0;
    this.timer = null;
  }

  connectedCallback() {
    this.init();
  }

  init() {
    this.slides[0].classList.add('active');
    this.start();

    this.addEventListener('mouseenter', () => this.stop());
    this.addEventListener('mouseleave', () => this.start());
    this.addEventListener('touchstart', (e) => this.handleSwipeStart(e));
    this.addEventListener('touchend', (e) => this.handleSwipeEnd(e));

    // Add event listeners for click and drag functionality
    this.addEventListener('mousedown', (e) => this.handleDragStart(e));
    this.addEventListener('mousemove', (e) => this.handleDragMove(e));
    this.addEventListener('mouseup', (e) => this.handleDragEnd(e));
  }

  start() {
    this.timer = setInterval(() => this.nextSlide(), this.interval);
  }

  stop() {
    clearInterval(this.timer);
  }

  nextSlide() {
    this.slides[this.currentIndex].classList.remove('active');
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.slides[this.currentIndex].classList.add('active');
  }

  prevSlide() {
    this.slides[this.currentIndex].classList.remove('active');
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.slides[this.currentIndex].classList.add('active');
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
    this.stop(); // May not be necessary, keeping incase stop on mouseenter is removed
    e.preventDefault(); // Prevent default behavior selecting an element
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
}

customElements.define('slide-show', SlideShow);
