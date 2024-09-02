class DialogOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');

    if (!button) return;
    button.addEventListener('click', () => {
      const dialog = document.querySelector(this.getAttribute('data-dialog'));
      if (dialog) dialog.show(button);
    });
  }
}

customElements.define('dialog-opener', DialogOpener);

class DialogModal extends HTMLElement {
  constructor() {
    super();

    this.dialog = this.querySelector('dialog');
    this.content = this.querySelector('.dialog-content');
    this.load = this.getAttribute('data-load');
    this.loaded = false;
    this.loadingClass = 'loading';
  }

  connectedCallback() {
    this.dialog.addEventListener('click', this.handleClick.bind(this));
  }

  show() {
    this.dialog.showModal();
    this.loadContent();
  }

  handleClick(event) {
    const x = event.clientX;
    const y = event.clientY;
    const rect = event.target.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      this.dialog.close();
    }
  }

  loadContent() {
    if (this.content && this.load && !this.loaded) {
      this.content.classList.add(this.loadingClass);
      fetch(this.load)
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
          return response.text();
        })
        .then((text) => {
          this.content.innerHTML = text;
          this.loaded = true;
        })
        .catch((error) => {
          this.content.innerHTML = 'Failed to load content';
          console.error(error);
        })
        .finally(() => {
          this.content.classList.remove(this.loadingClass);
        });
    }
  }
}

customElements.define('dialog-modal', DialogModal);
