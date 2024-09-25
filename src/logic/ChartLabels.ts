import { ObjectType } from '@/types';
import ParamValues from '@/logic/ParamValues';

abstract class ChartLabels {    

    abstract _title: string;

    _xLabel: string = '';
    _yLabel: string = '';

    constructor( searchParams: ObjectType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        const timeRepr = {
            month: 'ανά μήνα',
            year: 'ανά έτος',
            custom_year: 'ανά υδρολογικό έτος',
        };

        const valueRepr = {
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
            yLabel: this._yLabel
        }
    }
}

class SavingsChartLabels extends ChartLabels {

    _title: string;

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Αποθέματα νερού ' + ( 
            searchParams.reservoir_aggregation 
                ? '(συνολικά)'
                : '(ανά ταμιευτήρα)'
        );

        this._yLabel += ' (κυβ.μέτρα)'
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            title: this._title
        }
    }
}

class ProductionChartLabels extends ChartLabels {

    _title: string;

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this._title = 'Παραγωγή πόσιμου νερού ' + ( 
            searchParams.factory_aggregation 
                ? '(συνολικά)'
                : '(ανά μονάδα επεξεργασίας)'
        );

        this._yLabel += ' (κυβ.μέτρα)'
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            title: this._title
        }
    }
}


export { SavingsChartLabels, ProductionChartLabels };