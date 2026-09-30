import json
import os
import urllib.request
import urllib.error
import psycopg2

TELEGRAM_API = "https://api.telegram.org/bot{token}/sendMessage"
CHAT_ID = "8176067494"


def handler(event: dict, context) -> dict:
    """Приём заявок на вступление в BANNDA82: сохранение в базу, просмотр и удаление заявок админом."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    method = event.get("httpMethod", "GET")
    admin_password = os.environ.get("ADMIN_PASSWORD", "")

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    if method == "GET":
        params = event.get("queryStringParameters") or {}
        password = params.get("password", "")
        if password != admin_password:
            cur.close()
            conn.close()
            return {"statusCode": 403, "headers": cors_headers, "body": json.dumps({"error": "Неверный пароль"})}

        cur.execute("SELECT id, name, contact, about, created_at, status FROM applications ORDER BY id DESC")
        rows = cur.fetchall()
        applications = [
            {
                "id": r[0],
                "name": r[1],
                "contact": r[2],
                "about": r[3],
                "created_at": r[4].isoformat(),
                "status": r[5],
            }
            for r in rows
        ]
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"applications": applications})}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        action = body.get("action", "create")

        if action == "check":
            password = body.get("password", "")
            cur.close()
            conn.close()
            if password != admin_password:
                return {"statusCode": 403, "headers": cors_headers, "body": json.dumps({"error": "Неверный пароль"})}
            return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"ok": True})}

        if action == "delete":
            password = body.get("password", "")
            if password != admin_password:
                cur.close()
                conn.close()
                return {"statusCode": 403, "headers": cors_headers, "body": json.dumps({"error": "Неверный пароль"})}
            app_id = body.get("id")
            cur.execute("DELETE FROM applications WHERE id = %s", (app_id,))
            conn.commit()
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"ok": True})}

        name = body.get("name", "").strip()
        contact = body.get("contact", "").strip()
        about = body.get("about", "").strip()

        if not name or not contact:
            cur.close()
            conn.close()
            return {
                "statusCode": 400,
                "headers": cors_headers,
                "body": json.dumps({"error": "Имя и контакт обязательны"}),
            }

        cur.execute(
            "INSERT INTO applications (name, contact, about) VALUES (%s, %s, %s) RETURNING id",
            (name, contact, about),
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
        if token:
            text = (
                "🎵 *Новая заявка в BANNDA82*\n\n"
                f"👤 *Имя:* {name}\n"
                f"📲 *Контакт:* {contact}\n"
                f"📝 *О себе:* {about or '—'}"
            )
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
            try:
                urllib.request.urlopen(req, timeout=3)
            except Exception:
                pass

        return {
            "statusCode": 200,
            "headers": cors_headers,
            "body": json.dumps({"ok": True, "id": new_id}),
        }

    cur.close()
    conn.close()
    return {"statusCode": 405, "headers": cors_headers, "body": json.dumps({"error": "Method not allowed"})}
