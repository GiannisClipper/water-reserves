import { YearMonthDayInput, MonthDayInput } from "./Input";

import "@/styles/checkbox.css"

type FieldPropsType = {
    className?: string
    label?: React.ReactNode
    value: React.ReactNode
}

const Field = ( { className, label, value }: FieldPropsType ) => {

    className = ( "Field " + ( className ? className : "" ) ).trim();

    return (
        <div className={className}>
            { label }
            { value }
        </div>
    );
}

// type FieldSelectPropsType = {
//     className?: string
//     value: React.ReactNode
// }

// const FieldSelect = ( { className, value }: FieldSelectPropsType ) => {

//     className = ( "FieldSelect " + ( className ? className : "" ) ).trim();

//     return (
//         <div className={className}>
//             { value }
//         </div>
//     );
// }

const FieldFromDate = ( props: any ) => {

    return (
        <Field
            label = { <span>From</span> }
            value = { <YearMonthDayInput {...props} /> }
        />
    );
}

const FieldToDate = ( props: any ) => {

    return (

        <Field
            label = { <span>To</span> }
            value = { <YearMonthDayInput {...props} /> }
        />
    );
}

const FieldFromInterval = ( props: any ) => {

    return (
        <Field
            label = { <span>From</span> }
            value = { <MonthDayInput {...props} /> }
        />
    );
}

const FieldToInterval = ( props: any ) => {

    return (

        <Field
            label = { <span>To</span> }
            value = { <MonthDayInput {...props} /> }
        />
    );
}

const reprItemsAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 
        '': 'Individualy',
        'sum': 'Aggregated',
    };

    if ( key in values ) {
        return values[ key ];
    }
    return "";
}

const reprValueAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 
        '': 'Daily value',
        'avg': 'Average daily value',
        'sum': 'Sum daily values',
        'growth': 'Change percentage',
    };

    if ( key in values ) {
        return values[ key ];
    }
    return "";
}

const reprEventsAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 
        '': 'Events',
        'sum': 'Events',
        'sum,over-area': 'Events over area',
        'sum,over-population': 'Events over population',
    };

    if ( key in values ) {
        return values[ key ];
    }
    return "";
}

const reprTimeAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 
        '': 'Per date',
        'date': 'Per date',
        'month': 'Per month', 
        'year': 'Per year', 
        'custom_year': 'Per hydrological year',
        'alltime': 'All time', 
    };

    if ( key in values ) {
        return values[ key ];
    }
    return "";
}

const FieldItemsAggregation = ( props: any ) => (

    <Field
        label = {<span>Aggregation</span>}
        value = {
            <select { ...props }>
                <option value="sum">{reprItemsAggregation( "sum" )}</option>
                <option value="">{reprItemsAggregation( "" )}</option>
            </select>
        }
    />
);

const FieldTimeAggregation = ( { values, ...props } ) => (

    <Field
        label = {<span>Aggregation</span>}
        value = {
            <select { ...props } disabled={ values.length <= 1 }>
                { values.map( v => <option key={v} value={v}>{reprTimeAggregation( v )}</option> ) }
            </select>

            // <select { ...props }>
            //     <option value="">{reprTimeAggregation( "" )}</option>
            //     <option value="month">{reprTimeAggregation( "month" )}</option>
            //     <option value="year">{reprTimeAggregation( "year" )}</option>
            //     <option value="custom_year">{reprTimeAggregation( "custom_year" )}</option>
            // </select>
        }
    />
);

const FieldValueAggregation = ( { values, ...props } ) => (

    <Field
        label = {<span>Value</span>}
        value = {
            <select { ...props } disabled={ values.length <= 1 }>
                { values.map( v => <option key={v} value={v}>{reprValueAggregation( v )}</option> ) }
            </select>
        }
    />
);

const FieldEventsAggregation = ( { values, ...props } ) => (

    <Field
        label = {<span>Value</span>}
        value = {
            <select { ...props } disabled={ values.length <= 1 }>
                { values.map( v => <option key={v} value={v}>{reprEventsAggregation( v )}</option> ) }
            </select>
        }
    />
);

const CheckField = ( { label, ...props }: any ) => {

    const onClick = ( e: React.MouseEvent<HTMLElement> ) => {
        const target: HTMLElement = e.currentTarget as HTMLElement;
        const input: HTMLInputElement | null = target.querySelector( 'input' );
        if ( input ) {
            // click will change the value and trigger the onChange
            input.click();
        }
    }

    return (
        <div className="CheckField" onClick={ onClick }>
            <input {...props} type="checkbox" />
            <span className="CheckBox">
                <span className="CheckMark"></span>
            </span>
            <span className="CheckLabel">
                { label }
            </span>
        </div>
    );
}

const FieldFilename = ( props: any ) => {

    return (
        <Field
            label = { <span>Filename</span> }
            value = { <input {...props} /> }
        />
    );
}

export { 
    Field, 
    FieldFromDate, FieldToDate, 
    FieldFromInterval, FieldToInterval, 
    FieldItemsAggregation, 
    FieldTimeAggregation, FieldValueAggregation, FieldEventsAggregation,
    CheckField,
    FieldFilename
};