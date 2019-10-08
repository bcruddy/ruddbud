class MagicButtonOpen extends HTMLElement {
    constructor () {
        super();
        this.classList.add('shadow-root');
        this.dom = this.attachShadow({ mode: 'open' });
        this.attachMagicButton();
    }

    attachMagicButton () {
        if (!this.hasAttribute('magic')) {
           return;
        }

        const button = document.createElement('button');

        button.textContent = this.getAttribute('magic');
        button.classList.add('magic-button--open');

        this.dom.appendChild(button);
    }
}

window.customElements.define('magic-button-open', MagicButtonOpen);

class MagicButtonClosed extends HTMLElement {
    constructor() {
        super();
        this.classList.add('shadow-root');
        this.dom = this.attachShadow({ mode: 'closed' });
        this.attachMagicButton();

    }

    attachMagicButton () {
        if (!this.hasAttribute('magic')) {
            return;
        }

        const button = document.createElement('button');

        button.textContent = this.getAttribute('magic');
        button.classList.add('magic-button--closed');

        this.dom.appendChild(button);
    }
}

window.customElements.define('magic-button-closed', MagicButtonClosed);
