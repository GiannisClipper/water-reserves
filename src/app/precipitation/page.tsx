import type { SearchParamsType } from "@/types/searchParams";
import Header from "../Header";
import { PRECIPITATION } from "../settings";

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (precipitation)..." )

    return (
        <>
        <Header subTitle={PRECIPITATION} />
        </>
    );
}

