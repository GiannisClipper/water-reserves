"use client"

import Link from 'next/link';

import { Top, Bottom, Left, Right } from "@/components/Generics";
import { WaterIcon, GaugeIcon, FaucetIcon, RainIcon, TemperatureIcon, ToolIcon, ComposeIcon } from "@/components/Icons";

import { APP_TITLE } from "./settings";

import "@/styles/header.css";

type PropsType = { 
    subTitle: string 
    withOptions: boolean | undefined
}

const Header = ( { subTitle, withOptions }: PropsType ) => {

    subTitle = `${subTitle}`;

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
                    { withOptions ? <HeaderOptions /> : null }
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

        </>
    );
}

const HeaderOptions = () => 
    <>
        <Link className="Option" href="/status">
            <span className='icon' title="Current status">
                <GaugeIcon />
            </span>
        </Link>

        <Link className="Option" href="/savings">
            <span className='icon' title="Water reserves">
                <WaterIcon />
            </span>
        </Link>

        <Link className="Option" href="/production">
            <span className='icon' title="Drinking water production">
                <FaucetIcon />
            </span>
        </Link>

        <Link className="Option" href="/precipitation">
            <span className='icon' title="Precipitation measurements">
                <RainIcon />
            </span>
        </Link>

        <Link className="Option" href="/temperature">
            <span className='icon' title="Temperature in Athens">
                <TemperatureIcon />
            </span>
        </Link>

        <Link className="Option" href="/interruptions">
            <span className='icon' title="Water supply interruptions">
                <ToolIcon />
            </span>
        </Link>

        <Link className="Option" href="/savings-production">
            <span className='icon' title="Water reserves & production">
                <ComposeIcon />
            </span>
        </Link>

        <Link className="Option" href="/savings-precipitation">
            <span className='icon' title="Water reserves & precipitation">
                <ComposeIcon />
            </span>
        </Link>
    </>;

export default Header;

