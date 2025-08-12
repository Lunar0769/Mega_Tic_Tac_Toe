// Configuration for different environments
const config = {
  development: {
    websocketUrl: 'ws://localhost:4000'
  },
  production: {
    // You'll need to replace this with your deployed WebSocket server URL
    // Options: Railway, Render, Heroku, or any other WebSocket hosting service
    websocketUrl: 'wss://your-websocket-server.herokuapp.com' // Replace with your actual URL
  }
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];