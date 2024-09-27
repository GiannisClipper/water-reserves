import ParamValues from '@/logic/ParamValues';

import { BLUE, SKY, TEAL, GREEN, RED, YELLOW, INDIGO, CYAN } from '@/helpers/colors';

import type { ObjectType } from '@/types';
import type { SearchParamsType } from '@/types/searchParams';

type UnitType = 'm3' | 'mm' | '%';

abstract class ChartTexts {    

    abstract _title: string;
    abstract _unit: UnitType;
    abstract _colors: ObjectType[];

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
        }
    }
    
}

class SavingsChartTexts extends ChartTexts {

    _title: string;
    _unit: UnitType;
    _colors: ObjectType[];

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

class ProductionChartTexts extends ChartTexts {

    _title: string;
    _unit: UnitType;
    _colors: ObjectType[];

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Παραγωγή πόσιμου νερού ' + ( 
            searchParams.factory_aggregation 
                ? '(συνολικά)'
                : '(ανά μονάδα επεξεργασίας)'
        );

        this._unit = 'm3';
        this._colors = [ TEAL ];
        this._yLabel += ' (κυβ.μέτρα)';
    }
}

class PrecipitationChartTexts extends ChartTexts {

    _title: string;
    _unit: UnitType;
    _colors: ObjectType[];

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Ποσότητες υετού ' + ( 
            searchParams.location_aggregation 
                ? '(συνολικά)'
                : '(ανά τοποθεσία)'
        );

        this._unit = 'mm';
        this._colors = [ CYAN ];
        this._yLabel += ' (mm)';
    }
}

class SavingsProductionChartTexts extends ChartTexts {

    _title: string;
    _unit: UnitType;
    _colors: ObjectType[];

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Αποθέματα και Παραγωγή νερού ';

        this._unit = '%';
        this._colors = [ SKY, TEAL ];
        this._yLabel += ' (μεταβολή %)';
    }
}

class ChartTextsFactory {

    private _chartTexts: ChartTexts;

    constructor( endpoint: string, searchParams: SearchParamsType ) {

        switch ( endpoint ) {

            case 'savings': {
                this._chartTexts = new SavingsChartTexts( searchParams );
                break;
            } 
            case 'production': {
                this._chartTexts = new ProductionChartTexts( searchParams );
                break;
            }
            case 'precipitation': {
                this._chartTexts = new PrecipitationChartTexts( searchParams );
                break;
            }
            case 'savings-production': {
                this._chartTexts = new SavingsProductionChartTexts( searchParams );
                break;
            }
            default:
                throw `Invalid endpoint (${endpoint}) used in ChartTextsFactory`;
        }
    }

    get chartTexts(): ChartTexts {
        return this._chartTexts;
    }
}

export type { UnitType };

export { ChartTextsFactory };