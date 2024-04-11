import { useCurrentUser } from "@/hooks/use-current-user";
import { FileForm } from "./FileForm";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import Link from "next/link";

const Page = async () => {
    // const user = useCurrentUser();
    const session = await auth();
    if (session == null || session.user == null) {
        return (
            <div className="w-full h-full">
                <div className="w-full h-full flex justify-center items-center flex-col">
                    <h1>Not authenticated</h1>
                </div>
            </div>
        );
    }

    const csvFiles = await db.cSVFile.findMany({
        where: {
            userId: session.user.id,
        },
        take: 20,
    });

    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex justify-center items-center flex-col">
                <FileForm />
                {csvFiles.map((file, index) => {
                    return (
                        <Link key={index} href={`/files/${file.id}`}>
                            <div className="text-white p-2">{file.name}</div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
export default Page;
