const WebSocket = require('ws');

class SportsBettingApp {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.sportsData = {};
    this.competitionsData = {};
    this.gamesData = {};
    this.currentFilter = 'all';
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.init();
  }

  init() {
    this.connectWebSocket();
  }

  getWebSocketURL() {
    return 'wss://sportsbet.io/graphql';
  }

  connectWebSocket() {
    try {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        return;
      }

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // For testing only

      const wsUrl = this.getWebSocketURL();
      this.socket = new WebSocket(wsUrl, 'graphql-ws', {
        headers: {
          'Origin': 'https://sportsbet.io',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Sec-WebSocket-Version': '13'
        }
      });

      this.socket.on('open', () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.sendInitialCommands();
      });

      this.socket.on('message', (data) => {
        console.log('Raw message:', data.toString());
        try {
          const parsedData = JSON.parse(data.toString());
          this.handleMessage(parsedData);
        } catch (error) {
          this.handleMessage(data.toString());
        }
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
      });

      this.socket.on('close', (event) => {
        console.log('WebSocket closed:', event);
        this.isConnected = false;
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Reconnecting attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
          setTimeout(() => this.connectWebSocket(), this.reconnectDelay);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.showError('WebSocket connection failed. Please restart.');
        }
      });
    } catch (error) {
      console.error('WebSocket init error:', error);
      this.showError('WebSocket connection failed: ' + error.message);
    }
  }

  sendInitialCommands() {
    if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected');
      return;
    }

    const commands = [
      {
        "eventData": { "variables": { "input": {} } },
        "eventName": "connection_init"
      },
      // Add your other subscription commands here (truncated for brevity)
      // Copy the full array from your browser code
    ];

    commands.forEach((cmd, index) => {
      setTimeout(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(cmd));
          console.log(`Sent command ${index + 1}/${commands.length}`);
        }
      }, index * 100); // Stagger sends to avoid overwhelming
    });
  }

  handleMessage(data) {
    console.log('Handled message:', data);
    // Process your sports data here
    // Update this.sportsData, this.competitionsData, etc.
  }

  showError(message) {
    console.error(message);
  }

  // Add other methods like setupFilters() if needed
}

// Start the app
const app = new SportsBettingApp();
console.log('SportsBettingApp started');
