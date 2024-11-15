import WidePage from "@/components/wide/Page";
import DataSection from "@/components/wide/list/DataSection";
import { SAVINGS_PRODUCTION } from "@/app/settings";
import type { SearchParamsType } from "@/types/searchParams";

const endpoint: string = 'savings-production';

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    return (
        <WidePage
            subTitle={ SAVINGS_PRODUCTION }
            DataSection={ DataSection }
            endpoint={ endpoint }
            searchParams={ searchParams }
        />
    );
}
