from flask import Blueprint, request, redirect, flash, url_for, send_from_directory
from prisma.models import CSVFile
from prisma import Prisma, register
from werkzeug.utils import secure_filename
import os
import uuid
import csv
import shutil

csv_route = Blueprint('csv', __name__)
STORAGE_CSV = '.\static'
db = Prisma()
register(db)
ALLOWED_EXTENSIONS = {'csv'}
csvs = {}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def handle_csv(fileId, path, filename):
    with open(path, 'r', encoding="utf8") as csv_file:
        reader = csv.reader(csv_file)
        data = {}
        dataKeys = []
        for i, row in enumerate(reader):
            rowArr = row[0].split(';')
            if i == 0:
                data = {key: [] for key in rowArr}
                dataKeys = rowArr
            else:
                for j, key in enumerate(rowArr):
                    data[dataKeys[j]].append({
                        "value": key,
                        "type": "normal" if key is not None else "null"
                    })
        csvs[fileId] = {
            "cols": [{
                "name": key,
                "type": "string",
                "values": data[key]
            } for key in data],
            "name": filename,
            "id:": fileId
        }
        print(csvs)
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
            path = os.path.join(STORAGE_CSV, request.form['userId'], unique_fileid)
            os.makedirs(path, exist_ok=True)
            file.save(os.path.join(path, filename))
            shutil.copy(os.path.join(path, filename), os.path.join(path, filename.strip('.csv') + "_original" + ".csv"))
            try:
                await db.connect()
                await CSVFile.prisma().delete_many(
                    where={"userId": request.form['userId']}
                )
                csv_file = await CSVFile.prisma().create(
                    data={
                        "userId": request.form['userId'],
                        "name": filename,
                        "path": os.path.join(path, filename),
                    }
                )

                returnObject = {
                    "message": "File uploaded",
                    "fileId": csv_file.id
                }
                handle_csv(csv_file.id, os.path.join(path, filename), filename)

                return returnObject, 200
            finally:
                await db.disconnect()

            # return {"message": "File uploaded", "fileId": str(unique_fileid)}, 200


@csv_route.route('/csv/<fileId>', methods=['GET'])
async def get_csv(fileId):  # one csv
    try:
        # await db.connect()
        # csv_file = await CSVFile.prisma().find_unique(
        #     where={"fileId": fileId}
        # )
        # print(csv_file)
        return csvs[fileId]

    finally:
        await db.disconnect()


@csv_route.route('/csv/<userId>/<fileId>/edit/fixColls', methods=['POST'])
async def fix_colls(userId, fileId):
    try:
        empty_columns = []
        cols = csvs[fileId]["cols"]
        for column in cols:
            if all(value["value"] == "" for value in column["values"]):
                empty_columns.append(column)
        for column in empty_columns:
            cols.remove(column)
        return csvs[fileId]
    except Exception as e:
        return {"error": str(e)}, 400
