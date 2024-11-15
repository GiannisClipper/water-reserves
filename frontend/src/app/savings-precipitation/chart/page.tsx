import WidePage from "@/components/wide/Page";
import DataSection from "@/components/wide/chart/DataSection";
import { SAVINGS_PRECIPITATION } from "@/app/settings";
import type { SearchParamsType } from "@/types/searchParams";

const endpoint: string = 'savings-precipitation';

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    return (
        <WidePage
            subTitle={ SAVINGS_PRECIPITATION }
            DataSection={ DataSection }
            endpoint={ endpoint }
            searchParams={ searchParams }
        />
    );
}