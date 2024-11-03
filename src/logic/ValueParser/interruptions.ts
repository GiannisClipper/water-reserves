import { PrimaryValueParser, SecondaryValueParser, DifferenceValueParser, ChangeValueParser } from "@/logic/ValueParser";

import type { PrimaryValueParserType, SecondaryValueParserType } from "@/logic/ValueParser";
import type { ObjectType } from "@/types";

class MunicipalityIdValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            // dataset: 'interruptions', # no dataset to operate as join key
            key: 'municipality_id', 
            ...props 
        } );
    }
}

class EventsValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'events', 
            ...props 
        } );

    }
}

class EventsDifferenceValueParser extends DifferenceValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'events',
            key: 'events_difference', 
            ...props 
        } );
    }
}

class EventsChangeValueParser extends ChangeValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'events',
            key: 'events_percentage', 
            ...props 
        } );
    }
}

class MunicipalityNameValueParser extends SecondaryValueParser {
    
    constructor( props: SecondaryValueParserType ) {
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

class MunicipalityAreaValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'area', 
            ...props 
        } );

    }
}

class MunicipalityPopulationValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'population', 
            ...props 
        } );

    }
}

class EventsOverAreaValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'events_over_area', 
            ...props 
        } );

    }
}

class EventsOverPopulationValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'interruptions', 
            key: 'events_over_population', 
            ...props 
        } );

    }
}

class NClustersValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( {
            dataset: 'interruptions', 
            key: 'n_clusters', 
            ...props 
        } );
    }
}

class ClusterValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( {
            dataset: 'interruptions', 
            key: 'cluster', 
            ...props 
        } );
    }
}

export {
    MunicipalityIdValueParser,
    EventsValueParser, 
    EventsDifferenceValueParser,
    EventsChangeValueParser,
    MunicipalityNameValueParser,
    MunicipalityAreaValueParser,
    MunicipalityPopulationValueParser,
    EventsOverAreaValueParser,
    EventsOverPopulationValueParser,
    NClustersValueParser,
    ClusterValueParser,
}