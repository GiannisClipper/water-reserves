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

    props = { placeholder: 'YYYY-MM-DD', ...props }

    return (
        <Field
            label = { <span>From</span> }
            value = { <input {...props} /> }
        />
    );
}

const FieldToDate = ( props: any ) => {

    props = { placeholder: 'YYYY-MM-DD', ...props }

    return (

        <Field
            label = { <span>To</span> }
            value = { <input {...props} /> }
        />
    );
}

const FieldFromInterval = ( props: any ) => {

    props = { placeholder: 'MM-DD', ...props }

    return (
        <Field
            label = { <span>From</span> }
            value = { <input {...props} /> }
        />
    );
}

const FieldToInterval = ( props: any ) => {

    props = { placeholder: 'MM-DD', ...props }

    return (

        <Field
            label = { <span>To</span> }
            value = { <input {...props} /> }
        />
    );
}

const reprItemsAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 
        '': 'Separately',
        'sum': 'Aggregated',
    };

    if ( key in values ) {
        return values[ key ];
    }
    return "";
}

const reprValueAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 
        '': 'Daily quantity',
        'avg': 'Mean daily quantity',
        'sum': 'Total quantity',
        'growth': 'Growth/shrink percentage',
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
        'alltime': 'In total', 
    };

    if ( key in values ) {
        return values[ key ];
    }
    return "";
}

const FieldItemsAggregation = ( props: any ) => (

    <Field
        label = {<span>Density</span>}
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
        label = {<span>Density</span>}
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

export { 
    Field, 
    FieldFromDate, FieldToDate, 
    FieldFromInterval, FieldToInterval, 
    FieldItemsAggregation, 
    FieldTimeAggregation, FieldValueAggregation, 
    CheckField
};