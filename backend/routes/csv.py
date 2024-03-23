from datetime import datetime

from flask import Blueprint, request, redirect, flash
from prisma import Prisma, register
from werkzeug.utils import secure_filename
import os
import uuid
import csv
import shutil
from stats import data_builder

csv_route = Blueprint('csv', __name__)
STORAGE_CSV = '.\static'
db = Prisma()
register(db)
ALLOWED_EXTENSIONS = {'csv'}
csvs = {}
"""
/csv/{user}/{id}/data/{zmienna} - PUT update zmiennej do podanej, zwraca nową zmienną  
/csv/{user}/{id}/data/{zmienna}/updateDetail - POST ustawia puste na określoną rzecz z szczegółów np. mediana średnia itp (to co będzie w details[name] 
/csv/files/{userId}/{id}/img/{img} - GET wszystkie wykresy itp
/csv/files/{userId}/{id}/csv/{img} - GET wszystkie csv'ki
"""


def is_float(s):
    if s is None:
        return False
    try:
        float(s)
        return True
    except ValueError:
        return False


def is_int(s):
    if s is None:
        return False

    try:
        int(s)
        return True
    except ValueError:
        return False


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def is_date(string):
    try:
        datetime.strptime(string, "%Y-%m-%d")
        return True
    except ValueError:
        return False

def row_null_type_set(fileId):
    cols = csvs[fileId]["cols"]
    empty_rows = [set() for _ in range(len(cols))]
    i_max = max(len(col["values"]) for col in cols)

    for col_idx, column in enumerate(cols):
        for i, value in enumerate(column["values"]):
            if value["value"] is None:
                empty_rows[col_idx].add(i)

    for i in range(i_max):
        if all(i in empty_rows[col_idx] for col_idx in range(len(cols))):
            for column in cols:
                column["values"][i]["type"] = "row_null"

    return csvs[fileId]
def delete_row_null_type(fileId):
    cols = csvs[fileId]["cols"]
    for column in cols:
        for value in column["values"]:
            if value["type"] == "row_null":
                value["type"] = "null"
    return csvs[fileId]



def parse_value(v):
    if v == "":
        return [None, "null"]
    try:
        return [int(v), "normal"]
    except ValueError:
        try:
            return [float(v), "normal"]
        except ValueError:
            return [v, "normal"]


def set_column_type(column):
    if all(value['value'] == "" for value in column) or all(value['value'] == None for value in column):
        return "col_null"
    elif any(is_float(value['value']) or is_int(value['value']) for value in column):
        return "number"
    else:
        return "text"


def handle_csv(fileId, path, filename):
    with open(path, 'r', encoding="utf8") as csv_file:
        reader = csv.reader(csv_file)
        data = {}
        dataKeys = []
        for i, row in enumerate(reader):
            rowArr = row[0].split(';')
            if i == 0:
                keys = [key for key in rowArr]
                keysParsed = [key.replace(" ", "_").replace("/", "(or)") for key in keys]
                data = {key: [] for key in keysParsed}
                dataKeys = keysParsed
            else:
                for j, key in enumerate(rowArr):
                    parsedValue, valueType = parse_value(key)
                    data[dataKeys[j]].append({
                        "value": parsedValue,
                        "type": valueType
                    })
        csvs[fileId] = {
            "cols": [{
                "name": key,
                "type": set_column_type(data[key]),
                "values": data[key],
                "details": [],
                "graphs": []
            } for key in data],
            "name": filename,
            "id:": fileId
        }
        row_null_type_set(fileId)
        # print(csvs)
        # csvs[fileId] = data


@csv_route.route('/csv', methods=['POST'])
async def upload_csv():
    print(request.headers)
    if 'file' not in request.files or 'userId' not in request.form:
        return {"error": "No file part or no user id provided"}, 400
    else:
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_fileid = str(uuid.uuid4())
            global userID
            userID = request.form['userId']
            path = os.path.join(STORAGE_CSV, request.form['userId'], unique_fileid)
            os.makedirs(path, exist_ok=True)
            file.save(os.path.join(path, filename))
            shutil.copy(os.path.join(path, filename), os.path.join(path, filename.strip('.csv') + "_original" + ".csv"))
            try:
                await db.connect()

                csv_file = await db.csvfile.create(
                    data={
                        "id": unique_fileid,
                        "userId": request.form['userId'],
                        "name": filename,
                        "path": os.path.join(path, filename),
                    }
                )
                returnObject = {
                    "message": "File uploaded",
                    "fileId": unique_fileid
                }
                handle_csv(unique_fileid, os.path.join(path, filename), filename)

                return returnObject, 200
            except Exception as e:
                return {"error": str(e)}, 400
            finally:
                await db.disconnect()

            # return {"message": "File uploaded", "fileId": str(unique_fileid)}, 200


@csv_route.route('/csv/<fileId>', methods=['GET'])
async def get_csv(fileId):  # one csv
    # try:
    # await db.connect()
    # csv_file = await CSVFile.prisma().find_unique(
    #     where={"fileId": fileId}
    # )
    # print(csv_file)
    # print("DATA: ", csvs[fileId])
    try:
        return csvs[fileId]
    except Exception as e:
        await db.connect()
        try:
            csv_file = await db.csvfile.find_unique(
                where={"id": fileId}
            )
            handle_csv(fileId, csv_file.path, csv_file.name)
            return csvs[fileId]
        except:
            return {"error": "File not found"}, 400
        finally:
            await db.disconnect()
    return csvs[fileId]


@csv_route.route('/csv/<fileId>/data/<colId>', methods=['GET'])
async def get_csv_col(fileId, colId):  # one csv
    try:
        csvFile = csvs[fileId]
        print("hm?")
    except Exception as e:
        await db.connect()
        try:
            csv_file = await db.csvfile.find_unique(
                where={"id": fileId}
            )
            handle_csv(fileId, csv_file.path, csv_file.name)
            csvFile = csvs[fileId]
        except:
            return {"error": "File not found"}, 400
        finally:
            await db.disconnect()
    for col in csvFile["cols"]:
        if col["name"] == colId:
            col["details"] = data_builder.get_num_data(col["values"])
            print(col["details"])
            delete_row_null_type(fileId)
            return col


# ex
# finally:
#     await db.disconnect()


@csv_route.route('/csv/<fileId>/data/<columnName>', methods=['GET'])
async def get_column(fileId, columnName):
    try:
        for column in csvs[fileId]["cols"]:
            if column["name"] == columnName:
                return column
        return {"error": "Column not found"}, 400
    except Exception as e:
        return {"error": str(e)}, 400
    finally:
        await db.disconnect()


@csv_route.route('/csv/<fileId>/fixcols', methods=['GET'])
async def fix_cols(fileId):
    try:
        empty_columns = []
        cols = csvs[fileId]["cols"]
        for column in cols:
            if all(value["value"] == None for value in column["values"]):
                empty_columns.append(column)
        for column in empty_columns:
            cols.remove(column)
        row_null_type_set(fileId)
        return csvs[fileId]
    except Exception as e:
        return {"error": str(e)}, 400


@csv_route.route('/csv/<fileId>/fixrows', methods=['GET'])
async def fix_rows(fileId):
    try:
        empty_rows = []
        cols = csvs[fileId]["cols"]
        i_max = 0
        for column in cols:
            empty_rows.append([])
            i = 0
            for value in column["values"]:
                if value["value"] == None:
                    empty_rows[-1].append(i)
                i += 1
            if i > i_max:
                i_max = i
        for i in range(i_max):
            flag = True
            for table in empty_rows:
                if i not in table:
                    flag = False
            if flag:
                for column in cols:
                    column["values"].pop(i)
        return csvs[fileId]
    except Exception as e:
        return {"error": str(e)}, 400


@csv_route.route('/csv/files/<fileId>/fixes/<columnName>/fixed/<fixedValue>', methods=['GET'])
async def update_const(fileId, columnName, fixedValue):
    try:
        for column in csvs[fileId]["cols"]:
            if column["name"] == columnName:

                if column['type'] == "number":
                    fixedValue = float(fixedValue)
                    print(fixedValue)
                    for value in column["values"]:
                        if value["value"] == None:
                            value["value"] = fixedValue
                            value["type"] = parse_value(value["value"])

                    return csvs[fileId]

    except Exception as e:
        return {"error, column not exist": str(e)}, 400



@csv_route.route('/csv/files/<fileId>/fixes/<columnName>/median', methods=['GET'])
async def update_median(fileId, columnName):
    try:
        for column in csvs[fileId]["cols"]:
            if column["name"] == columnName:
                if column['type'] == "number":
                    values = [float(value["value"]) for value in column["values"] if value["value"] != None]
                    values.sort()
                    median = values[len(values) // 2] if len(values) % 2 == 0 else (values[len(values) // 2] + values[len(values) // 2 + 1]) / 2
                    print(median)
                    for value in column["values"]:
                        if value["value"] == None:
                            value["value"] = str(median)
                            value["type"] = parse_value(value["value"])
                    delete_row_null_type(fileId)

                    return csvs[fileId]

    except Exception as e:
        return {"error, column not exist": str(e)}, 400


@csv_route.route('/csv/files/<fileId>/fixes/<columnName>/mostcommon', methods=['GET'])
async def update_most_common(fileId, columnName):
    try:
        for column in csvs[fileId]["cols"]:
            if column["name"] == columnName:
                values = [(value["value"]) for value in column["values"] if value["value"] != None]
                most_common = ""
                for i in range(len(values)):
                    if values.count(values[i]) > values.count(most_common):
                        most_common = values[i]
                for value in column["values"]:
                    if value["value"] is None:
                        value["value"] = str(most_common)
                        value["type"] = parse_value(value["value"])
                delete_row_null_type(fileId)
                return csvs[fileId]

    except Exception as e:
        return {"error, column not exist": str(e)}, 400


@csv_route.route('/csv/files/<fileId>/fixes/<columnName>/average', methods=['GET'])
async def update_avg(fileId, columnName):
    try:
        for column in csvs[fileId]["cols"]:
            if column["name"] == columnName:
                if column['type'] == "number":
                    values = [float(value["value"]) for value in column["values"] if value["value"] != None]
                    avg = sum(values) / len(values)
                    avg = round(avg, 2)
                    for value in column["values"]:
                        print(value["value"], avg)
                        if value["value"] is None:
                            value["value"] = str(avg)
                            value["type"] = parse_value(value["value"])
                    delete_row_null_type(fileId)
                    return csvs[fileId]
                else:
                    return {"error": "Column is not a number type"}, 400
    except Exception as e:
        return {"error, columnd not exist": str(e)}, 400

@csv_route.route('/csv/files/<fileId>/fixes/<columnName>/normalize', methods=['GET'])
async def update_normalize(fileId, columnName):
    try:
        for column in csvs[fileId]["cols"]:
            if column["name"] == columnName:
                if column['type'] == "number":
                    values = [float(value["value"]) for value in column["values"] if value["value"] != None]
                    print(values)
                    max_value = max(values)
                    min_value = min(values)
                    for value in column["values"]:
                        if value["value"] is not None:
                            value["value"] = (float(value["value"]) - min_value) / (max_value - min_value) #normalizacja min-max

                    return csvs[fileId]
                else:
                    return {"error": "Column is not a number type"}, 400
    except Exception as e:
        return {"error, columnd not exist": str(e)}, 400