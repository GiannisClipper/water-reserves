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
}

class TemperatureMeanGrowthValueParser extends GrowthValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'temperature_mean',
            key: 'temperature_mean_percentage', 
            ...props 
        } );
    }
}

class TemperatureMeanRatioValueParser extends RatioValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'temperature_mean',
            key: 'temperature_mean_ratio', 
            ...props 
        } );
    }
}

export {
    TemperatureMinValueParser, 
    TemperatureMeanValueParser, 
    TemperatureMaxValueParser, 
    TemperatureMeanDifferenceValueParser, 
    TemperatureMeanGrowthValueParser, 
    TemperatureMeanRatioValueParser,     
}
