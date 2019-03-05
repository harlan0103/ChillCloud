from flask import Flask, jsonify, request, send_file
from flask_cors import CORS, cross_origin
from functools import wraps
from model import Folder
import peewee
import os
import hashlib
from playhouse.shortcuts import model_to_dict, dict_to_model
# Import itsdangerous package to create salted token
from itsdangerous import (TimedJSONWebSignatureSerializer as URLSafeSerializer, BadSignature, SignatureExpired)
from model import File

app = Flask(__name__)
app.config.from_object('config')

# Since flask using port 5000 and React using port 3000
# We need to connect them
CORS(app)

# This function check if the passed in token is correct
def verify_auth_token(token):
    s = URLSafeSerializer(app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except SignatureExpired:
        return None
    except BadSignature:
        return None
    return 'key' in data and data['key'] == app.config['SECRET_KEY']

# This function check the token value from cookies, header and args
def test_authorization():
    cookies = request.cookies
    header = request.headers
    args = request.args
    token = None

    if 'token' in cookies:
        token = cookies['token']
    elif 'Authorization' in header:
        token = header['Authorization']
    elif 'token' in args:
        token = args['token']
    else:
        return False

    return verify_auth_token(token)

# Wraps function f, each time we first execute the test_authorization() first
def authorization_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        # failed, return 401
        if not test_authorization():
            return jsonify(message='unauthorized'), 401
        return f(*args, **kwargs)
    return wrapper

def generate_filename(folder, filename):
    return hashlib.md5(
                (folder + '_' + filename).encode('utf-8')).hexdigest()

def base36_encode(number):
    assert number >= 0, 'positive integer required'
    if number == 0:
        return '0'
    base36 = []
    while number != 0:
        number, i = divmod(number, 36)
        base36.append('0123456789abcdefghijklmnopqrstuvwxyz'[i])
    return ''.join(reversed(base36))

def generate_url():
    return base36_encode(get_random_long_int())

# This function first check if user entered username and pwd are matching
# Then use URLSafeSerializer to generate a token and return the token
# If login failed, return fail message
@app.route('/login', methods=['POST'])
def index():
    req = request.get_json()
    if req['email'] == app.config['EMAIL'] and req['password'] == app.config['PASSWORD']:
        s = URLSafeSerializer(app.config['SECRET_KEY'], expires_in = 7 * 24 * 3600)
        print("back-end log: " + req['email'] + " is loggin !")
        return jsonify(message = 'ok',
            token = s.dumps({'key': app.config['SECRET_KEY']}).decode('utf-8'))
    else:
        return jsonify(message='unauthorized'), 401


@app.route('/auth', methods=['GET'])
@authorization_required
def auth():
    return jsonify(message='ok')

# This function calls the url/folders with get and post method
# POST method will create a new table with name as request parameter name
# GET method will return all folders as json format
@app.route('/folders', methods = ['GET','POST'])
# TODO @authorization_required
def folders():
    if request.method == 'POST':
        req = request.get_json()
        try:
            f = Folder.create(name = req['name'])
            f.save()
            return jsonify(message = 'ok'), 201
        except peewee.IntegrityError as e:
            return jsonify(message = 'error'), 409
    
    if request.method == 'GET':
        query = Folder.select()
        if(query.exists()):
            return jsonify(message = 'ok', data = [model_to_dict(folder) for folder in query])
        else:
            return jsonify(message = 'ok', data = [])

# This function takes folder_name as paramter of URL/folders/
# The function will first check if database has the selected table name
# GET method will return the instance of the table
# DELETE method will delete the instance of the table
# 注意这里加入了 POST 支持
@app.route('/folders/<folder_name>', methods=['GET','POST', 'DELETE'])
# TODO: @authorization_required
def folder(folder_name):
    try:
        folder = Folder.get(Folder.name==folder_name)
    except peewee.DoesNotExist:
        return jsonify(message='error'), 404

    if request.method == 'POST':
        f = request.files['file']
        if f:
            actual_filename = generate_filename(folder_name, f.filename)
            target_file = os.path.join(os.path.expanduser(app.config['UPLOAD_FOLDER']), actual_filename)
            if os.path.exists(target_file):
                return jsonify(message='error'), 409

            try:
                f.save(target_file)
                f2 = File.create(folder=folder, filename=f.filename)
                f2.save()
            except Exception as e:
                app.logger.exception(e)
                return jsonify(message='error'), 500

            return jsonify(message='OK'), 201

    if request.method == 'GET':
        return jsonify(message='OK', data=model_to_dict(folder, backrefs=True))

    if request.method == 'DELETE':
        try:
            folder.delete_instance()
        except peewee.IntegrityError:
            return jsonify(message='error'), 409
    return jsonify(message='OK')


@app.route('/folders/<folder_name>/<filename>', methods=['GET', 'DELETE'])
# TODO:@authorization_required
def files(folder_name, filename):
    # Get the name path
    actual_filename = generate_filename(folder_name, filename)
    target_file = os.path.join(os.path.expanduser(app.config['UPLOAD_FOLDER']), actual_filename)

    try:
        f = File.get(filename=filename)
    except peewee.DoesNotExist:
        return jsonify(message='error'), 404

    if request.method == 'GET':
        args = request.args

        if 'query' in args and args['query'] == 'info':
            return jsonify(message='OK', data=model_to_dict(f))

        if os.path.exists(target_file):
            return send_file(target_file)
        else:
            return jsonify(message='error'), 404

    if request.method == 'DELETE':
        if os.path.exists(target_file):
            try:

                f.delete_instance()
                os.remove(target_file)
                return jsonify(message='OK')
            except Exception as e:
                app.logger.exception(e)
                return jsonify(message='error'), 500
        else:
            return jsonify(message='error'), 404

if __name__ == '__main__':
    app.run(debug = True)

