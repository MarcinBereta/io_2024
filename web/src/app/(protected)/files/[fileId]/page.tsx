import { CSVCol, CSVFile } from "@/types";
import { DataTable } from "./DataTable";

const generateRandomText = (length: number) => {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return result;
};

const generateMockData = () => {
    const rows = 50;
    const colls = 100;
    const dataType = "text";
    const csvCol: CSVCol[] = [];
    for (let i = 0; i < colls; i++) {
        const col: CSVCol = {
            type: dataType,
            name: generateRandomText(5),
            values: [],
        };
        for (let j = 0; j < rows; j++) {
            const random = Math.floor(Math.random() * 10);
            if (random < 2) {
                col.values.push({
                    value: null,
                    type: "null",
                });
                continue;
            } else {
                col.values.push({
                    value: generateRandomText(20),
                    type: "normal",
                });
            }
        }
        csvCol.push(col);
    }

    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * colls);

    for (let i = 0; i < rows; i++) {
        csvCol[randomCol].values[i].value = null;
        csvCol[randomCol].values[i].type = "col_null";
    }

    for (let i = 0; i < colls; i++) {
        csvCol[i].values[randomRow].value = null;
        csvCol[i].values[randomRow].type = "row_null";
    }
    const CSVData: CSVFile = {
        name: generateRandomText(5),
        id: generateRandomText(5),
        cols: csvCol,
    };
    return CSVData;
};
const Page = async ({
    params: { fileId },
}: {
    params: {
        fileId: string;
    };
}) => {
    // const data = generateMockData();
    const res = await fetch(`http://127.0.0.1:4000/csv/${fileId}`, {
        cache: "no-store",
    });
    const data = (await res.json()) as CSVFile;
    // console.log(data)
    console.log(new Date());
    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex justify-center items-center">
                <DataTable data={data} file={fileId} />
            </div>
        </div>
    );
};
export default Page;
