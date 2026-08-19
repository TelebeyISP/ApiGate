const express = require('express');
const axios = require('axios');

const router = express.Router();

function apigateBase() {
  const url = process.env.APIGATE_URL || 'http://localhost:4000';
  if (!/^https?:\/\//i.test(url)) {
    throw new Error('APIGATE_URL must be an http(s) URL');
  }
  return url.replace(/\/$/, '');
}

async function proxy(path, res) {
  const APIGATE_URL = apigateBase();
  try {
    const response = await axios.get(`${APIGATE_URL}${path}`, {
      timeout: 4000,
      validateStatus: () => true,
      maxRedirects: 0,
    });
    return res.status(response.status).json({
      connected: response.status < 500,
      apigate: APIGATE_URL,
      data: response.data,
    });
  } catch (error) {
    return res.status(503).json({
      connected: false,
      apigate: APIGATE_URL,
      error: error.message,
    });
  }
}

router.get('/health', (_req, res) => proxy('/health', res));
router.get('/network', (_req, res) => proxy('/open5gs/status', res));

module.exports = router;
