import type { SearchParamsType } from "@/types/searchParams";
import Header from "../Header";
import { SAVINGS_PRECIPITATION } from "../settings";

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (savings-precipitation)..." )

    return (
        <>
        <Header subTitle={SAVINGS_PRECIPITATION} />
        </>
    );
}

