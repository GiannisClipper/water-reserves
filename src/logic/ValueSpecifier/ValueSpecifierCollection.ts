import { ValueSpecifier, PrimaryValueSpecifier, SecondaryValueSpecifier, NestedValueSpecifier } from '.';

class ValueSpecifierCollection {

    _specifiers: ValueSpecifier[]

    constructor( specifiers: ValueSpecifier[] ) {
        this._specifiers = specifiers;
    }

    get specifiers(): ValueSpecifier[] {
        return this._specifiers
    }

    getPrimarySpecifiers(): PrimaryValueSpecifier[] {
        return this._specifiers.filter( s => s instanceof PrimaryValueSpecifier );
    }

    getSecondarySpecifiers(): SecondaryValueSpecifier[] {
        return this._specifiers.filter( s => s instanceof SecondaryValueSpecifier );
    }

    getNestedSpecifiers(): NestedValueSpecifier[] {
        return this._specifiers.filter( s => s instanceof NestedValueSpecifier );
    }

    getNotNestedSpecifiers(): ValueSpecifier[] {
        return this._specifiers.filter( s => ! ( s instanceof NestedValueSpecifier ) );
    }

    getByDataset( dataset?: string ): PrimaryValueSpecifier[] { 
        const filter: string | null = dataset || null;
        return  this.getPrimarySpecifiers().filter( s => s.dataset == dataset );
    }  

    getDatasets(): string[] {
        return Array.from( new Set( 
            this.getPrimarySpecifiers().filter( s => s.dataset ).map( s => s.dataset ) 
        ) ) as string[];
    }  

    getByKey( key: string ): ValueSpecifier {
        return this._specifiers.filter( s => s[ 'key' ] === key )[ 0 ];
    }
}

export default ValueSpecifierCollection;
