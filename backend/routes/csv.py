from flask import Blueprint, request, redirect, flash, url_for, send_from_directory
from prisma.models import CSVFile
from prisma import Prisma, register
from werkzeug.utils import secure_filename
import os
import uuid

csv = Blueprint('csv', __name__)
STORAGE_CSV = '.\static'
db = Prisma()
register(db)
ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@csv.route('/csv', methods=['POST'])
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
            file.save(os.path.join(path, filename.strip(".csv") + "_orignal" + ".csv"))

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
                print(csv_file)
            finally:
                await db.disconnect()

            return {"message": "File uploaded", "fileId": str(unique_fileid)}, 200
@csv.route('/csv/<userId>', methods=['GET'])
async def get_csv(userId):#one csv
    try:
        await db.connect()
        csv_file = await CSVFile.prisma().find_first(
            where={"userId": userId}
        )
        print(csv_file.path.replace('\\','/'))
        return send_from_directory(csv_file.path.replace('\\','/').strip(csv_file.name)[1:], csv_file.name)

    finally:
        await db.disconnect()