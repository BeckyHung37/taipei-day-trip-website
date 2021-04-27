import pymysql
import json

#---------------database-------------------
#python連結mysql資料庫
TAdb = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='becky1qaz2wsx',
    database='TAdb',
)
cursor=TAdb.cursor() #為了執行CRUD操作

#------------------------------------------

# 檔案讀取

# ===========functiin for filter out img with jpg and png==============
def filter_out_png_and_jpg(img_url_list):
    result = ''
    for img_url in img_url_list[1:]: #1: ->代表全部，
        img_file_type = img_url[-3:]
        if img_file_type == 'png' or img_file_type == 'jpg' or img_file_type == 'JPG':
            result = result + 'http' + img_url + ','
        else:
            continue #什麼事都不做，繼續往下跑下一個回圈
    return result    



#將資料放入資料庫
with open('taipei-attractions.json', mode='r', encoding='utf-8') as file:
    #transform into json type
    data=json.load(file)
    attractions_list=data['result']['results']
    #print(len(attractions_list))
    for attraction in attractions_list: #for迴圈必須在with裡面運作
        name = attraction["stitle"]
        category = attraction["CAT2"]
        description = attraction["xbody"]
        address = attraction["address"]
        transport = attraction["info"]
        mrt = attraction["MRT"]
        latitude = attraction["latitude"]
        longitude = attraction["longitude"]
        #圖片的限制
        img = attraction["file"]
        img_url_list = img.split("http")
        #filter image with jpg/png/JPG
        images = filter_out_png_and_jpg(img_url_list=img_url_list)

        #inser in database
        sql_command = "INSERT INTO attractions (name, category, description, address, transport, mrt, latitude, longitude, images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);"
        new_data = (name,category,description,address,transport,mrt,latitude,longitude,images)
        #excute sql command(not commit yet)
        cursor.execute(sql_command, new_data)
        #commit 
        TAdb.commit()
        #close connection with database

            