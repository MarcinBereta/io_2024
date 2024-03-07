"use client";
import { cn } from "@/lib/utils";
import { CSVFile } from "@/types";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

const DataTable = ({ data }: { data: CSVFile }) => {
    const [columns, setColumns] = useState<string[]>(() => {
        return data.cols.map((col) => col.name);
    });
    const [values, setValues] = useState<string[][]>(() => {
        const dataSize = data.cols.length;
        const rowSize = data.cols[0].values.length;
        const arr = [];
        for (let i = 0; i < rowSize; i++) {
            const row = [];
            for (let j = 0; j < dataSize; j++) {
                row.push(
                    data.cols[j].values[i] != null
                        ? (data.cols[j].values[i].value as string)
                        : ""
                );
            }
            arr.push(row);
        }
        return arr;
    });
    return (
        <div
            className="m-2 w-full h-full"
            style={{ maxHeight: "calc(80vh - 2.5rem)" }}>
            <PerfectScrollbar className="w-full h-full">
                <div className="flex flex-row ml-2">
                    {data.cols.map((col, index) => {
                        return (
                            <div
                                key={index}
                                className=" flex flex-col text-white  w-auto rounded-e-lg">
                                <div className="flex flex-row justify-center items-center min-w-20 bg-slate-500 border ">
                                    <input
                                        className="bg-transparent"
                                        value={columns[index]}
                                        type="text"
                                        onChange={(e) => {
                                            const newColumns = [...columns];
                                            newColumns[index] = e.target.value;
                                            setColumns(newColumns);
                                        }}
                                    />
                                </div>
                                <div className="border">
                                    {col.values.map((val, index2) => {
                                        return (
                                            <div
                                                key={index2}
                                                className={cn(
                                                    "flex flex-row justify-center items-center w-auto min-w-20 min-h-7 text-white hover:bg-slate-200 hover:text-black",
                                                    `${
                                                        val.type == "row_null"
                                                            ? "bg-slate-400"
                                                            : val.type ==
                                                              "col_null"
                                                            ? "bg-slate-500"
                                                            : val.type == "null"
                                                            ? "bg-slate-700"
                                                            : "bg-slate-600"
                                                    }`
                                                )}>
                                                {values.length > 0 &&
                                                values[0].length > 0 ? (
                                                    <input
                                                        type="text"
                                                        className="bg-transparent"
                                                        value={
                                                            values[index2][
                                                                index
                                                            ]
                                                        }
                                                        onChange={(e) => {
                                                            const newValues = [
                                                                ...values,
                                                            ];
                                                            newValues[index2][
                                                                index
                                                            ] = e.target.value;
                                                            setValues(
                                                                newValues
                                                            );
                                                        }}
                                                    />
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </PerfectScrollbar>
        </div>
    );
};
export { DataTable };
