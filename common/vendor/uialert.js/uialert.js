//
//  uialert.js
//  uialert.js (https://github.com/therealFoxster/uialert.js)
//
//  Copyright (c) 2024 therealFoxster.
//  MIT License.
//

class UIAlert {
    constructor({
        title,
        message,
        actions = [{
            title: 'OK',
            style: 'cancel', // '', 'cancel', 'destructive'
            handler: () => {},
            isAddedByDefault: true
        }]
    }) {
        this.title = title?.replaceAll('\n', '<br>');
        this.message = message?.replaceAll('\n', '<br>');
        this.actions = actions;
    }

    #html = () => `
        <div id="uialert-container">
            <dialog id="uialert">
                <div id="text">
                    ${this.title ? `<p id="title">${this.title}</p>` : ''}
                    ${this.message ? `<p id="message">${this.message}</p>` : ''}
                </div>
                <div id="buttons">
                    ${this.actions.map((action, i) =>
                        `<button id="action-${i}" class="${action.style}" ">${action.title}</button>`
                    ).join('')}
                </div>
            </dialog>
        </div>
    `;

    addAction({title = 'OK', style = '', handler = () => {}}) {
        if (this.actions.length === 1 && this.actions[0].isAddedByDefault) {
            this.actions = [];
        }
        this.actions.push({
            title: title,
            style: style,
            handler: handler
        });
    }

    #addActionHandlers() {
        this.actions.forEach((action, i) => {
            document.querySelector(`#uialert #action-${i}`).addEventListener('click', () => {
                UIAlert.#hide();
                action.handler();
            });
        });
    }

    async present() {
        await UIAlert.#hide();
        document.body.insertAdjacentHTML('beforeend', this.#html());
        this.#addActionHandlers();
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', UIAlert.#onKeyDown);
    }
    
    static async #hide() {
        const alert = document.getElementById('uialert');
        if (alert) {
            alert.classList.add('hiding');
            alert.parentElement.classList.add('hiding');
            return new Promise((resolve) => {
                alert.addEventListener('animationend', () => {
                    document.body.style.overflow = 'auto';
                    alert.parentElement.remove();
                    setTimeout(resolve, 300);
                }, { once: true });
            });
        } else {
            return Promise.resolve();
        }
    }

    static #onKeyDown = (event) => {
        if (event.key === 'Escape') {
            UIAlert.#hide();
        }
    }
}

window.UIAlert = UIAlert;
export default UIAlert;