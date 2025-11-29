const SMS_API_URL = import.meta.env.VITE_SMS_API_URL;

export async function sendBulkSms({ phones, text }) {
  if (!SMS_API_URL) {
    throw new Error("SMS_API_URL_NOT_SET");
  }

  const res = await fetch(SMS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phones, text }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.ok) {
    console.error("SMS ERROR:", json);
    throw new Error(json?.error || "sms_failed");
  }

  return json; // { ok: true, result: ... }
}
