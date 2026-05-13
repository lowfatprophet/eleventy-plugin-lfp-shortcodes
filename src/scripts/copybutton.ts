/**! LFP CopyButton Web Component v2.0 | (c) 2026 lowfatprophet | All rights reserved */

/**
 * # LFPCopyButton
 * 
 * Creates a button that hooks into the `clipboard` API and lets the user copy the text from a specified node. Select carefully and make sure the resulting `.textContent` can be copied sensibly.
 * 
 * ## Attributes
 * 
 * - `copy-target`: valid CSS selector applied on entire document to find element from which `.textcontent` gets copied.
 * - `button-text`: text that is placed on button per default.
 * - `copy-text`: text that gets shown when successfully copied content.
 */
export class LFPCopyButton extends HTMLElement {
  button = this.querySelector('button');
  btnText!: string;
  copyTarget = document.querySelector(this.getAttribute('copy-target') || '');

  connectedCallback() {
    if (!this.button || !this.copyTarget) return;

    this.button.removeAttribute('disabled');
    this.button.textContent = this.getAttribute('button-text') || 'Copy';
    this.btnText = this.button.textContent;

    const doCopy = async () => {
      // biome-ignore lint/style/noNonNullAssertion: function only called in context where `this.copyTarget` is defined
      await navigator.clipboard.writeText(this.copyTarget!.textContent);
    };

    this.button.addEventListener('click', async () => {
      try {
        // try to ask for permission, ...
        const result = await navigator.permissions?.query({
          // @ts-expect-error
          // TypeScript does not like experimental features; which do no harm here
          // https://developer.mozilla.org/en-US/docs/Web/API/Permissions#browser_compatibility
          name: 'clipboard-write',
        });

        if (result.state === 'granted' || result.state === 'prompt') doCopy();
      } catch (error) {
        // ... copy anyway
        if (error instanceof TypeError) doCopy();
      }

      // biome-ignore lint/style/noNonNullAssertion: is defined inside its own event listener!
      this.button!.textContent = this.getAttribute('copy-text') || 'Copied!';

      setTimeout(() => {
        // biome-ignore lint/style/noNonNullAssertion: is defined inside its own event listener!
        this.button!.textContent = this.btnText;
      }, 1500);
    });
  }
}

customElements.define('lfp-copy-button', LFPCopyButton);