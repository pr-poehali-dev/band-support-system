import json
import os
import urllib.request

TELEGRAM_API = "https://api.telegram.org/bot{token}/sendMessage"
CHAT_ID = "8176067494"


def handler(event: dict, context) -> dict:
    """Принимает заявку на вступление в BANNDA82 и отправляет уведомление в Telegram."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    contact = body.get("contact", "").strip()
    about = body.get("about", "").strip()

    if not name or not contact:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Имя и контакт обязательны"}),
        }

    text = (
        "🎵 *Новая заявка в BANNDA82*\n\n"
        f"👤 *Имя:* {name}\n"
        f"📲 *Контакт:* {contact}\n"
        f"📝 *О себе:* {about or '—'}"
    )

    token = os.environ["TELEGRAM_BOT_TOKEN"]
    payload = json.dumps({
        "chat_id": CHAT_ID,
        "text": text,
        "parse_mode": "Markdown",
    }).encode()

    req = urllib.request.Request(
        TELEGRAM_API.format(token=token),
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    urllib.request.urlopen(req)

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"ok": True}),
    }
