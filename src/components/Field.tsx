type FieldPropsType = {
    className?: string
    label: React.ReactNode
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

const reprValueAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 
        '': 'Ημερήσια τιμή',
        'avg': 'Μέση ημερήσια τιμή',
        'sum': 'Συνολική τιμή', 
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

const FieldTimeAggregation = ( props: any ) => (

    <Field
        label = {<span>[]</span>}
        value = {
            <select {...props}>
                <option value="">{reprTimeAggregation( "" )}</option>
                <option value="month">{reprTimeAggregation( "month" )}</option>
                <option value="year">{reprTimeAggregation( "year" )}</option>
                <option value="custom_year">{reprTimeAggregation( "custom_year" )}</option>
            </select>
        }
    />
);

const FieldValueAggregation = ( { values, ...props } ) => (

    <Field
        label = {<span>[]</span>}
        value = {
            <select {...props}>
                { values.map( v => <option key={v} value={v}>{reprValueAggregation( v )}</option> ) }
            </select>
        }
    />
);


const FieldCheckBox = ( { label, ...props }: any ) => {

    return (
        <Field
            label = { <span>{ label }</span> }
            value = { <input {...props} type="checkbox" /> }
        />
    );
}

export { 
    Field, 
    FieldFromDate, FieldToDate, 
    FieldFromInterval, FieldToInterval, 
    FieldTimeAggregation, FieldValueAggregation, 
    FieldCheckBox
};