import type { SearchParamsType } from "@/types/searchParams";
import Header from "../Header";
import { PRODUCTION } from "../settings";

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (production)..." )

    return (
        <>
        <Header subTitle={PRODUCTION} />
        </>
    );
}

