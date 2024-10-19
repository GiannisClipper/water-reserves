import { PrimaryValueSpecifier, SecondaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType } from "@/logic/ValueSpecifier";
import type { ObjectType } from "@/types";

class MunicipalityIdValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            // dataset: 'interruptions', # no dataset to operate as join key
            key: 'municipality_id', 
            label: 'Δήμος', 
            ...props 
        } );
    }
}

class InterruptionsPointsValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'points', 
            label: 'Συμβάντα', 
            unit: '', 
            ...props 
        } );

    }
}

class InterruptionsDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'points',
            key: 'points_difference', 
            label: 'Διαφορά', 
            unit: '', 
            ...props 
        } );
    }
}

class InterruptionsGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'points',
            key: 'points_percentage', 
            label: 'Μεταβολή', 
            unit: '%', 
            ...props 
        } );
    }
}

class InterruptionsPopulationValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'points',
            key: 'points_population', 
            label: 'Ανά αριθμό κατοίκων', 
            unit: '', 
            ...props 
        } );
        this.parser = this.defaultParser;
    }

    defaultParser = ( data: ObjectType[], legend: ObjectType | undefined ) => {

        // make municipalities dictionary for quick search

        const municipalities: ObjectType = {}; 
        if ( legend ) {
            for ( const row of legend.municipalities ) {
                municipalities[ row.id ] = row;
            }
        }
        console.log( municipalities )
        for ( let i = 0; i < data.length; i++ ) {
            if ( data[ i ][ this.sourceKey ] === 0 ) {
                continue;
            }

            // calculate population over interruptions

            let population: number = 0;
            if ( municipalities[ data[ i ].municipality_id ] ) {
                population = municipalities[ data[ i ].municipality_id ].population;
            }
            data[ i ][ this.key ] = population / data[ i ][ this.sourceKey ]
        }
    }
}

export {
    MunicipalityIdValueSpecifier,
    InterruptionsPointsValueSpecifier, 
    InterruptionsDifferenceValueSpecifier,
    InterruptionsGrowthValueSpecifier,
    InterruptionsPopulationValueSpecifier,
}