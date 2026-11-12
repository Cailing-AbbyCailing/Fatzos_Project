// Data Stores
let lechonData = [
    { id: 'l1', name: 'Whole Lechon XL', price: 12000, available: true },
    { id: 'l2', name: 'Whole Lechon Large', price: 9500, available: true },
    { id: 'l3', name: 'Whole Lechon Medium', price: 7500, available: true },
    { id: 'l4', name: 'Boneless Roll 5kg', price: 2800, available: false }
];

let cateringData = [
    { id: 'c1', name: 'Fiesta Pack A (50 Pax)', price: 18500, available: true },
    { id: 'c2', name: 'Fiesta Pack B (100 Pax)', price: 34000, available: true },
    { id: 'c3', name: 'Executive (Per Head)', price: 450, available: true }
];

let trackerOrdersData = [
    { id: "ORD-8821", customer: "Juan Dela Cruz", item: "Whole Lechon Large", status: "Preparing", total: 9500 },
    { id: "ORD-8822", customer: "Maria Santos", item: "Fiesta Pack A", status: "Out for Delivery", total: 18500 },
    { id: "ORD-8823", customer: "Grace Tan", item: "Whole Lechon Medium", status: "Pending", total: 7500 }
];

let currentCategory = 'lechon';

function openScreen(screenId) {
    const homeScreen = document.getElementById('home-screen');
    if (homeScreen) homeScreen.style.display = 'none';
    
    document.querySelectorAll('.subpage-main').forEach(s => s.classList.remove('active'));

    if (screenId === 'home') {
        if (homeScreen) homeScreen.style.display = 'flex';
    } else {
        const target = document.getElementById(screenId + '-screen');
        if (target) target.classList.add('active');
    }
}

function renderLechon() {
    const box = document.getElementById('lechon-container');
    if (!box) return;
    
    box.innerHTML = lechonData.map(item => `
        <div class="admin-card-item">
            <div class="card-row-top">
                <span class="item-name-text">${item.name}</span>
                <div class="switch-box">
                    <label class="toggle-switch">
                        <input type="checkbox" ${item.available ? 'checked' : ''} onchange="toggleItem('lechon', '${item.id}')">
                        <span class="toggle-slider"></span>
                    </label>
                    <button class="delete-btn" onclick="deleteItem('lechon', '${item.id}')" title="Delete Item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
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
    updateCounters();
}

function renderCatering() {
    const box = document.getElementById('catering-container');
    if (!box) return;

    box.innerHTML = cateringData.map(item => `
        <div class="admin-card-item">
            <div class="card-row-top">
                <span class="item-name-text">${item.name}</span>
                <div class="switch-box">
                    <label class="toggle-switch">
                        <input type="checkbox" ${item.available ? 'checked' : ''} onchange="toggleItem('catering', '${item.id}')">
                        <span class="toggle-slider"></span>
                    </label>
                    <button class="delete-btn" onclick="deleteItem('catering', '${item.id}')" title="Delete Item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
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
    updateCounters();
}

function deleteItem(type, id) {
    if (confirm("Are you sure you want to delete this item?")) {
        if (type === 'lechon') {
            lechonData = lechonData.filter(i => i.id !== id);
            renderLechon();
        } else if (type === 'catering') {
            cateringData = cateringData.filter(i => i.id !== id);
            renderCatering();
        }
        notify("Item deleted successfully!");
    }
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

function openAddModal(category) {
    currentCategory = category;
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = `ADD NEW ${category.toUpperCase()} ITEM`;
    
    document.getElementById('modal-item-name').value = '';
    document.getElementById('modal-item-price').value = '';
    const descEl = document.getElementById('modal-item-desc');
    if (descEl) descEl.value = '';
    
    document.getElementById('addItemModal').classList.remove('hidden');
}

function closeAddModal() {
    document.getElementById('addItemModal').classList.add('hidden');
}

function saveNewItem() {
    const name = document.getElementById('modal-item-name').value.trim();
    const price = parseFloat(document.getElementById('modal-item-price').value);
    const statusSelect = document.getElementById('modal-item-status');
    const available = statusSelect ? statusSelect.value === 'available' : true;

    if (!name || isNaN(price)) {
        notify("Please enter a valid name and price.");
        return;
    }

    const newItem = {
        id: 'item_' + Date.now(),
        name: name,
        price: price,
        available: available
    };

    if (currentCategory === 'lechon') {
        lechonData.push(newItem);
        renderLechon();
    } else if (currentCategory === 'catering') {
        cateringData.push(newItem);
        renderCatering();
    }

    closeAddModal();
    notify("New item added successfully!");
}

function renderTrackerOrders(orders = trackerOrdersData) {
    const container = document.getElementById('tracker-container');
    if (!container) return;

    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = `<div style="text-align:center; color: var(--accent-gold); padding: 20px; font-size: 0.8rem;">No matching orders found.</div>`;
    } else {
        orders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'admin-card-item';
            card.innerHTML = `
                <div class="card-row-top">
                    <span class="item-name-text">${order.id} - ${order.customer}</span>
                    <span class="status-indicator status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span>
                </div>
                <div class="card-row-bottom" style="margin-bottom: 6px;">
                    <span style="color: #fff; font-size: 0.75rem;">Item: ${order.item}</span>
                    <span style="color: var(--accent-gold); font-size: 0.75rem; font-weight: bold; margin-left: auto;">₱${(order.total || 0).toLocaleString()}</span>
                </div>
                <select class="tracker-status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                    <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            `;
            container.appendChild(card);
        });
    }

    const countBadge = document.getElementById('tracker-order-count');
    if (countBadge) countBadge.textContent = `${orders.length} Total`;
}

function filterTrackerOrders() {
    const searchInput = document.getElementById('tracker-search-input');
    const statusFilter = document.getElementById('tracker-status-filter');
    
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const statusVal = statusFilter ? statusFilter.value : 'all';

    const filtered = trackerOrdersData.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchVal) || 
                              order.id.toLowerCase().includes(searchVal);
        const matchesStatus = (statusVal === 'all') || (order.status === statusVal);
        return matchesSearch && matchesStatus;
    });

    renderTrackerOrders(filtered);
}

function updateOrderStatus(orderId, newStatus) {
    const order = trackerOrdersData.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        notify(`Order ${orderId} status set to ${newStatus}`);
        filterTrackerOrders(); 
    }
}

// Helpers
function savePrice(type, id) {
    const val = document.getElementById(`price-${id}`).value;
    const list = type === 'lechon' ? lechonData : cateringData;
    const item = list.find(i => i.id === id);
    if(item) item.price = parseFloat(val) || 0;
    notify(`Saved new price: ₱${val}`);
}

function notify(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
}

function updateCounters() {
    const lechonAvailable = lechonData.filter(i => i.available).length;
    const lechonKpi = document.querySelector('#lechon-screen .kpi-value');
    if (lechonKpi) lechonKpi.textContent = `${lechonAvailable} Available`;

    const cateringAvailable = cateringData.filter(i => i.available).length;
    const cateringKpi = document.querySelector('#catering-screen .kpi-value');
    if (cateringKpi) cateringKpi.textContent = `${cateringAvailable} Available`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderLechon();
    renderCatering();
    renderTrackerOrders();
});

console.log("Admin JS loaded successfully!");