import { PrimaryValueSpecifier, SecondaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType } from "@/logic/ValueSpecifier";
import type { ObjectType } from "@/types";

class MunicipalityIdValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            // dataset: 'interruptions', # no dataset to operate as join key
            key: 'municipality_id', 
            ...props 
        } );
    }
}

class EventsValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'events', 
            ...props 
        } );

    }
}

class EventsDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'events',
            key: 'events_difference', 
            ...props 
        } );
    }
}

class EventsGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'events',
            key: 'events_percentage', 
            ...props 
        } );
    }
}

class MunicipalityNameValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'municipality_id',
            key: 'name', 
            ...props 
        } );
        this.parser = this.defaultParser;
    }

    defaultParser = ( data: ObjectType[], legend: ObjectType | undefined ) => {

        // make municipalities dictionary for quick search

        const municipalities: ObjectType = {}; 
        if ( legend && Object.keys( legend ).length ) {
            for ( const row of legend.municipalities ) {
                municipalities[ row.id ] = row;
            }
        }
        for ( let i = 0; i < data.length; i++ ) {
            const id: string = data[ i ][ this.sourceKey ];
            data[ i ][ this.key ] = municipalities[ id ].name_en;
        }
    }
}

class MunicipalityAreaValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'area', 
            ...props 
        } );

    }
}

class MunicipalityPopulationValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'population', 
            ...props 
        } );

    }
}

class EventsOverAreaValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'events_over_area', 
            ...props 
        } );

    }
}

class EventsOverPopulationValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'events_over_population', 
            ...props 
        } );

    }
}

class ClusterValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( {
            dataset: 'interruptions', 
            key: 'cluster', 
            ...props 
        } );
    }
}

export {
    MunicipalityIdValueSpecifier,
    EventsValueSpecifier, 
    EventsDifferenceValueSpecifier,
    EventsGrowthValueSpecifier,
    MunicipalityNameValueSpecifier,
    MunicipalityAreaValueSpecifier,
    MunicipalityPopulationValueSpecifier,
    EventsOverAreaValueSpecifier,
    EventsOverPopulationValueSpecifier,
    ClusterValueSpecifier,
}