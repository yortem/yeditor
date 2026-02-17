# yEditor - A Simple and Flexible Content Editor

yEditor is an open-source project for creating a JavaScript-based WYSIWYG content editor, designed for easy embedding on any website over a `<textarea>` element. The editor is fully encapsulated using Shadow DOM, supports directionality (RTL/LTR), and offers an API for extensibility.

![The editor in action](example.webp)

## Performance & Visual Stability

### Avoiding Flickering (Flash of Un-styled Textarea)

When embedding the editor, the original `<textarea>` may be visible for a brief moment before the editor is fully initialized. To prevent this "flicker" and ensure a smooth user experience, you can hide the textarea using CSS:

```css
/* Hide the textarea until the editor is ready */
.y-editor:not(.yeditor-initialized) {
    visibility: hidden;
    /* Optional: set a height to reserve space and avoid layout shifts */
    height: 300px; 
}
```

The editor will automatically replace the textarea once initialization is complete.

## Key Features

- **Simple Embedding**: Turns any `<textarea>` into a rich content editor with a single line of code.
- **Optimized Loading**: Dependencies and assets (CSS, Lang) are loaded in parallel for maximum performance.
- **Protected Custom Blocks**: Support for non-editable "modules" (shortcodes/embeds) that can be edited via a bubble menu.
- **Multi-language Support**: A JSON-based translation structure allows for easy addition of new languages.
- **Theming**: Built-in support for light and dark themes.
- **Markdown Support**: Automatic conversion of Markdown shortcuts for headings (`## H2`).
- **Extensibility API**: Powerful API to add custom buttons with searchable prompts and multi-selection.

## Installation and Usage

### Local Installation

1.  Download the project files and place the `src` and `dist` directories in your project.
2.  Ensure your HTML page includes the JS file:

    ```html
    <script src="src/editor.js"></script>
    ```

3.  Add a `<textarea>` to your page with a unique `id`.

    ```html
    <textarea id="my-editor" class="y-editor"></textarea>
    ```

4.  Initialize the editor using JavaScript:

    ```javascript
    yEditor.init('#my-editor', {
        lang: 'en',       // e.g., 'en', 'he'
        direction: 'ltr', // 'ltr' or 'rtl'
        theme: 'light',   // 'light' or 'dark'
        quickLinksApiUrl: '/path/to/links-api.json',
        imageGalleryApiUrl: '/path/to/images-api.json',
        fileBrowserUrl: '/path/to/your/file-browser.html'
    });
    ```

## Extensibility API (Custom Buttons)

You can add custom buttons to the toolbar using the `yEditor.registerButton(config)` function. This is perfect for inserting product modules, shortcodes, or custom UI components.

### Protected Blocks
When a custom button inserts HTML, `yEditor` automatically wraps it in a **Protected Block**. These blocks:
- Are non-editable (`contenteditable="false"`) to prevent accidental corruption.
- Behave as a single unit (deleted with one backspace).
- Show a **Bubble Menu** when clicked, allowing the user to edit the data via the original prompt.

### Example: Multi-Product Shortcode
This example creates a button that allows searching for multiple products and inserting them as a single shortcode like `{products: 1,2,3}`.

```javascript
yEditor.registerButton({
    title: 'Insert Products',
    icon: '<svg>...</svg>', 
    inline: true, // Use a span instead of a div for the block
    
    prompt: {
        title: 'Select Products',
        label: 'Search products:',
        placeholder: 'e.g. iPhone',
        displayField: 'title', 
        multiple: true, // Allow selecting multiple items

        search: async (query) => {
            const response = await fetch(`/api/products?q=${query}`);
            return await response.json();
        },

        renderItem: (item) => `
            <div class="search-result-item" data-item='${JSON.stringify(item)}'>
                <strong>${item.title}</strong>
                <small>${item.price}</small>
            </div>`
    },

    // Generates the HTML stored in the database
    onInsert: (selectedItems) => {
        const ids = selectedItems.map(item => item.id).join(',');
        return `{products: ${ids}}`;
    },

    // Configuration for the "Edit" bubble menu
    edit: {
        selector: '.y-products-shortcode',
        onOpen: (element) => {
            // Parse the existing IDs from the block text to pre-fill the prompt
            const match = element.textContent.match(/{products: (.*)}/);
            if (match) {
                return match[1].split(',').map(id => ({ id: id.trim(), title: `Product ${id}` }));
            }
            return [];
        }
    }
});
```

## Events API 

yEditor dispatches several custom events on its container element (`.yeditor-container`).

```javascript 
const editorContainer = document.querySelector('.yeditor-container');
editorContainer.addEventListener('yeditor-change', (event) => {
    console.log('New content:', event.detail.content);
});
```

### Available Events
- `yeditor-init`: Fired when the editor is ready.
- `yeditor-change`: Fired on every modification.
- `yeditor-focus` / `yeditor-blur`: Fired on focus changes.
- `yeditor-command-exec`: Fired when a toolbar button is clicked.

## Methods API

#### `yEditor.setContent(selector, content)`
Sets the HTML content of an initialized editor. Content is automatically sanitized while preserving protected block attributes.

#### `yEditor.getInstance(selector)`
Returns the editor instance details (shadowRoot, container, original textarea).

## Acknowledgements

- **DOMPurify**: Robust HTML sanitization.
- **Clarity Icons**: Clean toolbar icons.
- **jsDelivr**: Fast CDN hosting.
