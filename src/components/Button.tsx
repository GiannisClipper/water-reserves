import { MouseEventHandler } from "react"
import { CopyIcon } from "./Icons";

import "@/styles/button.css"

type ButtonPropsType = {
    className?: string
    icon?: React.ReactNode
    label?: React.ReactNode
    onClick: MouseEventHandler<HTMLButtonElement>
}

const Button = ( { className, icon, label, onClick }: ButtonPropsType ) => {

    className = ( "Button " + ( className ? className : "" ) ).trim();

    return (
        <button className={className} onClick={ onClick }>
            { icon }
            <span>{ label }</span>
        </button>
    );
}

const ButtonCopy = ( { className, label, onClick }: ButtonPropsType ) =>
    <Button
        className={ className }
        icon={ <CopyIcon /> }
        label={ label }
        onClick={ onClick }
    />;

export { ButtonCopy };
