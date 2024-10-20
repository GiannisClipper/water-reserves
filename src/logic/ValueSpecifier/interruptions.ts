import { PrimaryValueSpecifier, SecondaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType } from "@/logic/ValueSpecifier";
import type { ObjectType } from "@/types";

class MunicipalityIdValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            // dataset: 'interruptions', # no dataset to operate as join key
            key: 'municipality_id', 
            label: 'Municipality', 
            ...props 
        } );
    }
}

class InterruptionsEventsValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'events', 
            label: 'Events', 
            unit: '', 
            ...props 
        } );

    }
}

class InterruptionsDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'events',
            key: 'events_difference', 
            label: 'Difference', 
            unit: '', 
            ...props 
        } );
    }
}

class InterruptionsGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'events',
            key: 'events_percentage', 
            label: 'Change', 
            unit: '%', 
            ...props 
        } );
    }
}

class MunicipalityNameValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'municipality_id',
            key: 'name', 
            label: 'Municipality', 
            unit: '', 
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
            data[ i ][ this.key ] = municipalities[ id ].name_el;
        }
    }
}

class MunicipalityAreaValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'municipality_id',
            key: 'area', 
            label: 'Area (sq. km)', 
            unit: 'km2', 
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
            data[ i ][ this.key ] = municipalities[ id ].area;
        }
    }
}

class MunicipalityPopulationValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'municipality_id',
            key: 'population', 
            label: 'Population (persons)',
            unit: '', 
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
            data[ i ][ this.key ] = municipalities[ id ].population;
        }
    }
}

class InterruptionsOverAreaValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'events',
            key: 'events_over_area', 
            label: 'Events per sq. km', 
            unit: '', 
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
            if ( data[ i ][ this.sourceKey ] === 0 ) {
                continue;
            }

            // calculate interruptions per sq. km

            const events: number = data[ i ][ this.sourceKey ];
            const area: number = municipalities[ data[ i ].municipality_id ].area;
            data[ i ][ this.key ] = events / area;
        }
    }
}

class InterruptionsOverPopulationValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'events',
            key: 'events_over_population', 
            label: 'Events per 1000 residents', 
            unit: '', 
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
            if ( data[ i ][ this.sourceKey ] === 0 ) {
                continue;
            }

            // calculate interruptions per 1000 residents

            const events: number = data[ i ][ this.sourceKey ];
            const population: number = municipalities[ data[ i ].municipality_id ].population;
            data[ i ][ this.key ] = events / ( .001 * population )
        }
    }
}

export {
    MunicipalityIdValueSpecifier,
    InterruptionsEventsValueSpecifier, 
    InterruptionsDifferenceValueSpecifier,
    InterruptionsGrowthValueSpecifier,
    MunicipalityNameValueSpecifier,
    MunicipalityAreaValueSpecifier,
    MunicipalityPopulationValueSpecifier,
    InterruptionsOverAreaValueSpecifier,
    InterruptionsOverPopulationValueSpecifier,
}