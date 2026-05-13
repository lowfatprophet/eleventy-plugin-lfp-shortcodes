/**! LFP Rich Link Web Component v3.0 | (c) 2026 lowfatprophet | All rights reserved */

interface LFPRichlinkEvent extends Event {
  detail: {
    name: string;
    consent: boolean;
  }
}

export class LFPRichlink extends HTMLElement {
  static eventType = 'lfp:richlink-consent';
  static storageKey = 'show-richlink';
  input = this.querySelector('input');
  url!: URL;

  connectedCallback() {
    // if there are no images to consent to, there is no input
    if (!this.input) return;

    try {
      // try to parse the URL, errors are silenced
      // biome-ignore lint/style/noNonNullAssertion: gets catched by surrounding try/catch block
      this.url = new URL(this.dataset.url!);
      
      this.input.addEventListener('change', this);
      // biome-ignore lint/suspicious/noTsIgnore: listener for custom event
      // @ts-ignore
      window.addEventListener(LFPRichlink.eventType, this);

      if (this.#consentedOrigins().has(this.url.origin)) {
        this.input.checked = true;
        this.#dispatch(true);
      }
    } catch {}
  }

  disconnectedCallback() {
    window.removeEventListener(LFPRichlink.eventType, this);
  }

  handleEvent(e: LFPRichlinkEvent) {
    if (
      e.type === LFPRichlink.eventType &&
      e.detail.name === this.dataset.name
    ) {
      const consentedOrigins = this.#consentedOrigins();

      if (e.detail.consent) {
        this.#setSrc(el => el.src === el.dataset.src);
        this.#setSrc<HTMLElement>(
          el => el.style.backgroundImage = `url(${el.dataset.src})`,
          '.rl_s',
        );

        consentedOrigins.add(this.url.origin);
      } else {
        this.#setSrc(el => el.src = '.');
        this.#setSrc<HTMLElement>(el => el.style.backgroundImage = '', '.rl_s');

        consentedOrigins.delete(this.url.origin);
      }

      localStorage.setItem(
        LFPRichlink.storageKey,
        JSON.stringify([...consentedOrigins]),
      );
    } else if (e.type === 'change') {
      // @ts-expect-error
      this.#dispatch(this.input.checked);
    }
  }

  #setSrc<T extends Element = HTMLImageElement>(
    cb: (value: T, key: number, parent: NodeListOf<T>) => unknown,
    selector: string = 'img',
  ) {
    this.querySelectorAll<T>(selector).forEach(cb);
  }

  #dispatch(consent: string | boolean) {
    this.dispatchEvent(
      new CustomEvent(LFPRichlink.eventType, {
        bubbles: true,
        cancelable: true,
        detail: { name: this.dataset.name, consent },
      }),
    );
  }

  #consentedOrigins(): Set<string> {
    return new Set(
      JSON.parse(localStorage.getItem(LFPRichlink.storageKey) || '[]'),
    );
  }
}

customElements.define('lfp-richlink', LFPRichlink);