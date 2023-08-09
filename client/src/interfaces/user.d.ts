import { BaseKey } from "@refinedev/core";
import { ReactNode } from "react";

export interface UserCardProp {
    id?: BaseKey | undefined;
    name: string;
    email: string;
    avatar: string;
    role:string;
}

export interface InfoBarProps {
    icon: ReactNode;
    name: string;
}