class ScrollAssist extends HTMLElement {
  constructor() {
    super();

    this.track = this.querySelector('[data-scroll-track]');
    this.leftBtn = this.querySelector('[data-scroll-direction=left]');
    this.rightBtn = this.querySelector('[data-scroll-direction=right]');
    this.distance = this.getAttribute('data-scroll-distance') || '';
    this.timer = null;
  }

  connectedCallback() {
    if (!this.track || !this.leftBtn || !this.rightBtn) return;

    this.leftBtn.addEventListener('click', (event) => this.handleScroll(event));
    this.rightBtn.addEventListener('click', (event) => this.handleScroll(event));

    this.track.addEventListener('scroll', () => this.handleDisabledBtns());

    this.handleDisabledBtns();
  }

  calcDistance() {
    return this.distance == 'child'
      ? this.track.firstElementChild.nextElementSibling.offsetLeft
      : this.track.offsetWidth;
  }

  handleScroll(event) {
    const eventTarget = event.currentTarget.dataset.scrollDirection;
    const distance = this.calcDistance();
    const leftOrRight = eventTarget === 'right' ? distance : -distance;
    this.track.scrollBy({ left: leftOrRight, behavior: 'smooth' });
  }

  handleDisabledBtns() {
    if (this.timer !== null) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.leftBtn.disabled = this.track.scrollLeft === 0;
      this.rightBtn.disabled = this.track.scrollWidth - this.track.scrollLeft - this.track.offsetWidth <= 32;
    }, 250);
  }
}

customElements.define('scroll-assist', ScrollAssist);
