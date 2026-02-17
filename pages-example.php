<?php

// Log errors to a file instead of displaying them
// ini_set('display_errors', 1);
// ini_set('log_errors', 1);
// ini_set('error_log', __DIR__ . '/php_errors.log');

require_once '../db.php'; // Ensures all functions are loaded first.

$action = $_GET['action'] ?? 'list';
$id = $_GET['id'] ?? null;
$current_type_slug = $_GET['type'] ?? 'page';

// Fetch current type details
$current_type_details = null;
// require_once '../auth.php'; // Auth is now handled by db.php -> auth_functions.php -> get_current_user_from_cookie()

if ($current_type_slug !== 'page') {
    $stmt = $conn->prepare("SELECT pt.*, parent.slug as parent_type_slug FROM page_types pt LEFT JOIN page_types parent ON pt.parent_id = parent.id WHERE pt.slug = ?");
    $stmt->bind_param("s", $current_type_slug);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $current_type_details = $result->fetch_assoc();
    }
} else {
    // Provide default details for the built-in 'page' type
    $current_type_details = [
        'has_content' => 1, 'has_featured_image' => 1, 'has_gallery' => 1,
        'has_tags' => 1, 'has_categories' => 1, 'parent_id' => null,
        'name_plural' => 'דפים', 'name_singular' => 'דף', 'is_indexable' => 1
    ];
}

// ... (functions omitted for brevity, keeping the JS part) ...

?>
<!-- SortableJS for gallery -->
<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>

<style>
    /* Performance optimization: hide editor textarea until initialized */
    .wysiwyg-editor:not(.yeditor-initialized) {
        visibility: hidden;
        height: 400px;
    }
</style>

<script>
    // This script block must come AFTER the main yEditor script is loaded in footer.php,
    // but it needs PHP variables, so it's placed here.
    document.addEventListener('DOMContentLoaded', function() {
        const pageId = '<?php echo $page['id'] ?: 'new'; ?>';
        const pageType = '<?php echo $current_type_slug; ?>';
        
        // --- Custom yEditor Button for Products ---
        if (pageType !== 'product') { // Don't show the button when editing a product itself
            yEditor.registerButton({
                title: 'הוסף מוצר',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.744-.616l2.25-9a.75.75 0 00-.744-.884H7.062L5.438 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" /></svg>',
                inline: true, // Treat the shortcode as an inline element
                prompt: {
                    title: 'חיפוש והוספת מוצרים',
                    label: 'הקלד שם של מוצר:',
                    placeholder: 'לדוגמה: מקלדת',
                    displayField: 'title',
                    multiple: true,

                    search: async (query) => {
                        if (query.length < 2) return [];
                        const response = await fetch(`/api.php?action=search_pages&type=product&q=${encodeURIComponent(query)}`, {
                            headers: { 'Accept': 'application/json' }
                        });
                        const textResponse = await response.text();
                        if (!response.headers.get('content-type')?.includes('application/json')) {
                            console.error("Server did not return JSON. Response:", textResponse);
                            return [];
                        }
                        try {
                            const products = JSON.parse(textResponse);
                            return products;
                        } catch (e) {
                            console.error("--- RAW SERVER RESPONSE (NOT VALID JSON) ---");
                            console.error(textResponse);
                            return [];
                        }
                    },

                    renderItem: (item) => {
                        const price = parseFloat(item.sale_price || item.price || 0).toFixed(2);
                        return `<div class="search-result-item" data-item='${JSON.stringify(item)}'>
                                    <div class="font-semibold">${item.title}</div>
                                    <small class="text-gray-500">מחיר: ${price} ₪ | מק"ט: ${item.sku || 'N/A'}</small>
                                </div>`;
                    }
                },

                onInsert: (selectedItems) => {
                    const items = Array.isArray(selectedItems) ? selectedItems : [selectedItems].filter(Boolean);
                    if (items.length === 0) return '';
                    const ids = items.map(item => item.id).join(',');
                    return `<span class="y-products-block">{מוצרים: ${ids}}</span>`;
                },

                edit: {
                    selector: '.y-products-block',
                    onOpen: async (element) => {
                        const match = element.textContent.match(/{מוצרים: (.*)}/);
                        if (!match) return [];
                        
                        const ids = match[1].split(',').map(id => id.trim()).filter(Boolean);
                        if (ids.length === 0) return [];

                        try {
                            // Fetch actual names from your API using the IDs
                            const response = await fetch(`/api.php?action=get_products_by_ids&ids=${ids.join(',')}`);
                            if (response.ok) {
                                return await response.json();
                            }
                        } catch (e) {
                            console.error("Failed to fetch product names for edit:", e);
                        }

                        // Fallback if API fails: show the IDs
                        return ids.map(id => ({ id: id, title: `מוצר ${id}` }));
                    }
                }
            });
        }

        // ... (rest of initialization) ...
        function initializeYEditor() {
            if (window.yEditor) {
                window.yEditor.init('.wysiwyg-editor', {
                    lang: 'he',
                    direction: 'rtl',
                    theme: 'light',
                    quickLinksApiUrl: '/api.php?action=search_links',
                    fileBrowserUrl: `/y2admin/apps/media_manager.php?context=pages&context_id=${pageId}`,
                    fileBrowserOptions: { width: 1024, height: 768 }
                });
            } else { setTimeout(initializeYEditor, 50); }
        }
        initializeYEditor();
    });
</script>
