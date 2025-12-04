/**
 * Product Carousel Component
 *
 * Extends the base carousel component with additional methods for programmatic control.
 * Allows scrolling to specific slides by ID, adding new items, and updating existing content.
 */
import { CarouselComponent } from './carousel.js';

export class ProductCarouselComponent extends CarouselComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    // Call parent's connectedCallback first
    super.connectedCallback();
  }

  /**
   * Scroll to a specific slide by its unique ID
   * @param {string} id - The unique ID of the slide to scroll to
   */
  scrollToSlide(id) {
    const targetSlide = this.querySelector(`[data-slide-id="${id}"]`);
    if (!targetSlide) {
      console.warn(`Slide with ID "${id}" not found`);
      return;
    }

    const scrollPosition = targetSlide.offsetLeft;
    const behavior = this.prefersReducedMotion ? 'auto' : 'smooth';

    this.track.scrollTo({ left: scrollPosition, behavior });

    // Move focus to the target slide after scrolling
    setTimeout(() => {
      targetSlide.focus();
    }, this.prefersReducedMotion ? 0 : 300);
  }

  /**
   * Add a new item to the carousel
   * @param {string} content - HTML content to insert into the new slide
   * @param {string} id - Unique ID for the slide
   */
  addItem(content, id) {
    if (!id) {
      console.error('ID is required for adding items');
      return;
    }

    // Check if ID already exists
    if (this.querySelector(`[data-slide-id="${id}"]`)) {
      console.warn(`Slide with ID "${id}" already exists`);
      return;
    }

    // Create new slide wrapper
    const newSlide = document.createElement('div');
    newSlide.className = 'carousel__slide';
    newSlide.setAttribute('data-slide-id', id);
    newSlide.innerHTML = content;

    // Append to track
    this.track.appendChild(newSlide);

    // Update button states after adding new slide
    this.handleDisabledBtns();

    // Scroll to the newly added slide
    this.scrollToSlide(id);
  }

  /**
   * Update the content of an existing slide
   * @param {string} id - Unique ID of the slide to update
   * @param {string} content - New HTML content for the slide
   */
  updateSlide(id, content) {
    const targetSlide = this.querySelector(`[data-slide-id="${id}"]`);
    if (!targetSlide) {
      console.warn(`Slide with ID "${id}" not found`);
      return;
    }

    targetSlide.innerHTML = content;
  }

  /**
   * Get all slide IDs currently in the carousel
   * @returns {string[]} Array of slide IDs
   */
  getSlideIds() {
    const slides = this.querySelectorAll('[data-slide-id]');
    return Array.from(slides).map(slide => slide.getAttribute('data-slide-id'));
  }

  /**
   * Get the ID of the currently visible slide (approximation)
   * @returns {string|null} ID of the slide closest to the left edge
   */
  getCurrentSlideId() {
    const slides = this.querySelectorAll('[data-slide-id]');
    const trackLeft = this.track.scrollLeft;

    for (let slide of slides) {
      const slideLeft = slide.offsetLeft;
      const slideRight = slideLeft + slide.offsetWidth;

      // If slide is at least partially visible
      if (slideLeft <= trackLeft + this.track.offsetWidth && slideRight > trackLeft) {
        return slide.getAttribute('data-slide-id');
      }
    }

    return null;
  }

  /**
   * Remove a slide by ID
   * @param {string} id - Unique ID of the slide to remove
   */
  removeSlide(id) {
    const targetSlide = this.querySelector(`[data-slide-id="${id}"]`);
    if (!targetSlide) {
      console.warn(`Slide with ID "${id}" not found`);
      return;
    }

    targetSlide.remove();
    this.handleDisabledBtns();
  }
}

// Auto-register the component if not already registered
if (!customElements.get('product-carousel')) {
  customElements.define('product-carousel', ProductCarouselComponent);
}
