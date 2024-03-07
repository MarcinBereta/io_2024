"use client";
import { CSVColumnDetailed } from "@/types";
import { BarChart } from "@tremor/react";

const chartdata = [
    {
        name: "Amphibians",
        "Number of threatened species": 2488,
    },
    {
        name: "Birds",
        "Number of threatened species": 1445,
    },
    {
        name: "Crustaceans",
        "Number of threatened species": 743,
    },
    {
        name: "Ferns",
        "Number of threatened species": 281,
    },
    {
        name: "Arachnids",
        "Number of threatened species": 251,
    },
    {
        name: "Corals",
        "Number of threatened species": 232,
    },
    {
        name: "Algae",
        "Number of threatened species": 98,
    },
];

const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

const Visual = ({
    data,
    groupedData,
}: {
    data: CSVColumnDetailed;
    groupedData: {
        name: string;
        count: number;
    }[];
}) => {
    return (
        <div className="flex flex-col w-full h-full items-center">
            <div className="flex flex-row gap-4 flex-wrap w-3/4 justify-center">
                {data.details.map((detail) => {
                    return (
                        <div className="text-white p-8 bg-slate-500 rounded-md">
                            <p>{detail.name}</p>
                            <p>{detail.values as string}</p>
                        </div>
                    );
                })}
            </div>
            <BarChart
                className="h-80 w-full"
                data={groupedData}
                index="name"
                categories={["count"]}
                colors={["blue"]}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
                onValueChange={(v) => console.log(v)}
            />
        </div>
    );
};

export { Visual };
