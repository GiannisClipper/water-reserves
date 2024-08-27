import { Top, Bottom } from "./Generics";
import { CloseIcon } from "@/components/Icons";

import "@/styles/modal.css";


type ModalPropsType = {
    onClose: () => void
    children: React.ReactNode
}

function Modal( { onClose, children }: ModalPropsType ) {

    return (
        <div className="Modal" onClick={ onClose }>
            <ModalContent onClose={ onClose }>
                { children }
            </ModalContent>
        </div>
    )
}

function ModalContent( { onClose, children }: ModalPropsType ) {

    return (
        <div className="ModalContent" onClick={ e => e.stopPropagation() }>
            <Top>
                <button onClick={ onClose }><CloseIcon /></button>
            </Top>
            <Bottom>
                { children }
            </Bottom>
        </div>
    )
}

export { Modal, ModalContent };