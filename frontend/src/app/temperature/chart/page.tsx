import WidePage from "@/components/wide/Page";
import DataSection from "@/components/wide/chart/DataSection";
import { TEMPERATURE } from "@/app/settings";
import type { SearchParamsType } from "@/types/searchParams";

const endpoint: string = 'temperature';

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    return (
        <WidePage
            subTitle={ TEMPERATURE }
            DataSection={ DataSection }
            endpoint={ endpoint }
            searchParams={ searchParams }
        />
    );
}