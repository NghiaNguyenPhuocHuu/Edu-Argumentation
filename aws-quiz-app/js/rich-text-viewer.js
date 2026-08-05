class RichTextViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['content'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'content' && oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const rawContent = decodeURIComponent(this.getAttribute('content') || '');
        
        // 1. Parse Markdown safely
        let htmlContent = rawContent;
        if (typeof marked !== 'undefined') {
            htmlContent = marked.parse(rawContent);
        }

        // 2. Inject HTML and Styles
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css');
                
                :host {
                    display: block;
                    font-family: inherit;
                    line-height: 1.6;
                }
                
                /* Minimal markdown styling */
                p { margin-bottom: 1em; }
                code { background: rgba(255, 255, 255, 0.1); padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
                pre { background: #111827; padding: 1em; overflow-x: auto; border-radius: 8px; border: 1px solid #374151; }
                pre code { background: transparent; padding: 0; }
                ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
                ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
                h1, h2, h3, h4 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; color: #fff; }
                a { color: #ef5b5b; text-decoration: underline; }
                blockquote { border-left: 4px solid #ef5b5b; padding-left: 1em; color: #9ca3af; margin-left: 0; }
            </style>
            <div class="content-container">${htmlContent}</div>
        `;

        // 3. Scan and render LaTeX inside the newly created DOM
        if (typeof renderMathInElement !== 'undefined') {
            const container = this.shadowRoot.querySelector('.content-container');
            renderMathInElement(container, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
    }
}

customElements.define('rich-text-viewer', RichTextViewer);
