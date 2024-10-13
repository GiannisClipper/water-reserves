import { PrimaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType } from "@/logic/ValueSpecifier";

class InterruptionsValueSpecifier extends PrimaryValueSpecifier {

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

export {
    InterruptionsValueSpecifier, 
    InterruptionsDifferenceValueSpecifier, 
    InterruptionsGrowthValueSpecifier,
    MunicipalityIdValueSpecifier,
}