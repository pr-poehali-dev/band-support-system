import json
import os
import uuid
import base64
import boto3


def handler(event: dict, context) -> dict:
    """Управление галереей BANNDA82: получение и загрузка фото в S3"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

    method = event.get('httpMethod', 'GET')
    project_id = os.environ['AWS_ACCESS_KEY_ID']

    if method == 'GET':
        result = s3.list_objects_v2(Bucket='files', Prefix='gallery/')
        photos = []
        for obj in result.get('Contents', []):
            key = obj['Key']
            if key == 'gallery/':
                continue
            url = f"https://cdn.poehali.dev/projects/{project_id}/bucket/{key}"
            photos.append({'key': key, 'url': url})
        photos.sort(key=lambda x: x['key'], reverse=True)
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'photos': photos})}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action', 'upload')

        password = body.get('password', '')
        admin_password = os.environ.get('ADMIN_PASSWORD', '')
        if password != admin_password:
            return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Неверный пароль'})}

        if action == 'delete':
            key = body.get('key', '')
            if not key.startswith('gallery/'):
                return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Неверный ключ'})}
            s3.delete_object(Bucket='files', Key=key)
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

        file_data = body.get('file', '')
        content_type = body.get('content_type', 'image/jpeg')
        if not file_data:
            return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Нет файла'})}

        file_bytes = base64.b64decode(file_data)
        ext = 'jpg' if 'jpeg' in content_type else content_type.split('/')[-1]
        key = f"gallery/{uuid.uuid4()}.{ext}"

        s3.put_object(Bucket='files', Key=key, Body=file_bytes, ContentType=content_type)
        url = f"https://cdn.poehali.dev/projects/{project_id}/bucket/{key}"
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True, 'url': url, 'key': key})}

    return {'statusCode': 405, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Method not allowed'})}
