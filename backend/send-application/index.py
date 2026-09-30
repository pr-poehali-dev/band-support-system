import json
import os
import smtplib
from email.mime.text import MIMEText
import psycopg2

NOTIFY_EMAIL = "bannda82@mail.ru"


def send_notification_email(name: str, contact: str, about: str) -> None:
    password = os.environ.get("MAILRU_SMTP_PASSWORD", "")
    if not password:
        return

    text = (
        f"Новая заявка в BANNDA82\n\n"
        f"Имя: {name}\n"
        f"Контакт: {contact}\n"
        f"О себе: {about or '—'}"
    )
    msg = MIMEText(text, "plain", "utf-8")
    msg["Subject"] = "Новая заявка BANNDA82"
    msg["From"] = NOTIFY_EMAIL
    msg["To"] = NOTIFY_EMAIL

    with smtplib.SMTP_SSL("smtp.mail.ru", 465, timeout=8) as server:
        server.login(NOTIFY_EMAIL, password)
        server.sendmail(NOTIFY_EMAIL, [NOTIFY_EMAIL], msg.as_string())


def handler(event: dict, context) -> dict:
    """Приём заявок на вступление в BANNDA82: сохранение в базу, письмо на почту, просмотр и удаление заявок."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    method = event.get("httpMethod", "GET")

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    if method == "GET":
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

        if action == "delete":
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

        try:
            send_notification_email(name, contact, about)
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
