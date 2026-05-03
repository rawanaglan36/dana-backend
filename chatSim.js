const { io } = require('socket.io-client');
const jwt = require('jsonwebtoken');
const readline = require('readline');

// ============================================
// ✏️  FILL THESE IN
// ============================================
const JWT_SECRET = 'YOUR_JWT_SECRET_HERE';
const parentId   = 'PARENT_OBJECT_ID';
const doctorId   = 'DOCTOR_OBJECT_ID';
// ============================================

function createToken(userId, role) {
  return jwt.sign(
    { sub: userId, role, phone: '01000000000' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function createSocket(token, label) {
  return io('http://localhost:3000', {
    auth: { token },
    transports: ['websocket'],
  });
}

// --- Parent Socket ---
const parentSocket = createSocket(createToken(parentId, 'parent'), 'PARENT');

// --- Doctor Socket ---
const doctorSocket = createSocket(createToken(doctorId, 'doctor'), 'DOCTOR');

let parentReady = false;
let doctorReady = false;

// ─── Parent ───────────────────────────────
parentSocket.on('connect', () => {
  console.log('✅ [PARENT] Connected');
  parentSocket.emit('joinRoom', { parentId, doctorId });
});

parentSocket.on('joinRoom', () => {
  console.log('✅ [PARENT] Joined room\n');
  parentReady = true;
  tryStartChat();
});

parentSocket.on('receiveMessage', (data) => {
  const msg = data?.response?.data;
  const from = msg.senderId === parentId ? 'PARENT (you)' : 'DOCTOR';
  console.log(`\n💬 [${from}]: ${msg.message}`);
  if (from !== 'PARENT (you)') promptParent();
});

parentSocket.on('error', (e) => console.log('❌ [PARENT] Error:', e));

// ─── Doctor ───────────────────────────────
doctorSocket.on('connect', () => {
  console.log('✅ [DOCTOR] Connected');
  doctorSocket.emit('joinRoom', { parentId, doctorId });
});

doctorSocket.on('joinRoom', () => {
  console.log('✅ [DOCTOR] Joined room\n');
  doctorReady = true;
  tryStartChat();
});

doctorSocket.on('receiveMessage', (data) => {
  const msg = data?.response?.data;
  const from = msg.senderId === doctorId ? 'DOCTOR (you)' : 'PARENT';
  console.log(`\n💬 [${from}]: ${msg.message}`);
  if (from !== 'DOCTOR (you)') promptDoctor();
});

doctorSocket.on('error', (e) => console.log('❌ [DOCTOR] Error:', e));

// ─── Chat Interface ───────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function tryStartChat() {
  if (!parentReady || !doctorReady) return;

  console.log('═══════════════════════════════════');
  console.log('  Chat started! Type your messages  ');
  console.log('  Ctrl+C to exit                    ');
  console.log('═══════════════════════════════════\n');

  promptParent();
}

function promptParent() {
  rl.question('👨 PARENT: ', (msg) => {
    if (!msg.trim()) return promptParent();
    parentSocket.emit('sendMessage', {
      parentId,
      doctorId,
      message: msg.trim(),
      clientMessageId: `msg-${Date.now()}`,
    });
    setTimeout(promptDoctor, 300);
  });
}

function promptDoctor() {
  rl.question('👨‍⚕️ DOCTOR: ', (msg) => {
    if (!msg.trim()) return promptDoctor();
    doctorSocket.emit('sendMessage', {
      parentId,
      doctorId,
      message: msg.trim(),
      clientMessageId: `msg-${Date.now()}`,
    });
    setTimeout(promptParent, 300);
  });
}

process.on('SIGINT', () => {
  console.log('\n\nClosing chat...');
  parentSocket.disconnect();
  doctorSocket.disconnect();
  rl.close();
  process.exit(0);
});