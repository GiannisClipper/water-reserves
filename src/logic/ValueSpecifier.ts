import { ObjectType } from "@/types"

interface ValueSpecifierType {
    key?: string
    parser?: CallableFunction
    label?: string
    unit?: string
    chartXY?: string
}

interface PrimaryValueSpecifierType extends ValueSpecifierType {
    isJoinValue?: boolean | undefined
    dataset?: string
    index: number
}

interface SecondaryValueSpecifierType extends ValueSpecifierType {
    sourceKey?: string
}

interface NestedValueSpecifierType extends ValueSpecifierType {
    nestedKey?: string
    nestedValue?: string
}

abstract class ValueSpecifier {

    key: string;
    parser: CallableFunction;
    label: string;
    unit: string;
    chartXY: string;

    constructor( { key, parser, label, unit, chartXY }: ValueSpecifierType ) {
        this.key = key || 'value'
        this.parser = parser || this.defaultParser
        this.label = label || '';
        this.unit = unit || '';
        this.chartXY = chartXY || '';
    }

    defaultParser = ( ( val: any ): any => val )

    toJSON(): ObjectType {
        return {
            key: this.key,
            label: this.label,
            unit: this.unit,
            chartXY: this.chartXY,
        }
    }
}

// promary values: get directly from the http response

abstract class PrimaryValueSpecifier extends ValueSpecifier {

    isJoinValue: boolean;
    dataset: string | undefined;
    index: number;

    constructor( { dataset, index, isJoinValue, ...otherProps }: PrimaryValueSpecifierType ) {
        super( otherProps );
        this.isJoinValue = isJoinValue || false;
        this.dataset = dataset || undefined;
        this.index = index;
    }
}

// secondary values: calculated from primary values

abstract class SecondaryValueSpecifier extends ValueSpecifier {

    sourceKey: string;

    constructor( { sourceKey, ...otherProps }: SecondaryValueSpecifierType ) {
        super( otherProps );
        this.sourceKey = sourceKey || 'value';
    }
}

// nested values: sub values of the same entity, eg. reservoirs, factories, locations
// helpful for the stack charts

abstract class NestedValueSpecifier extends ValueSpecifier {

    nestedKey: string;
    nestedValue: string;

    constructor( { nestedKey, nestedValue, ...otherProps }: NestedValueSpecifierType ) {
        super( otherProps );
        this.nestedKey = nestedKey || 'key';
        this.nestedValue = nestedValue || 'value';
    }
}

abstract class DifferenceValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( arr: ObjectType[] ): ObjectType[] => {
        for ( let i = arr.length - 1; i >= 0; i-- ) {
            if ( i > 0 ) {
                arr[ i ][ this.key ] =  arr[ i ][ this.sourceKey ] - arr[ i - 1 ][ this.sourceKey ];
            } else {
                arr[ i ][ this.key ] = 0;
            }
        }
        return arr;
    }
}

abstract class GrowthValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( arr: ObjectType[] ): ObjectType[] => {

        for ( let i = arr.length - 1; i >= 0; i-- ) {
            if ( i > 0 ) {
                arr[ i ][ this.key ] = Math.round( 
                    ( arr[ i ][ this.sourceKey ] / arr[ i - 1 ][ this.sourceKey ] - 1 ) * 100 
                );
            } else {
                arr[ i ][ this.key ] = 0;
            }
        }
        return arr;
    }
}

abstract class RatioValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( arr: ObjectType[] ): ObjectType[] => {
        const maxVal = Math.max( ...( arr.map( x => x[ this.sourceKey ] ) ) );
        for ( let i = 0; i <= arr.length - 1; i++ ) {
            arr[ i ][ this.key ] /= maxVal; // normalize between 0..1
        }
        return arr;
    }
}

abstract class NestedSumValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( arr: ObjectType[] ): ObjectType[] => {
        // an example for the row structure
        // {
        //     time: "2023",
        //     sum: 1014061531.5,
        //     reservoirs: {
        //         1: { reservoir_id: 1, savings: 45959895.89, percentage: 5 },
        //         2: { reservoir_id: 2, savings: 25926093.15, percentage: 3 },
        //         3: { reservoir_id: 3, savings: 562056767.12, percentage: 55 },
        //         4: { reservoir_id: 4, savings: 380118775.34, percentage: 37 },
        //     }
        // }

        const [ sourceKey, nestedValueKey ] = this.sourceKey.split( '.' );

        for ( let i = arr.length - 1; i >= 0; i-- ) {
            const sum = Object.values( arr[ i ][ sourceKey ] )
                .map( o => o[ nestedValueKey ] )
                .reduce( ( a, b ) => a + b, 0 );
            arr[ i ][ this.key ] =  sum;
        }

        return arr;
    }
}

abstract class NestedPercentageValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( arr: ObjectType[] ): ObjectType[] => {
        // an example for the row structure
        // {
        //     time: "2023",
        //     sum: 1014061531.5,
        //     reservoirs: {
        //         1: { reservoir_id: 1, savings: 45959895.89, percentage: 5 },
        //         2: { reservoir_id: 2, savings: 25926093.15, percentage: 3 },
        //         3: { reservoir_id: 3, savings: 562056767.12, percentage: 55 },
        //         4: { reservoir_id: 4, savings: 380118775.34, percentage: 37 },
        //     }
        // }

        const [ sourceKey, nestedValueKey ] = this.sourceKey.split( '.' );

        for ( let i = arr.length - 1; i >= 0; i-- ) {

            const sum: number = Object.values( arr[ i ][ sourceKey ] )
                .map( o => o[ nestedValueKey ] )
                .reduce( ( a, b ) => a + b, 0 );

            Object.values( arr[ i ][ sourceKey ] )
                .forEach( o => { 
                    o[ this.key ] = Math.round( o[ nestedValueKey ] / sum * 100 );
                } );
        }
        return arr;
    }
}

class TimeValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            key: 'time', 
            isJoinValue: false,
            label: 'Time', 
            ...props 
        } );
    }
}

class SavingsValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'savings', 
            key: 'savings', 
            label: 'Αποθέματα νερού', 
            unit: 'm3', 
            ...props 
        } );
    }
}

class ProductionValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'production', 
            key: 'production', 
            label: 'Παραγωγή νερού', 
            unit: 'm3', 
            ...props 
        } );
    }
}

class PrecipitationValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather', 
            key: 'precipitation', 
            label: 'Ποσότητα υετού', 
            unit: 'mm', 
            ...props 
        } );

    }
}

class SavingsDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'savings', 
            key: 'savings_difference', 
            label: 'Διαφορά', 
            unit: 'm3', 
            ...props 
        } );
    }
}

class ProductionDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'production', 
            key: 'production_difference', 
            label: 'Διαφορά', 
            unit: 'm3', 
            ...props 
        } );
    }
}

class PrecipitationDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'precipitation',
            key: 'precipitation_difference', 
            label: 'Διαφορά', 
            unit: 'mm', 
            ...props 
        } );
    }
}

class SavingsGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'savings',
            key: 'savings_percentage', 
            label: 'Μεταβολή', 
            unit: '%', 
            ...props 
        } );
    }
}

class ProductionGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'production', 
            key: 'production_percentage', 
            label: 'Μεταβολή', 
            unit: '%', 
            ...props 
        } );
    }
}

class PrecipitationGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'precipitation',
            key: 'precipitation_percentage', 
            label: 'Μεταβολή', 
            unit: '%', 
            ...props 
        } );
    }
}

class SavingsRatioValueSpecifier extends RatioValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'savings',
            key: 'savings_ratio', 
            label: 'Αναλογία (0..1)', 
            ...props 
        } );
    }
}

class ProductionRatioValueSpecifier extends RatioValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'production', 
            key: 'production_ratio', 
            label: 'Αναλογία (0..1)', 
            ...props 
        } );
    }
}

class PrecipitationRatioValueSpecifier extends RatioValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'precipitation',
            key: 'precipitation_ratio', 
            label: 'Αναλογία (0..1)', 
            ...props 
        } );
    }
}

class ReservoirIdValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'savings',
            key: 'reservoir_id', 
            label: 'Ταμιευτήρας', 
            ...props 
        } );
    }
}

class FactoryIdValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'production',
            key: 'factory_id', 
            label: 'Μονάδα επεξεργασίας', 
            ...props 
        } );
    }
}

class LocationIdValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather',
            key: 'location_id', 
            label: 'Τοποθεσία', 
            ...props 
        } );
    }
}

class ReservoirsValueSpecifier extends NestedValueSpecifier {

    constructor( props: NestedValueSpecifierType ) {
        super( { 
            nestedKey: 'reservoir_id',
            nestedValue: 'savings',
            key: 'reservoirs', 
            label: 'Ταμιευτήρες', 
            ...props 
        } );
    }
}

class FactoriesValueSpecifier extends NestedValueSpecifier {

    constructor( props: NestedValueSpecifierType ) {
        super( { 
            nestedKey: 'factory_id',
            nestedValue: 'production',
            key: 'factories', 
            label: 'Μονάδες επεξεργασίας', 
            ...props 
        } );
    }
}

class LocationsValueSpecifier extends NestedValueSpecifier {

    constructor( props: NestedValueSpecifierType ) {
        super( { 
            nestedKey: 'location_id',
            nestedValue: 'precipitation',
            key: 'locations', 
            label: 'Τοποθεσίες', 
            ...props 
        } );
    }
}

class ReservoirsSumValueSpecifier extends NestedSumValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'reservoirs.savings',
            key: 'sum', 
            label: 'Σύνολο ταμιευτήρων', 
            unit: 'm3', 
            ...props 
        } );
    }
}

class ReservoirsPercentageValueSpecifier extends NestedPercentageValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'reservoirs.savings',
            key: 'percentage', 
            label: 'Μερίδιο', 
            unit: '%', 
            ...props 
        } );
    }
}

export type { ValueSpecifierType, PrimaryValueSpecifierType, SecondaryValueSpecifierType };

    export {
        ValueSpecifier, PrimaryValueSpecifier, SecondaryValueSpecifier, NestedValueSpecifier,
        TimeValueSpecifier,
        SavingsValueSpecifier, ProductionValueSpecifier, PrecipitationValueSpecifier,
        SavingsDifferenceValueSpecifier, ProductionDifferenceValueSpecifier, PrecipitationDifferenceValueSpecifier,
        SavingsGrowthValueSpecifier, ProductionGrowthValueSpecifier, PrecipitationGrowthValueSpecifier,
        SavingsRatioValueSpecifier, ProductionRatioValueSpecifier, PrecipitationRatioValueSpecifier,
        ReservoirIdValueSpecifier, FactoryIdValueSpecifier, LocationIdValueSpecifier,
        ReservoirsValueSpecifier, FactoriesValueSpecifier, LocationsValueSpecifier,
        ReservoirsSumValueSpecifier, ReservoirsPercentageValueSpecifier
    }