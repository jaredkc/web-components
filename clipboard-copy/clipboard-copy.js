/**
 * Clipboard Copy
 *
 * Allows for easy copying of text to the clipboard.
 */
if (!customElements.get('clipboard-copy')) {
  class ClipboardCopy extends HTMLElement {
    constructor() {
      super();

      this.button = this.querySelector('button');
      this.buttonText = this.button.textContent || 'Copy';
      this.input = this.querySelector('input');
      this.inputSize = this.input.getAttribute('size') || 12;
    }

    connectedCallback() {
      this.button.addEventListener('click', () => this.copyText());
      this.input.addEventListener('focus', this.handleInputFocus.bind(this));
      this.input.addEventListener('blur', this.handleInputBlur.bind(this));

      if (!this.input.getAttribute('size')) {
        this.input.setAttribute('size', this.inputSize);
      }
    }

    copyText() {
      navigator.clipboard.writeText(this.input.value);
      this.classList.add('copied');
      this.button.textContent = 'Copied!';
      setTimeout(() => {
        this.button.textContent = this.buttonText;
        this.classList.remove('copied');
      }, 2000);
    }

    handleInputFocus() {
      this.copyText();
      this.input.setSelectionRange(0, 99999);
      if (this.input.value.length > this.inputSize) {
        this.input.setAttribute('size', this.input.value.length);
      }
    }

    handleInputBlur() {
      this.input.setAttribute('size', this.inputSize);
    }
  }

  customElements.define('clipboard-copy', ClipboardCopy);
}
