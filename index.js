const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const APP_ID = '9186b68cc62240b88f8d2f186374d9e5';
const APP_CERTIFICATE = 'f16fffc3b9254c4ebd57fbd97c0e0cc5';
const app = express();

const nocache = (req, resp, next) => {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  next();
};

const generateAccessToken = (req, resp) => {
  resp.header('Access-Control-Allow-Origin', '*');

  const channelName = req.query.channelName;
  if (!channelName) {
    console.error('channelName is required');
    return resp.status(400).json({ 'error': 'channelName is required' });
  }

  let uid = req.query.uid;
  if (!uid || uid === '') {
    uid = 0;
  }

  let role = RtcRole.SUBSCRIBER;
  if (req.query.role === 'publisher') {
    role = RtcRole.PUBLISHER;
  }

  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime === '') {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );

  console.log(`Generated token: ${token}`);
  return resp.json({ 'token': token });
};

app.get('/access_token', nocache, generateAccessToken);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Token server listening at http://localhost:${PORT}`);
});
