// Product Order Telegram - Express Server
// Main server file that handles static file serving and API endpoints

const express = require('express');
const path = require('path');
require('dotenv').config();
const { sendOrderNotification } = require('./telegramService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Basic logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Order processing API endpoint
app.post('/api/order', async (req, res) => {
    try {
        console.log('Processing new order:', req.body);
        
        // Validate request data
        const { phoneNumber, product } = req.body;
        
        if (!phoneNumber || !product) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Phone number and product are required'
                }
            });
        }

        // Validate phone number format (basic validation)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_PHONE',
                    message: 'Please enter a valid phone number'
                }
            });
        }

        // Validate product data
        if (!product.name || !product.price || !product.description) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_PRODUCT',
                    message: 'Product must have name, price, and description'
                }
            });
        }

        // Create order data structure
        const orderData = {
            phoneNumber: phoneNumber.trim(),
            product: {
                name: product.name,
                price: parseFloat(product.price),
                description: product.description
            },
            quantity: 1, // Always 1 for this implementation
            totalAmount: parseFloat(product.price) * 1
        };

        // Send notification to Telegram
        const telegramResult = await sendOrderNotification(orderData);
        
        // Return success response
        res.json({
            success: true,
            message: 'Order processed successfully',
            orderId: `ORDER_${Date.now()}`,
            telegram: telegramResult
        });

    } catch (error) {
        console.error('Order processing error:', error.message);
        
        // Return error response
        res.status(500).json({
            success: false,
            error: {
                code: 'ORDER_PROCESSING_ERROR',
                message: 'Failed to process order. Please try again.'
            }
        });
    }
});

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: {
            code: 'SERVER_ERROR',
            message: 'Internal server error occurred'
        }
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'API endpoint not found'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Environment variables loaded:', {
        hasBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
        hasChatId: !!process.env.TELEGRAM_CHAT_ID
    });
});

module.exports = app;