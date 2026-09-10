/* Keep Stockist responsible for data, search, map controls and retailer popups.
 * The native Stockist custom element also supports Shopify section replacement.
 */
if (!customElements.get('tejesta-store-locator')) {
  customElements.define('tejesta-store-locator', class extends HTMLElement {
    connectedCallback() {
      this.observer = new MutationObserver(() => this.styleWidget());
      this.observer.observe(this, { childList: true, subtree: true });
      this.styleWidget();
      if (!this.querySelector('stockist-store-locator')) return;
      if (!window.tejestaStockistLoader) {
        window.tejestaStockistLoader = new Promise((resolve, reject) => {
          if (customElements.get('stockist-store-locator')) return resolve();
          let script = document.querySelector('script[src*="stockist.co/embed/v1/widget.min.js"]');
          const existing = !!script;
          if (!script) {
            script = document.createElement('script');
            script.src = 'https://stockist.co/embed/v1/widget.min.js';
            script.async = true;
          }
          script.addEventListener('load', resolve, { once: true });
          script.addEventListener('error', reject, { once: true });
          if (!existing) document.head.appendChild(script);
        });
      }
      window.tejestaStockistLoader.catch(() => {
        if (!this.isConnected) return;
        this.querySelector('stockist-store-locator').hidden = true;
        this.querySelector('.tejesta-locator__error').hidden = false;
      });
    }
    disconnectedCallback() {
      this.observer?.disconnect();
    }
    styleWidget() {
      const input = this.querySelector('.stockist-search-field');
      if (input && this.dataset.placeholder) {
        input.placeholder = this.dataset.placeholder;
        input.setAttribute('aria-label', this.dataset.placeholder);
      }
      // Retain Stockist’s native button, keyboard search and event listeners.
      const button = this.querySelector('.stockist-search-button button');
      if (button) button.setAttribute('aria-label', 'Search for a retailer');
      if (!this.dataset.markerUrl) return;
      this.querySelectorAll('img.leaflet-marker-icon[src^="https://pins.stockist.co/pin-"]').forEach((marker) => {
        marker.src = this.dataset.markerUrl;
        marker.classList.add('tejesta-locator__marker');
      });
    }
  });
}
