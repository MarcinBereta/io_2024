import { CSVCol, CSVColumnDetailed, CSVFile, CSVValue } from "@/types";
import { Visual } from "./visual";

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
    const rows = 10;
    const csvCol: CSVValue[] = [];

    for (let j = 0; j < rows; j++) {
        const random = Math.floor(Math.random() * 10);
        const randomCount = Math.floor(Math.random() * 20);
        if (random < 2) {
            csvCol.push({
                value: null,
                type: "null",
            });
            continue;
        } else {
            const text = generateRandomText(20);
            for (let j = 0; j < randomCount; j++) {
                csvCol.push({
                    value: text,
                    type: "normal",
                });
            }
        }
    }

    const csvDetails: CSVColumnDetailed = {
        name: "Mockdata",
        type: "string",
        values: csvCol,
        details: [
            {
                name: "test",
                values: "test",
            },
            {
                name: "test2",
                values: "test2",
            },
        ],
        graphs: [],
    };

    return csvDetails;
};

const groupByData = (data: CSVColumnDetailed) => {
    const groupedData: { [key: string]: number } = {};
    data.values.forEach((value) => {
        if (value.type === "null") return;
        if (groupedData.hasOwnProperty(value.value as string)) {
            groupedData[value.value as string] += 1;
        } else {
            groupedData[value.value as string] = 1;
        }
    });

    const parsedData = Object.keys(groupedData).map((key) => {
        return { name: key, count: groupedData[key] };
    });

    return parsedData;
};

const Page = ({
    params: { fieldId, columnId },
    searchParams: { col1, col2 },
}: {
    params: {
        fieldId: string;
        columnId: string;
    };
    searchParams: {
        col1: string;
        col2: string;
    };
}) => {
    const data = generateMockData();
    const groupedData = groupByData(data);
    const data2 = generateMockData();
    const groupedData2 = groupByData(data);
    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex justify-center items-center">
                <Visual
                    data={data}
                    data2={data2}
                    groupedData={groupedData}
                    groupedData2={groupedData2}
                    title={fieldId}
                    cols={[col1, col2]}
                />
            </div>
        </div>
    );
};
export default Page;
