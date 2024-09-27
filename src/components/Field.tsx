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

    props = { placeholder: 'EEEE-MM-HH', ...props }

    return (
        <Field
            label = { <span>Από</span> }
            value = { <input {...props} /> }
        />
    );
}

const FieldToDate = ( props: any ) => {

    props = { placeholder: 'EEEE-MM-HH', ...props }

    return (

        <Field
            label = { <span>Έως</span> }
            value = { <input {...props} /> }
        />
    );
}

const FieldFromInterval = ( props: any ) => {

    props = { placeholder: 'MM-HH', ...props }

    return (
        <Field
            label = { <span>Από</span> }
            value = { <input {...props} /> }
        />
    );
}

const FieldToInterval = ( props: any ) => {

    props = { placeholder: 'MM-HH', ...props }

    return (

        <Field
            label = { <span>Έως</span> }
            value = { <input {...props} /> }
        />
    );
}

const reprItemsAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 
        '': 'Αναλυτικά',
        'sum': 'Συγκεντρωτικά',
    };

    if ( key in values ) {
        return values[ key ];
    }
    return "";
}

const reprValueAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 
        '': 'Ημερήσια ποσότητα',
        'avg': 'Μέση ημερήσια ποσότητα',
        'sum': 'Συνολική ποσότητα',
        'growth': 'Ποσοστό αύξησης/μείωσης',
    };

    if ( key in values ) {
        return values[ key ];
    }
    return "";
}

const reprTimeAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 
        '': 'Ανά ημέρα',
        'month': 'Ανά μήνα', 
        'year': 'Ανά έτος', 
        'custom_year': 'Ανά υδρολογικό έτος'
    };

    if ( key in values ) {
        return values[ key ];
    }
    return "";
}

const FieldItemsAggregation = ( props: any ) => (

    <Field
        label = {<span>Ανάλυση</span>}
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
        label = {<span>Ανάλυση</span>}
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
        label = {<span>Τιμή</span>}
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