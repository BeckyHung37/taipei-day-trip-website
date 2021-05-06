from flask import * #把flask所有功能import進來
import pymysql
import json
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False

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