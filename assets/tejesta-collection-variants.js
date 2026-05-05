class TejestaCollectionVariants extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', this.onVariantClick.bind(this));
  }

  onVariantClick(event) {
    const variantButton = event.target.closest('[data-tejesta-collection-variant]');

    if (!variantButton || !this.contains(variantButton)) {
      return;
    }

    const card = variantButton.closest('[data-tejesta-product-card]');

    if (!card) {
      return;
    }

    this.querySelectorAll('[data-tejesta-collection-variant]').forEach((button) => {
      button.classList.toggle('is-active', button === variantButton);
      button.setAttribute('aria-pressed', button === variantButton ? 'true' : 'false');
    });

    this.updateCardImage(card, variantButton);
    this.updateCardLinks(card, variantButton);
  }

  updateCardImage(card, variantButton) {
    const image = card.querySelector('.tejesta-collection-card__image');
    const imageUrl = variantButton.dataset.variantImage;

    if (!image || !imageUrl) {
      return;
    }

    image.src = imageUrl;
    image.srcset = imageUrl;

    if (variantButton.dataset.variantLabel) {
      image.alt = variantButton.dataset.variantLabel;
    }
  }

  updateCardLinks(card, variantButton) {
    const variantUrl = variantButton.dataset.variantUrl;

    if (!variantUrl) {
      return;
    }

    card.querySelectorAll('.tejesta-collection-card__link').forEach((link) => {
      link.href = variantUrl;
    });
  }
}

if (!customElements.get('tejesta-collection-variants')) {
  customElements.define('tejesta-collection-variants', TejestaCollectionVariants);
}
