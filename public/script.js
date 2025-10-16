// Product Order System - Frontend JavaScript
// Handles user interactions, validation, and API communication

// Constant phone number - no user input required
const PHONE_NUMBER = '1234567890';

// Product data - matches the HTML structure
const products = {
    '1': {
        name: 'Premium Smartphone',
        price: 599.99,
        description: 'Latest flagship smartphone with advanced camera and long battery life'
    },
    '2': {
        name: 'Gaming Laptop',
        price: 1299.99,
        description: 'High-performance gaming laptop with RTX graphics and fast SSD'
    },
    '3': {
        name: 'Wireless Headphones',
        price: 199.99,
        description: 'Premium noise-canceling wireless headphones with 30-hour battery'
    }
};

// DOM elements
const orderSummary = document.getElementById('orderSummary');
const confirmBtn = document.getElementById('confirmOrder');
const messagesSection = document.getElementById('messages');

// State management
let currentOrder = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
    // Product selection handlers
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const selectBtn = card.querySelector('.select-btn');
        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleProductSelection(card.dataset.productId);
        });
    });
    
    // Order confirmation handler
    confirmBtn.addEventListener('click', handleOrderConfirmation);
}



/**
 * Handle product selection and generate order summary
 * @param {string} productId - ID of the selected product
 */
function handleProductSelection(productId) {
    const product = products[productId];
    if (!product) {
        showMessage('Invalid product selection', 'error');
        return;
    }
    
    // Create order data with constant phone number
    currentOrder = {
        phoneNumber: PHONE_NUMBER,
        product: product,
        quantity: 1,
        totalAmount: product.price * 1
    };
    
    // Update order summary display
    updateOrderSummary();
    
    // Show order summary section
    orderSummary.style.display = 'block';
    orderSummary.scrollIntoView({ behavior: 'smooth' });
    
    // Clear any previous messages
    clearMessages();
}

/**
 * Update the order summary display with current order data
 */
function updateOrderSummary() {
    if (!currentOrder) return;
    
    document.getElementById('summaryProductName').textContent = currentOrder.product.name;
    document.getElementById('summaryPrice').textContent = `$${currentOrder.product.price.toFixed(2)}`;
    document.getElementById('summaryQuantity').textContent = currentOrder.quantity;
    document.getElementById('summaryTotal').textContent = `$${currentOrder.totalAmount.toFixed(2)}`;
}

/**
 * Handle order confirmation and send to backend
 */
async function handleOrderConfirmation() {
    if (!currentOrder) {
        showMessage('No order to confirm', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Send order to backend API
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentOrder),
            // 10-second timeout
            signal: AbortSignal.timeout(10000)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Order successful
            showMessage('🎉 Order confirmed! Telegram notification sent successfully.', 'success');
            resetOrderForm();
        } else {
            // Server returned error
            showMessage(`❌ ${result.error.message}`, 'error');
        }
        
    } catch (error) {
        console.error('Order submission error:', error);
        
        // Handle different error types
        if (error.name === 'AbortError') {
            showMessage('❌ Request timeout. Please try again.', 'error');
        } else if (error.name === 'TypeError') {
            showMessage('❌ Network error. Please check your connection.', 'error');
        } else {
            showMessage('❌ Failed to process order. Please try again.', 'error');
        }
    } finally {
        setLoadingState(false);
    }
}

/**
 * Set loading state for the confirm button
 * @param {boolean} loading - Whether to show loading state
 */
function setLoadingState(loading) {
    const btnText = confirmBtn.querySelector('.btn-text');
    const spinner = confirmBtn.querySelector('.loading-spinner');
    
    confirmBtn.disabled = loading;
    
    if (loading) {
        btnText.style.display = 'none';
        spinner.style.display = 'inline';
    } else {
        btnText.style.display = 'inline';
        spinner.style.display = 'none';
    }
}

/**
 * Display a message to the user
 * @param {string} message - Message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Clear previous messages
    messagesSection.innerHTML = '';
    messagesSection.appendChild(messageDiv);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

/**
 * Clear all messages
 */
function clearMessages() {
    messagesSection.innerHTML = '';
}

/**
 * Reset the order form after successful submission
 */
function resetOrderForm() {
    // Reset order state
    currentOrder = null;
    
    // Hide order summary
    orderSummary.style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}