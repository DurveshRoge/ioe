# Product Order Telegram System

A simple web application that allows customers to enter their phone number, select from three products, and automatically sends order details to a Telegram bot for processing.

## Features

- 📱 Phone number input with real-time validation
- 🛒 Three product selection with detailed information
- 📋 Automatic order summary generation
- 📨 Instant Telegram notifications via Bot API
- ✅ Order confirmation and error handling
- 📱 Responsive design for mobile and desktop

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API Integration**: Telegram Bot API via Axios
- **Environment**: dotenv for configuration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Telegram Bot

1. Create a new bot by messaging [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the instructions to get your bot token
3. Get your chat ID by messaging your bot and visiting:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```

### 3. Environment Configuration

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file with your Telegram credentials:
   ```env
   TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
   TELEGRAM_CHAT_ID=your_actual_chat_id_here
   PORT=3000
   ```

### 4. Start the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Enter Phone Number**: Input your phone number in the designated field
2. **Select Product**: Choose from one of the three available products
3. **Review Order**: Check the automatically generated order summary
4. **Confirm Order**: Click "Confirm Order" to send notification to Telegram
5. **Receive Confirmation**: Get instant feedback on order status

## API Endpoints

### POST /api/order

Processes a new order and sends Telegram notification.

**Request Body:**
```json
{
  "phoneNumber": "string",
  "product": {
    "name": "string",
    "price": "number",
    "description": "string"
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Order processed successfully",
  "orderId": "ORDER_1234567890",
  "telegram": {
    "success": true,
    "messageId": 123,
    "timestamp": "2023-..."
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message"
  }
}
```

## File Structure

```
├── server.js              # Express server and API endpoints
├── telegramService.js     # Telegram Bot API integration
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── README.md             # This file
└── public/               # Frontend static files
    ├── index.html        # Main HTML structure
    ├── styles.css        # Responsive CSS styling
    └── script.js         # Frontend JavaScript logic
```

## Key Features Explained

### Phone Number Validation
- Real-time validation with visual feedback
- International phone number format support
- Prevents product selection until valid phone is entered

### Product Selection
- Three predefined products with emoji icons
- Automatic order summary generation
- Disabled state when phone number is invalid

### Telegram Integration
- Formatted HTML messages with order details
- Error handling for API failures
- Timeout protection (10 seconds)
- Retry logic for network issues

### Responsive Design
- Mobile-first approach
- Grid layout that adapts to screen size
- Touch-friendly buttons and inputs
- Smooth animations and transitions

## Error Handling

The application includes comprehensive error handling:

- **Frontend**: Network timeouts, validation errors, user feedback
- **Backend**: Missing environment variables, invalid requests, Telegram API errors
- **User Experience**: Clear error messages, loading states, retry options

## Security Considerations

- Environment variables for sensitive credentials
- Input validation and sanitization
- No sensitive data exposed to client-side
- Basic rate limiting protection

## Troubleshooting

### Common Issues

1. **Telegram notifications not working**
   - Verify bot token and chat ID in `.env` file
   - Ensure bot has permission to send messages to the chat
   - Check network connectivity

2. **Phone validation errors**
   - Use international format (with or without +)
   - Ensure number is between 7-16 digits
   - Remove special characters except +, -, (), spaces

3. **Server not starting**
   - Check if port 3000 is available
   - Verify all dependencies are installed
   - Check for syntax errors in configuration

### Development Mode

For development with auto-restart, you can use nodemon:

```bash
npm install -g nodemon
nodemon server.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details