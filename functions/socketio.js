const axios = require('axios');

exports.handler = async function(event, context) {
  // Extract the request body from the event object
  console.log('body', event.body);
  const requestBody = JSON.parse(event.body);
  
  
  // Replace 'YOUR_WEBSOCKET_SERVER_URL' with the actual URL of your WebSocket server
//   const websocketServerURL = 'https://your-websocket-server.com';
  const expressServerURL = 'http://localhost:8888/.netlify/functions/server/createPurchase';


  try {
    // Forward the HTTP request to the WebSocket server
    const response = await axios.post(expressServerURL, requestBody);
      console.log('respone', response);
    // Return the response from the WebSocket server
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};