import WidePage from "@/components/wide/Page";
import DataSection from "@/components/wide/list/DataSection";
import { INTERRUPTIONS } from "@/app/settings";
import type { SearchParamsType } from "@/types/searchParams";

const endpoint: string = 'interruptions';

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    return (
        <WidePage
            subTitle={ INTERRUPTIONS }
            DataSection={ DataSection }
            endpoint={ endpoint }
            searchParams={ searchParams }
        />
    );
}
