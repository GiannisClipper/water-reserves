import { Top, Bottom } from '@/components/Generics';

// Form...

type FormPropsType = {
    className?: string
    children: React.ReactNode
}

const Form = ( { className, children }: FormPropsType ) => {

    className = ( "Form " + ( className ? className : "" ) ).trim();

    return (

        <div className={className}>
            { children }
        </div>
    );
}

// FormSection...

type FormSectionPropsType = {
    className?: string
    label?: string
    children?: React.ReactNode
}

const FormSection = ( { className, label, children }: FormSectionPropsType ) => {

    className = ( "FormSection " + ( className ? className : "" ) ).trim();

    return (
        <div className={className}>
            <Top>
                { label }
            </Top>
            <Bottom>
                { children }
            </Bottom>
        </div>
    );
}

type FormSectionType_ = {
    children: React.ReactNode
}

const FormSectionTimeRange = ( { children }: FormSectionType_ ) => {
    return (
        <FormSection label="Περίοδος δεδομένων">
            { children }
        </FormSection>
    );
}

const FormSectionIntervalFilter = ( { children }: FormSectionType_ ) => {
    return (
        <FormSection label="Περιορισμένο διάστημα ενδιαφέροντος">
            { children }
        </FormSection>
    );
}

const FormSectionValueAggregation = ( { children }: FormSectionType_ ) => {
    return (
        <FormSection label="Ανάλυση ποσότητας">
            { children }
        </FormSection>
    );
}

const FormSectionTimeAggregation = ( { children }: FormSectionType_ ) => {
    return (
        <FormSection label="Ανάλυση χρόνου">
            { children }
        </FormSection>
    );
}

// Field...

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

const FieldFromMonthDay = ( props: any ) => {

    props = { placeholder: 'MM-HH', ...props }

    return (
        <Field
            label = { <span>Από</span> }
            value = { <input {...props} /> }
        />
    );
}

const FieldToMonthDay = ( props: any ) => {

    props = { placeholder: 'MM-HH', ...props }

    return (

        <Field
            label = { <span>Έως</span> }
            value = { <input {...props} /> }
        />
    );
}

const reprValueAggregation = ( key: string ): string => {

    // const values: { [key: string]: string } = { 'avg': 'Μέση ημερήσια τιμή' };

    // if ( key in values ) {
    //     return values[ key ];
    // }
    return 'Μέση ημερήσια τιμή';
}

const reprTimeAggregation = ( key: string ): string => {

    const values: { [key: string]: string } = { 'month': 'Ανά μήνα', 'year': 'Ανά έτος', 'custom_year': 'Ανά υδρολογικό έτος' };

    if ( key in values ) {
        return values[ key ];
    }
    return "Ανά ημέρα";
}

const FieldValueAggregation = ( props: any ) => (

    <Field
        label = {<span>[]</span>}
        value = {
            <select {...props}>
                <option value="avg">{reprValueAggregation( "avg" )}</option>
            </select>
        }
    />
);

const FieldTimeAggregation = ( props: any ) => (

    <Field
        label = {<span>[]</span>}
        value = {
            <select {...props}>
                <option value="day">{reprTimeAggregation( "day" )}</option>
                <option value="month">{reprTimeAggregation( "month" )}</option>
                <option value="year">{reprTimeAggregation( "year" )}</option>
                <option value="custom_year">{reprTimeAggregation( "custom_year" )}</option>
            </select>
        }
    />
);

export { 
    Form, 
    FormSection, FormSectionTimeRange, FormSectionIntervalFilter, FormSectionValueAggregation, FormSectionTimeAggregation,
    Field, FieldFromDate, FieldToDate, FieldFromMonthDay, FieldToMonthDay, FieldValueAggregation, FieldTimeAggregation
};