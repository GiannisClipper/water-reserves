import { ObjectType } from '@/types';
import FormParams from '../savings/params/FormParams';

class ChartLabels {    

    xLabel: string = '';
    yLabel: string = '';

    constructor( searchParams: ObjectType ) {

        const params = new FormParams( searchParams ).getAsObject();
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

        this.xLabel = 'Χρονική ανάλυση ' + ( timeRepr[ timeAggregation ] || 'ανά ημέρα' );
        this.yLabel = valueRepr[ valueAggregation ] !== undefined
            ? valueRepr[ valueAggregation ]
            : 'Ημερήσια ποσότητα';    
    }

    getAsObject(): ObjectType {
        return {
            xLabel: this.xLabel, 
            yLabel: this.yLabel
        }
    }
}

class SavingsChartLabels extends ChartLabels {

    title: string = '';

    constructor( searchParams: ObjectType ) {

        super( searchParams );
        
        this.title = 'Αποθέματα νερού ' + ( 
            searchParams.reservoir_aggregation 
                ? '(συνολικά)'
                : '(ανά ταμιευτήρα)'
        );

        this.yLabel += ' (κυβ.μέτρα)'
    }

    getAsObject(): ObjectType {
        return {
            ...super.getAsObject(),
            title: this.title
        }
    }
}


export { SavingsChartLabels };