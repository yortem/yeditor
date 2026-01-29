const yEditor = {
    // Cache for loaded language files
    _loadedTranslations: {},
    // Default fallback translations
    _defaultLang: 'en',
    // Cache for the loaded CSS content
    _cssContent: null,
    // Path to the script directory, determined at runtime
    _scriptPath: null,
    // Store instances of editors initialized on the page
    _instances: {},


    _getToolbarButtons: function() {
        return [ // Using embedded SVG for icons
            { command: 'removeFormat', title: 'removeFormat', icon: '<svg viewBox="0 0 24 24"><path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21l1.8-1.27L4.54 6.27.27 3.27zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5z"/></svg>' },
            { command: 'bold', title: 'bold', icon: '<svg viewBox="0 0 16 16"><path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908zm0 6.788V8.598h1.734c1.239 0 1.82.56 1.82 1.414 0 .933-.645 1.53-1.844 1.53H5.908z"/></svg>' },
            { command: 'italic', title: 'italic', icon: '<svg viewBox="0 0 24 24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>' },
            { command: 'underline', title: 'underline', icon: '<svg viewBox="0 0 24 24"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2z"/></svg>' },
            { command: 'createLink', title: 'link', icon: '<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>' },
            { command: 'unlink', title: 'unlink', icon: '<svg viewBox="0 0 24 24"><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.96l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zM7 9h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1S5.29 9 7 9zm-1 4h10v-2H6zm-3.24-8.76L2 6.24l19.76 19.76 1.41-1.41z"/></svg>' },
            { command: 'formatBlock', value: 'blockquote', title: 'quote', icon: '<svg viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>' },
            { command: 'insertTable', title: 'table', icon: '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4zm0-6H4v-4h4zm0-6H4V4h4zm6 12h-4v-4h4zm0-6h-4v-4h4zm0-6h-4V4h4zm6 12h-4v-4h4zm0-6h-4v-4h4zm0-6h-4V4h4z"/></svg>' },
            { command: 'insertHorizontalRule', title: 'horizontalRule', icon: '<svg viewBox="0 0 24 24"><path d="M4 11h16v2H4z"/></svg>' },
            { command: 'insertImage', title: 'insertImage', icon: '<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z"/></svg>' },
            { command: 'insertUnorderedList', title: 'unorderedList', icon: '<svg viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7zm0-6h14v-2H7zm0-8v2h14V5z"/></svg>' },
            { command: 'insertOrderedList', title: 'orderedList', icon: '<svg viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2zm1-9h1V4H2v1h1zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2zm5-6v2h14V5zm0 14h14v-2H7zm0-6h14v-2H7z"/></svg>' },
            { command: 'toggleSource', title: 'source', icon: '<svg viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>' },
        ];
    },

    init: async function(selector, options = {}) {
        // --- Configuration ---
        const config = {
            lang: 'en',
            direction: 'ltr',
            theme: 'light',
            quickLinksApiUrl: null,
            imageGalleryApiUrl: null,
            fileBrowserOptions: {},
            fileBrowserUrl: null,
            ...options
        };
        this.config = config;
        
        // Ensure dependencies are loaded before proceeding
        await this._ensureDOMPurify();

        // Determine script path once, relative to which other assets are loaded.
        if (!this._scriptPath) {
            // Find the script tag that loaded this script.
            const scriptTag = document.querySelector('script[src*="editor.js"], script[src*="editor.min.js"]');
            if (scriptTag) {
                const src = scriptTag.src;
                this._scriptPath = src.substring(0, src.lastIndexOf('/'));
            } else {
                // Fallback for when script is inlined or hard to find. Assumes assets are relative to the page.
                this._scriptPath = '.'; 
                console.warn('yEditor: Could not determine script path. Assuming assets are relative to the HTML document.');
            }
        }

        // Load the language file before proceeding
        await this._loadCSS();
        await this._loadLanguage(config.lang);
        this.t = (key) => this._loadedTranslations[this.config.lang]?.[key] || this._loadedTranslations[this._defaultLang]?.[key] || key;

        const textarea = document.querySelector(selector);
        if (!textarea) {
            console.error("yEditor: Element not found for selector:", selector);
            return;
        }

        // 1. הסתר את ה-textarea המקורי
        textarea.style.display = 'none';

        // 2. צור את הקונטיינר הראשי ואת ה-Shadow DOM
        const container = document.createElement('div');
        container.className = 'yeditor-container'; // Class for external reference if needed
        container.dataset.theme = config.theme; // Set theme attribute
        container.dir = config.direction; // Set direction attribute
        const shadowRoot = container.attachShadow({ mode: 'open' });
        this._container = container; // Store container for event dispatching
        this._shadowRoot = shadowRoot; // Store shadowRoot for later access if needed
        this._textarea = textarea; // Store reference to original textarea

        // Store instance details for external access
        this._instances[selector] = { container, shadowRoot, textarea };

        // 3. הוסף את ה-CSS הפנימי
        const styleElement = document.createElement('style');
        styleElement.textContent = this._cssContent;
        shadowRoot.appendChild(styleElement);

        // 4. צור את רכיבי העורך והוסף אותם
        const toolbar = this.createToolbar();
        const contentArea = this.createContentArea(textarea.value, config.direction);
        const sourceArea = document.createElement('textarea');
        sourceArea.className = 'yeditor-source';
        sourceArea.style.display = 'none';
        sourceArea.dir = 'ltr'; // HTML is always LTR

        shadowRoot.appendChild(toolbar);
        shadowRoot.appendChild(contentArea);
        shadowRoot.appendChild(sourceArea);

        // 4.1 Create and append status bar
        const statusBarElement = document.createElement('div');
        statusBarElement.className = 'yeditor-statusbar';
        statusBarElement.innerHTML = `
            <div class="yeditor-dom-path"></div>
            <div class="yeditor-word-count"></div>
        `;
        shadowRoot.appendChild(statusBarElement);

        // הוסף את העורך לדף לפני ה-textarea
        textarea.parentNode.insertBefore(container, textarea);

        // 5. הגדר את האירועים
        this.setupEventListeners(shadowRoot, toolbar, contentArea, sourceArea, textarea, container);

        // Hide link toolbar when clicking outside the editor
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && !e.composedPath().includes(container)) {
                this.hideLinkToolbar(shadowRoot);
                this.hideTableToolbar(shadowRoot);
                this._customButtons.forEach(config => {
                    if (config.edit) {
                        const bubble = shadowRoot.querySelector(`[data-bubble-for="${config.edit.selector}"]`);
                        if (bubble) {
                            bubble.remove();
                        }
                    }
                });
            }
        });

        // Activate the listener for external content injection
        this._listenForExternalContent();

        // Dispatch init event
        this._dispatchEvent('yeditor-init', { editor: container });
    },

    /**
     * Gets an initialized editor instance.
     * @param {string} selector The same selector used to initialize the editor.
     */
    getInstance: function(selector) {
        return this._instances[selector];
    },

    /**
     * Sets the content of an initialized editor instance.
     * @param {string} selector The same selector used to initialize the editor (e.g., '.y-editor').
     * @param {string} content The new HTML content to set.
     */
    setContent: function(selector, content) {
        const instance = this._instances[selector];
        if (!instance) {
            console.error(`yEditor: No editor instance found for selector "${selector}". Was it initialized?`);
            return;
        }

        const { shadowRoot, textarea } = instance;
        const contentArea = shadowRoot.querySelector('.yeditor-content');
        if (!contentArea) return;

        const sanitizedContent = DOMPurify.sanitize(content);
        contentArea.innerHTML = sanitizedContent;

        // Manually trigger the update logic
        contentArea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    },

    /**
     * Listens for a global event to set content, allowing for decoupled updates.
     */
    _listenForExternalContent: function() {
        // Ensure this listener is only added once
        if (this._isListeningForExternalContent) return;
        
        document.addEventListener('yeditor-set-content', (e) => {
            this.setContent(e.detail.selector, e.detail.content);
        });
        this._isListeningForExternalContent = true;
    },

    _loadCSS: async function() {
        if (this._cssContent) return;

        // Try loading the minified version first (for production/CDN)
        let cssUrl = `${this._scriptPath}/editor.min.css`;
        let response;
        try {
            response = await fetch(cssUrl);
            if (!response.ok) {
                // If minified version fails, fall back to the standard version (for development)
                cssUrl = `${this._scriptPath}/editor.css`;
                response = await fetch(cssUrl);
            }
            if (!response.ok) {
                throw new Error(`Neither editor.min.css nor editor.css were found at ${this._scriptPath}`);
            }
            this._cssContent = await response.text();
        } catch (error) {
            console.error('yEditor: Failed to load CSS.', error);
        }
    },

    _ensureDOMPurify: function() {
        return new Promise((resolve, reject) => {
            // If DOMPurify is already loaded, we're done.
            if (window.DOMPurify) {
                return resolve();
            }

            // If not, create a script tag to load it from the CDN.
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.11/dist/purify.min.js';
            
            script.onload = () => {
                resolve();
            };
            script.onerror = () => reject(new Error('yEditor: Failed to load DOMPurify from CDN.'));
            
            document.head.appendChild(script);
        });
    },

    _loadLanguage: async function(lang) {
        // Don't load if already loaded
        if (this._loadedTranslations[lang]) {
            return;
        }

        try {
            const langUrl = `${this._scriptPath}/lang/${lang}.json`;

            const response = await fetch(langUrl);
            if (!response.ok) {
                throw new Error(`Language file not found: ${lang}.json`);
            }
            this._loadedTranslations[lang] = await response.json();
        } catch (error) {
            console.error(`yEditor: Failed to load language '${lang}'. Falling back to default.`, error);
            // If the requested language fails, try to load the default one
            if (lang !== this._defaultLang) await this._loadLanguage(this._defaultLang);
        }
    },

    createToolbar: function() {
        const toolbar = document.createElement('div');
        toolbar.className = 'yeditor-toolbar';

        // --- Headings Dropdown ---
        const headings = {
            [this.t('paragraph') || 'Paragraph']: 'p',
            [this.t('heading1') || 'Heading 1']: 'h1',
            [this.t('heading2') || 'Heading 2']: 'h2',
            [this.t('heading3') || 'Heading 3']: 'h3',
            [this.t('heading4') || 'Heading 4']: 'h4',
            [this.t('heading5') || 'Heading 5']: 'h5',
            [this.t('heading6') || 'Heading 6']: 'h6',
        };
        const dropdown = document.createElement('div');
        dropdown.className = 'yeditor-dropdown';
        const dropdownButton = document.createElement('button');
        dropdownButton.innerHTML = this.t('headings') || 'Headings';
        dropdownButton.style.width = 'auto';
        dropdownButton.style.padding = '0 10px';
        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'yeditor-dropdown-content';
        for (const [text, tag] of Object.entries(headings)) {
            const item = document.createElement('button');
            item.dataset.command = 'formatBlock';
            item.dataset.value = tag;
            item.textContent = text;
            dropdownContent.appendChild(item);
        }
        dropdown.append(dropdownButton, dropdownContent);
        toolbar.appendChild(dropdown);

        const buttons = this._getToolbarButtons();
        buttons.forEach(btnConfig => {
            const button = document.createElement('button');
            button.type = 'button'; // למנוע שליחת טופס
            button.dataset.command = btnConfig.command;
            if (btnConfig.value) {
                button.dataset.value = btnConfig.value;
            }
            button.title = this.t(btnConfig.title);
            // No longer disabling buttons by default
            button.innerHTML = btnConfig.icon;
            toolbar.appendChild(button);
        });

        // --- Color Picker Dropdown ---
        const colors = [
            '#000000', '#6c757d', '#dc3545', '#fd7e14', '#ffc107', '#28a745',
            '#17a2b8', '#007bff', '#6f42c1', '#e83e8c', '#adb5bd', '#ffffff'
        ];
        const colorDropdown = document.createElement('div');
        colorDropdown.className = 'yeditor-dropdown';
        const colorButton = document.createElement('button');
        colorButton.title = this.t('textColor');
        colorButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zM6.5 12c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;
        const colorDropdownContent = document.createElement('div');
        colorDropdownContent.className = 'yeditor-dropdown-content yeditor-color-grid';
        colors.forEach(color => {
            const swatch = document.createElement('button'); // Changed back to button
            swatch.className = 'yeditor-color-swatch';
            swatch.dataset.command = 'foreColor';
            swatch.dataset.value = color;
            swatch.style.backgroundColor = color;
            swatch.title = color;
            colorDropdownContent.appendChild(swatch);
        });
        colorDropdown.append(colorButton, colorDropdownContent);
        toolbar.appendChild(colorDropdown);

        // --- Align Dropdown ---
        const alignOptions = {
            'justifyLeft': { title: 'alignLeft', icon: '<svg viewBox="0 0 24 24"><path d="M15 15H3v2h12zm0-8H3v2h12zM3 13h18v-2H3zm0 8h18v-2H3zM3 3v2h18V3z"/></svg>' },
            'justifyCenter': { title: 'alignCenter', icon: '<svg viewBox="0 0 24 24"><path d="M7 15v2h10v-2zm-4 6h18v-2H3zm0-8h18v-2H3zm4-6v2h10V7zM3 3v2h18V3z"/></svg>' },
            'justifyRight': { title: 'alignRight', icon: '<svg viewBox="0 0 24 24"><path d="M3 21h18v-2H3zm6-4h12v-2H9zM3 13h18v-2H3zm6-4h12V7H9zM3 3v2h18V3z"/></svg>' }
        };
        const alignDropdown = document.createElement('div');
        alignDropdown.className = 'yeditor-dropdown';
        alignDropdown.dataset.group = 'align';
        const alignButton = document.createElement('button');
        // Set default icon based on editor's direction
        const defaultAlign = this.config.direction === 'rtl' ? 'justifyRight' : 'justifyLeft';
        alignButton.innerHTML = alignOptions[defaultAlign].icon;
        alignButton.title = this.t(alignOptions[defaultAlign].title);

        const alignDropdownContent = document.createElement('div');
        alignDropdownContent.className = 'yeditor-dropdown-content';

        Object.entries(alignOptions).forEach(([command, details]) => {
            const item = document.createElement('button');
            item.dataset.command = command;
            item.title = this.t(details.title);
            item.innerHTML = details.icon;
            alignDropdownContent.appendChild(item);
        });

        alignDropdown.append(alignButton, alignDropdownContent);
        toolbar.appendChild(alignDropdown);

        this._addCustomButtons(toolbar);

        // --- Directionality Buttons ---
        const dirButtons = [
            { command: 'setDirection', value: 'ltr', title: 'setDirectionLtr', icon: '<svg viewBox="0 0 24 24"><path d="M9 10v5h2V4h2v11h2V4h2V2H9C6.79 2 5 3.79 5 6s1.79 4 4 4zm12 8-4-4v3H5v2h12v3z"/></svg>' },
            { command: 'setDirection', value: 'rtl', title: 'setDirectionRtl', icon: '<svg viewBox="0 0 24 24"><path d="M10 10v5h2V4h2v11h2V4h2V2h-8C7.79 2 6 3.79 6 6s1.79 4 4 4zm-2 7v-3l-4 4 4 4v-3h12v-2z"/></svg>' }
        ];
        dirButtons.forEach(btnConfig => {
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.command = btnConfig.command;
            button.dataset.value = btnConfig.value;
            button.title = this.t(btnConfig.title);
            button.innerHTML = btnConfig.icon;
            toolbar.appendChild(button);
        });

        return toolbar;
    },

    createContentArea: function(initialValue, direction) {
        const contentArea = document.createElement('div');
        contentArea.className = 'yeditor-content';
        contentArea.contentEditable = true;
        contentArea.dir = direction;
        contentArea.innerHTML = DOMPurify.sanitize(initialValue); // Sanitize initial content
        return contentArea;
    },

    setupEventListeners: function(shadowRoot, toolbar, contentArea, sourceArea, textarea, container) {
        // Close dropdowns when clicking anywhere in the editor, except on a dropdown button itself
        shadowRoot.addEventListener('click', (e) => {
            // Check if the click was on the dropdown button to let the other listener handle the toggle
            if (!e.target.closest('.yeditor-dropdown > button')) {
                shadowRoot.querySelectorAll('.yeditor-dropdown.active').forEach(d => d.classList.remove('active'));
            }
        });

        // אירוע לחיצה על כפתורי סרגל הכלים
        toolbar.addEventListener('click', (e) => {
            const dropdown = e.target.closest('.yeditor-dropdown');
            if (dropdown) {
                // Toggle dropdown
                dropdown.classList.toggle('active');
                // Close other dropdowns if any
                shadowRoot.querySelectorAll('.yeditor-dropdown').forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });
            }

            const button = e.target.closest('button[data-command]');
            if (!button) return;

            // Dispatch command execution event
            this._dispatchEvent('yeditor-command-exec', { command: button.dataset.command, value: button.dataset.value });

            const { command, value } = button.dataset;

            // Close dropdown after selection
            const parentDropdown = button.closest('.yeditor-dropdown');
            if (parentDropdown) parentDropdown.classList.remove('active');

            // שמירת הבחירה הנוכחית, כי היא עלולה ללכת לאיבוד בפתיחת פופאפ
            const selection = shadowRoot.getSelection ? shadowRoot.getSelection() : window.getSelection();
            const savedRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

            if (command === 'createLink') { // Logic for both creating and editing a link
                const existingLink = savedRange ? savedRange.startContainer.parentElement.closest('a') : null;

                if (existingLink) {
                    // --- EDIT MODE ---
                    // The cursor is inside an existing link, so we edit it.
                    const currentData = {
                        url: existingLink.href,
                        newWindow: existingLink.target === '_blank'
                    };
                    this.showLinkPrompt(shadowRoot, currentData).then(result => {
                        if (result) { // If user confirmed
                            existingLink.href = result.url;
                            if (result.newWindow) {
                                existingLink.target = '_blank';
                            } else {
                                existingLink.removeAttribute('target');
                            }
                        }
                    });
                } else {
                    // --- CREATE MODE ---
                    // No existing link found, create a new one.
                    if (!savedRange || savedRange.collapsed) { // Check if text is selected
                        this.showAlert(shadowRoot, this.t('linkTextRequired'));
                        return;
                    }
                    this.showLinkPrompt(shadowRoot).then(result => {
                        if (result && savedRange) {
                            selection.removeAllRanges();
                            selection.addRange(savedRange); // Restore selection before executing command

                            document.execCommand('createLink', false, result.url);

                            // Find the newly created link to set its target
                            const newLink = selection.anchorNode.parentElement.closest('a');
                            if (newLink && result.newWindow) {
                                newLink.setAttribute('target', '_blank');
                            }
                        }
                    });
                }
            } else if (command === 'insertTable') { // Logic for inserting a table via modal
                this.showTablePrompt(shadowRoot).then(dims => {
                    if (dims && savedRange) {
                        selection.removeAllRanges();
                        selection.addRange(savedRange);

                        const tableHTML = this._createTableHTML(dims.rows, dims.cols);
                        document.execCommand('insertHTML', false, tableHTML);
                    }
                });
                return; // Prevent focus shift until modal is closed
            } else if (command === 'insertImage') {
                this.showImagePrompt(shadowRoot).then(result => {
                    if (result && result.url && savedRange) {
                        selection.removeAllRanges();
                        selection.addRange(savedRange);
                        const sanitizedAlt = DOMPurify.sanitize(result.alt, { USE_PROFILES: { html: false } });
                        document.execCommand('insertHTML', false, `<img src="${result.url}" alt="${sanitizedAlt}">`);
                    }
                });
                return; // Prevent focus shift until modal is closed
            } else if (command === 'formatBlock' && value === 'blockquote') {
                const existingBlockquote = savedRange ? savedRange.startContainer.parentElement.closest('blockquote') : null;
                if (existingBlockquote) {
                    // If already a blockquote, format back to a paragraph
                    document.execCommand('formatBlock', false, 'p');
                } else {
                    // Otherwise, apply blockquote
                    document.execCommand('formatBlock', false, 'blockquote');
                }
            } else if (command === 'setDirection') {
                this.setBlockDirection(shadowRoot, value);
            } else if (command === 'toggleSource') {
                const contentArea = shadowRoot.querySelector('.yeditor-content');
                const sourceArea = shadowRoot.querySelector('.yeditor-source');
                const isSource = sourceArea.style.display !== 'none';

                if (isSource) {
                    // Switch to WYSIWYG
                    contentArea.innerHTML = DOMPurify.sanitize(sourceArea.value);
                    sourceArea.style.display = 'none';
                    contentArea.style.display = 'block';
                    button.classList.remove('active');
                    
                    // Sync and dispatch change
                    textarea.value = DOMPurify.sanitize(contentArea.innerHTML);
                    this._dispatchEvent('yeditor-change', { content: textarea.value });
                    this.updateDomPath(shadowRoot, contentArea);
                    this.updateWordCount(shadowRoot, contentArea);

                    // Enable other buttons
                    toolbar.querySelectorAll('button[data-command], .yeditor-dropdown').forEach(el => {
                        if (el !== button && !el.closest('.yeditor-dropdown')) {
                            el.classList.remove('disabled');
                            el.style.pointerEvents = 'auto';
                        }
                        if (el.classList.contains('yeditor-dropdown')) {
                             el.style.pointerEvents = 'auto';
                             el.style.opacity = '1';
                        }
                    });
                } else {
                    // Switch to Source
                    sourceArea.value = contentArea.innerHTML;
                    contentArea.style.display = 'none';
                    sourceArea.style.display = 'block';
                    button.classList.add('active');
                    // Sync original textarea
                    textarea.value = sourceArea.value;

                    // Clear DOM path
                    const domPathEl = shadowRoot.querySelector('.yeditor-dom-path');
                    if (domPathEl) domPathEl.innerHTML = '';
                    this.updateWordCount(shadowRoot, sourceArea);

                    // Disable other buttons
                    toolbar.querySelectorAll('button[data-command], .yeditor-dropdown').forEach(el => {
                        if (el !== button && !el.closest('.yeditor-dropdown')) {
                            el.classList.add('disabled');
                            el.style.pointerEvents = 'none';
                        }
                        if (el.classList.contains('yeditor-dropdown')) {
                             el.style.pointerEvents = 'none';
                             el.style.opacity = '0.4';
                        }
                    });
                }
                return;
            } else {
                // השתמש ב-execCommand לפעולות עיצוב סטנדרטיות
                document.execCommand(command, false, value || null);
            }
            
            contentArea.focus(); // החזר את הפוקוס לאזור העריכה
        });

        // 4. סנכרן את התוכן בחזרה ל-textarea המקורי בכל שינוי
        contentArea.addEventListener('input', () => {
            // Sanitize content before assigning it to the textarea for saving
            textarea.value = DOMPurify.sanitize(contentArea.innerHTML);
            this._dispatchEvent('yeditor-change', { content: textarea.value });
            this.updateDomPath(shadowRoot, contentArea);
            this.updateWordCount(shadowRoot, contentArea);
        });

        sourceArea.addEventListener('input', () => {
            textarea.value = sourceArea.value;
            this._dispatchEvent('yeditor-change', { content: textarea.value });
            this.updateWordCount(shadowRoot, sourceArea);
        });

        // 5. Paste handling (keep structure, strip styles)
        contentArea.addEventListener('paste', (e) => {
            e.preventDefault();
            const clipboardData = e.clipboardData || window.clipboardData;
            const html = clipboardData.getData('text/html');
            const text = clipboardData.getData('text/plain');

            if (html) {
                // Sanitize HTML to keep structure but strip styles and classes
                const sanitizedHtml = DOMPurify.sanitize(html, {
                    ALLOWED_TAGS: [
                        'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                        'ul', 'ol', 'li', 'a', 'b', 'i', 'u', 'strong', 'em', 
                        'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'hr'
                    ],
                    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'dir']
                });
                document.execCommand('insertHTML', false, sanitizedHtml);
            } else {
                document.execCommand('insertText', false, text);
            }
        });

        // Update status on selection change
        shadowRoot.addEventListener('selectionchange', () => {
            this.updateDomPath(shadowRoot, contentArea); // Keep updating the DOM path
            // No longer calling updateToolbarState to disable buttons
        });

        // Unified click handler for the content area to manage all pop-up toolbars
        contentArea.addEventListener('click', (e) => {
            // Update the DOM path on every click inside the content area
            this.updateDomPath(shadowRoot, contentArea);

            const link = e.target.closest('a');
            const table = e.target.closest('table');
            const img = e.target.closest('img');

            if (link) {
                this.showLinkToolbar(shadowRoot, link);
                e.preventDefault(); // Prevent default link navigation
            } else {
                this.hideLinkToolbar(shadowRoot);
            }
            
            if (table) this.showTableToolbar(shadowRoot, table);
            else this.hideTableToolbar(shadowRoot);

            if (img) {
                this._handleImageSelection(shadowRoot, img);
            } else {
                this._clearImageSelection(shadowRoot);
            }
        });

        // Initial status update
        this.updateWordCount(shadowRoot, contentArea);
        this.updateDomPath(shadowRoot, contentArea);

        // Markdown support for headings on space key
        contentArea.addEventListener('keyup', (e) => {
            if (e.key === ' ' || e.code === 'Space') {
                this._handleMarkdown(shadowRoot);
            }
        });

        // Handle Tab key for table navigation
        contentArea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this._handleTabInTable(e);
            }
        });

        // Focus and blur events
        contentArea.addEventListener('focus', () => {
            this._dispatchEvent('yeditor-focus');
        });

        contentArea.addEventListener('blur', () => {
            this._dispatchEvent('yeditor-blur');
        });

    },

    // --- Modal Helper Functions ---

    showAlert: function(shadowRoot, message) {
        const body = document.createElement('p');
        body.textContent = message;

        const footer = document.createElement('div');
        const okButton = document.createElement('button');
        okButton.textContent = this.t('ok');
        okButton.className = 'active'; // Style as primary button
        footer.appendChild(okButton);

        const modal = this._createModal(this.t('alertTitle'), body, footer);
        requestAnimationFrame(() => okButton.focus());
        okButton.onclick = () => modal.remove();
    },

    showTablePrompt: function(shadowRoot, initialData = {}) {
        return new Promise(resolve => {
            const body = document.createElement('div');
            body.innerHTML = `
                <div class="input-group">
                    <div>
                        <label for="table-rows">${this.t('rows')}</label>
                        <input type="number" id="table-rows" min="1">
                    </div>
                    <div>
                        <label for="table-cols">${this.t('columns')}</label>
                        <input type="number" id="table-cols" min="1">
                    </div>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="table-header">
                    <label for="table-header">${this.t('headerRow')}</label>
                </div>
            `;

            const footer = document.createElement('div');
            const cancelButton = document.createElement('button');
            cancelButton.textContent = this.t('cancel');
            const okButton = document.createElement('button');
            okButton.textContent = this.t('ok');
            okButton.className = 'active';
            footer.append(cancelButton, okButton);

            const modal = this._createModal(this.t('table'), body, footer);
            const rowsInput = body.querySelector('#table-rows');
            const colsInput = body.querySelector('#table-cols');
            const headerCheckbox = body.querySelector('#table-header');

            rowsInput.value = initialData.rows || 2;
            colsInput.value = initialData.cols || 2;
            headerCheckbox.checked = initialData.header || false;

            requestAnimationFrame(() => rowsInput.focus());

            [rowsInput, colsInput].forEach(input => {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        okButton.click();
                    }
                });
            });

            okButton.onclick = () => { modal.remove(); resolve({ rows: parseInt(rowsInput.value, 10), cols: parseInt(colsInput.value, 10), header: headerCheckbox.checked }); };
            cancelButton.onclick = () => { modal.remove(); resolve(null); };
        });
    },

    showImagePrompt: function(shadowRoot, initialData = {}) {
        return new Promise(resolve => {
            const body = document.createElement('div');
            body.innerHTML = `
                <div class="yeditor-modal-tabs">
                    <button class="active" data-tab="url">${this.t('fromUrl')}</button>
                    <button data-tab="gallery">${this.t('fromGallery')}</button>
                </div>
                <div id="tab-url" class="yeditor-modal-tab-content active">
                    <label for="image-url">${this.t('linkUrlLabel')}</label>
                    <div class="input-with-button">
                        <input type="text" id="image-url" placeholder="https://..." value="${initialData.url || ''}">
                        <button type="button" id="yeditor-browse-server" class="yeditor-browse-button">${this.t('browseServer')}</button>
                    </div>
                </div>
                <div id="tab-gallery" class="yeditor-modal-tab-content">
                    <div class="image-gallery"></div>
                </div>
                <div style="margin-top: 15px;">
                    <label for="image-alt">${this.t('altText')}</label>
                    <input type="text" id="image-alt" value="${initialData.alt || ''}">
                </div>
            `;

            const footer = document.createElement('div');
            const cancelButton = document.createElement('button');
            cancelButton.textContent = this.t('cancel');
            const okButton = document.createElement('button');
            okButton.textContent = this.t('ok');
            okButton.className = 'active';
            footer.append(cancelButton, okButton);

            const modal = this._createModal(this.t('insertImage'), body, footer);

            requestAnimationFrame(() => body.querySelector('#image-url').focus());

            const urlInput = body.querySelector('#image-url');
            const altInput = body.querySelector('#image-alt');

            // --- File Browser Logic ---
            const browseButton = body.querySelector('#yeditor-browse-server');
            if (this.config.fileBrowserUrl) {
                browseButton.addEventListener('click', () => {
                    // Define a global callback function that the popup can call
                    window.yEditorFileBrowserCallback = (fileUrl) => {
                        if (fileUrl) {
                            urlInput.value = fileUrl;
                        }
                        // Clean up the global function
                        delete window.yEditorFileBrowserCallback;
                    };

                    // --- Popup window options with defaults ---
                    const browserOptions = this.config.fileBrowserOptions || {};
                    const popupWidth = browserOptions.width || 900;
                    const popupHeight = browserOptions.height || 600;
                    const left = browserOptions.left !== undefined ? browserOptions.left : (window.screen.width - popupWidth) / 2;
                    const top = browserOptions.top !== undefined ? browserOptions.top : (window.screen.height - popupHeight) / 2;

                    // Open the file browser popup
                    window.open(
                        this.config.fileBrowserUrl, 
                        'yEditorFileBrowser', 
                        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`
                    );
                });
            } else {
                browseButton.style.display = 'none';
            }

            [urlInput, altInput].forEach(input => {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        okButton.click();
                    }
                });
            });
            // Tab logic
            const tabs = body.querySelectorAll('.yeditor-modal-tabs button');
            const tabContents = body.querySelectorAll('.yeditor-modal-tab-content');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    tabContents.forEach(c => c.classList.remove('active'));
                    body.querySelector(`#tab-${tab.dataset.tab}`).classList.add('active');
                });
            });

            // Gallery logic
            const galleryContainer = body.querySelector('.image-gallery');
            const galleryTabButton = body.querySelector('button[data-tab="gallery"]');

            if (this.config.imageGalleryApiUrl) {
                fetch(this.config.imageGalleryApiUrl)
                    .then(res => res.json())
                    .then(images => {
                        galleryContainer.innerHTML = images.map(img => `
                            <div class="image-gallery-item" data-url="${img.url}" data-title="${img.title}">
                                <img src="${img.url}" alt="${img.title}">
                            </div>
                        `).join('');
                    });
            } else {
                // If no API URL is provided, hide the gallery tab
                galleryTabButton.style.display = 'none';
            }

            let selectedImageUrl = '';
            galleryContainer.addEventListener('click', (e) => {
                const item = e.target.closest('.image-gallery-item');
                if (item) {
                    galleryContainer.querySelectorAll('.image-gallery-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    selectedImageUrl = item.dataset.url;
                    body.querySelector('#image-alt').value = item.dataset.title;
                }
            });

            okButton.onclick = () => {
                const activeTab = body.querySelector('.yeditor-modal-tabs button.active').dataset.tab;
                const url = (activeTab === 'gallery') ? selectedImageUrl : body.querySelector('#image-url').value;
                const alt = body.querySelector('#image-alt').value;
                modal.remove();
                resolve({ url, alt });
            };

            cancelButton.onclick = () => { modal.remove(); resolve(null); };
        });
    },

    showLinkPrompt: function(shadowRoot, initialData = {}) {
        return new Promise(resolve => {
            const placeholderText = this.config.quickLinksApiUrl ? this.t('linkPlaceholder') : this.t('linkPlaceholderSimple');
            const body = document.createElement('div');
            body.innerHTML = `
                <label for="link-url">${this.t('linkUrlLabel')}</label>
                <input type="text" id="link-url" placeholder="${placeholderText}" autocomplete="off">
                <div class="search-results"></div>
                <div class="checkbox-container">
                    <input type="checkbox" id="link-new-window">
                    <label for="link-new-window">${this.t('linkNewWindowLabel')}</label>
                </div>
            `;

            const footer = document.createElement('div');
            const cancelButton = document.createElement('button');
            cancelButton.textContent = this.t('cancel');
            const okButton = document.createElement('button');
            okButton.textContent = this.t('ok');
            okButton.className = 'active';
            footer.append(cancelButton, okButton);

            const modal = this._createModal(this.t('linkPromptTitle'), body, footer);
            const urlInput = body.querySelector('#link-url');
            const newWindowCheckbox = body.querySelector('#link-new-window');
            const resultsContainer = body.querySelector('.search-results');

            urlInput.value = initialData.url || '';
            newWindowCheckbox.checked = initialData.newWindow || false;

            requestAnimationFrame(() => {
                urlInput.focus();
                urlInput.select();
            });

            const closeModal = (value) => {
                modal.remove();
                resolve(value);
            };

            okButton.onclick = () => closeModal({
                url: urlInput.value,
                newWindow: newWindowCheckbox.checked
            });
            cancelButton.onclick = () => closeModal(null);

            // --- Keyboard Navigation for Search Results ---
            urlInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const selected = resultsContainer.querySelector('.selected');
                    if (selected) {
                        selected.click(); // Prioritize selecting a highlighted item
                    } else {
                        okButton.click(); // Otherwise, submit the form
                    }
                    return;
                }

                const results = resultsContainer.querySelectorAll('.search-result-item');
                if (results.length > 0 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                    e.preventDefault();

                    const selected = resultsContainer.querySelector('.selected');
                    let currentIndex = -1;
                    if (selected) {
                        currentIndex = Array.from(results).indexOf(selected);
                        selected.classList.remove('selected');
                    }

                    let nextIndex;
                    if (e.key === 'ArrowDown') {
                        nextIndex = (currentIndex + 1) % results.length;
                    } else { // ArrowUp
                        nextIndex = (currentIndex - 1 + results.length) % results.length;
                    }

                    const nextSelected = results[nextIndex];
                    if (nextSelected) {
                        nextSelected.classList.add('selected');
                        nextSelected.scrollIntoView({ block: 'nearest' });
                    }
                }
            });

            // --- Quick Links API Logic ---
            if (this.config.quickLinksApiUrl) {
                let searchTimeout;
                urlInput.addEventListener('input', () => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(async () => {
                        const query = urlInput.value.trim().toLowerCase();
                        if (query.length < 2) {
                            resultsContainer.innerHTML = '';
                            return;
                        }

                        try {
                            // In a real app, this would be fetch(`${this.config.quickLinksApiUrl}?search=${query}`)
                            const response = await fetch(this.config.quickLinksApiUrl);
                            const links = await response.json();
                            
                            const filteredLinks = links.filter(link => 
                                link.title.toLowerCase().includes(query) || link.url.toLowerCase().includes(query)
                            );

                            resultsContainer.innerHTML = filteredLinks.map(link => 
                                `<a class="search-result-item" data-url="${link.url}">
                                    ${link.title}
                                    <small>${link.url}</small>
                                </a>`
                            ).join('');

                        } catch (error) {
                            console.error('Quick links API error:', error);
                        }
                    }, 300); // Debounce for 300ms
                });
            }

            resultsContainer.addEventListener('click', (e) => {
                const item = e.target.closest('.search-result-item');
                if (item) {
                    urlInput.value = item.dataset.url;
                    resultsContainer.innerHTML = '';
                    urlInput.focus();
                }
            });
        });
    },


    _createModal: function(title, bodyElement, footerElement) {
        const overlay = document.createElement('div');
        overlay.className = 'yeditor-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'yeditor-modal';

        const header = document.createElement('div');
        header.className = 'yeditor-modal-header';
        header.textContent = title;

        const body = document.createElement('div');
        body.className = 'yeditor-modal-body';
        body.appendChild(bodyElement);

        const footer = document.createElement('div');
        footer.className = 'yeditor-modal-footer';
        footer.appendChild(footerElement);

        modal.append(header, body, footer);
        overlay.appendChild(modal);

        // We need to inject the styles for the modal into the main document's head
        // to ensure it's styled correctly outside the Shadow DOM.
        this._injectModalStyles();

        document.body.appendChild(overlay);

        // Use requestAnimationFrame to ensure the 'active' class is applied after the element is in the DOM
        requestAnimationFrame(() => overlay.classList.add('active'));
        return overlay;
    },

    _createTableHTML: function(rows, cols, hasHeader) {
        let tableHTML = '<table>';
        if (hasHeader) {
            tableHTML += '<thead><tr>';
            for (let c = 0; c < cols; c++) {
                tableHTML += '<th>&nbsp;</th>';
            }
            tableHTML += '</tr></thead>';
            rows--; // one row is used for the header
        }
        tableHTML += '<tbody>';
        if (rows > 0) {
            for (let r = 0; r < rows; r++) {
                tableHTML += '<tr>';
                for (let c = 0; c < cols; c++) {
                    tableHTML += '<td>&nbsp;</td>';
                }
                tableHTML += '</tr>';
            }
        }
        tableHTML += '</tbody></table><p><br></p>'; // Add a paragraph after for easy exit
        return tableHTML;
    },

    // --- Link Toolbar Functions ---

    _injectModalStyles: function() {
        // Prevent injecting styles multiple times
        if (document.getElementById('yeditor-modal-styles')) {
            return;
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'yeditor-modal-styles';
        // Extract only the modal styles from the main style string
        const modalStyles = this._cssContent.substring(this._cssContent.indexOf('/* --- Modal (Popup) Styles --- */'));
        styleElement.textContent = modalStyles.replace(/:host\(\[data-theme="dark"\]\)/g, 'body[data-yeditor-theme="dark"]');

        document.head.appendChild(styleElement);
    },

    showLinkToolbar: function(shadowRoot, linkElement) {
        this.hideLinkToolbar(shadowRoot); // Hide any existing toolbar

        const toolbar = document.createElement('div');
        toolbar.className = 'link-toolbar';

        const linkDisplay = document.createElement('a');
        linkDisplay.href = linkElement.href;
        linkDisplay.textContent = linkElement.href;
        linkDisplay.target = "_blank"; // Open link from toolbar in new tab
        linkDisplay.rel = "noopener noreferrer";

        const editButton = document.createElement('button');
        editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`; // Edit icon
        editButton.title = this.t('linkPromptTitle');

        const unlinkButton = document.createElement('button');
        unlinkButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 13h-2.55v-2H16v2zm-6.45 0H7v-2h2.55v2zM17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.96l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zM7 9h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1S5.29 9 7 9zm5 10c2.76 0 5-2.24 5-5h-1.9c0 1.71-1.39 3.1-3.1 3.1s-3.1-1.39-3.1-3.1H7c0 2.76 2.24 5 5 5z"/><path d="M3.41 4.83L2 6.24l18 18 1.41-1.41z"/></svg>`; // Unlink icon
        unlinkButton.title = this.t('unlink');

        toolbar.append(linkDisplay, editButton, unlinkButton);
        shadowRoot.appendChild(toolbar);

        // Position the toolbar after it's rendered and its dimensions are available
        requestAnimationFrame(() => {
            const linkRect = linkElement.getBoundingClientRect();
            const hostRect = shadowRoot.host.getBoundingClientRect(); // The editor container

            // Calculate toolbar position relative to the host element
            const toolbarHeight = toolbar.offsetHeight;
            const toolbarWidth = toolbar.offsetWidth;
            const toolbarTop = linkRect.top - hostRect.top - toolbarHeight - 5;
            let toolbarLeft = linkRect.left - hostRect.left + (linkRect.width / 2);

            // Boundary checking
            if (toolbarLeft - (toolbarWidth / 2) < 0) {
                toolbarLeft = toolbarWidth / 2 + 5;
            } else if (toolbarLeft + (toolbarWidth / 2) > hostRect.width) {
                toolbarLeft = hostRect.width - (toolbarWidth / 2) - 5;
            }

            toolbar.style.top = `${toolbarTop}px`;
            toolbar.style.left = `${toolbarLeft}px`;

            toolbar.classList.add('active');
        });

        editButton.onclick = () => {
            const currentData = {
                url: linkElement.href,
                newWindow: linkElement.target === '_blank' // Check if target is _blank
            };
            this.showLinkPrompt(shadowRoot, currentData).then(result => {
                if (result) {
                    linkElement.href = result.url;
                    if (result.newWindow) {
                        linkElement.target = '_blank';
                    } else {
                        linkElement.removeAttribute('target');
                    }
                }
            });
            this.hideLinkToolbar(shadowRoot);
        };

        unlinkButton.onclick = () => {
            const selection = shadowRoot.getSelection ? shadowRoot.getSelection() : window.getSelection();
            const range = document.createRange();
            range.selectNode(linkElement);
            selection.removeAllRanges();
            selection.addRange(range);

            document.execCommand('unlink', false, null);
            this.hideLinkToolbar(shadowRoot);
        };
    },

    hideLinkToolbar: function(shadowRoot) {
        const existingToolbar = shadowRoot.querySelector('.link-toolbar');
        if (existingToolbar) {
            existingToolbar.remove();
        }
    },

    // --- Table Toolbar Functions ---

    showTableToolbar: function(shadowRoot, tableElement) {
        this.hideTableToolbar(shadowRoot); // Hide any existing toolbar

        const toolbar = document.createElement('div');
        toolbar.className = 'table-toolbar';

        const addRowButton = document.createElement('button');
        addRowButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 13h-8v-2h8v2zm0-6h-8v2h8V7zm-8 10h8v-2h-8v2zM12 7v10H4V7h8zm-2 8H6v-2h4v2zm0-4H6v-2h4v2z"/></svg>`;
        addRowButton.title = this.t('addRow');
        
        const editButton = document.createElement('button');
        editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`; // Edit icon
        editButton.title = this.t('editTable');


        toolbar.append(editButton, addRowButton);
        shadowRoot.appendChild(toolbar);

        requestAnimationFrame(() => {
            const tableRect = tableElement.getBoundingClientRect();
            const hostRect = shadowRoot.host.getBoundingClientRect();

            const toolbarHeight = toolbar.offsetHeight;
            const toolbarWidth = toolbar.offsetWidth;
            const toolbarTop = tableRect.top - hostRect.top - toolbarHeight - 5;
            let toolbarLeft = tableRect.left - hostRect.left + (tableRect.width / 2);

            // Boundary checking
            if (toolbarLeft - (toolbarWidth / 2) < 0) {
                toolbarLeft = toolbarWidth / 2 + 5;
            } else if (toolbarLeft + (toolbarWidth / 2) > hostRect.width) {
                toolbarLeft = hostRect.width - (toolbarWidth / 2) - 5;
            }

            toolbar.style.top = `${toolbarTop}px`;
            toolbar.style.left = `${toolbarLeft}px`;
            toolbar.classList.add('active');
        });

        addRowButton.onclick = () => {
            const tbody = tableElement.querySelector('tbody');
            if (!tbody) return;
            const newRow = tbody.insertRow(-1); // Insert at the end
            const colCount = tableElement.rows[0]?.cells.length || 1;
            for (let i = 0; i < colCount; i++) {
                newRow.insertCell(i).innerHTML = '&nbsp;';
            }
        };

        editButton.onclick = () => {
            const currentData = {
                rows: tableElement.rows.length,
                cols: tableElement.rows[0]?.cells.length || 0,
                header: !!tableElement.querySelector('thead')
            };
            this.showTablePrompt(shadowRoot, currentData).then(newData => {
                if (newData) {
                    const newTableHTML = this._createTableHTML(newData.rows, newData.cols, newData.header);
                    const newTableWrapper = document.createElement('div');
                    newTableWrapper.innerHTML = newTableHTML;
            // Sanitize the newly created table before replacing
            const newTable = DOMPurify.sanitize(newTableWrapper.innerHTML, { ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td'], ADD_ATTR: ['style', 'border'] });
                    tableElement.parentNode.replaceChild(newTable, tableElement);
                }
            });
            this.hideTableToolbar(shadowRoot);
        };
    },

    hideTableToolbar: function(shadowRoot) {
        const existingToolbar = shadowRoot.querySelector('.table-toolbar');
        if (existingToolbar) existingToolbar.remove();
    },

    // --- Image Functions ---

    _handleImageSelection: function(shadowRoot, imgElement) {
        // Clear any other selections first
        this._clearImageSelection(shadowRoot);

        // Wrap the image if it's not already wrapped
        let wrapper = imgElement.parentElement;
        if (!wrapper.classList.contains('yeditor-image-wrapper')) {
            wrapper = document.createElement('span');
            wrapper.className = 'yeditor-image-wrapper';
            imgElement.parentNode.insertBefore(wrapper, imgElement);
            wrapper.appendChild(imgElement);
        }

        // Make the wrapper resizable
        wrapper.classList.add('resizable');
        // Set the initial size of the wrapper to the image's current size
        wrapper.style.width = `${imgElement.offsetWidth}px`;
        wrapper.style.height = `${imgElement.offsetHeight}px`;

        // Show the image toolbar
        this.showImageToolbar(shadowRoot, wrapper, imgElement);

         // Add a one-time event listener for when resizing stops
        const onMouseUp = () => {
            // Apply the wrapper's size to the image's style
            imgElement.style.width = wrapper.style.width;
            imgElement.style.height = wrapper.style.height;

            // Temporarily remove the 'resizable' class to get clean HTML for saving
            wrapper.classList.remove('resizable');

            // Manually trigger an update to the underlying textarea
            this._textarea.value = DOMPurify.sanitize(wrapper.closest('.yeditor-content').innerHTML);
            
            // Add the class back so the user still sees the selection
            wrapper.classList.add('resizable');

            // Clean up the listener
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mouseup', onMouseUp);
    },

    _clearImageSelection: function(shadowRoot) {
        shadowRoot.querySelectorAll('.yeditor-image-wrapper.resizable').forEach(wrapper => {
            wrapper.classList.remove('resizable');
        });
        this.hideImageToolbar(shadowRoot);
    },

    showImageToolbar: function(shadowRoot, wrapperElement, imgElement) {
        this.hideImageToolbar(shadowRoot);

        const toolbar = document.createElement('div');
        toolbar.className = 'image-toolbar';

        const editButton = document.createElement('button');
        editButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
        editButton.title = this.t('editImage');

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/></svg>`;
        deleteButton.title = this.t('deleteImage');

        toolbar.append(editButton, deleteButton);

        shadowRoot.appendChild(toolbar);

        requestAnimationFrame(() => {
            const wrapperRect = wrapperElement.getBoundingClientRect();
            const hostRect = shadowRoot.host.getBoundingClientRect();
            
            const toolbarHeight = toolbar.offsetHeight;
            const toolbarWidth = toolbar.offsetWidth;
            const toolbarTop = wrapperRect.top - hostRect.top - toolbarHeight - 5;
            let toolbarLeft = wrapperRect.left - hostRect.left + (wrapperRect.width / 2);

            // Boundary checking
            if (toolbarLeft - (toolbarWidth / 2) < 0) {
                toolbarLeft = toolbarWidth / 2 + 5;
            } else if (toolbarLeft + (toolbarWidth / 2) > hostRect.width) {
                toolbarLeft = hostRect.width - (toolbarWidth / 2) - 5;
            }

            toolbar.style.top = `${toolbarTop}px`;
            toolbar.style.left = `${toolbarLeft}px`;
            toolbar.classList.add('active');
        });

        editButton.onclick = () => {
            this.showImagePrompt(shadowRoot, { url: imgElement.src, alt: imgElement.alt }).then(result => {
                if (result) {
                    imgElement.src = result.url;
                    imgElement.alt = result.alt;
                }
            });
        };

        deleteButton.onclick = () => {
            wrapperElement.remove();
            this.hideImageToolbar(shadowRoot);
            // Dispatch an 'input' event on the content area to trigger
            // the existing update logic, including sanitization.
            shadowRoot.querySelector('.yeditor-content').dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        };
    },

    hideImageToolbar: function(shadowRoot) {
        const existingToolbar = shadowRoot.querySelector('.image-toolbar');
        if (existingToolbar) existingToolbar.remove();
    },

    // --- Table Navigation Handler ---

    _handleTabInTable: function(e) {
        const selection = this._shadowRoot.getSelection();
        if (!selection || !selection.rangeCount) return;

        const currentCell = selection.anchorNode.parentElement.closest('td, th');
        if (!currentCell) return; // Not in a table cell, allow default tab behavior

        e.preventDefault(); // We are in a table, so we handle the tabbing.

        const table = currentCell.closest('table');
        const cells = Array.from(table.querySelectorAll('td, th'));
        const currentIndex = cells.indexOf(currentCell);

        let nextIndex;

        if (e.shiftKey) { // Handle Shift+Tab for reverse tabbing
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
                // At the first cell, do nothing to prevent tabbing out of the editor
                return;
            }
        } else { // Handle Tab
            nextIndex = currentIndex + 1;
            if (nextIndex >= cells.length) {
                // At the last cell, add a new row
                const tbody = table.querySelector('tbody') || table;
                const newRow = tbody.insertRow(-1); // Insert at the end
                const colCount = currentCell.parentElement.cells.length;
                for (let i = 0; i < colCount; i++) {
                    newRow.insertCell(i).innerHTML = '&nbsp;';
                }
                // Focus the first cell of the new row
                this._focusCell(newRow.cells[0]);
                return;
            }
        }

        const nextCell = cells[nextIndex];
        if (nextCell) {
            this._focusCell(nextCell);
        }
    },

    _focusCell: function(cell) {
        const range = document.createRange();
        const selection = this._shadowRoot.getSelection();
        range.selectNodeContents(cell);
        selection.removeAllRanges();
        selection.addRange(range);
    },

    // --- Markdown Handler ---

    _handleMarkdown: function(shadowRoot) {
        const selection = shadowRoot.getSelection();
        if (!selection || !selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const node = range.startContainer;

        // Check if we are at the beginning of a text node inside a block element
        if (node.nodeType !== Node.TEXT_NODE || range.startOffset < 2) return;

        const block = node.parentElement;
        // Ensure we are at the start of a paragraph-like element
        if (block.tagName !== 'P' && !block.tagName.startsWith('H')) return;

        const text = node.textContent.substring(0, range.startOffset);
        const match = text.match(/^(#{1,6})\s$/);

        if (match) {
            const level = match[1].length;
            const headingTag = `h${level}`;

            // This is a trick to apply the format and remove the markdown characters
            // 1. Select the markdown characters
            const markdownRange = document.createRange();
            markdownRange.setStart(node, 0);
            markdownRange.setEnd(node, match[0].length);
            selection.removeAllRanges();
            selection.addRange(markdownRange);

            // 2. Replace them with nothing (delete them)
            document.execCommand('insertText', false, '');

            // 3. Format the block as a heading
            document.execCommand('formatBlock', false, headingTag);
        }
    },

    // --- Status Bar Functions ---

    updateWordCount: function(shadowRoot, element) {
        const wordCountEl = shadowRoot.querySelector('.yeditor-word-count');
        if (!wordCountEl) return;

        const text = (element.tagName === 'TEXTAREA' ? element.value : element.innerText) || '';
        const words = text.trim().split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        wordCountEl.textContent = `${this.t('words') || 'Words'}: ${wordCount}`;
    },

    updateDomPath: function(shadowRoot, contentArea) {
        const domPathEl = shadowRoot.querySelector('.yeditor-dom-path');
        if (!domPathEl) return;

        const selection = shadowRoot.getSelection ? shadowRoot.getSelection() : window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        let node = selection.anchorNode;
        const path = [];
        const nodes = [];

        while (node && node !== contentArea) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                nodes.unshift(node);
            }
            node = node.parentNode;
        }

        domPathEl.innerHTML = '';
        nodes.forEach((elNode, index) => {
            const span = document.createElement('span');
            span.textContent = elNode.tagName.toLowerCase();
            span.style.cursor = 'pointer';
            span.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const range = document.createRange();
                const sel = shadowRoot.getSelection ? shadowRoot.getSelection() : window.getSelection();
                range.selectNode(elNode);
                sel.removeAllRanges();
                sel.addRange(range);
                
                contentArea.focus();
            });
            domPathEl.appendChild(span);
        });
    },

    // פונקציה מיוחדת לקביעת כיווניות של בלוק טקסט (פסקה)
    setBlockDirection: function(shadowRoot, dir) {
        const selection = shadowRoot.getSelection ? shadowRoot.getSelection() : window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        let node = range.startContainer;

        // מצא את אלמנט הבלוק הקרוב ביותר (למשל <p>, <div>, <h1>)
        while (node && (!node.style || window.getComputedStyle(node).display !== 'block')) {
            node = node.parentNode;
        }

        if (node && node.style) {
            // הגדר את הכיווניות. היישור יתעדכן אוטומטית על ידי כללי ה-CSS
            // שהגדרנו עבור [dir="rtl"] ו-[dir="ltr"] בתוך ה-content area.
            // עם זאת, הגדרה ישירה מבטיחה תאימות טובה יותר.
            node.setAttribute('dir', dir);
            node.style.textAlign = (dir === 'rtl') ? 'right' : 'left';
        }
    },

    _showCustomBubble: function(shadowRoot, element, config) {
        // Hide other custom bubbles
        shadowRoot.querySelectorAll('[data-bubble-for]').forEach(b => b.remove());

        const toolbar = document.createElement('div');
        toolbar.className = 'link-toolbar'; // Reuse link toolbar style
        toolbar.dataset.bubbleFor = config.edit.selector;

        const editButton = document.createElement('button');
        editButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
        editButton.title = config.prompt.title;
        toolbar.appendChild(editButton);

        shadowRoot.appendChild(toolbar);

        requestAnimationFrame(() => {
            const elementRect = element.getBoundingClientRect();
            const hostRect = shadowRoot.host.getBoundingClientRect();
            toolbar.style.top = `${elementRect.top - hostRect.top - toolbar.offsetHeight - 5}px`;
            toolbar.style.left = `${elementRect.left - hostRect.left + (elementRect.width / 2)}px`;
            toolbar.classList.add('active');
        });

        editButton.onclick = () => {
            const initialData = config.edit.onOpen(element);
            this._showCustomPrompt(config.prompt, initialData).then(newData => {
                if (newData) {
                    const newHtml = config.onInsert(newData);
                    const newElWrapper = document.createElement('div');
                    newElWrapper.innerHTML = newHtml;
                    const newElement = newElWrapper.firstElementChild;

                    element.parentNode.replaceChild(newElement, element);
                }
            });
            toolbar.remove();
        };
    },

    // --- Custom Buttons API ---
    _customButtons: [],

    registerButton: function(buttonConfig) {
        this._customButtons.push(buttonConfig);
    },

    _addCustomButtons: function(toolbar) {
        this._customButtons.forEach(config => {
            const button = document.createElement('button');
            button.type = 'button';
            button.title = config.title;
            button.innerHTML = config.icon;

            button.addEventListener('click', () => {
                const selection = this._shadowRoot.getSelection();
                const savedRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

                this._showCustomPrompt(config.prompt, {}).then(result => {
                    if (!result || (Array.isArray(result) && result.length === 0)) {
                        return; // Do nothing if no result or empty array for multiple selection
                    }

                    if (savedRange) {
                        selection.removeAllRanges();
                        selection.addRange(savedRange);

                        // The onInsert function now needs to handle both a single object and an array of objects.
                        // We can create a unified input for it.
                        const itemsToInsert = Array.isArray(result) ? result : [result];
                        const rawHtml = config.onInsert(itemsToInsert);

                        const sanitizedHtml = DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['style'] }); // Allow style attribute for custom embeds
                        document.execCommand('insertHTML', false, sanitizedHtml);
                    }
                });
            });

            toolbar.appendChild(button);
        });
    },

    _showCustomPrompt: function(promptConfig, initialData = {}) {
        return new Promise(resolve => {
            const body = document.createElement('div');
            const isMultiple = promptConfig.multiple === true;

            // Add a container for selected items if in multiple mode
            if (isMultiple) {
                body.innerHTML += `<div class="selected-items-container"></div>`;
            }

            body.innerHTML = `
                <label for="custom-search">${promptConfig.label}</label>
                <input type="text" id="custom-search" placeholder="${promptConfig.placeholder}" autocomplete="off">
                <div class="search-results"></div>
            `;

            const footer = document.createElement('div');
            const cancelButton = document.createElement('button');
            cancelButton.textContent = this.t('cancel');
            const okButton = document.createElement('button');
            okButton.textContent = this.t('ok');
            okButton.className = 'active';
            footer.append(cancelButton, okButton);

            const modal = this._createModal(promptConfig.title, body, footer);
            const searchInput = body.querySelector('#custom-search');
            requestAnimationFrame(() => searchInput.focus());

            const resultsContainer = body.querySelector('.search-results');
            const selectedItemsContainer = body.querySelector('.selected-items-container');
            let selectedItems = []; // Use an array to store multiple items

            searchInput.value = initialData[promptConfig.displayField] || '';

            // Submit on Enter
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    // In the future, this could also select a highlighted item
                    e.preventDefault();
                    okButton.click();
                }
            });

            const renderSelectedItems = () => {
                if (!selectedItemsContainer) return;
                selectedItemsContainer.innerHTML = selectedItems.map((item, index) => `
                    <span class="selected-item" data-index="${index}">
                        ${item[promptConfig.displayField]}
                        <button type="button" class="selected-item-remove" title="Remove">&times;</button>
                    </span>
                `).join('');
            };

            if (selectedItemsContainer) {
                selectedItemsContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('selected-item-remove')) {
                        const itemSpan = e.target.closest('.selected-item');
                        const indexToRemove = parseInt(itemSpan.dataset.index, 10);
                        selectedItems.splice(indexToRemove, 1);
                        renderSelectedItems();
                    }
                });
            }

            searchInput.addEventListener('input', async () => {
                const query = searchInput.value.trim().toLowerCase();
                if (query.length < 2) { resultsContainer.innerHTML = ''; return; }

                const results = await promptConfig.search(query);
                resultsContainer.innerHTML = results.map(item => promptConfig.renderItem(item)).join('');
            });

            resultsContainer.addEventListener('click', (e) => {
                const itemElement = e.target.closest('[data-item]');
                if (!itemElement) return;

                const itemData = JSON.parse(itemElement.dataset.item);

                if (isMultiple) {
                    // Add item to the list if it's not already there
                    if (!selectedItems.some(item => item.id === itemData.id)) { // Assuming items have a unique 'id'
                        selectedItems.push(itemData);
                        renderSelectedItems();
                    }
                    searchInput.value = ''; // Clear search for next item
                    resultsContainer.innerHTML = ''; // Clear results
                    searchInput.focus();
                } else {
                    // Single selection mode (original behavior)
                    selectedItems = [itemData];
                    searchInput.value = itemData[promptConfig.displayField];
                    resultsContainer.innerHTML = '';
                }
            });

            okButton.onclick = () => { modal.remove(); resolve(isMultiple ? selectedItems : selectedItems[0] || null); };
            cancelButton.onclick = () => { modal.remove(); resolve(null); };
        });
    },

    _dispatchEvent: function(eventName, detail = {}) {
        if (!this._container) return;
        this._container.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            composed: true, // Important for events to cross Shadow DOM boundaries
            detail: detail
        }));
    }

};

window.yEditor = yEditor;
