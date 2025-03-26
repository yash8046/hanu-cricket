// contactUS.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON data
app.use(express.json());

// Slack Webhook URL
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

// POST route to handle sending messages to Slack
app.post('/api/contactUS', async (req, res) => {
  const { userName, userEmail, Message } = req.body;

  const message = `Contact Hanu:
Name: ${userName}
Email: ${userEmail}
Message: ${Message}
`;

  try {
    const response = await axios.post(SLACK_WEBHOOK_URL, { text: message });
    // Respond to the client with success
    res.status(200).json({
      success: true,
      message: 'Message sent to Slack',
      data: response.data
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: 'Failed to send message to Slack',
      error: error.message
    });
  }
});

// Start server on port 3000 (for local dev)
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
