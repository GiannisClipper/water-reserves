import { Top, Bottom } from "./Generics";
import { CloseIcon } from "@/components/Icons";

import "@/styles/modal.css";


type ModalPropsType = {
    className?: string
    onClose: () => void
    children: React.ReactNode
}

function Modal( { className, onClose, children }: ModalPropsType ) {

    className = ( "Modal " + ( className ? className : "" ) ).trim();

    return (
        <div className={ className } onClick={ onClose }>
            <ModalWindow onClose={ onClose }>
                { children }
            </ModalWindow>
        </div>
    )
}

function ModalWindow( { onClose, children }: ModalPropsType ) {

    return (
        <div className="ModalWindow" onClick={ e => e.stopPropagation() }>
            <Top>
                <button onClick={ onClose }><CloseIcon /></button>
            </Top>
            <Bottom>
                { children }
            </Bottom>
        </div>
    )
}

export default Modal;