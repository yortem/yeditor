# yEditor - A Simple and Flexible Content Editor

yEditor is an open-source project for creating a JavaScript-based WYSIWYG content editor, designed for easy embedding on any website over a `<textarea>` element. The editor is fully encapsulated using Shadow DOM, supports directionality (RTL/LTR), and offers an API for extensibility.



## Key Features

- **Simple Embedding**: Turns any `<textarea>` into a rich content editor with a single line of code.
- **Multi-language Support**: A JSON-based translation structure allows for easy addition of new languages.
- **Theming**: Built-in support for light and dark themes.
- **Markdown Support**: Automatic conversion of Markdown shortcuts for headings (`## H2`).
- **Extensibility API**: Allows developers to add custom buttons and functionality.

## Installation and Usage

### Local Installation

1.  Download the project files (`editor.js` and the `lang` directory) and add them to your project.
2.  Ensure your HTML page includes the JS file:

    ```html
    <script src="editor.js"></script>
    ```

3.  Add a `<textarea>` to your page with a unique `id`.

    ```html
    <textarea id="my-editor"></textarea>
    ```

4.  Initialize the editor using JavaScript:

    ```html
    <script>
        yEditor.init('#my-editor', {
            lang: 'en',       // e.g., 'en', 'he'
            direction: 'ltr', // 'ltr' or 'rtl'
            theme: 'light',   // 'light' or 'dark'
            quickLinksApiUrl: '/path/to/links-api.json',
            imageGalleryApiUrl: '/path/to/images-api.json',
            fileBrowserUrl: '/path/to/your/file-browser.html',
            fileBrowserOptions: { width: 1024, height: 768 } // Optional
        });
    </script>
    ```

### CDN Usage (Recommended)

For the quickest setup, you can use yEditor directly from the jsDelivr CDN. This method doesn't require you to host any files.

1.  Add the editor script to your HTML file.

    ```html
    <script src="https://cdn.jsdelivr.net/gh/yortem/yeditor@latest/editor.js"></script>
    ```

2.  Initialize the editor on your `<textarea>`:

    ```html
    <textarea id="my-editor"></textarea>

    <script>
        yEditor.init('#my-editor');
    </script>
    ```
The editor will automatically load the required language files from the CDN.

## Built-in API Integrations

yEditor comes with built-in support for fetching data from simple JSON APIs to enhance the user experience.

### Quick Links API

To speed up the process of adding internal links, the link popup can search for pages from a predefined JSON file.
This feature is enabled by providing a URL in the `quickLinksApiUrl` option during initialization.

*   **Trigger**: Typing in the URL field of the "Add/Edit Link" popup.
*   **JSON Format**: The file should contain an array of objects, where each object has a `title` and a `url`.

**Example `links-api.json`:**
```json
[
    { "title": "Homepage", "url": "/" },
    { "title": "About Us", "url": "/about" }
]
```

### Image Gallery API

The "Insert Image" popup can display a gallery of pre-existing images fetched from a JSON file.
This feature is enabled by providing a URL in the `imageGalleryApiUrl` option during initialization. If not provided, the "From Gallery" tab will be hidden.

*   **Trigger**: Opening the "From Gallery" tab in the "Insert Image" popup.
*   **JSON Format**: The file should contain an array of objects, where each object has a `title` (which will be used as the default alt text) and a `url`.

**Example `images-api.json`:**
```json
[
    { "title": "Laptop on a desk", "url": "https://example.com/image1.jpg" },
    { "title": "Mountain landscape", "url": "https://example.com/image2.jpg" }
]
```

### External File Browser

For advanced integration with a server-side file management system, you can specify a URL to an external file browser. This feature is enabled by providing a URL in the `fileBrowserUrl` option.

*   **Configuration**:
    *   `fileBrowserUrl` (string): The URL to your file browser page.
    *   `fileBrowserOptions` (object, optional): An object to configure the popup window's dimensions and position.
        *   `width` (number): The width of the popup in pixels. Default: `900`.
        *   `height` (number): The height of the popup in pixels. Default: `600`.
        *   `left`, `top` (number): The screen coordinates for the popup. If not provided, the window will be centered.
*   **Trigger**: A "Browse Server" button will appear next to the URL input in the "Insert Image" popup. Clicking it opens your file browser URL in a new popup window.
*   **Communication**: Your file browser should be a standalone page. When a user selects a file in it, your page must execute the JavaScript function described below to send the file URL back to the editor and close the popup.

### Script For File Browser

This is the script you can use for your external file browser:

```javascript
// Example: Add this script to your file browser page.

// Get all the selectable items.
const selectableItems = document.querySelectorAll('.file-item');

// Add a click listener to each item.
selectableItems.forEach(item => {
    item.addEventListener('click', () => {
        // Get the URL from the clicked item's data attribute.
        const selectedFileUrl = item.dataset.url;

        // --- This is the crucial part ---
        // Check if the window that opened this popup (the editor window)
        // has the callback function we're looking for.
        if (window.opener && typeof window.opener.yEditorFileBrowserCallback === 'function') {
            // If it exists, call it and pass the selected file URL.
            window.opener.yEditorFileBrowserCallback(selectedFileUrl);
        }

        // Finally, close this popup window.
        window.close();
    });
});
```


## Extensibility API

You can add custom buttons to the toolbar using the `yEditor.registerButton(config)` function.

### Example: Adding an "Insert Product" Button

The following example adds a button that opens a popup, searches for products from an external API, and inserts the selected product into the editor.

```javascript
yEditor.registerButton({
    // 1. Button settings
    title: 'Insert Product',
    icon: '<svg>...</svg>', // SVG code for the icon
    
    // 2. Popup settings
    prompt: {
        title: 'Search Product',
        label: 'Type a product name:',
        placeholder: 'e.g., Keyboard',
        displayField: 'name', // Which field from the object to display in the search input after selection

        // 3. Search function (can be a real API call)
        search: async (query) => {
            const response = await fetch('https://api.example.com/products?q=' + query);
            const products = await response.json();
            return products;
        },

        // 4. Function to render each item in the search results
        renderItem: (item) => {
            // It's important to add the data-item attribute with the full object
            return `<a class="search-result-item" data-item='${JSON.stringify(item)}'>
                        ${item.name}
                        <small>${item.price}</small>
                    </a>`;
        }
    },

    // 5. Function that builds the HTML to be inserted into the editor after selection
    onInsert: (selectedItem) => {
        return `<div class="product-embed">
                    <strong>${selectedItem.name}</strong>
                </div><p><br></p>`;
    },

    // 6. (Optional) Edit configuration
    edit: {
        selector: '.product-embed', // A CSS selector to identify the element
        onOpen: (element) => { // A function to parse data from the existing element
            const name = element.querySelector('strong').textContent;
            return { name: name }; // This object will pre-fill the prompt
        }
    }
});

// registerButton must be called before init
yEditor.init('#my-editor');
```

## Acknowledgements

This project was made possible by the following open-source libraries and resources:

- **DOMPurify** for robust HTML sanitization and XSS protection.
- **Clarity Icons** and **Google Material Icons** for the clean and intuitive toolbar icons.
- **Unsplash** for the beautiful placeholder images used in the demo.
- **Gemini Code Assist** for development assistance and code suggestions.