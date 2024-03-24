"use client";
import { cn } from "@/lib/utils";
import { CSVFile } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

const DataTable = ({ data, file }: { data: CSVFile; file: string }) => {
    const router = useRouter();
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const handleClick = async (type: "rows" | "cols") => {
        const res = await fetch(
            `http://127.0.0.1:4000/csv/${file}/fix${type}`,
            {
                cache: "no-store",
            }
        );
        if (res.status == 200 || res.status == 201) {
            router.refresh();
        }
    };

    const handleDownload = async () => {
        const res = await fetch(`http://127.0.0.1:4000/csv/${file}/download`, {
            cache: "no-store",
            method: "GET",
        });
        if (res.status == 200 || res.status == 201) {
            router.replace(res.url);
        }
    };

    const handleDownloadSelectedCols = async () => {
        if (selectedColumns.length == 0) {
            alert("Please select atleast one column to download");
            return;
        }
        const res = await fetch(
            `http://127.0.0.1:4000/csv/${file}/downloadSelected`,
            {
                method: "POST",
                cache: "no-store",
                body: JSON.stringify({
                    selectedColumns,
                }),
            }
        );

        if (res.status == 200 || res.status == 201) {
            const data = await res.json();
            const newFile = await fetch(
                `http://127.0.0.1:4000/csv/${file}/downloadSelected/${data.file}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );
            if (newFile.status == 200 || newFile.status == 201) {
                router.replace(newFile.url);
            }
        }
        // if (res.status == 200 || res.status == 201) {
        //     router.replace(res.url);
        // }
    };

    return (
        <div
            className="m-2 w-full h-full"
            style={{ maxHeight: "calc(70vh - 2.5rem)" }}>
            <div>
                <h1 className="text-3xl text-white">CSV Data</h1>
                <div>
                    <h2 className="text-xl text-white">Name: {data.name}</h2>
                </div>
            </div>
            <div className="flex flex-row justify-around my-2">
                <div
                    className="flex p-2 text-white cursor-pointer bg-slate-500 rounded-2xl"
                    onClick={() => {
                        handleClick("cols");
                    }}>
                    Remove empty columns
                </div>
                <div
                    className="flex p-2 text-white cursor-pointer bg-slate-500 rounded-2xl"
                    onClick={() => {
                        handleClick("rows");
                    }}>
                    Remove empty rows
                </div>
                <div
                    className="flex p-2 text-white cursor-pointer bg-slate-500 rounded-2xl"
                    onClick={handleDownload}>
                    Download file
                </div>
                <div
                    className="flex p-2 text-white cursor-pointer bg-slate-500 rounded-2xl"
                    onClick={handleDownloadSelectedCols}>
                    Download file with selected cols
                </div>
            </div>
            <PerfectScrollbar className="w-full h-full">
                <div className="flex flex-row ml-10 mb-10">
                    {data.cols.map((col, index) => {
                        return (
                            <div
                                key={index}
                                className=" flex flex-col text-white w-auto rounded-e-lg min-w-60">
                                <div className="flex flex-col justify-center items-center  bg-slate-500 border ">
                                    {col.name
                                        .replace("_", " ")
                                        .replace("(or)", "/")
                                        .replace("_", " ")
                                        .replace("/_", "/ ")}
                                    <div
                                        onClick={() => {
                                            if (
                                                selectedColumns.includes(
                                                    col.name
                                                )
                                            ) {
                                                setSelectedColumns(
                                                    selectedColumns.filter(
                                                        (v) => v !== col.name
                                                    )
                                                );
                                            } else {
                                                setSelectedColumns([
                                                    ...selectedColumns,
                                                    col.name,
                                                ]);
                                            }
                                        }}
                                        className="text-white cursor-pointer">
                                        {selectedColumns.includes(col.name)
                                            ? "Remove from selection"
                                            : "Add to selection"}
                                    </div>
                                </div>
                                <div
                                    className="border cursor-pointer h-auto flex flex-col"
                                    onClick={() => {
                                        router.push(
                                            `/files/${file}/${col.name}`
                                        );
                                    }}>
                                    {col.values.map((val, index2) => {
                                        return (
                                            <div
                                                key={index2}
                                                className={cn(
                                                    " whitespace-nowrap overflow-hidden text-ellipsis text-center min-w-20 w-fill min-h-7 text-white hover:bg-slate-200 hover:text-black",
                                                    `${
                                                        val.type == "row_null"
                                                            ? "bg-slate-400"
                                                            : col.type ==
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
