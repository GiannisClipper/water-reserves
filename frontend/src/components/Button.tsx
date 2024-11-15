import { MouseEventHandler } from "react"
import { CopyIcon, DownloadIcon } from "./Icons";

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
        label={ label ? label : 'Copy to clipboard' }
        onClick={ onClick }
    />;

const ButtonDownload = ( { className, label, onClick }: ButtonPropsType ) =>

    <Button
        className={ className }
        icon={ <DownloadIcon /> }
        label={ label ? label : 'Download' }
        onClick={ onClick }
    />;
    
export { ButtonCopy, ButtonDownload };
