from flask import * #把flask所有功能import進來
import pymysql
import json
import requests
import hashlib
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False
app.config['SECRET_KEY'] = 'becky'

#將12筆資料放入建立好的list
def get_database_data(cursor,page=0):
    query_list = [] #list()
    start_index = page*12
    end_index = start_index + 12
    index = 0 #因為cursor沒辦法放index查裡面的資料，所以另外弄一個index
    for data in cursor:
        if end_index > index >= start_index:
            _dict = {}
            _dict['id']= data[0]
            _dict['name'] = data[1]
            _dict['category'] = data[2]
            _dict['description'] = data[3]
            _dict['address'] = data[4]
            _dict['transport'] = data[5]
            _dict['mrt'] = data[6]
            _dict['latitude'] = data[7]
            _dict['longitude'] = data[8]
            # img_list = [img_url for img_url in data[9].split(',')[:-1]]
            img_list = []
            for img_url in data[9].split(',')[:-1]:
                img_list.append(img_url) #將新的url加入
            _dict['images'] = img_list
            query_list.append(_dict)
        else:
            pass #什麼事都不做，繼續往下跑（下面還有index = index+1，所以不能用continue)
        index = index+1
    return query_list	

#將資料合成成規定的函式
def add_attraction_info(return_result,query_list):
	return_result['data'] = query_list
	return 	return_result


@app.errorhandler(500)
def error_500(e):
    return jsonify({'error':True,'message':'something wrong with server'}), 500

@app.errorhandler(400)
def error_400(e):
    return jsonify({'error':True,'message':'your index not exist'}), 400	



@app.route("/api/attractions", methods=["GET"])
def get_attration_info():
    page = request.args.get('page') #input第幾頁
    page = int(page) #保險起見轉換成int
    start_index = page*12
    connection = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='Becky1qaz@WSX',
        database='TAdb'
        )
    # 查詢資料庫
    cursor = connection.cursor() 
    keyword = request.args.get('keyword')
    if keyword :
	    #limt {index},12 means get first 12 data ,start with {start_index}
        cursor.execute(f"SELECT * FROM attractions WHERE name LIKE '%{keyword}%';")
    else:
        cursor.execute(f"SELECT * FROM attractions;")
    max_number = cursor.rowcount    
    #從函式get database data()拿取資料
    query_list = get_database_data(cursor,page)
	#關閉資料庫，停止連線
    cursor.close()
    connection.close()
    #合成
    return_result = {}
    if (page+1)*12 > max_number:
        return_result['nextPage'] = None
    else:
        return_result['nextPage'] = page+1
	#使用函式add_attraction_info()合成
    return_result = add_attraction_info(return_result,query_list)
	#用import的flask將資料轉換為json格式
    return_result = jsonify(return_result)

    return return_result

@app.route("/api/attraction/<attractionId>", methods=["GET"])
def get_attration_info_by_id(attractionId):
    attractionId = int(attractionId)
    connection = pymysql.connect(host='127.0.0.1',user='root',password='Becky1qaz@WSX',database='TAdb')
    # 查詢資料庫
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM attractions WHERE id={attractionId};")
    if cursor.rowcount == -1:
        return jsonify({'error':True,'message':'your index not exist'}), 400
    # 列出查詢的資料
    query_list = get_database_data(cursor)
    cursor.close()
    connection.close()
    return_result = {}
    return_result = add_attraction_info(return_result,query_list)
    return_result = jsonify(return_result)

    return return_result

# @app.route("/api/user/", methods=["GET"])
# @app.route("/api/user/error", methods=["GET"])
@app.route("/api/user", methods=['GET','POST','PATCH','DELETE'])
def user_method():
    if request.method == 'POST':
        try:    
            name = request.form['name']
            email = request.form['email']
            pwd = request.form['pwd']
            connection = pymysql.connect(
                host='127.0.0.1',
                user='root',
                password='Becky1qaz@WSX',
                database='TAdb'
            )
            cursor = connection.cursor()
            email_check = cursor.execute(f"SELECT * FROM users WHERE email LIKE '%{email}%';")
            if email_check:
                result = {'error': True,'message' :'此信箱已被他人註冊，請重新輸入'} #傳過去會是json字串
                return jsonify(result),400
            else:
                cursor.execute(f"INSERT INTO users(name, email, password) VALUES ('{name}', '{email}', '{pwd}');")
                connection.commit()
                result = {'ok': True }
                return jsonify(result),200
        except:
            result = {'error': True,'message' :'伺服器錯誤'} #傳過去會是json字串
            return jsonify(result),500

    elif request.method == 'GET':
        signin_email = session['user_signin']
        if signin_email:
            connection = pymysql.connect(
                    host='127.0.0.1',
                    user='root',
                    password='Becky1qaz@WSX',
                    database='TAdb'
                )
            cursor = connection.cursor()
            cursor.execute(f"SELECT * FROM users WHERE email ='{signin_email}';")
            filter_result = cursor.fetchone()
            print(filter_result)
            user_id = filter_result[0]
            user_name = filter_result[1]
            result = {'data':{"id": user_id,"name": user_name,"email":signin_email}}
            return jsonify(result),200
        else:
            result = {'data':None}
            return  jsonify(result),200


    elif request.method == 'PATCH':
        try:    
            email = request.form['email']
            pwd = request.form['pwd']
            connection = pymysql.connect(
                host='127.0.0.1',
                user='root',
                password='Becky1qaz@WSX',
                database='TAdb'
            )
            cursor = connection.cursor()
            cursor.execute(f"SELECT * FROM users WHERE email ='{email}' AND password ='{pwd}';")
            user_check = cursor.fetchone() #用來拿username
            if user_check:
                session["user_signin"]=email
                session["user_name"]=user_check[1]
                print('login_user',user_check[1])
                result = {'ok': True} #傳過去會是json字串
                return jsonify(result),200
            else:
                result = {'error': True,'message' :'登入失敗，帳號或密碼錯誤或其他原因'}
                return jsonify(result),400
        except Exception as e:
            print(e)
            result = {'error': True,'message' :'伺服器錯誤'} #傳過去會是json字串
            return jsonify(result),500
    
    elif request.method == 'DELETE':
        session['user_signin'] = None
        result = {"ok": True}
        return jsonify(result),200

@app.route("/api/booking", methods=['GET','POST','DELETE'])
def booking_api():
    if request.method == 'GET':
        try:
            if not session['user_signin']:
                result = {'error': True,'message' :'未登入系統，拒絕存取'}
                return jsonify(result),403 
            attraction_id = session['attraction_id']
            date = session['date']
            time = session['time']
            price = session['price']
            if not attraction_id or not date or not time or not price:
                result = {'data':None}
                return jsonify(result),200
            connection = pymysql.connect(host='127.0.0.1',user='root',password='Becky1qaz@WSX',database='TAdb')
            cursor = connection.cursor()
            cursor.execute(f"SELECT * FROM attractions WHERE id={attraction_id};")
            filter_result = cursor.fetchone()
            name = filter_result[1]
            address = filter_result[4]
            image = filter_result[9].split(',')[0]
            result = {
                "data": {
                    "attraction": {
                        "id": attraction_id,
                        "name": name,
                        "address": address,
                        "image": image
                        }
                        },
                "date": date,
                "time": time,
                "price": price
            }
            print('booking info',result)
            return jsonify(result),200
        except Exception as e:
            print('get booking error',e)
            result = {'error': True,'message' :'伺服器錯誤'} #傳過去會是json字串
            return jsonify(result),500 

    elif request.method=='POST':
        try:
            if not session['user_signin']:
                result = {'error': True,'message' :'未登入系統，拒絕存取'}
                return jsonify(result),403 
            attraction_id = request.form['attraction_id']
            date = request.form['date']
            time = request.form['time']
            price = request.form['price']
            if not attraction_id or not date or not time or not price:
                result = {'error': True,'message' :'建立失敗，輸入不正確或其他原因'}
                return jsonify(result),400
            session['attraction_id'] = attraction_id
            session['date'] = date
            session['time'] = time
            session['price'] = price
            result = {"ok": True}
            return jsonify(result),200
        except Exception as e:
            print('post booking error',e)
            result = {'error': True,'message' :'伺服器錯誤'} #傳過去會是json字串
            return jsonify(result),500 

    elif request.method == 'DELETE':
        try:
            if not session['user_signin']:
                result = {'error': True,'message' :'未登入系統，拒絕存取'}
                return jsonify(result),403 
            session['attraction_id'] = None
            session['date'] = None
            session['time'] = None
            session['price'] = None
            result = {"ok": True}
            return jsonify(result),200
        except Exception as e:
            print('delete booking error',e)
            result = {'error': True,'message' :'伺服器錯誤'} #傳過去會是json字串
            return jsonify(result),500

@app.route("/api/orders", methods=['POST'])
def order_api():
    if request.method == 'POST':
        if not session['user_signin']:
            result = {'error': True,'message' :'未登入系統，拒絕存取'}
            return jsonify(result),403
        try: 
            request_body = request.get_json(force=True)   
            prime = request_body['prime']
            price = request_body['order']['price']
            attraction_id = request_body['order']['trip']['attraction']['id']
            attraction_name = request_body['order']['trip']['attraction']['name']
            attraction_address = request_body['order']['trip']['attraction']['address']
            attraction_image = request_body['order']['trip']['attraction']['image']
            date = request_body['order']['trip']['date']
            time = request_body['order']['trip']['time']
            contact_email = request_body['order']['contact']['email']
            contact_name = request_body['order']['contact']['name']
            contact_phone = request_body['order']['contact']['phone']
            m = hashlib.md5()
            m.update((contact_email+date+time).encode("utf-8"))
            order_code = m.hexdigest()
            connection = pymysql.connect(
                    host='127.0.0.1',
                    user='root',
                    password='Becky1qaz@WSX',
                    database='TAdb')
            cursor = connection.cursor()
            try:
                cursor.execute(f"INSERT INTO orders(price, attraction_id, attraction_name, attraction_address,attraction_image,date,time,contact_email,contact_name,contact_phone,payment,order_code) \
                            VALUES ('{price}', '{attraction_id}', '{attraction_name}', '{attraction_address}','{attraction_image}','{date}','{time}','{contact_email}','{contact_name}','{contact_phone}','False','{order_code}');")
                connection.commit()
            except:
                result = {
                "error": True,
                "message": "訂單建立失敗，輸入不正確或其他原因"
                }
                return jsonify(result),400
            url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
            data = {
                    "prime": prime,
                    "partner_key": "partner_vx666d8CW3NUodrH15jkbOUx6npaE8f14K9KrzhoOGzw4WqCipbcox2A",
                    "merchant_id": "beckyhung37_TAISHIN",
                    "details":"TapPay Test",
                    "amount": int(price),
                    "cardholder": {
                        "phone_number": contact_phone,
                        "name": contact_name,
                        "email": contact_email,
                    },
                    "remember": True
                    }        
            response = requests.post(url, json=data,headers={"content-type":"application/json","x-api-key":"partner_vx666d8CW3NUodrH15jkbOUx6npaE8f14K9KrzhoOGzw4WqCipbcox2A"})
            print('successful get response')
            print('tappay api return',response.json())
            if response.json()['status'] == 0:
                cursor.execute(f"UPDATE orders SET payment='True' WHERE order_code='{order_code}';")
                connection.commit()
                result = {
                "data": {
                    "number": order_code,
                    "payment": {
                    "status": response.json()['status'],
                    "message": "付款成功"}
                        }
                }
                return jsonify(result),200
            else:
                result = {
                "data": {
                    "number": order_code,
                    "payment": {
                    "status": response.json()['status'],
                    "message": "付款成功"}
                        }
                }
                return jsonify(result),200
        except Exception as e:
            print(e)
            result = {'error': True,'message' :'伺服器錯誤'} #傳過去會是json字串
            return jsonify(result),500

@app.route("/api/order/<orderNumber>", methods=['GET'])
def order_api_by_order_code(orderNumber):
    if request.method == 'GET':
        if not session['user_signin']:
            result = {'error': True,'message' :'未登入系統，拒絕存取'}
            return jsonify(result),403
        connection = pymysql.connect(host='127.0.0.1',user='root',password='Becky1qaz@WSX',database='TAdb')
        cursor = connection.cursor()
        cursor.execute(f"SELECT * FROM orders WHERE order_code={orderNumber};")
        filter_result = cursor.fetchone()
        price = filter_result[1]
        attraction_id = filter_result[2]
        attraction_name = filter_result[3]
        attraction_address = filter_result[4]
        attraction_image = filter_result[5]
        date = filter_result[6]
        time = filter_result[7]
        contact_email = filter_result[8]
        contact_name = filter_result[9]
        contact_phone = filter_result[10]
        payment = filter_result[11]
        order_code = filter_result[12]
        result = {
        "data": {
            "number": order_code,
            "price": int(price),
            "trip": {
            "attraction": {
                "id": attraction_id,
                "name": attraction_name,
                "address": attraction_address,
                "image": attraction_image
            },
            "date": date,
            "time": time
            },
            "contact": {
            "name": contact_name,
            "email": contact_email,
            "phone": contact_phone
            },
            "status": 1
            }
        }
        return jsonify(result),200

















# Pages #不要更動
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.run(port=3000,host='0.0.0.0')