const lechonData = [
    { id: 'l1', name: 'Whole Lechon XL', price: 12000, available: true },
    { id: 'l2', name: 'Whole Lechon Large', price: 9500, available: true },
    { id: 'l3', name: 'Whole Lechon Medium', price: 7500, available: true },
    { id: 'l4', name: 'Boneless Roll 5kg', price: 2800, available: false }
];

const cateringData = [
    { id: 'c1', name: 'Fiesta Pack A (50 Pax)', price: 18500, available: true },
    { id: 'c2', name: 'Fiesta Pack B (100 Pax)', price: 34000, available: true },
    { id: 'c3', name: 'Executive (Per Head)', price: 450, available: true }
];

const trackerData = [
    { id: '#ORD-8821', name: 'Juan Dela Cruz', item: 'Whole Lechon Large', status: 'Preparing' },
    { id: '#ORD-8822', name: 'Maria Santos', item: 'Fiesta Pack A', status: 'Out for Delivery' }
];

function openScreen(screenId) {
    document.getElementById('home-screen').style.display = 'none';
    document.querySelectorAll('.subpage-main').forEach(s => s.classList.remove('active'));

    if (screenId === 'home') {
        document.getElementById('home-screen').style.display = 'flex';
    } else {
        const target = document.getElementById(screenId + '-screen');
        if (target) target.classList.add('active');
    }
}

function renderLechon() {
    const box = document.getElementById('lechon-container');
    box.innerHTML = lechonData.map(item => `
        <div class="admin-card-item">
            <div class="card-row-top">
                <span class="item-name-text">${item.name}</span>
                <div class="switch-box">
                    <label class="toggle-switch">
                        <input type="checkbox" ${item.available ? 'checked' : ''} onchange="toggleItem('lechon', '${item.id}')">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="status-indicator">${item.available ? 'Available' : 'Unavailable'}</span>
                </div>
            </div>
            <div class="card-row-bottom">
                <div class="price-field-wrapper">
                    <span class="peso-sign">₱</span>
                    <input type="number" value="${item.price}" id="price-${item.id}" class="edit-price-input">
                </div>
                <button class="save-action-btn" onclick="savePrice('lechon', '${item.id}')">Save</button>
            </div>
        </div>
    `).join('');
}

function renderCatering() {
    const box = document.getElementById('catering-container');
    box.innerHTML = cateringData.map(item => `
        <div class="admin-card-item">
            <div class="card-row-top">
                <span class="item-name-text">${item.name}</span>
                <div class="switch-box">
                    <label class="toggle-switch">
                        <input type="checkbox" ${item.available ? 'checked' : ''} onchange="toggleItem('catering', '${item.id}')">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="status-indicator">${item.available ? 'Available' : 'Unavailable'}</span>
                </div>
            </div>
            <div class="card-row-bottom">
                <div class="price-field-wrapper">
                    <span class="peso-sign">₱</span>
                    <input type="number" value="${item.price}" id="price-${item.id}" class="edit-price-input">
                </div>
                <button class="save-action-btn" onclick="savePrice('catering', '${item.id}')">Save</button>
            </div>
        </div>
    `).join('');
}

function renderTracker() {
    const box = document.getElementById('tracker-container');
    box.innerHTML = trackerData.map(ord => `
        <div class="admin-card-item">
            <div class="card-row-top">
                <span class="item-name-text">${ord.id}</span>
                <span style="color:#fff; font-size:0.75rem;">${ord.name}</span>
            </div>
            <p style="color:#ddd; font-size:0.7rem; font-family:sans-serif; margin-bottom:4px;">${ord.item}</p>
            <select class="tracker-status-select" onchange="notify('Order ${ord.id} status updated')">
                <option value="Order Received" ${ord.status === 'Order Received' ? 'selected' : ''}>Order Received</option>
                <option value="Preparing" ${ord.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                <option value="Out for Delivery" ${ord.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
        </div>
    `).join('');
}

function toggleItem(type, id) {
    const list = type === 'lechon' ? lechonData : cateringData;
    const item = list.find(i => i.id === id);
    if (item) {
        item.available = !item.available;
        notify(`Updated ${item.name}`);
        if (type === 'lechon') renderLechon();
        else renderCatering();
    }
}

function savePrice(type, id) {
    const val = document.getElementById(`price-${id}`).value;
    notify(`Saved new price: ₱${val}`);
}

function notify(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderLechon();
    renderCatering();
    renderTracker();
});