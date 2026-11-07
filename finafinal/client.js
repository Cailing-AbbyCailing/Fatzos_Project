function openModal() {
    document.getElementById('orderModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function submitOrder() {
    const orderMessage = document.getElementById('orderMessage').value.trim();
    
    if (!orderMessage) {
        alert('Please enter your order or message before submitting.');
        return;
    }

    const recipientEmail = 'cailingabegail@gmail.com';
    const subject = encodeURIComponent('New Order from Fatzo\'s Customer');
    const body = encodeURIComponent(orderMessage);

    // Triggers the mail client to send to the specified email address
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    closeModal();
}