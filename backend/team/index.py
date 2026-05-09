import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Получение и добавление участников команды BANNDA82"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        cur.execute("SELECT id, name, real_name, role FROM team_members ORDER BY id ASC")
        rows = cur.fetchall()
        members = [{'id': r[0], 'name': r[1], 'real': r[2], 'role': r[3]} for r in rows]
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'members': members})}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        password = body.get('password', '')
        admin_password = os.environ.get('ADMIN_PASSWORD', '')

        if password != admin_password:
            cur.close()
            conn.close()
            return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Неверный пароль'})}

        action = body.get('action', 'add')

        if action == 'check':
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

        if action == 'delete':
            member_id = body.get('id')
            cur.execute("DELETE FROM team_members WHERE id = %s", (member_id,))
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

        name = body.get('name', '').strip()
        real_name = body.get('real', '').strip()
        role = body.get('role', '').strip()

        if not name or not real_name:
            cur.close()
            conn.close()
            return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Заполните имя и псевдоним'})}

        cur.execute(
            "INSERT INTO team_members (name, real_name, role) VALUES (%s, %s, %s) RETURNING id",
            (name, real_name, role)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True, 'id': new_id})}

    cur.close()
    conn.close()
    return {'statusCode': 405, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Method not allowed'})}