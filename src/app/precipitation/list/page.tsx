import WidePage from "@/components/wide/Page";
import DataSection from "@/components/wide/list/DataSection";
import { PRECIPITATION } from "@/app/settings";
import type { SearchParamsType } from "@/types/searchParams";

const endpoint: string = 'precipitation';

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    return (
        <WidePage
            subTitle={ PRECIPITATION }
            DataSection={ DataSection }
            endpoint={ endpoint }
            searchParams={ searchParams }
        />
    );
}
