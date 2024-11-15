import Link from 'next/link';
import { Left, Right } from "@/components/Generics";
import { GaugeIcon, WaterIcon, FaucetIcon, RainIcon, TemperatureIcon, ToolIcon, ComposeIcon } from "@/components/Icons";

import { 
    STATUS,
    SAVINGS,
    PRODUCTION,
    PRECIPITATION,
    TEMPERATURE, 
    INTERRUPTIONS,
    SAVINGS_PRODUCTION, 
    SAVINGS_PRECIPITATION,

    STATUS_DESCR,
    SAVINGS_DESCR,
    PRODUCTION_DESCR,
    PRECIPITATION_DESCR,
    TEMPERATURE_DESCR,
    INTERRUPTIONS_DESCR,
    SAVINGS_PRODUCTION_DESCR,
    SAVINGS_PRECIPITATION_DESCR

} from "./settings";

import "@/styles/options.css";

type ChildrenProps = {
    children: React.ReactNode
}

export default function Options() {
    return (
        <div className="Content"> 
            <div className="Options"> 

            <Link className="Option Status" href="/status">
                <Left className='icon'>
                    <GaugeIcon />
                </Left>
                <Right className='text'>
                    <p>{ STATUS }</p>
                    <p>{ STATUS_DESCR }</p>
                </Right>
            </Link>

            <Link className="Option Savings" href="/savings">
                <Left className='icon'>
                    <WaterIcon />
                </Left>
                <Right className='text'>
                    <p>{ SAVINGS }</p>
                    <p>{ SAVINGS_DESCR }</p>
                </Right>
            </Link>

            <Link className="Option Production" href="/production">
                <Left className='icon'>
                   <FaucetIcon />
                </Left>
                <Right className='text'>
                    <p>{ PRODUCTION }</p>
                    <p>{ PRODUCTION_DESCR }</p>
                </Right>
            </Link>

            <Link className="Option Precipitation" href="/precipitation">
                <Left className='icon'>
                    <RainIcon />
                </Left>
                <Right className='text'>
                    <p>{ PRECIPITATION }</p>
                    <p>{ PRECIPITATION_DESCR }</p>
                </Right>
            </Link>

            <Link className="Option Temperature" href="/temperature">
                <Left className='icon'>
                    <TemperatureIcon />
                </Left>
                <Right className='text'>
                    <p>{ TEMPERATURE }</p>
                    <p>{ TEMPERATURE_DESCR }</p>
                </Right>
            </Link>

            <Link className="Option Interruptions" href="/interruptions">
                <Left className='icon'>
                    <ToolIcon />
                </Left>
                <Right className='text'>
                    <p>{ INTERRUPTIONS }</p>
                    <p>{ INTERRUPTIONS_DESCR }</p>
                </Right>
            </Link>

            <Link className="Option SavingsProduction" href="/savings-production">
                <Left className='icon'>
                    <ComposeIcon />
                </Left>
                    <Right className='text'>
                    <p>{ SAVINGS_PRODUCTION }</p>
                    <p>{ SAVINGS_PRODUCTION_DESCR }</p>
                </Right>
            </Link>

            <Link className="Option SavingsPrecipitation" href="/savings-precipitation">
                <Left className='icon'>
                    <ComposeIcon />
                </Left>
                <Right className='text'>
                    <p>{ SAVINGS_PRECIPITATION }</p>
                    <p>{ SAVINGS_PRECIPITATION_DESCR }</p>
                </Right>
            </Link>

            </div>
        </div>
    );
}

