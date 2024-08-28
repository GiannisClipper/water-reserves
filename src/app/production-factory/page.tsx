import type { SearchParamsType } from "@/types/searchParams";
import Header from "../Header";
import { PRODUCTiON_FACTORY } from "../settings";

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (production-factory)..." )

    return (
        <>
        <Header subTitle={PRODUCTiON_FACTORY} />
        </>
    );
}

