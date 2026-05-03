const { io } = require('socket.io-client');
const jwt = require('jsonwebtoken');

// ============================================
// ✏️  FILL THESE IN
// ============================================
const JWT_SECRET = 'Kah38fna9283HFbs92nfS8gH28fbA83Hs82NF84ALG72hf';

const MY_USER_ID = '69f6978404a3187020e1b4d9';   // the ID of whoever is testing
const MY_ROLE    = 'parent';              // 'parent' or 'doctor'

const parentId   = '69f6978404a3187020e1b4d9';
const doctorId   = '69eef5b28147366ccd88d47a';
// ============================================

// Generate token
const token = jwt.sign(
  { sub: MY_USER_ID, role: MY_ROLE, phone: '01000000000' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

console.log('Generated Token:', token);
console.log('---');

const socket = io('http://localhost:3000', {
  auth: { token },
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);
  console.log('📤 Joining room...');
  socket.emit('joinRoom', { parentId, doctorId });
});

socket.on('joinRoom', (data) => {
  console.log('✅ Joined Room:', JSON.stringify(data, null, 2));
  console.log('📤 Sending message...');
  socket.emit('sendMessage', {
    parentId,
    doctorId,
    message: 'Hello from test script!',
    clientMessageId: `msg-${Date.now()}`,
  });
});

socket.on('receiveMessage', (data) => {
  console.log('📨 Message Received:', JSON.stringify(data, null, 2));
  socket.disconnect();
});

socket.on('error',         (e) => console.log('❌ Server Error:', e));
socket.on('connect_error', (e) => console.log('❌ Connect Error:', e.message));
socket.on('disconnect',    ()  => console.log('🔌 Disconnected'));

setTimeout(() => {
  console.log('⏰ Timeout — check your secret or server');
  process.exit(1);
}, 10000);