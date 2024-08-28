import type { SearchParamsType } from "@/types/searchParams";
import Header from "../Header";
import { CURRENT_STATUS } from "../settings";

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (current-status)..." )

    return (
        <>
        <Header subTitle={CURRENT_STATUS} />
        </>
    );
}

