import type { SearchParamsType } from "@/types/searchParams";
import Header from "../Header";
import { SAVINGS_PRODUCTION } from "../settings";

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (savings-production)..." )

    return (
        <>
        <Header subTitle={SAVINGS_PRODUCTION} />
        </>
    );
}

