"use client"

import Modal from "@/components/Modal";
import { Box, Top, Bottom } from "@/components/Generics";

type PropsType = {
    onClose: () => void
}

export default function InfoModal( { onClose }: PropsType ) {

    console.log( "rendering: InfoModal..." )

    return (
        <Modal 
            className="InfoModal"
            onClose={ onClose }
        >
            <Box>
                <Top>
                    Για το water reserves
                </Top>
                <Bottom>
                    Πληροφορίες για το σύστημα παρακολούθησης υδάτινων πόρων...
                </Bottom>
            </Box>
            <Box>
                <Top>
                    Για τα δεδομένα από το eydap.gr
                </Top>
                <Bottom>
                    Πληροφορίες για τα δεδομένα που προέρχονται από το eydap.gr...
                </Bottom>
            </Box>
            <Box>
                <Top>
                    Για τα δεδομένα από το open-meteo.com
                </Top>
                <Bottom>
                    Πληροφορίες για τα δεδομένα που προέρχονται από το open-meteo.com...
                </Bottom>
            </Box>
        </Modal>
    );
}
