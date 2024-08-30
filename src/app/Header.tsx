"use client"

import Link from 'next/link';
import { useState } from "react";

import { Top, Bottom, Left, Right } from "@/components/Generics";
import { WaterIcon, InfoIcon  } from "@/components/Icons";
import InfoModal from "./InfoModal";

import { APP_TITLE } from "./settings";

import "@/styles/header.css";

type PropsType = { subTitle: string }

const Header = ( { subTitle }: PropsType ) => {

    subTitle = `:: ${subTitle} ::`;

    const [ openModal, setOpenModal ] = useState( false );

    return (
        <>
        <div className="Header">

            <Top>
                <Link className="Left" href="/">

                    <Left className="icon">
                        <WaterIcon />
                    </Left>
                    <Right className="text">
                        { APP_TITLE }
                    </Right>
                </Link>

                <Right>
                    <Right className="icon" onClick={ () => setOpenModal( true ) }>
                        <InfoIcon />
                    </Right>
                </Right>
            </Top>

            <Bottom>
                <Left>
                    <Left className="icon">
                        <span></span> {/* empty space */}
                    </Left>
                    <Right className="text">
                        { subTitle }
                    </Right>
                </Left>
            </Bottom>

        </div>

        { openModal ? 
            <InfoModal onClose={ () => setOpenModal( false ) } /> 
        : null }

        </>
    );

}

export default Header;

