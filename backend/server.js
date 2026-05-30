require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const PORT = process.env.PORT || 5000;
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Sheet1';
const CONTACT_HEADERS = [
  'Timestamp',
  'Name',
  'Email',
  'Phone',
  'Message',
  'IP',
  'Location',
  'Device',
];
const LEGACY_HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Message'];
const HEADER_RANGE = `${SHEET_NAME}!A1:H1`;
const DATA_RANGE = `${SHEET_NAME}!A:H`;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://vignesh-dev.in,https://www.vignesh-dev.in')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.set('trust proxy', 1);
app.use(express.json({ limit: '32kb' }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
  })
);

function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY');
  }

  if (!SHEET_ID) {
    throw new Error('Missing GOOGLE_SHEET_ID');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function isEmptyHeaderRow(row) {
  if (!row || row.length === 0) {
    return true;
  }

  return row.every((cell) => !String(cell || '').trim());
}

function normalizeHeader(cell) {
  return String(cell || '').trim().toLowerCase();
}

function headersMatch(row, expectedHeaders) {
  return (
    row.length === expectedHeaders.length &&
    expectedHeaders.every(
      (header, index) => normalizeHeader(row[index]) === header.toLowerCase()
    )
  );
}

function isLegacyHeaders(row) {
  return headersMatch(row, LEGACY_HEADERS);
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || 'Unknown';
}

function isPrivateIp(ip) {
  if (!ip || ip === 'Unknown') {
    return true;
  }

  const normalized = ip.replace('::ffff:', '');

  if (normalized === '127.0.0.1' || normalized === '::1') {
    return true;
  }

  if (normalized.startsWith('192.168.') || normalized.startsWith('10.')) {
    return true;
  }

  const privateClassB = normalized.match(/^172\.(\d+)\./);
  if (privateClassB) {
    const secondOctet = Number(privateClassB[1]);
    if (secondOctet >= 16 && secondOctet <= 31) {
      return true;
    }
  }

  return false;
}

function getDeviceInfo(userAgent) {
  if (!userAgent) {
    return 'Unknown';
  }

  const ua = userAgent.toLowerCase();

  let deviceType = 'Desktop';
  if (/ipad|tablet/.test(ua)) {
    deviceType = 'Tablet';
  } else if (/mobile|android|iphone|ipod/.test(ua)) {
    deviceType = 'Mobile';
  }

  let browser = 'Unknown Browser';
  if (ua.includes('edg/')) {
    browser = 'Edge';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('chrome')) {
    browser = 'Chrome';
  } else if (ua.includes('safari')) {
    browser = 'Safari';
  }

  let os = 'Unknown OS';
  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac os')) {
    os = 'macOS';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (/iphone|ipad|ipod/.test(ua)) {
    os = 'iOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  }

  return `${deviceType} | ${os} | ${browser}`;
}

async function getLocationFromIp(ip) {
  if (isPrivateIp(ip)) {
    return 'Local / Private IP';
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city`,
      { signal: AbortSignal.timeout(4000) }
    );

    if (!response.ok) {
      return 'Unknown';
    }

    const data = await response.json();

    if (data.status !== 'success') {
      return 'Unknown';
    }

    return [data.city, data.regionName, data.country].filter(Boolean).join(', ') || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

async function getRequestMeta(req) {
  const ip = getClientIp(req);
  const device = getDeviceInfo(req.headers['user-agent']);
  const location = await getLocationFromIp(ip);

  return { ip, location, device };
}

async function writeSheetHeaders(sheets) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: HEADER_RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [CONTACT_HEADERS],
    },
  });
}

async function ensureSheetTab(sheets) {
  const { data } = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
    fields: 'sheets.properties.title',
  });

  const tabExists = data.sheets?.some((sheet) => sheet.properties?.title === SHEET_NAME);

  if (tabExists) {
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: { title: SHEET_NAME },
          },
        },
      ],
    },
  });
}

async function ensureSheetHeaders() {
  const sheets = getSheetsClient();

  await ensureSheetTab(sheets);

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: HEADER_RANGE,
  });

  const existingHeaders = data.values?.[0] || [];

  if (headersMatch(existingHeaders, CONTACT_HEADERS)) {
    return;
  }

  if (isEmptyHeaderRow(existingHeaders)) {
    await writeSheetHeaders(sheets);
    return;
  }

  if (isLegacyHeaders(existingHeaders)) {
    await writeSheetHeaders(sheets);
    console.log(`Google Sheet "${SHEET_NAME}" headers upgraded to include IP, Location, Device.`);
    return;
  }

  throw new Error(
    `Sheet "${SHEET_NAME}" row 1 must be empty, legacy headers, or match: ${CONTACT_HEADERS.join(' | ')}`
  );
}

let headersReadyPromise = null;

function prepareSheet() {
  if (!headersReadyPromise) {
    headersReadyPromise = ensureSheetHeaders().catch((error) => {
      headersReadyPromise = null;
      throw error;
    });
  }

  return headersReadyPromise;
}

function getMailTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatIndianDateTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).formatToParts(date);

  const get = (type) => parts.find((part) => part.type === type)?.value || '';

  const day = get('day');
  const month = get('month');
  const year = get('year');
  const hour = get('hour');
  const minute = get('minute');
  const second = get('second');
  const dayPeriod = get('dayPeriod').toLowerCase();

  return `${day}/${month}/${year} ${hour}:${minute}:${second} ${dayPeriod}`;
}

async function sendContactNotification({
  name,
  email,
  phone,
  message,
  ip,
  location,
  device,
  timestamp,
}) {
  const notifyEmail = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER;
  const transporter = getMailTransporter();

  if (!transporter || !notifyEmail) {
    console.warn('Email notification skipped: GMAIL_USER, GMAIL_APP_PASSWORD, or NOTIFY_EMAIL not set.');
    return;
  }

  const subject = `New contact from vignesh-dev.in — ${name}`;

  const text = [
    'New contact form submission',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Message: ${message}`,
    '',
    `IP: ${ip}`,
    `Location: ${location}`,
    `Device: ${device}`,
    `Time: ${timestamp}`,
  ].join('\n');

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    <hr>
    <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
    <p><strong>Location:</strong> ${escapeHtml(location)}</p>
    <p><strong>Device:</strong> ${escapeHtml(device)}</p>
    <p><strong>Time:</strong> ${escapeHtml(timestamp)}</p>
  `;

  await transporter.sendMail({
    from: `"vignesh-dev.in" <${process.env.GMAIL_USER}>`,
    to: notifyEmail,
    replyTo: email,
    subject,
    text,
    html,
  });
}

async function appendContactRow({ name, email, phone, message, ip, location, device }) {
  await prepareSheet();

  const sheets = getSheetsClient();
  const timestamp = formatIndianDateTime();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: DATA_RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[timestamp, name, email, phone, message, ip, location, device]],
    },
  });

  return timestamp;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body || {};

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedMessage) {
    return res.status(400).json({ error: 'Name, email, phone, and message are required.' });
  }

  if (!isValidEmail(trimmedEmail)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (!isValidPhone(trimmedPhone)) {
    return res.status(400).json({ error: 'Invalid phone number.' });
  }

  if (trimmedMessage.length > 5000) {
    return res.status(400).json({ error: 'Message is too long.' });
  }

  try {
    const { ip, location, device } = await getRequestMeta(req);

    const timestamp = await appendContactRow({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      message: trimmedMessage,
      ip,
      location,
      device,
    });

    console.log('Contact form saved to Google Sheet:', {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      ip,
      location,
      device,
      success: true,
    });

    try {
      await sendContactNotification({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        message: trimmedMessage,
        ip,
        location,
        device,
        timestamp,
      });
      console.log('Contact notification email sent.');
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError.message);
    }

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error('Failed to append contact to Google Sheet:', error.message);
    return res.status(500).json({ error: 'Failed to save your message. Please try again later.' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Contact API listening on port ${PORT}`);

  prepareSheet()
    .then(() => {
      console.log(`Google Sheet "${SHEET_NAME}" headers ready.`);
    })
    .catch((error) => {
      console.error('Failed to prepare Google Sheet headers:', error.message);
    });
});
