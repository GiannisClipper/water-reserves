import { Top, Bottom } from '@/components/Generics';

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
        <FormSection label="Περίοδος αναζήτησης">
            { children }
        </FormSection>
    );
}

const FormSectionIntervalFilter = ( { children }: FormSectionType_ ) => {
    return (
        <FormSection label="Ημέρες ενδιαφέροντος">
            { children }
        </FormSection>
    );
}

const FormSectionAggregation = ( { children }: FormSectionType_ ) => {
    return (
        <FormSection label="Συγκέντρωση δεδομένων">
            { children }
        </FormSection>
    );
}

const FormSectionReservoirs = ( { children }: FormSectionType_ ) => {
    return (
        <FormSection label="Ταμιευτήρες">
            { children }
        </FormSection>
    );
}

export { 
    Form, FormSection, 
    FormSectionTimeRange, FormSectionIntervalFilter,
    FormSectionAggregation,
    FormSectionReservoirs,
};