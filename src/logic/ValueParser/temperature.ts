import { PrimaryValueParser, DifferenceValueParser, GrowthValueParser, RatioValueParser } from "@/logic/ValueParser";

import type { PrimaryValueParserType, SecondaryValueParserType } from "@/logic/ValueParser";

class TemperatureMinValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'weather', 
            key: 'temperature_min', 
            ...props 
        } );

    }
}

class TemperatureMeanValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'weather', 
            key: 'temperature_mean', 
            ...props 
        } );

    }
}

class TemperatureMaxValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'weather', 
            key: 'temperature_max', 
            ...props 
        } );

    }
}

class TemperatureMeanDifferenceValueParser extends DifferenceValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'temperature_mean',
            key: 'temperature_mean_difference', 
            ...props 
        } );
    }

    parse( data: ObjectType[], legend: ObjectType | undefined ) {
        super.parse( data, legend );
        for ( let i = data.length - 1; i >= 0; i-- ) {
            data[ i ][ this.key ] = Math.round( data[ i ][ this.key ] * 10 ) / 10;
        }
    }    
}

class TemperatureMinDifferenceValueParser extends TemperatureMeanDifferenceValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'temperature_min',
            key: 'temperature_min_difference', 
            ...props 
        } );
    }
}

class TemperatureMaxDifferenceValueParser extends TemperatureMeanDifferenceValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'temperature_max',
            key: 'temperature_max_difference', 
            ...props 
        } );
    }
}

// class TemperatureMeanGrowthValueParser extends GrowthValueParser {

//     constructor( props: SecondaryValueParserType ) {
//         super( { 
//             sourceKey: 'temperature_mean',
//             key: 'temperature_mean_percentage', 
//             ...props 
//         } );
//     }
// }

// class TemperatureMeanRatioValueParser extends RatioValueParser {

//     constructor( props: SecondaryValueParserType ) {
//         super( { 
//             sourceKey: 'temperature_mean',
//             key: 'temperature_mean_ratio', 
//             ...props 
//         } );
//     }
// }

export {
    TemperatureMinValueParser, 
    TemperatureMeanValueParser, 
    TemperatureMaxValueParser, 
    TemperatureMinDifferenceValueParser, 
    TemperatureMeanDifferenceValueParser, 
    TemperatureMaxDifferenceValueParser, 
    // TemperatureMeanGrowthValueParser, 
    // TemperatureMeanRatioValueParser,     
}
