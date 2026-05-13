/**! LFP Embed Web Component v1.1 | (c) 2026 lowfatprophet | All rights reserved */

interface LFPEmbedEvent extends Event {
  detail: {
    name: string;
    consent: boolean;
  }
}

export class LFPEmbed extends HTMLElement {
  static eventType = 'lfp:embed-consent';
  template: HTMLTemplateElement | null = this.querySelector('template');
  name: string = this.getAttribute('embed-name') || '';
  origin: string = this.getAttribute('embed-origin') || '';
  url: string = this.getAttribute('embed-url') || '';
  input!: HTMLInputElement;
  wrapper!: HTMLDivElement;

  connectedCallback() {
    const uuid = crypto.randomUUID();
    this.innerHTML = /* html */ `<input type="checkbox" name="embed-${uuid}" id="embed-${uuid}">
    <label for="embed-${uuid}">Show ${this.name} embed</label>
    <small>(By consenting you accept that your data might be processed by ${this.origin ? `<a href="${this.origin}">${this.name}</a>` : this.name} and/or their affiliates; <a href="${this.url}">visit the linked content directly</a>.)</small>
    <div class="embed-wrapper"></div>`;

// biome-ignore lint/style/noNonNullAssertion: elements are guaranteed to be defined at that moment as they are set in the line before
    this.input = this.querySelector('input')!;
    // biome-ignore lint/style/noNonNullAssertion: elements are guaranteed to be defined at that moment as they are set in the line before
    this.wrapper = this.querySelector('.embed-wrapper')!;

    this.addEventListener('change', e => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent(LFPEmbed.eventType, {
          bubbles: true,
          cancelable: false,
          detail: {
            name: this.name,
            consent: this.input.checked,
          },
        }),
      );
    });
    // biome-ignore lint/suspicious/noTsIgnore: listener for custom event
    // @ts-ignore
    window.addEventListener(LFPEmbed.eventType, this);
  }

  disconnectedCallback() {
    // biome-ignore lint/suspicious/noTsIgnore: listener for custom event
    // @ts-ignore
    window.removeEventListener(LFPEmbed.eventType, this);
  }

  handleEvent(e: LFPEmbedEvent) {
    if (e.detail.name === this.name && this.template) {
      e.preventDefault();
      if (e.detail.consent) {
        this.wrapper.append(this.template.content.cloneNode(true));
      } else {
        this.wrapper.replaceChildren();
      }
      if (e.detail.consent !== this.input.checked) {
        this.input.checked = e.detail.consent;
      }
    }
  }
}

customElements.define('lfp-embed', LFPEmbed);