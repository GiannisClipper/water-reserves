import Link from 'next/link';

import { Top, Bottom, Left, Right } from "@/components/Generics";
import { WaterIcon, GaugeIcon, FaucetIcon, RainIcon, TemperatureIcon, ToolIcon, ComposeIcon } from "@/components/Icons";

import { APP_TITLE } from "./settings";

import "@/styles/header.css";

type PropsType = { 
    subTitle: string 
    endpoint?: string
}

const Header = ( { subTitle, endpoint }: PropsType ) => {

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

                <Right className={endpoint}>
                    { endpoint ? <HeaderOptions /> : null }
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
        <Link className="Option" title="Current status" href="/status">
            <GaugeIcon />
        </Link>

        <Link className="Option" title="Water reserves" href="/savings">
            <WaterIcon />
        </Link>

        <Link className="Option" title="Drinking water production" href="/production">
            <FaucetIcon />
        </Link>

        <Link className="Option" title="Precipitation measurements" href="/precipitation">
            <RainIcon />
        </Link>

        <Link className="Option" title="Temperature in Athens" href="/temperature">
            <TemperatureIcon />
        </Link>

        <Link className="Option" title="Water supply interruptions" href="/interruptions">
                <ToolIcon />
        </Link>

        <Link className="Option" title="Water reserves & production" href="/savings-production">
            <ComposeIcon />
        </Link>

        <Link className="Option" title="Water reserves & precipitation" href="/savings-precipitation">
            <ComposeIcon />
        </Link>
    </>;

export default Header;

