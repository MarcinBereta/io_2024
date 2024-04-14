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
                values: Math.floor(Math.random() * 100),
            },
            {
                name: "test2",
                values: Math.floor(Math.random() * 100),
            },
        ],
        graphs: [],
    };

    return csvDetails;
};

const Page = async ({
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
    const res = await fetch(
        `http://127.0.0.1:4000/csv/${fieldId}/data/${col1}`,
        {
            cache: "no-store",
            method: "GET",
        }
    );
    const data = await res.json();

    const res2 = await fetch(
        `http://127.0.0.1:4000/csv/${fieldId}/data/${col2}`,
        {
            cache: "no-store",
            method: "GET",
        }
    );
    const data2 = await res2.json();

    const res3 = await fetch(
        `http://127.0.0.1:4000/csv/${fieldId}/data/${col1}/${col2}`,
        {
            cache: "no-store",
            method: "GET",
        }
    );
    console.log(res3)
    let data23 = await res3.text();

    // Zamień "Infinity" na null
    data23 = data23.replace(/Infinity/g, 'null');

   let data3 = JSON.parse(data23);

    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex justify-center items-center">
                <Visual
                    data={data}
                    data2={data2}
                    title={fieldId}
                    cols={[col1, col2]}
                    compare={data3}
                />
            </div>
        </div>
    );
};
export default Page;
