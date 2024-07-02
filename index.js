const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const port = 3000;

const APP_ID = '9186b68cc62240b88f8d2f186374d9e5';
const APP_CERTIFICATE = 'f16fffc3b9254c4ebd57fbd97c0e0cc5';

app.get('/access_token', (req, res) => {
  console.log('Received request for /access_token');
  const channelName = req.query.channelName;
  if (!channelName) {
    console.log('channelName is required');
    return res.status(400).json({ error: 'channelName is required' });
  }

  const role = RtcRole.SUBSCRIBER;
  const uid = req.query.uid || 0;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  console.log(`Generating token for channelName: ${channelName}, uid: ${uid}, role: ${role}`);

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  console.log(`Generated token: ${token}`);
  return res.json({ token });
});

app.listen(port, () => {
  console.log(`Token server listening at http://localhost:${port}`);
});
