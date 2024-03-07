"use client";

import { UserButton } from "@/components/auth/user-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const router = useRouter();

    const user = useCurrentUser();

    return (
        <nav
            className="flex p-2 w-full justify-center flex-row shadow-sm border-b-2 border-sky-500 "
            style={{ height: "90px" }}>
            <div
                className="text-white text-lg flex justify-start align-middle gap-x-2 gap-y-5 pl-5 w-1/4 items-center cursor-pointer"
                onClick={() => {
                    router.push("/");
                }}>
                Data explorer
            </div>
            <div className="flex gap-x-4 justify-end w-3/4 items-center text-white">
                Hello: {user?.name}
                <div>
                    <UserButton />
                </div>
            </div>
        </nav>
    );
};
