const packageDescriptions = {
    "Fiesta Pack A": "Good for 50 Pax — Includes whole lechon, 4 main dishes, rice, dessert, and drinks.",
    "Fiesta Pack B": "Good for 100 Pax — Includes whole lechon, 6 main dishes, rice, dessert, and drinks.",
    "Executive": "Per Head — Customizable buffet setup with lechon carving station and full catering service."
};

function getPackageDescription(name) {
    const key = Object.keys(packageDescriptions).find(k =>
        name.toLowerCase().includes(k.toLowerCase())
    );
    return key ? packageDescriptions[key] : "";
}

async function loadCateringProducts() {
    const container = document.getElementById('catering-container');

    const { data, error } = await window.supabaseClient
        .from('catering')
        .select('id, name, price, available')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error loading Catering:", error);
        container.innerHTML = "<p>Failed to load Catering packages.</p>";
        return;
    }

    container.innerHTML = data.map(item => {
        const desc = getPackageDescription(item.name);
        return `
            <div class="package-card">
                <span class="package-name">${escapeHTML(item.name)}</span>
                ${desc ? `<p class="package-description">${escapeHTML(desc)}</p>` : ''}
                <div class="price-input">
                    ₱ ${Number(item.price).toLocaleString('en-PH')}
                </div>
                ${item.available ? '' : '<span>Currently unavailable</span>'}
            </div>
        `;
    }).join('');
}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}
loadCateringProducts();