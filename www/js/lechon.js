const lechonDescriptions = {
    "lechon de leche": "• 17–20 Kilos\n• Good for 20 Pax\n• FREE Dinuguan or Halang-Halang\n• FREE Delivery anywhere in the City\n• CASH on DELIVERY",
    "regular": "• 22–25 Kilos\n• Good for 25–30 Pax\n• FREE Dinuguan or Halang-Halang\n• FREE Delivery anywhere in the City\n• CASH on DELIVERY",
    "medium": "• 27–30 Kilos\n• Good for 35–40 Pax\n• FREE Dinuguan or Halang-Halang\n• FREE Delivery anywhere in the City\n• CASH on DELIVERY",
    "large": "• 32–35 Kilos\n• Good for 45–50 Pax\n• FREE Dinuguan or Halang-Halang\n• FREE Delivery anywhere in the City\n• CASH on DELIVERY",
    "jumbo": "• 37–40 Kilos\n• Good for 55–60 Pax\n• FREE Dinuguan or Halang-Halang\n• FREE Delivery anywhere in the City\n• CASH on DELIVERY",
    "seafood": "• Add ₱1,800 to Level-Up your Festivity\n• 1 Kilo of Shrimps\n• 1 Kilo of Crabs\n• 1 Kilo of Sweet Corn",
    "chicken": "• Add only ₱850\n• 3 Whole Chickens Stuffed into your Lechon"
};

const lechonAddonsNote = "Stuffing Add-ons:\n• Seafoods Stuffed Lechon (+₱1,800: 1kg Shrimps, 1kg Crabs, 1kg Sweet Corn)\n• Chicken Stuffed Lechon (+₱850: 3 Whole Chickens)";

function getLechonDescription(name) {
    const lowerName = String(name ?? '').toLowerCase();
    const matchedKey = Object.keys(lechonDescriptions).find(key =>
        lowerName.includes(key)
    );
    return matchedKey ? lechonDescriptions[matchedKey] : "";
}

async function loadLechonProducts() {
    const container = document.getElementById('lechon-container');
    const { data, error } = await window.supabaseClient
        .from('lechon')
        .select('id, name, description, price, available')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error loading Lechon:", error);
        container.innerHTML = "<p>Failed to load Lechon products.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>No Lechon products available.</p>";
        return;
    }

    container.innerHTML = data.map(item => {
        const desc = item.description;
        return `
            <div class="package-card">
                <span class="package-name">${escapeHTML(item.name)}</span>
                ${desc ? `<p class="package-description">${escapeHTML(desc)}</p>` : ''}
                <div class="price-input">
                    ₱ ${Number(item.price).toLocaleString('en-PH')}
                </div>
                ${item.available ? '' : '<span class="unavailable-tag">Currently unavailable</span>'}
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

loadLechonProducts();