"use client";
import { cn } from "@/lib/utils";
import { CSVColumnDetailed, CSVCompareDetailed } from "@/types";
import PerfectScrollbar from "react-perfect-scrollbar";
import Image from "next/image";

const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

const Visual = ({
    data,
    data2,
    title,
    cols,
    compare,
}: {
    data: CSVColumnDetailed;
    data2: CSVColumnDetailed;
    title: string;
    cols: string[];
    compare: CSVCompareDetailed;
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
            <div className="w-full flex flex-row p-2 justify-center items-center">
                <div className="flex flex-col w-2/4 h-full items-center justify-center">
                    <div className="flex flex-row gap-4 flex-wrap w-3/4 justify-center items-center ">
                        {compare.details.map((detail) => {
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
            <div className="flex flex-row flex-wrap text-white justify-center">
                {compare.graphs.map((graph, index) => (
                    <Image
                        key={`${graph}_${index}`}
                        src={`http://127.0.0.1:4000/csv/${graph}`}
                        alt={`graph_${index}`}
                        width={600}
                        height={500}
                    />
                ))}
            </div>
        </div>
    );
};

export { Visual };
