import WidePage from "@/components/wide/Page";
import DataSection from "@/components/wide/chart/DataSection";
import { PRODUCTION } from "@/app/settings";
import type { SearchParamsType } from "@/types/searchParams";

const endpoint: string = 'production';

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    return (
        <WidePage
            subTitle={ PRODUCTION }
            DataSection={ DataSection }
            endpoint={ endpoint }
            searchParams={ searchParams }
        />
    );
}