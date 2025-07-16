const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  // IMPORTANT: Replace this with your actual Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "const GOOGLE_SCRIPT_URL = ".netlify/functions/proxy";

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: event.body,
    } );

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Proxy function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to proxy request" }),
    };
  }
};
