import type { ObjectType } from '@/types';

abstract class CardHandler {    

    _interval: string;

    _date: string;
    abstract _recentEntries: ObjectType[];

    abstract _clusters: ObjectType[];
    abstract _cluster: number;

    constructor( result: ObjectType, key: string ) {

        const { recent_entries } = result[ key ];
        const firstEntry = recent_entries[ 0 ];
        const lastEntry = recent_entries[ recent_entries.length - 1 ];

        const firstDay = firstEntry.date.substring( 5 ).split( '-' ).reverse().join( '/' );
        const lastDay = lastEntry.date.substring( 5 ).split( '-' ).reverse().join( '/' );
        this._interval = `${firstDay}-${lastDay}`;

        this._date = lastEntry.date.split( '-' ).reverse().join( '/' );
    }

    get interval(): string {
        return this._interval;
    }

    get date(): string {
        return this._date;
    }

    get recentEntries(): ObjectType[] {
        return this._recentEntries;
    }

    get clusters(): Object[] {
        return this._clusters;
    }

    get cluster(): number {
        return this._cluster;
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

class SavingsCardHandler extends CardHandler {

    _recentEntries: ObjectType[];

    _clusters: ObjectType[];
    _cluster: number;

    quantity: number;

    constructor( result: any ) {

        const key: string = 'savings';
        super( result, key );

        this._clusters = result[ key ].analysis.quantity.kmeans.clusters;
        this._cluster = this.clusters[ this.clusters.length -1  ].cluster;

        const { recent_entries } = result[ key ];
        this.quantity = recent_entries[ recent_entries.length - 1 ].quantity;

        this._recentEntries = recent_entries.map( ( entry: ObjectType ) => ( { 
            date: entry.date,
            quantity: entry.quantity, 
        } ) );
    }
}

class ProductionCardHandler extends CardHandler {

    _recentEntries: ObjectType[];

    _clusters: ObjectType[];
    _cluster: number;

    quantity: number;

    constructor( result: any ) {

        const key: string = 'production';
        super( result, key );

        this._clusters = result[ key ].analysis.quantity.kmeans.clusters;
        this._cluster = this.clusters[ this.clusters.length -1  ].cluster;

        const { recent_entries } = result[ key ];
        this.quantity = recent_entries[ recent_entries.length - 1 ].quantity;

        this._recentEntries = recent_entries.map( ( entry: ObjectType ) => ( { 
            date: entry.date,
            quantity: entry.quantity, 
        } ) );
    }
}

class PrecipitationCardHandler extends CardHandler {

    _recentEntries: ObjectType[];

    _clusters: ObjectType[];
    _cluster: number;

    precipitation_sum: number;

    constructor( result: any ) {

        const key: string = 'weather';
        super( result, key );

        this._clusters = result[ key ].analysis.precipitation.kmeans.clusters;
        this._cluster = this.clusters[ this.clusters.length -1  ].cluster;

        const { recent_entries } = result[ key ];
        this.precipitation_sum = recent_entries[ recent_entries.length - 1 ].precipitation_sum;

        this._recentEntries = recent_entries.map( ( entry: ObjectType ) => ( { 
            date: entry.date,
            precipitation_sum: entry.precipitation_sum, 
        } ) );
    }
}

class TemperatureCardHandler extends CardHandler {

    _recentEntries: ObjectType[];

    _clusters: ObjectType[];
    _cluster: number;

    temperature_2m_min: number;
    temperature_2m_mean: number;
    temperature_2m_max: number;

    constructor( result: any ) {

        const key: string = 'weather';
        super( result, key );

        this._clusters = result[ key ].analysis.temperature_mean.kmeans.clusters;
        this._cluster = this.clusters[ this.clusters.length -1  ].cluster;

        const { recent_entries } = result[ key ];
        this.temperature_2m_min = recent_entries[ recent_entries.length - 1 ].temperature_2m_min;
        this.temperature_2m_mean = recent_entries[ recent_entries.length - 1 ].temperature_2m_mean;
        this.temperature_2m_max = recent_entries[ recent_entries.length - 1 ].temperature_2m_max;

        this._recentEntries = recent_entries.map( ( entry: ObjectType ) => ( { 
            date: entry.date,
            temperature_2m_min: entry.temperature_2m_min,
            temperature_2m_mean: entry.temperature_2m_mean, 
            temperature_2m_max: entry.temperature_2m_max, 
        } ) );
    }
}

class CardHandlerFactory {

    private _cardHandler: CardHandler;

    constructor( option: string, result: ObjectType ) {

        switch ( option ) {

            case 'savings': {
                this._cardHandler = new SavingsCardHandler( result );
                break;
            } 
            case 'production': {
                this._cardHandler = new ProductionCardHandler( result );
                break;
            }
            case 'precipitation': {
                this._cardHandler = new PrecipitationCardHandler( result );
                break;
            }
            case 'temperature': {
                this._cardHandler = new TemperatureCardHandler( result );
                break;
            }
            default:
                throw `Invalid option (${option}) used in CardHandlerFactory`;
        }
    }

    get cardHandler(): CardHandler {
        return this._cardHandler;
    }
}

export { CardHandler, CardHandlerFactory };