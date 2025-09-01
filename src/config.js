// Configuration for different environments
const config = {
  development: {
    websocketUrl: 'ws://localhost:4000'
  },
  production: {
    // Live WebSocket server on Render
    websocketUrl: 'wss://hypergrid-jpsb.onrender.com'
  }
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];