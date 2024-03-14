"use client";
import { useCompareContext } from "@/components/contexts/ComparissionContext";
import { cn } from "@/lib/utils";
import { CSVColumnDetailed } from "@/types";
import { BarChart } from "@tremor/react";
import { compare } from "bcryptjs";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

const chartdata = [
    {
        name: "Topic 1",
        "Group A": 890,
        "Group B": 338,
        "Group C": 538,
        "Group D": 396,
        "Group E": 138,
        "Group F": 436,
    },
    {
        name: "Topic 2",
        "Group A": 289,
        "Group B": 233,
        "Group C": 253,
        "Group D": 333,
        "Group E": 133,
        "Group F": 533,
    },
    {
        name: "Topic 3",
        "Group A": 380,
        "Group B": 535,
        "Group C": 352,
        "Group D": 718,
        "Group E": 539,
        "Group F": 234,
    },
    {
        name: "Topic 4",
        "Group A": 90,
        "Group B": 98,
        "Group C": 28,
        "Group D": 33,
        "Group E": 61,
        "Group F": 53,
    },
];

const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

const Visual = ({
    data,
    groupedData,
    data2,
    title,
    cols,
}: {
    data: CSVColumnDetailed;
    groupedData: {
        name: string;
        count1: number;
        count2: number;
    }[];
    data2: CSVColumnDetailed;

    title: string;
    cols: string[];
}) => {
    console.log(groupedData);

    return (
        <div
            className="flex flex-col w-full h-full"
            style={{ maxHeight: "calc(80vh - 2.5rem)" }}>
            <div className="flex flex-row justify-center text-white">
                <div className=" text-2xl">{title}</div>
            </div>
            <div className="flex flex-row justify-around m-2">
                {cols.map((col, index) => {
                    return (
                        <div
                            key={index}
                            className="flex flex-row justify-center items-center w-auto min-w-20 bg-slate-500 text-white ">
                            {col}
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-row w-full justify-around">
                <div
                    className=" w-1/4 h-full"
                    style={{ maxHeight: "calc(40vh - 2.5rem)" }}>
                    <PerfectScrollbar>
                        {data.values.map((val, index2) => {
                            return (
                                <div
                                    key={index2}
                                    className={cn(
                                        "flex flex-row justify-center items-center w-auto min-w-20 min-h-7 text-white hover:bg-slate-200 hover:text-black",
                                        `${
                                            val.type == "row_null"
                                                ? "bg-slate-400"
                                                : val.type == "col_null"
                                                ? "bg-slate-500"
                                                : val.type == "null"
                                                ? "bg-slate-700"
                                                : "bg-slate-600"
                                        }`
                                    )}>
                                    {val.value as string}
                                </div>
                            );
                        })}
                    </PerfectScrollbar>
                </div>
                <div
                    className=" w-1/4 h-full"
                    style={{ maxHeight: "calc(40vh - 2.5rem)" }}>
                    <PerfectScrollbar>
                        {data2.values.map((val, index2) => {
                            return (
                                <div
                                    key={index2}
                                    className={cn(
                                        "flex flex-row justify-center items-center w-auto min-w-20 min-h-7 text-white hover:bg-slate-200 hover:text-black",
                                        `${
                                            val.type == "row_null"
                                                ? "bg-slate-400"
                                                : val.type == "col_null"
                                                ? "bg-slate-500"
                                                : val.type == "null"
                                                ? "bg-slate-700"
                                                : "bg-slate-600"
                                        }`
                                    )}>
                                    {val.value as string}
                                </div>
                            );
                        })}
                    </PerfectScrollbar>
                </div>
            </div>
            <div className="w-full flex flex-row p-2">
                <div className="flex flex-row w-2/4 h-full items-center">
                    <div className="flex flex-row gap-4 flex-wrap w-3/4 justify-center">
                        {data.details.map((detail) => {
                            return (
                                <div
                                    key={detail.name}
                                    className="text-white p-8 bg-slate-500 rounded-md">
                                    <p>{detail.name}</p>
                                    <p>{detail.values as string}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col w-2/4 h-full items-center">
                    <div className="flex flex-row gap-4 flex-wrap w-3/4 justify-center">
                        {data2.details.map((detail) => {
                            return (
                                <div
                                    key={detail.name}
                                    className="text-white p-8 bg-slate-500 rounded-md">
                                    <p>{detail.name}</p>
                                    <p>{detail.values as string}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <BarChart
                className="h-80 w-full"
                data={groupedData}
                index="name"
                categories={["count1", "count2"]}
                colors={["blue", "teal"]}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
                onValueChange={(v) => console.log(v)}
            />
        </div>
    );
};

export { Visual };
