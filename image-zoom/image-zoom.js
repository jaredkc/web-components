if (!customElements.get('image-zoom')) {
  class ImageZoom extends HTMLElement {
    constructor() {
      super();
      this.image = this.querySelector('img');
    }

    connectedCallback() {
      this.image.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
      console.log('ImageZoom clicked');
      if (this.image.style.width === '300%') {
        this.image.removeAttribute('style');
      } else {
        this.image.style.width = '300%';
        this.image.style.maxWidth = '300%';
        this.image.style.height = 'auto';
      }
    }
  }

  customElements.define('image-zoom', ImageZoom);
}
