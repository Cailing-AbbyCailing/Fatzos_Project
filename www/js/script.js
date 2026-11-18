async function checkAdminAccess() {
    const { data: { user }, error } =
        await window.supabaseClient.auth.getUser();

    if (error || !user) {
        alert("Please log in first.");
        window.location.href = "index.html";
        return;
    }

    const { data: profile, error: profileError } =
        await window.supabaseClient
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

    if (profileError || profile.role !== "admin") {
        alert("Access denied. Admins only.");
        await window.supabaseClient.auth.signOut();
        window.location.href = "index.html";
        return;
    }

    console.log("Admin access verified!");
}

checkAdminAccess();

async function handleAdminLogout() {
    try {
        if (window.supabaseClient) {
            const { error } = await window.supabaseClient.auth.signOut();
            if (error) console.error('Logout error:', error.message);
        }
        localStorage.removeItem('adminSession');
        sessionStorage.clear();

        window.location.href = 'index.html';
    } catch (err) {
        console.error('Unexpected error during logout:', err);
        window.location.href = 'index.html';
    }
}

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

let trackerOrdersData = [];

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

async function renderLechon() {
    const box = document.getElementById('lechon-container');
    if (!box) return;

    const { data, error } = await window.supabaseClient
        .from('lechon')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error loading Lechon products:", error);
        box.innerHTML = "<p>Failed to load Lechon products.</p>";
        return;
    }

    lechonData = data;

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
                    <input type="number" value="${item.price}" id="price-lechon-${item.id}" class="edit-price-input">
                </div>
                <button class="save-action-btn" onclick="savePrice('lechon', '${item.id}')">Save</button>
            </div>
        </div>
    `).join('');
}

async function renderCatering() {
    const box = document.getElementById('catering-container');
    if (!box) return;

    const { data, error } = await window.supabaseClient
        .from('catering')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error loading Catering products:", error);
        box.innerHTML = "<p>Failed to load Catering products.</p>";
        return;
    }

    cateringData = data;

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
                    <input type="number" value="${item.price}" id="price-catering-${item.id}" class="edit-price-input">
                </div>
                <button class="save-action-btn" onclick="savePrice('catering', '${item.id}')">Save</button>
            </div>
        </div>
    `).join('');
}

async function deleteItem(type, id) {
    if (confirm("Are you sure you want to delete this item?")) {
        if (type === 'lechon' || type === 'catering') {
            const table = type === 'lechon' ? 'lechon' : 'catering';

            const { error } = await window.supabaseClient
                .from(table)
                .delete()
                .eq('id', id);

            if (error) {
                console.error(`Error deleting ${type} item:`, error);
                notify("Failed to delete item!");
                return;
            }

            if (type === 'lechon') {
                await renderLechon();
            } else {
                await renderCatering();
            }
        }

        await updateCounters();
        notify("Item deleted successfully!");
    }
}

async function toggleItem(type, id) {
    const list = type === 'lechon' ? lechonData : cateringData;
    const item = list.find(i => i.id == id);

    if (!item) return;

    const newAvailability = !item.available;
    const table = type === 'lechon' ? 'lechon' : 'catering';

    const { error } = await window.supabaseClient
        .from(table)
        .update({ available: newAvailability })
        .eq('id', id);

    if (error) {
        console.error(`Error updating ${type} availability:`, error);
        notify("Failed to update availability!");
        return;
    }

    if (type === 'lechon') {
        await renderLechon();
    } else {
        await renderCatering();
    }

    notify(`Updated ${item.name}`);
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

async function saveNewItem() {
    const name = document.getElementById('modal-item-name').value.trim();
    const price = parseFloat(document.getElementById('modal-item-price').value);
    const statusSelect = document.getElementById('modal-item-status');
    const available = statusSelect ? statusSelect.value === 'available' : true;

    if (!name || isNaN(price) || price < 0) {
        notify("Please enter a valid name and price.");
        return;
    }

    const table = currentCategory === 'lechon' ? 'lechon' : 'catering';

    const { error } = await window.supabaseClient
        .from(table)
        .insert([{
            name: name,
            price: price,
            available: available
        }]);

    if (error) {
        console.error(`Error adding ${currentCategory} item:`, error);
        notify("Failed to add item!");
        return;
    }

    if (currentCategory === 'lechon') {
        await renderLechon();
    } else {
        await renderCatering();
    }

    await updateCounters();
    closeAddModal();
    notify("New item added successfully!");
}

function openAddOrderModal() {
    const modal = document.getElementById('addOrderModal');
    if (modal) modal.classList.remove('hidden');
}

function closeAddOrderModal() {
    const modal = document.getElementById('addOrderModal');
    if (modal) modal.classList.add('hidden');
    
    document.getElementById('order-customer-name').value = '';
    document.getElementById('order-item-details').value = '';
    document.getElementById('order-total-price').value = '';
    document.getElementById('order-status').value = 'Pending';
    document.getElementById('order-category').value = 'Lechon';
}

async function loadTrackerOrders() {
    const { data, error } = await window.supabaseClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error loading orders:", error);
        notify("Failed to load orders!");
        return;
    }

    trackerOrdersData = data.map(order => ({
        id: order.order_id,
        customer: order.customer,
        item: order.item,
        status: order.status,
        total: order.total,
        createdAt: order.created_at,
        category: order.category
    }));

    renderTrackerOrders();
    await updateCounters();
}

async function saveNewOrderToSupabase() {
    const customerName = document.getElementById('order-customer-name').value.trim();
    const details = document.getElementById('order-item-details').value.trim();
    const totalInput = document.getElementById('order-total-price').value;
    const total = parseFloat(totalInput);
    const status = document.getElementById('order-status').value;
    const category = document.getElementById('order-category').value;

    if (!customerName || !details || totalInput === '' || isNaN(total) || total < 0) {
        notify('Please enter valid order details.');
        return;
    }

    const orderId = 'ORD-' + Date.now();

    const { data, error } = await window.supabaseClient
        .from('orders')
        .insert([{
            order_id: orderId,
            customer: customerName,
            item: details,
            total: total,
            status: status,
            category: category
        }])
        .select();

    if (error) {
        console.error('Error adding order:', error);
        notify('Failed to add order!');
        return;
    }

    await loadTrackerOrders();
    closeAddOrderModal();
    notify('Order added successfully!');
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
                               order.id.toLowerCase().includes(searchVal) ||
                               order.item.toLowerCase().includes(searchVal);
        const matchesStatus = (statusVal === 'all') || (order.status === statusVal);
        return matchesSearch && matchesStatus;
    });

    renderTrackerOrders(filtered);
}

async function updateOrderStatus(orderId, newStatus) {
    const { data, error } = await window.supabaseClient
        .from('orders')
        .update({ status: newStatus })
        .eq('order_id', orderId)
        .select();

    if (error || !data || data.length === 0) {
        console.error('Error updating order status:', error);
        notify('Failed to update order status!');
        filterTrackerOrders();
        return;
    }

    const order = trackerOrdersData.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
    }

    await updateCounters();
    filterTrackerOrders();
    notify(`Order ${orderId} status set to ${newStatus}`);
}

async function savePrice(type, id) {
    const val = document.getElementById(`price-${type}-${id}`).value;
    const newPrice = parseFloat(val);

    if (isNaN(newPrice) || newPrice < 0) {
        notify("Please enter a valid price!");
        return;
    }

    const table = type === 'lechon' ? 'lechon' : 'catering';

    const { data, error } = await window.supabaseClient
        .from(table)
        .update({ price: newPrice })
        .eq('id', id)
        .select();

    if (error) {
        console.error(`Error saving ${type} price:`, error);
        notify("Failed to save price!");
        return;
    }

    if (type === 'lechon') {
        await renderLechon();
    } else {
        await renderCatering();
    }

    notify(`Saved new price: ₱${newPrice}`);
}

async function updateCounters() {
    const lechonOrders = trackerOrdersData.filter(order =>
        order.category === 'Lechon' &&
        order.status !== 'Completed'
    ).length;

    const cateringBookings = trackerOrdersData.filter(order =>
        order.category === 'Catering' &&
        order.status !== 'Completed'
    ).length;

    const { count: lechonMenuCount, error: lechonError } =
        await window.supabaseClient
            .from('lechon')
            .select('id', { count: 'exact', head: true });

    const { count: cateringPackageCount, error: cateringError } =
        await window.supabaseClient
            .from('catering')
            .select('id', { count: 'exact', head: true });

    if (lechonError || cateringError) {
        console.error('Error loading dashboard counts:', lechonError || cateringError);
    }

    document.getElementById('kpi-lechon-orders').textContent =
        `${lechonOrders} Active`;

    document.getElementById('kpi-lechon-menu').textContent =
        `${lechonMenuCount ?? 0} Items`;

    document.getElementById('kpi-catering-bookings').textContent =
        `${cateringBookings} Bookings`;

    document.getElementById('kpi-catering-packages').textContent =
        `${cateringPackageCount ?? 0} Packages`;

    const dispatchedCount = trackerOrdersData.filter(
        order => order.status === 'Out for Delivery'
    ).length;

    const today = new Date().toLocaleDateString();

    const queueCount = trackerOrdersData.filter(order =>
        new Date(order.createdAt).toLocaleDateString() === today
    ).length;

    const dispatchedElement = document.getElementById('kpi-dispatched-count');
    const queueElement = document.getElementById('kpi-queue-count');

    if (dispatchedElement) {
        dispatchedElement.textContent = `${dispatchedCount} On Delivery`;
    }

    if (queueElement) {
        queueElement.textContent = `${queueCount} Total`;
    }
}

function notify(msg) {
    const toast = document.getElementById('toast');

    if (!toast) {
        console.error("Toast element not found!");
        return;
    }

    toast.textContent = msg;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderLechon();
    renderCatering();
    loadTrackerOrders();
});