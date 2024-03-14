"use client";
import { cn } from "@/lib/utils";
import { CSVFile } from "@/types";
import { useRouter } from "next/navigation";
import PerfectScrollbar from "react-perfect-scrollbar";

const DataTable = ({ data, file }: { data: CSVFile; file: string }) => {
    const router = useRouter();
    const handleClick = async (type: "rows" | "cols") => {
        const res = await fetch(`http://127.0.0.1:4000/csv/${file}/fix${type}`,{
            cache: "no-store",
        });
        if (res.status == 200 || res.status == 201) {
            console.log("dasjdoqwjdpqd");
            router.refresh();
        }
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
            </div>
            <PerfectScrollbar className="w-full h-full">
                <div className="flex flex-row ml-2">
                    {data.cols.map((col, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    router.push(`/files/${file}/${col.name}`);
                                }}
                                className=" flex flex-col text-white  w-auto rounded-e-lg cursor-pointer">
                                <div className="flex flex-row justify-center items-center min-w-20 bg-slate-500 border ">
                                    {col.name
                                        .replace("_", " ")
                                        .replace("(or)", "/")
                                        .replace("_", " ")
                                        .replace("/_", "/ ")}
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
