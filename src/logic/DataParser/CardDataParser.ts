import type { ObjectType } from '@/types';

abstract class CardDataParser {    

    interval: string;

    date: string;
    abstract recentEntries: ObjectType[];

    abstract clusters: ObjectType[];
    abstract cluster: number;

    constructor( result: ObjectType, key: string ) {

        const { recent_entries } = result[ key ];
        const firstEntry = recent_entries[ 0 ];
        const lastEntry = recent_entries[ recent_entries.length - 1 ];

        const firstDay = firstEntry.date.substring( 5 ).split( '-' ).reverse().join( '/' );
        const lastDay = lastEntry.date.substring( 5 ).split( '-' ).reverse().join( '/' );
        this.interval = `${firstDay}-${lastDay}`;

        this.date = lastEntry.date.split( '-' ).reverse().join( '/' );
    }

    toJSON(): ObjectType {
        return {
            interval: this.interval,
            date: this.date, 
            recentEntries: this.recentEntries,
            clusters: this.clusters,
            cluster: this.clusters,
        }
    }
}

class SavingsCardDataParser extends CardDataParser {

    recentEntries: ObjectType[];

    clusters: ObjectType[];
    cluster: number;

    quantity: number;

    constructor( result: any ) {

        const key: string = 'savings';
        super( result, key );

        this.clusters = result[ key ].analysis.quantity.kmeans.clusters;
        this.cluster = this.clusters[ this.clusters.length -1  ].cluster;

        const { recent_entries } = result[ key ];
        this.quantity = recent_entries[ recent_entries.length - 1 ].quantity;

        this.recentEntries = recent_entries.map( ( entry: ObjectType ) => ( { 
            date: entry.date,
            quantity: entry.quantity, 
        } ) );
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            quantity: this.quantity,
        }
    }
}

class ProductionCardDataParser extends CardDataParser {

    recentEntries: ObjectType[];

    clusters: ObjectType[];
    cluster: number;

    quantity: number;

    constructor( result: any ) {

        const key: string = 'production';
        super( result, key );

        this.clusters = result[ key ].analysis.quantity.kmeans.clusters;
        this.cluster = this.clusters[ this.clusters.length -1  ].cluster;

        const { recent_entries } = result[ key ];
        this.quantity = recent_entries[ recent_entries.length - 1 ].quantity;

        this.recentEntries = recent_entries.map( ( entry: ObjectType ) => ( { 
            date: entry.date,
            quantity: entry.quantity, 
        } ) );
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            quantity: this.quantity,
        }
    }
}

class PrecipitationCardDataParser extends CardDataParser {

    recentEntries: ObjectType[];

    clusters: ObjectType[];
    cluster: number;

    precipitation_sum: number;

    constructor( result: any ) {

        const key: string = 'weather';
        super( result, key );

        this.clusters = result[ key ].analysis.precipitation.kmeans.clusters;
        this.cluster = this.clusters[ this.clusters.length -1  ].cluster;

        const { recent_entries } = result[ key ];
        this.precipitation_sum = recent_entries[ recent_entries.length - 1 ].precipitation_sum;

        this.recentEntries = recent_entries.map( ( entry: ObjectType ) => ( { 
            date: entry.date,
            precipitation_sum: entry.precipitation_sum, 
        } ) );
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            precipitation_sum: this.precipitation_sum,
        }
    }
}

class TemperatureCardDataParser extends CardDataParser {

    recentEntries: ObjectType[];

    clusters: ObjectType[];
    cluster: number;

    temperature_2m_min: number;
    temperature_2m_mean: number;
    temperature_2m_max: number;

    constructor( result: any ) {

        const key: string = 'weather';
        super( result, key );

        this.clusters = result[ key ].analysis.temperature_mean.kmeans.clusters;
        this.cluster = this.clusters[ this.clusters.length -1  ].cluster;

        const { recent_entries } = result[ key ];
        this.temperature_2m_min = recent_entries[ recent_entries.length - 1 ].temperature_2m_min;
        this.temperature_2m_mean = recent_entries[ recent_entries.length - 1 ].temperature_2m_mean;
        this.temperature_2m_max = recent_entries[ recent_entries.length - 1 ].temperature_2m_max;

        this.recentEntries = recent_entries.map( ( entry: ObjectType ) => ( { 
            date: entry.date,
            temperature_2m_min: entry.temperature_2m_min,
            temperature_2m_mean: entry.temperature_2m_mean, 
            temperature_2m_max: entry.temperature_2m_max, 
        } ) );
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            temperature_2m_min: this.temperature_2m_min,
            temperature_2m_mean: this.temperature_2m_mean,
            temperature_2m_max: this.temperature_2m_max,
        }
    }
}

class CardDataParserFactory {

    parser: CardDataParser;

    constructor( option: string, result: ObjectType ) {

        switch ( option ) {

            case 'savings': {
                this.parser = new SavingsCardDataParser( result );
                break;
            } 
            case 'production': {
                this.parser = new ProductionCardDataParser( result );
                break;
            }
            case 'precipitation': {
                this.parser = new PrecipitationCardDataParser( result );
                break;
            }
            case 'temperature': {
                this.parser = new TemperatureCardDataParser( result );
                break;
            }
            default:
                throw `Invalid option (${option}) used in CardHandlerFactory`;
        }
    }
}

export default CardDataParserFactory;
export { CardDataParser };