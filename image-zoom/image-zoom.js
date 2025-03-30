if (!customElements.get('image-zoom')) {
  class ImageZoom extends HTMLElement {
    constructor() {
      super();
      this.image = this.querySelector('img');
      this.scale = 4;
    }

    connectedCallback() {
      this.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
      const rect = this.getBoundingClientRect();

      // Calculate relative click position as percentage
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;

      if (this.image.style.width) {
        this.style.height = '';
        this.image.style.width = '';
        this.image.style.maxWidth = '';
      } else {
        this.style.height = rect.height + 'px';
        this.image.style.width = `${this.scale * 100}%`;
        this.image.style.maxWidth = `${this.scale * 100}%`;

        // Calculate the new dimensions
        const newWidth = rect.width * this.scale;
        const newHeight = rect.height * this.scale;

        this.scrollTo({
          left: newWidth * relativeX - rect.width / 2,
          top: newHeight * relativeY - rect.height / 2,
        });
      }
    }
  }

  customElements.define('image-zoom', ImageZoom);
}
