import ParamValues from '@/logic/ParamValues';

import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import type { ObjectType } from '@/types';
import type { SearchParamsType } from '@/types/searchParams';

type UnitType = 'm3' | 'mm' | '%' | 'oC' | '';

abstract class MetadataHandler {    

    abstract _title: string;
    abstract _unit: UnitType;
    abstract _colors: ObjectType[];
    // abstract _valueLabels: string[];

    _xLabel: string = '';
    _yLabel: string = '';

    constructor( searchParams: ObjectType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        const timeRepr: ObjectType = {
            month: 'ανά μήνα',
            year: 'ανά έτος',
            custom_year: 'ανά υδρολογικό έτος',
        };

        const valueRepr: ObjectType = {
            avg: 'Μέση ημερήσια ποσότητα',
            sum: 'Συνολική ποσότητα',
        };

        this._xLabel = 'Χρονική ανάλυση ' + ( timeRepr[ timeAggregation ] || 'ανά ημέρα' );
        this._yLabel = valueRepr[ valueAggregation ] !== undefined
            ? valueRepr[ valueAggregation ]
            : 'Ημερήσια ποσότητα';
    }

    toJSON(): ObjectType {
        return {
            xLabel: this._xLabel, 
            yLabel: this._yLabel,
            title: this._title,
            unit: this._unit,
            colors: this._colors,
            // valueLabels: this._valueLabels,
        }
    }
    
}

class SavingsMetadataHandler extends MetadataHandler {

    _title: string;
    _unit: UnitType;
    _colors: ObjectType[];
    // _valueLabels: string[] = [ 'Αποθέματα' ];

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Αποθέματα νερού ' + ( 
            searchParams.reservoir_aggregation 
                ? '(συνολικά)'
                : '(ανά ταμιευτήρα)'
        );

        this._unit = 'm3';
        this._colors = [ SKY ];
        this._yLabel += ' (κυβ.μέτρα)';
    }
}

class ProductionMetadataHandler extends MetadataHandler {

    _title: string;
    _unit: UnitType;
    _colors: ObjectType[];
    // _valueLabels: string[] = [ 'Παραγωγή' ];

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Παραγωγή πόσιμου νερού ' + ( 
            searchParams.factory_aggregation 
                ? '(συνολικά)'
                : '(ανά μονάδα επεξεργασίας)'
        );

        this._unit = 'm3';
        this._colors = [ PINK ];
        this._yLabel += ' (κυβ.μέτρα)';
    }
}

class PrecipitationMetadataHandler extends MetadataHandler {

    _title: string;
    _unit: UnitType;
    _colors: ObjectType[];
    // _valueLabels: string[] = [ 'Υετός' ];

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Ποσότητες υετού ' + ( 
            searchParams.location_aggregation 
                ? '(συνολικά)'
                : '(ανά τοποθεσία)'
        );

        this._unit = 'mm';
        this._colors = [ TEAL ];
        this._yLabel += ' (mm)';
    }
}

class TemperatureMetadataHandler extends MetadataHandler {

    _title: string;
    _unit: UnitType;
    _colors: ObjectType[];
    // _valueLabels: string[] = [ 'Υετός' ];

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Μέση θερμοκρασία ' + ( 
            searchParams.location_aggregation 
                ? '(συνολικά)'
                : '(ανά τοποθεσία)'
        );

        this._unit = 'oC';
        this._colors = [ YELLOW ];
        this._yLabel += ' (oC)';
    }
}

class SavingsProductionMetadataHandler extends MetadataHandler {

    _title: string;
    _unit: UnitType;
    _colors: ObjectType[];
    // _valueLabels: string[] = [ 'Αποθέματα', 'Παραγωγή' ];

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Αποθέματα & Παραγωγή νερού';

        this._unit = '%';
        this._colors = [ SKY, PINK ];
        this._yLabel += ' (μεταβολή %)';
    }
}

class SavingsPrecipitationMetadataHandler extends MetadataHandler {

    _title: string;
    _unit: UnitType;
    _colors: ObjectType[];
    // _valueLabels: string[] = [ 'Αποθέματα', 'Υετός' ];

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Αποθέματα νερού & Μετρήσεις υετού';

        this._unit = '%';
        this._colors = [ SKY, TEAL ];
        this._yLabel += ' (μεταβολή %)';
    }
}

class MetadataHandlerFactory {

    private _metadataHandler: MetadataHandler;

    constructor( endpoint: string, searchParams: SearchParamsType ) {

        switch ( endpoint ) {

            case 'savings': {
                this._metadataHandler = new SavingsMetadataHandler( searchParams );
                break;
            } 
            case 'production': {
                this._metadataHandler = new ProductionMetadataHandler( searchParams );
                break;
            }
            case 'precipitation': {
                this._metadataHandler = new PrecipitationMetadataHandler( searchParams );
                break;
            } case 'temperature': {
                    this._metadataHandler = new TemperatureMetadataHandler( searchParams );
                    break;
            } case 'savings-production': {
                this._metadataHandler = new SavingsProductionMetadataHandler( searchParams );
                break;
            }
            case 'savings-precipitation': {
                this._metadataHandler = new SavingsPrecipitationMetadataHandler( searchParams );
                break;
            }
            default:
                throw `Invalid endpoint (${endpoint}) used in MetadataHandlerFactory`;
        }
    }

    get metadataHandler(): MetadataHandler {
        return this._metadataHandler;
    }
}

export type { UnitType };

export { MetadataHandler, MetadataHandlerFactory };