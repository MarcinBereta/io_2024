"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useRef } from "react";

const FileForm = () => {
    const user = useCurrentUser();
    const fileRef = useRef<HTMLInputElement>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(e);
        const event = e.target as HTMLInputElement;
        const file = event.files ? event.files[0] : null;
        if (file == null) {
            alert("Please select file");
        }

        if (file?.type != "text/csv") {
            alert("Please select csv file");
            return;
        }
        const form = new FormData();
        form.append("file", file);
        form.append("userId", user?.id || "");
        // const res = await fetch("localhost:4000/files", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     },
        //     body: form,
        // });
    };

    return (
        <div className="flex items-center justify-center">
            <input
                type="file"
                className="sr-only"
                accept=".csv"
                ref={fileRef}
                onChange={handleChange}
            />
            <div
                className="bg-blue-500 text-white p-5 rounded-md cursor-pointer"
                onClick={() => {
                    fileRef.current?.click();
                }}>
                Select file to upload
            </div>
        </div>
    );
};

export { FileForm };
