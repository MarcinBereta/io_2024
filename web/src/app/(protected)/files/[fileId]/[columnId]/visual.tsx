"use client";
import { useCompareContext } from "@/components/contexts/ComparissionContext";
import { cn } from "@/lib/utils";
import { CSVColumnDetailed } from "@/types";
import { BarChart } from "@tremor/react";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
const address = "http://192.168.0.127:4000/csv";

const Visual = ({
    data,
    groupedData,
    title,
    col,
}: {
    data: CSVColumnDetailed;
    groupedData: {
        name: string;
        count: number;
    }[];
    title: string;
    col: string;
}) => {
    console.log(data);
    const router = useRouter();
    const compareContext = useCompareContext();
    const [fixedValue, setFixedValue] = useState("");
    const [varName, setVarName] = useState(
        col
            .replace("_", " ")
            .replace("(or)", "/")
            .replace("_", " ")
            .replace("/_", "/ ")
    );
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [values, setValues] = useState(() => {
        return data.values.map((val) => {
            return val.value != null ? (val.value as string) : "";
        });
    });

    let isCompared = false;
    if (compareContext.compares[col]) {
        isCompared = compareContext.compares[col].includes(col);
    }

    let visible = false;
    Object.keys(compareContext.compares).forEach((key) => {
        if (compareContext.compares[key].length > 0) {
            visible = true;
        }
    });

    const generateButtons = (): React.ReactNode[] => {
        const arr: React.ReactNode[] = [];
        if (data.type == "number") {
            arr.push(
                <div
                    key="fix"
                    className="text-white p-3 rounded hover:border-gray-600 text-xl  bg-slate-400  cursor-pointer h-16 flex justify-center items-center"
                    style={{
                        width: "calc(50% - 0.5rem)",
                    }}
                    onClick={async () => {
                        const res = await fetch(
                            `${address}/files/${title}/fixes/${col}/normalize`,
                            {
                                cache: "no-store",
                                method: "GET",
                            }
                        );
                        if (res.status == 200 || res.status == 201)
                            // router.refresh();
                            window.location.reload();
                    }}>
                    Normalize
                </div>
            );
            arr.push(
                <div
                    key="normalize"
                    className="text-white p-3 rounded hover:border-gray-600 text-xl  bg-slate-400  cursor-pointer h-16 flex justify-center items-center"
                    style={{
                        width: "calc(50% - 0.5rem)",
                    }}
                    onClick={async () => {
                        const res = await fetch(
                            `${address}/files/${title}/fixes/${col}/average`,
                            {
                                cache: "no-store",
                            }
                        );
                        if (res.status == 200 || res.status == 201)
                            // router.refresh();
                            window.location.reload();
                    }}>
                    Set average
                </div>
            );
            arr.push(
                <div
                    key="normalize"
                    className="text-white p-3 rounded hover:border-gray-600 text-xl  bg-slate-400  cursor-pointer h-16 flex justify-center items-center"
                    style={{
                        width: "calc(50% - 0.5rem)",
                    }}
                    onClick={async () => {
                        const res = await fetch(
                            `${address}/files/${title}/fixes/${col}/median`,
                            {
                                cache: "no-store",
                                method: "GET",
                            }
                        );
                        if (res.status == 200 || res.status == 201)
                            // router.refresh();
                            window.location.reload();
                    }}>
                    Set median
                </div>
            );
            arr.push(
                <div
                    key="normalize"
                    className="text-white p-3 rounded hover:border-gray-600 text-xl  bg-slate-400 cursor-pointer h-16 flex justify-center items-center"
                    style={{
                        width: "calc(50% - 0.5rem)",
                    }}
                    onClick={async () => {
                        const res = await fetch(
                            `${address}/files/${title}/fixes/${col}/mostcommon`,
                            {
                                cache: "no-store",
                                method: "GET",
                            }
                        );
                        if (res.status == 200 || res.status == 201)
                            // router.refresh();
                            window.location.reload();
                    }}>
                    Set most common value
                </div>
            );
            arr.push(
                <div className="flex flex-row space-x-2  w-full h-16">
                    <input
                        className="bg-slate-500 rounded-md  text-white pl-2"
                        style={{
                            width: "calc(50% - 0.5rem)",
                        }}
                        type="text"
                        placeholder="Set constant value"
                        value={fixedValue}
                        onChange={(e) => setFixedValue(e.target.value)}
                    />
                    <div
                        key="normalize"
                        className="text-white p-2 rounded hover:border-gray-600 text-xl  bg-slate-400 cursor-pointer flex items-center justify-center"
                        style={{
                            width: "calc(50% - 0.5rem)",
                        }}
                        onClick={async () => {
                            const res = await fetch(
                                `${address}/files/${title}/fixes/${col}/fixed/${fixedValue}`,
                                {
                                    cache: "no-store",
                                    method: "GET",
                                }
                            );
                            if (res.status == 200 || res.status == 201)
                                // router.refresh();
                                window.location.reload();
                        }}>
                        Fixed value
                    </div>
                </div>
            );
        } else if (data.type == "text") {
            arr.push(
                <div
                    key="fix"
                    className="text-white p-3 rounded hover:border-gray-600 text-xl  bg-slate-400 cursor-pointer h-16 flex justify-center items-center"
                    style={{
                        width: "calc(50% - 0.5rem)",
                    }}
                    onClick={async () => {
                        const res = await fetch(
                            `${address}/files/${title}/fixes/${col}/normalize`,
                            {
                                cache: "no-store",
                                method: "GET",
                            }
                        );
                        if (res.status == 200 || res.status == 201)
                            window.location.reload();
                    }}>
                    Normalize
                </div>
            );
            arr.push(
                <div
                    key="normalize"
                    className="text-white p-3 rounded hover:border-gray-600 text-xl  bg-slate-400 w-1/2 cursor-pointer h-16 flex justify-center items-center"
                    style={{
                        width: "calc(50% - 0.5rem)",
                    }}
                    onClick={async () => {
                        const res = await fetch(
                            `${address}/files/${title}/fixes/${col}/mostcommon`,
                            {
                                cache: "no-store",
                                method: "GET",
                            }
                        );
                        if (res.status == 200 || res.status == 201)
                            // router.refresh();
                            window.location.reload();
                    }}>
                    Set most common value
                </div>
            );
            arr.push(
                <div className="flex flex-row space-x-2  w-full h-16">
                    <input
                        className="bg-slate-500 rounded-md  text-white pl-2"
                        style={{
                            width: "calc(50% - 0.5rem)",
                        }}
                        type="text"
                        placeholder="Set constant value"
                        value={fixedValue}
                        onChange={(e) => setFixedValue(e.target.value)}
                    />
                    <div
                        key="normalize"
                        className="text-white p-2 rounded hover:border-gray-600 text-xl  bg-slate-400 cursor-pointer flex items-center justify-center"
                        style={{
                            width: "calc(50% - 0.5rem)",
                        }}
                        onClick={async () => {
                            const res = await fetch(
                                `${address}/files/${title}/fixes/${col}/fixed/${fixedValue}`,
                                {
                                    cache: "no-store",
                                    method: "GET",
                                }
                            );
                            if (res.status == 200 || res.status == 201)
                                // router.refresh();
                                window.location.reload();
                        }}>
                        Fixed value
                    </div>
                </div>
            );
        }
        arr.push(
            <div
                key="update"
                className="text-white p-3 rounded hover:border-gray-600 text-xl  bg-slate-400 w-full cursor-pointer h-16 items-center justify-center flex"
                onClick={async () => {
                    const res = await fetch(
                        `${address}/files/${title}/fixes/${col}`,
                        {
                            cache: "no-store",
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name: varName,
                                values: values,
                            }),
                        }
                    );
                    if (res.status == 200 || res.status == 201) {
                        router.push(`/files/${title}/${varName}`);
                        router.refresh();
                    } else if (res.status == 409) {
                        alert("Column name already exists");
                    }
                }}>
                Update
            </div>
        );

        return arr;
    };

    const handleTypeChange = async () => {
        const res = await fetch(`${address}/files/${title}/changeType/${col}`, {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.status == 200 || res.status == 201) {
            router.push(`/files/${title}/${col}`);
            router.refresh();
        } else if (res.status == 409) {
            alert("Column name already exists");
        }
    };

    return (
        <div className="flex flex-col w-full h-full relative gap-5">
            <div className="flex flex-row">
                <div className="flex flex-col text-white w-1/3">
                    <div className=" text-2xl">{title}</div>
                    <input
                        className="text-white bg-transparent hover:border-gray-600 text-xl w-full"
                        type="text"
                        value={varName}
                        onChange={(e) => setVarName(e.target.value)}
                    />
                </div>
                <div className="p-2 m-2 w-2/3">
                    <div className="ml-2 flex-row flex gap-5 w-full justify-around">
                        <button
                            className="w-1/5 text-white p-3 rounded hover:border-gray-600 text-xl  bg-slate-400 "
                            onClick={() => {
                                if (isCompared) {
                                    compareContext.removeCompare(title, col);
                                } else {
                                    compareContext.addCompare(title, col);
                                }
                            }}>
                            {isCompared ? "Remove from compare" : "Compare"}
                        </button>
                        <button
                            className="text-white p-3 rounded hover:border-gray-600 text-xl  bg-slate-400 w-1/5"
                            onClick={() => {
                                compareContext.cleanCompare();
                                setIsCompareOpen(false);
                            }}>
                            Clean compare
                        </button>
                        <button
                            className="text-white p-3 rounded hover:border-gray-600 text-xl  bg-slate-400 w-1/5"
                            onClick={handleTypeChange}>
                            {data.type == "text"
                                ? "Change to numeric"
                                : "Change to categorical"}
                        </button>
                        <button
                            className="w-1/5 text-white p-3 rounded hover:border-gray-600 text-xl bg-slate-400 ml-4"
                            onClick={() => {
                                router.push(`/files/${title}`);
                            }}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-row w-full gap-5">
                <div
                    className=" w-1/4 h-full"
                    style={{ maxHeight: "calc(70vh - 2.5rem)" }}>
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
                                    <input
                                        type="text"
                                        className="bg-transparent text-center w-full"
                                        value={values[index2]}
                                        onChange={(e) => {
                                            const newValues = [...values];
                                            if (data.type == "number") {
                                                if (
                                                    isNaN(
                                                        Number(e.target.value)
                                                    )
                                                ) {
                                                    return;
                                                }
                                            }
                                            newValues[index2] = e.target.value;
                                            setValues(newValues);
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </PerfectScrollbar>
                </div>
                <div className="flex flex-col w-3/4 h-full items-center gap-10">
                    <div className=" flex flex-wrap flex-row gap-2 p-2">
                        {generateButtons()}
                    </div>
                    <div className="flex flex-row gap-4 flex-wrap w-3/4 justify-center">
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
            </div>
            <div className="absolute bottom-2 right-2 bg-slate-700 p-4 rounded-xl">
                <div
                    className="text-white cursor-pointer"
                    onClick={() => {
                        if (visible) setIsCompareOpen(!isCompareOpen);
                    }}>
                    {isCompareOpen ? "Close" : "Open"} Compare
                </div>
                {isCompareOpen ? (
                    <div>
                        <div
                            className={
                                isCompareOpen && visible
                                    ? `flex flex-col border border-white`
                                    : "sr-only border-none "
                            }>
                            {Object.keys(compareContext.compares).map((key) => {
                                return compareContext.compares[key].length >
                                    0 ? (
                                    <div
                                        key={key}
                                        onClick={() => {
                                            let path = "?";
                                            compareContext.compares[
                                                key
                                            ].forEach((val, index) => {
                                                path += `col${
                                                    index + 1
                                                }=${val}&`;
                                            });
                                            path = path.slice(0, -1);
                                            router.push(
                                                `/compare/${title}${path}`
                                            );
                                        }}
                                        className="text-white cursor-pointer p-2 ">
                                        {key}
                                        {compareContext.compares[key].map(
                                            (value) => {
                                                return (
                                                    <div
                                                        key={value}
                                                        className="text-white cursor-pointer pl-5">
                                                        {value}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="flex flex-row flex-wrap text-white justify-center">
                {data.graphs.map((graph, index) => (
                    <Image
                        key={`${graph}_${index}`}
                        src={`http://192.168.0.127:4000/csv/${graph}`}
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
