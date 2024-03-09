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

function shuffle(array: CSVValue[]) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

const generateMockData = () => {
    const rows = 200;
    const csvCol: CSVValue[] = [];

    for (let j = 0; j < rows; j++) {
        const random = Math.floor(Math.random() * 10);
        const randomCount = Math.floor(Math.random() * 50);
        if (random < 2) {
            csvCol.push({
                value: null,
                type: "null",
            });
            continue;
        } else {
            // const text = generateRandomText(20);
            const text = (Math.random() * 10).toFixed(4);
            for (let j = 0; j < randomCount; j++) {
                csvCol.push({
                    value: text,
                    type: "normal",
                });
            }
        }
    }
    const shuffled = shuffle(csvCol);
    const csvDetails: CSVColumnDetailed = {
        name: "Mockdata",
        type: "number",
        values: shuffled,
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

    const sortedData = parsedData.sort((a, b) => b.count - a.count);

    return sortedData;
};

const Page = ({
    params: { fileId, columnId },
}: {
    params: {
        fileId: string;
        columnId: string;
    };
}) => {
    const data = generateMockData();
    const groupedData = groupByData(data);
    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex justify-center items-center">
                <Visual
                    data={data}
                    groupedData={groupedData}
                    title={fileId}
                    col={columnId}
                />
            </div>
        </div>
    );
};
export default Page;
