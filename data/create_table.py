import pymysql
import json
#---------------database-------------------
#python連結mysql資料庫
TAdb = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='Becky1qaz@WSX',
    database='TAdb'
)
cursor=TAdb.cursor() #為了執行CRUD操作

#python新增mysql資料
#create db
# cursor.execute("CREATE DATABASE TAdb")

#---------------  table for attraction  -----------------
# cursor.execute('CREATE TABLE attractions (id INTEGER AUTO_INCREMENT PRIMARY Key,\
#                 name VARCHAR(255), category VARCHAR(255), description TEXT(65532), address VARCHAR(255),\
#                 transport TEXT(65532), mrt VARCHAR(255), latitude VARCHAR(255), longitude VARCHAR(255), images TEXT(65532))')
#--------------------------------------------------------

#---------------  table for user  ---------------------------------
# cursor.execute('CREATE TABLE users (id INTEGER AUTO_INCREMENT PRIMARY Key,\
#                 name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)')
#--------------------------------------------------------