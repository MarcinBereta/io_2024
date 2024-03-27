"use client";
import { useCompareContext } from "@/components/contexts/ComparissionContext";
import { cn } from "@/lib/utils";
import { CSVColumnDetailed } from "@/types";
import { BarChart } from "@tremor/react";
import { compare } from "bcryptjs";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

const Visual = ({
    data,
    groupedData,
    data2,
    title,
    cols,
}: // graphs, temporary removed
{
    data: CSVColumnDetailed;
    groupedData: {
        name: string;
        count1: number;
        count2: number;
    }[];
    data2: CSVColumnDetailed;

    title: string;
    cols: string[];
    // graphs: string[]; temporary removed
}) => {
    return (
        <div className="flex flex-col w-full h-full ">
            <div className="flex flex-row justify-center text-white">
                <div className=" text-2xl">{title}</div>
            </div>
            <div className="flex flex-row justify-around m-2">
                {cols.map((col, index) => {
                    return (
                        <div
                            key={index}
                            className="flex flex-row justify-center items-center w-auto min-w-20 bg-slate-500 text-white p-3 rounded-xl">
                            {col}
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-row w-full justify-around bg-black">
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
                    className=" w-1/4 h-full "
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
                <div className="flex flex-row w-2/4 h-full items-center justify-center">
                    <div className="flex flex-row gap-4 flex-wrap w-3/4 justify-center ">
                        {data.details.map((detail) => {
                            return (
                                <div
                                    key={detail.name}
                                    className="text-white p-8 bg-slate-500 rounded-md w-1/4 flex items-center justify-center flex-col">
                                    <b>{detail.name}</b>
                                    <p>{detail.values as string}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col w-2/4 h-full items-center justify-center">
                    <div className="flex flex-row gap-4 flex-wrap w-3/4 justify-center items-center ">
                        {data2.details.map((detail) => {
                            return (
                                <div
                                    key={detail.name}
                                    className="text-white p-8 bg-slate-500 rounded-md w-1/4 flex items-center justify-center flex-col">
                                    <b>{detail.name}</b>
                                    <p>{detail.values as string}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {groupedData.length == 0 ? null : (
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
            )}
        </div>
    );
};

export { Visual };
