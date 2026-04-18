import * as crypto from 'crypto';

export function verifyPaymobHmac(
  query: Record<string, any>,
  hmacSecret: string,
): boolean {
  const receivedHmac = query.hmac;
  if (!receivedHmac) return false;

  // 1. انسخ الـ query من غير hmac
  const data = { ...query };
  delete data.hmac;

  // 2. رتب المفاتيح أبجديًا
  const sortedKeys = Object.keys(data).sort();

  // 3. كوّن string بنفس طريقة Paymob
  const concatenatedString = sortedKeys
    .map((key) => data[key])
    .join('');

  // 4. احسب HMAC
  const calculatedHmac = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenatedString)
    .digest('hex');

  // 5. قارن
  return calculatedHmac === receivedHmac;
}
