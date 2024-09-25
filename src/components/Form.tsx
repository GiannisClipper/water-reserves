import { Top, Bottom, Left, Right } from '@/components/Generics';
import { PlusIcon, MinusIcon } from './Icons';
import { MouseEventHandler } from 'react';

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

// FormSection

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

// FormButton

type FormButtonPropsType = {
    className?: string
    label?: string
    icon?: React.ReactNode
    onClick: MouseEventHandler
}

const FormButton = ( { className, label, icon, onClick }: FormButtonPropsType ) => {

    className = ( "FormButton " + ( className ? className : "" ) ).trim();

    return (
        <button className={className} onClick={ onClick }>
            <Left>
                { icon }
            </Left>
            <Right>
                { label }
            </Right>
        </button>
    );
}

type FormButtonPropsType_ = { 
    className?: string 
    onClick: MouseEventHandler
}

const FormButtonMore = ( { className, onClick }: FormButtonPropsType_ ) => {
    return (
        <FormButton 
            className={ className }
            label="Περισσότερα"
            icon={ <PlusIcon /> }
            onClick={ onClick }
        />
    );
}

const FormButtonLess = ( { className, onClick }: FormButtonPropsType_ ) => {
    return (
        <FormButton 
        className={ className }
        label="Λιγότερα"
        icon={ <MinusIcon /> }
        onClick={ onClick }
        />
    );
}

export { Form, FormSection, FormButtonMore, FormButtonLess };