
async function loadCateringProducts() {
    const container = document.getElementById('catering-container');

    // Retrieve Catering packages from Supabase
    const { data, error } = await window.supabaseClient
        .from('catering')
        .select('id, name, price, available')
        .order('id', { ascending: true });

    // Handle database errors
    if (error) {
        console.error("Error loading Catering:", error);
        container.innerHTML = "<p>Failed to load Catering packages.</p>";
        return;
    }

    // Display Catering packages
    container.innerHTML = data.map(item => `
        <div class="package-card">
            <span class="package-name">${escapeHTML(item.name)}</span>
            <div class="price-input">
                ₱ ${Number(item.price).toLocaleString('en-PH')}
            </div>
            ${item.available ? '' : '<span>Currently unavailable</span>'}
        </div>
    `).join('');
}

// Prevent product names from being interpreted as HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

// Run when the page loads
loadCateringProducts();
