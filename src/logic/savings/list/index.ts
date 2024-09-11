import lexicon from "@/logic/lexicon";
import ObjectList from "@/helpers/objects/ObjectList";

const getHeaders = ( responseResult: any ): string[] => {

    let headers: string[] = responseResult && responseResult.headers || [];
    let data: any[][] = responseResult && responseResult.data || [];

    headers.push( 'diff' );
    headers.push( 'percent' );

    const lexList: ObjectList = new ObjectList( lexicon );
    const result: string[] = headers.map( h => {
        const term = lexList.findOne( 'text', h );
        if ( term ) {
            return term.repr;
        }
        return '';
    } );

    return result;
}

export { getHeaders };
