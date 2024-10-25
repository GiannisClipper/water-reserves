import { ValueParser, PrimaryValueParser, SecondaryValueParser, NestedValueParser } from '.';

class ValueParserCollection {

    _specifiers: ValueParser[]

    constructor( specifiers: ValueParser[] ) {
        this._specifiers = specifiers;
    }

    get specifiers(): ValueParser[] {
        return this._specifiers
    }

    getPrimaryParsers(): PrimaryValueParser[] {
        return this._specifiers.filter( s => s instanceof PrimaryValueParser );
    }

    getSecondaryParsers(): SecondaryValueParser[] {
        return this._specifiers.filter( s => s instanceof SecondaryValueParser );
    }

    getNestedParsers(): NestedValueParser[] {
        return this._specifiers.filter( s => s instanceof NestedValueParser );
    }

    getNotNestedParsers(): ValueParser[] {
        return this._specifiers.filter( s => ! ( s instanceof NestedValueParser ) );
    }

    getByDataset( dataset?: string ): PrimaryValueParser[] { 
        const filter: string | null = dataset || null;
        return  this.getPrimaryParsers().filter( s => s.dataset == dataset );
    }  

    getDatasets(): string[] {
        return Array.from( new Set( 
            this.getPrimaryParsers().filter( s => s.dataset ).map( s => s.dataset ) 
        ) ) as string[];
    }  

    getByKey( key: string ): ValueParser {
        return this._specifiers.filter( s => s[ 'key' ] === key )[ 0 ];
    }
}

export default ValueParserCollection;
