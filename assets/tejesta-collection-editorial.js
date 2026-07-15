class TejestaEditorialProduct extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', this.onVariantClick);
    this.addEventListener('pointerenter', this.preloadVariantImage, true);
    this.addEventListener('focusin', this.preloadVariantImage);
    this.randomizeColorways();
  }

  onVariantClick = (event) => {
    const button = event.target.closest('[data-tejesta-editorial-variant]');
    if (!button || !this.contains(button)) return;

    this.activateVariant(button);
  };

  activateVariant(button) {
    this.querySelectorAll('[data-tejesta-editorial-variant]').forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    this.updateImage(button);
    this.updateColorway(button);
    this.updateLinks(button);
  }

  randomizeColorways() {
    const colorways = this.querySelector('.tejesta-editorial-product__colorways');
    if (!colorways) return;

    const variants = Array.from(colorways.querySelectorAll('[data-tejesta-editorial-variant]'));
    if (variants.length < 2) return;

    for (let index = variants.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [variants[index], variants[randomIndex]] = [variants[randomIndex], variants[index]];
    }

    variants.forEach((variant) => colorways.appendChild(variant));

    const initialVariant = variants.find((variant) => variant.dataset.variantImage);
    if (initialVariant) this.activateVariant(initialVariant);
  }

  preloadVariantImage = (event) => {
    const button = event.target.closest('[data-tejesta-editorial-variant]');
    const imageUrl = button?.dataset.variantImage;
    if (!imageUrl || button.dataset.imagePreloaded === 'true') return;

    const preload = new Image();
    preload.src = imageUrl;
    button.dataset.imagePreloaded = 'true';
  };

  updateImage(button) {
    const image = this.querySelector('.tejesta-editorial-product__image');
    const imageUrl = button.dataset.variantImage;
    if (!image || !imageUrl) return;

    image.src = imageUrl;
    image.srcset = imageUrl;
    image.alt = button.dataset.variantAlt || button.dataset.variantLabel || image.alt;
  }

  updateColorway(button) {
    const colorway = this.querySelector('[data-editorial-colorway]');
    if (!colorway) return;

    colorway.textContent = button.dataset.variantLabel || '';
    colorway.classList.toggle('is-hidden', !button.dataset.variantLabel);
  }

  updateLinks(button) {
    const variantUrl = button.dataset.variantUrl;
    if (!variantUrl) return;

    this.querySelectorAll('[data-editorial-product-link]').forEach((link) => {
      link.href = variantUrl;
    });
  }
}

if (!customElements.get('tejesta-editorial-product')) {
  customElements.define('tejesta-editorial-product', TejestaEditorialProduct);
}
