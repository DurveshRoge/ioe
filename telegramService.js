// Telegram Service Module
// Handles all Telegram Bot API communication for order notifications

const axios = require('axios');

/**
 * Sends order notification to Telegram chat
 * @param {Object} orderData - Order information to send
 * @param {string} orderData.phoneNumber - Customer phone number
 * @param {Object} orderData.product - Product details
 * @param {number} orderData.quantity - Order quantity
 * @param {number} orderData.totalAmount - Total order amount
 * @returns {Promise<Object>} - Telegram API response or error
 */
async function sendOrderNotification(orderData) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Validate environment variables
    if (!botToken || !chatId) {
        throw new Error('Missing Telegram configuration. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.');
    }

    // Format the order message with HTML formatting
    const message = formatOrderMessage(orderData);
    
    // Telegram Bot API URL
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Message payload
    const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
    };

    try {
        console.log('Sending Telegram notification...');
        
        // Send HTTP request to Telegram API with 10-second timeout
        const response = await axios.post(telegramUrl, payload, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Telegram notification sent successfully');
        return {
            success: true,
            messageId: response.data.result.message_id,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Telegram API Error:', error.message);
        
        // Handle different types of errors
        if (error.code === 'ECONNABORTED') {
            throw new Error('Telegram request timeout - please try again');
        } else if (error.response) {
            // Telegram API returned an error
            const telegramError = error.response.data;
            throw new Error(`Telegram API Error: ${telegramError.description || 'Unknown error'}`);
        } else if (error.request) {
            // Network error
            throw new Error('Unable to connect to Telegram - please check your internet connection');
        } else {
            // Other error
            throw new Error(`Failed to send Telegram notification: ${error.message}`);
        }
    }
}

/**
 * Formats order data into a readable Telegram message
 * @param {Object} orderData - Order information
 * @returns {string} - Formatted HTML message
 */
function formatOrderMessage(orderData) {
    const { phoneNumber, product, quantity, totalAmount } = orderData;
    
    return `
🛒 <b>New Order Received!</b>

📱 <b>Customer Phone:</b> ${phoneNumber}
📦 <b>Product:</b> ${product.name}
💰 <b>Price:</b> $${product.price.toFixed(2)}
🔢 <b>Quantity:</b> ${quantity}
💵 <b>Total Amount:</b> $${totalAmount.toFixed(2)}

📝 <b>Description:</b> ${product.description}

⏰ <b>Order Time:</b> ${new Date().toLocaleString()}
    `.trim();
}

module.exports = {
    sendOrderNotification,
    formatOrderMessage
};