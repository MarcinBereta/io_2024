from datetime import datetime
from flask import Blueprint, request, redirect, flash, send_from_directory
from prisma import Prisma, register
from werkzeug.utils import secure_filename, send_file
import os
import uuid
import csv
import shutil
import json
from stats import data_builder

csv_route = Blueprint('csv', __name__)
STORAGE_CSV = '.\static'
db = Prisma()
register(db)
ALLOWED_EXTENSIONS = {'csv'}
csvs = {}
userID = ""


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
    if v == "" or v is None:
        return [None, "null"]
    try:
        return [float(v), "normal"]
    except ValueError:
        try:
            return [int(v), "normal"]
        except ValueError:
            return [v, "normal"]


def set_column_type(column):
    if all(value['value'] == "" for value in column) or all(value['value'] is None for value in column):
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
            if len(row) == 1:
                rowArr = row[0].split(';')
            else:
                connString =''.join(row)
                rowArr = connString.split(';')
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
        # csvs[fileId] = data


@csv_route.route('/csv', methods=['POST'])
async def upload_csv():
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


@csv_route.route('/csv/<fileId>/data/<colId>', methods=['GET'])
async def get_csv_col(fileId, colId):  # one csv
    try:
        csvFile = csvs[fileId]
    except Exception as e:
        await db.connect()
        try:
            csv_file = await db.csvfile.find_unique(
                where={"id": fileId}
            )
            handle_csv(fileId, csv_file.path, csv_file.name)
            csvFile = csvs[fileId]
        except Exception as e:
            return {"error": "File not found"}, 400
        finally:

            await db.disconnect()
    global userID
    for col in csvFile["cols"]:
        if col["name"] == colId:
            delete_row_null_type(fileId)
            col["details"], col["graphs"] = data_builder.get_data(col["values"], col["type"], col["name"], userID,
                                                                  fileId)
            row_null_type_set(fileId)
            return col
    return {"error": "Column not found"}, 400

@csv_route.route('/csv/<fileId>/data/<colId1>/<colId2>', methods=['GET'])
async def get_csv_cols(fileId, colId1, colId2):
    try:
        csvFile = csvs[fileId]
    except Exception as e:
        await db.connect()
        try:
            csv_file = await db.csvfile.find_unique(
                where={"id": fileId}
            )
            handle_csv(fileId, csv_file.path, csv_file.name)
            csvFile = csvs[fileId]
        except Exception as e:
            return {"error": "File not found"}, 400
        finally:
            await db.disconnect()
    global userID

    found_cols = []
    for col in csvFile["cols"]:
        if col["name"] == colId1 or col["name"] == colId2:
            found_cols.append(col)
            if len(found_cols) == 2:
                delete_row_null_type(fileId)
                pair_obj = {
                    "name": f'{found_cols[0]["name"]}_{found_cols[1]["name"]}"',
                    "type": 'Mixed',
                    "values": [],
                    "details": [],
                    "graphs": []
                }
                pair_obj["details"], pair_obj["graphs"] = data_builder.get_data2d(found_cols[0]["values"],
                                                                                  found_cols[0]["type"],
                                                                                  found_cols[0]["name"],
                                                                                  found_cols[1]["values"],
                                                                                  found_cols[1]["type"],
                                                                                  found_cols[1]["name"], userID, fileId)
                row_null_type_set(fileId)
                return pair_obj


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
            if all(value["value"] is None for value in column["values"]):
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
                if value["value"] is None:
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
                    for value in column["values"]:
                        if value["value"] is None:
                            value["value"] = fixedValue
                            value["type"] = parse_value(value["value"])[1]

                    return csvs[fileId]

    except Exception as e:
        return {"error, column not exist": str(e)}, 400


@csv_route.route('/csv/files/<fileId>/fixes/<columnName>/median', methods=['GET'])
async def update_median(fileId, columnName):
    try:
        for column in csvs[fileId]["cols"]:
            if column["name"] == columnName:
                if column['type'] == "number":
                    values = [float(value["value"]) for value in column["values"] if value["value"] is not None]
                    values.sort()
                    median = values[len(values) // 2] if len(values) % 2 == 1 else (values[len(values) // 2 - 1] +
                                                                                    values[
                                                                                        len(values) // 2]) / 2

                    for value in column["values"]:
                        if value["value"] is None:
                            value["value"] = median
                            value["type"] = parse_value(value["value"])[1]
                    delete_row_null_type(fileId)

                    return csvs[fileId]

    except Exception as e:
        return {"error, column not exist": str(e)}, 400


@csv_route.route('/csv/files/<fileId>/fixes/<columnName>/mostcommon', methods=['GET'])
async def update_most_common(fileId, columnName):
    try:
        for column in csvs[fileId]["cols"]:
            if column["name"] == columnName:
                values = [(value["value"]) for value in column["values"] if value["value"] is not None]
                most_common = ""
                for i in range(len(values)):
                    if values.count(values[i]) > values.count(most_common):
                        most_common = values[i]
                for value in column["values"]:
                    if value["value"] is None:
                        value["value"] = most_common
                        value["type"] = parse_value(value["value"])[1]
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
                    values = [float(value["value"]) for value in column["values"] if value["value"] is not None]
                    avg = sum(values) / len(values)
                    avg = round(avg, 2)
                    for value in column["values"]:
                        if value["value"] is None:
                            value["value"] = avg
                            value["type"] = parse_value(value["value"])[1]
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
                    values = [float(value["value"]) for value in column["values"] if value["value"] is not None]
                    max_value = max(values)
                    min_value = min(values)
                    for value in column["values"]:
                        if value["value"] is not None:
                            value["value"] = (float(value["value"]) - min_value) / (
                                    max_value - min_value)  # normalizacja min-max
                    return csvs[fileId]
                else:
                    return {"error": "Column is not a number type"}, 400
    except Exception as e:
        return {"error, columnd not exist": str(e)}, 400


@csv_route.route('/csv/files/<fileId>/fixes/<columnName>', methods=['PUT'])
async def update_column(fileId, columnName):
    data = request.get_json()
    data['values'] = [parse_value(value)[0] for value in data['values']]
    try:
        for column in csvs[fileId]["cols"]:
            if column["name"] == columnName:
                if "name" in data and (data["name"] not in [col["name"] for col in csvs[fileId]["cols"]] or data[
                    'name'] == columnName):
                    column["name"] = data["name"]
                else:
                    return {"error": f"Column with name '{data['name']}' already exists."}, 409
                for i, value in enumerate(data['values']):
                    column["values"][i]["value"] = parse_value(value)[0]
                    column["values"][i]["type"] = parse_value(value)[1]
                column["type"] = set_column_type(column["values"])

                return csvs[fileId]
        return {"error": "Column not found"}, 400
    except Exception as e:
        return {"error": str(e)}, 400


async def update_file(fileId):
    try:
        await db.connect()
        csv_file = await db.csvfile.find_unique(
            where={"id": fileId}
        )
        try:
            csvs[fileId]
        except Exception as e:
            handle_csv(fileId, csv_file.path, csv_file.name)

        with open(csv_file.path, 'w', newline='', encoding='utf8') as file:
            writer = csv.writer(file, delimiter=';')
            writer.writerow([col['name'] for col in csvs[fileId]['cols']])
            for i in range(len(csvs[fileId]['cols'][0]['values'])):
                writer.writerow(
                    [csvs[fileId]['cols'][j]['values'][i]['value'] for j in range(len(csvs[fileId]['cols']))])
    finally:
        if db.is_connected:
            await db.disconnect()


@csv_route.route('/csv/<fileId>/download', methods=['GET'])
async def download_csv(fileId):
    await update_file(fileId)
    try:
        await db.connect()

        csv_file = await db.csvfile.find_unique(
            where={"id": fileId}
        )
        directory, filename = os.path.split(csv_file.path)
        return send_from_directory(directory, filename, as_attachment=True)
    finally:
        if db.is_connected:
            await db.disconnect()


async def create_sub_file(fileId, columns):
    newFileId = str(uuid.uuid4()) + ".csv"

    try:
        await db.connect()
        csv_file = await db.csvfile.find_unique(
            where={"id": fileId}
        )
        directory, filename = os.path.split(csv_file.path)
        try:
            csvs[fileId]
        except Exception as e:
            handle_csv(fileId, csv_file.path, csv_file.name)

        with open(os.path.join(directory, newFileId), 'w', newline='', encoding='utf8') as file:
            writer = csv.writer(file, delimiter=';')
            writer.writerow([col['name'] for col in csvs[fileId]['cols'] if col['name'] in columns])
            for i in range(len(csvs[fileId]['cols'][0]['values'])):
                valuesToWrite = []
                for j in range(len(csvs[fileId]['cols'])):
                    if csvs[fileId]['cols'][j]['name'] in columns:
                        valuesToWrite.append(csvs[fileId]['cols'][j]['values'][i]['value'])
                writer.writerow(valuesToWrite)
    finally:
        if db.is_connected:
            await db.disconnect()
        return newFileId


@csv_route.route('/csv/<fileId>/downloadSelected', methods=['POST'])
async def download_csv_with_selected(fileId):
    decoded_str = request.data.decode('utf-8')
    obj = json.loads(decoded_str)
    newFileId = await create_sub_file(fileId, obj['selectedColumns'])
    return {"file": newFileId}


@csv_route.route('/csv/<fileId>/downloadSelected/<newFileId>', methods=['GET'])
async def download_csv_with_selected_values(fileId, newFileId):
    try:
        await db.connect()

        csv_file = await db.csvfile.find_unique(
            where={"id": fileId}
        )
        directory, filename = os.path.split(csv_file.path)
        return send_from_directory(directory, newFileId, as_attachment=True)
    finally:
        if db.is_connected:
            await db.disconnect()


@csv_route.route('/csv/<path:graphpath>', methods=['GET'])
def get_graph(graphpath):
    try:
        graphpath = graphpath.replace("/", "\\")
        directory = os.path.join('static', graphpath)

        response = send_file(directory, environ=request.environ)

        response.headers['Cache-Control'] = 'no-cache'
        response.headers['Cache-Control'] = 'max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'

        return response
    except Exception as e:
        return {"error": str(e)}, 400


@csv_route.route('/csv/files/<fileid>/changeType/<columnName>', methods=['POST'])
async def changeType(fileid, columnName):
    try:
        for column in csvs[fileid]["cols"]:
            print(column['name'], columnName)
            if column["name"] == columnName:
                print(column['type'])
                if column["type"] == "number":
                    column["type"] = "text"
                    for value in column["values"]:
                        if value["type"] != "null":
                            value["value"] = str(value["value"])
                elif column["type"] == "text":
                    for value in column["values"]:
                        if value["type"] != "null":
                            try:
                                value["value"] = float(value["value"])
                            except ValueError:
                                return {"error": "Column contains non-numeric values"}, 400
                    column["type"] = "number"
            print(column['type'])
        return {"result": "ok"}
    except Exception as e:
        # print(e)
        return {"error": str(e)}, 400
