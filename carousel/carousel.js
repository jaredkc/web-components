/**
 * Carousel Component
 *
 * A simple carousel component using CSS scroll-snap and native scrolling.
 * Features horizontal scrolling with prev/next buttons and accessibility support.
 */
export class CarouselComponent extends HTMLElement {
  constructor() {
    super();

    this.track = this.querySelector('[data-carousel-track]');
    this.leftBtn = this.querySelector('[data-carousel-direction="left"]');
    this.rightBtn = this.querySelector('[data-carousel-direction="right"]');
    this.timer = null;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;

    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  connectedCallback() {
    if (!this.track || !this.leftBtn || !this.rightBtn) return;

    // Button event listeners
    this.leftBtn.addEventListener('click', (event) => this.handleScroll(event));
    this.rightBtn.addEventListener('click', (event) => this.handleScroll(event));

    // Scroll event listener with debouncing
    this.track.addEventListener('scroll', () => this.handleDisabledBtns());

    // Touch/swipe support
    this.addEventListener('touchstart', (e) => this.handleSwipeStart(e));
    this.addEventListener('touchend', (e) => this.handleSwipeEnd(e));

    // Mouse drag support
    this.addEventListener('mousedown', (e) => this.handleDragStart(e));
    this.addEventListener('mousemove', (e) => this.handleDragMove(e));
    document.addEventListener('mouseup', (e) => this.handleDragEnd(e));
    this.addEventListener('selectstart', (e) => e.preventDefault());

    // Keyboard navigation
    this.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Initial button state update
    this.handleDisabledBtns();
  }

  disconnectedCallback() {
    if (this.timer !== null) clearTimeout(this.timer);
    document.removeEventListener('mouseup', this.handleDragEnd);
  }

  calcDistance() {
    // This accounts for scroll padding, similar to scroll-assist
    const firstChildLeft = this.track.firstElementChild.offsetLeft;
    return firstChildLeft === 0
      ? this.track.firstElementChild.nextElementSibling.offsetLeft
      : this.track.firstElementChild.offsetLeft;
  }

  handleScroll(event) {
    const eventTarget = event.currentTarget.dataset.carouselDirection;
    const distance = this.calcDistance();
    const leftOrRight = eventTarget === 'right' ? distance : -distance;

    const behavior = this.prefersReducedMotion ? 'auto' : 'smooth';
    this.track.scrollBy({ left: leftOrRight, behavior });
  }

  handleDisabledBtns() {
    if (this.timer !== null) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      const isAtStart = this.track.scrollLeft === 0;
      const isAtEnd = this.track.scrollWidth - this.track.scrollLeft - this.track.offsetWidth <= 32;

      this.leftBtn.disabled = isAtStart;
      this.rightBtn.disabled = isAtEnd;
    }, 250);
  }

  handleSwipeStart(e) {
    this.startX = e.touches[0].clientX;
  }

  handleSwipeEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const distance = this.calcDistance();

    if (this.startX - endX > 50) {
      // Swipe left - go to next
      this.track.scrollBy({ left: distance, behavior: this.prefersReducedMotion ? 'auto' : 'smooth' });
    } else if (endX - this.startX > 50) {
      // Swipe right - go to previous
      this.track.scrollBy({ left: -distance, behavior: this.prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }

  handleDragStart(e) {
    e.preventDefault();
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
    const distance = this.calcDistance();

    if (this.startX - endX > 50) {
      // Drag left - go to next
      this.track.scrollBy({ left: distance, behavior: this.prefersReducedMotion ? 'auto' : 'smooth' });
    } else if (endX - this.startX > 50) {
      // Drag right - go to previous
      this.track.scrollBy({ left: -distance, behavior: this.prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }

  handleKeydown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.rightBtn.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.leftBtn.click();
    }
  }
}

// Auto-register the component if not already registered
if (!customElements.get('carousel-component')) {
  customElements.define('carousel-component', CarouselComponent);
}
