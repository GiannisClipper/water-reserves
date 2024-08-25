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

const FieldFromTime = ( props: any ) => {

    props = { placeholder: 'EEEE-MM-HH', ...props }

    return (
        <Field
            label = { <span>Από</span> }
            value = { <input {...props} /> }
        />
    );
}

const FieldToTime = ( props: any ) => {

    props = { placeholder: 'EEEE-MM-HH', ...props }

    return (

        <Field
            label = { <span>Έως</span> }
            value = { <input {...props} /> }
        />
    );
}

export { Form, Field, FieldFromTime, FieldToTime };