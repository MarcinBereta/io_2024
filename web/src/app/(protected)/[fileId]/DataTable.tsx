"use client";
import { cn } from "@/lib/utils";
import { CSVFile } from "@/types";
import PerfectScrollbar from "react-perfect-scrollbar";

const DataTable = ({ data }: { data: CSVFile }) => {
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
                                className=" flex flex-col text-white  w-auto rounded-e-lg cursor-pointer">
                                <div className="flex flex-row justify-center items-center min-w-20 bg-slate-500 border ">
                                    {col.name}
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
                                                {val.value as string}
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
