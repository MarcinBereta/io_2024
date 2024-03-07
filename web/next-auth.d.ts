import NextAuth, { DefaultSession } from "next-auth/next";
import { Account, UserSettings } from "@prisma/client";

interface IUser {
    id: string;
    name: string;
    email: string;
    image: string;
    accounts: Account[];
}

declare module "next-auth" {
    interface User extends IUser {}
    interface Session {
        user?: User;
    }
}
declare module "next-auth/jwt" {
    interface JWT extends IUser {}
}
