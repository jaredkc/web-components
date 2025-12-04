/**
 * Product Carousel Thumbnails Component
 *
 * A companion component for product-carousel that provides clickable thumbnail navigation.
 * Links to a product-carousel via matching data-carousel-id attribute.
 */
export class ProductCarouselThumbsComponent extends HTMLElement {
  constructor() {
    super();
    this.carousel = null;
    this.thumbnails = [];
    this.scrollHandler = null;
  }

  connectedCallback() {
    // Find product-carousel by matching data-carousel-id
    this.findCarousel();

    if (!this.carousel) {
      console.warn('product-carousel-thumbs: No product-carousel found with matching data-carousel-id');
      return;
    }

    // Get all thumbnail buttons
    this.thumbnails = Array.from(this.querySelectorAll('[data-thumbnail-slide-id]'));

    if (this.thumbnails.length === 0) {
      console.warn('product-carousel-thumbs: No thumbnail buttons found');
      return;
    }

    // Set up click handlers
    this.setupClickHandlers();

    // Listen to carousel scroll events to update active state
    this.setupScrollListener();

    // Initial active state update
    this.updateActiveThumbnail();

    // Watch for dynamic slide changes
    this.setupMutationObserver();
  }

  disconnectedCallback() {
    if (this.scrollHandler && this.carousel?.track) {
      this.carousel.track.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  findCarousel() {
    const carouselId = this.getAttribute('data-carousel-id');
    if (carouselId) {
      const carousel = document.querySelector(`product-carousel[data-carousel-id="${carouselId}"]`);
      if (carousel) {
        this.carousel = carousel;
      }
    }
  }

  setupClickHandlers() {
    this.thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const slideId = thumb.getAttribute('data-thumbnail-slide-id');
        if (slideId && this.carousel) {
          this.carousel.scrollToSlide(slideId);
        }
      });
    });
  }

  setupScrollListener() {
    if (!this.carousel?.track) return;

    // Debounce scroll handler
    let scrollTimeout = null;
    this.scrollHandler = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.updateActiveThumbnail();
      }, 100);
    };

    this.carousel.track.addEventListener('scroll', this.scrollHandler);
  }

  updateActiveThumbnail() {
    if (!this.carousel) return;

    const currentSlideId = this.carousel.getCurrentSlideId();

    this.thumbnails.forEach(thumb => {
      const slideId = thumb.getAttribute('data-thumbnail-slide-id');
      if (slideId === currentSlideId) {
        thumb.classList.add('carousel-thumb--active');
        thumb.setAttribute('aria-current', 'true');
      } else {
        thumb.classList.remove('carousel-thumb--active');
        thumb.removeAttribute('aria-current');
      }
    });
  }

  setupMutationObserver() {
    // Watch for slides being added/removed in the carousel
    if (!this.carousel?.track) return;

    this.mutationObserver = new MutationObserver(() => {
      // Re-query thumbnails in case they were dynamically added
      this.thumbnails = Array.from(this.querySelectorAll('[data-thumbnail-slide-id]'));
      this.setupClickHandlers();
      this.updateActiveThumbnail();
    });

    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true
    });
  }
}

// Auto-register the component if not already registered
if (!customElements.get('product-carousel-thumbs')) {
  customElements.define('product-carousel-thumbs', ProductCarouselThumbsComponent);
}

