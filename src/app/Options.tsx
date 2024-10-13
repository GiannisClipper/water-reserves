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
} from "./settings";

import "@/styles/options.css";

type ChildrenProps = {
    children: React.ReactNode
}

export default function Options() {
    return (
        <div className="Options"> 

            <Link className="Option" href="/status">
                <Left className='icon'>
                    <GaugeIcon />
                </Left>
                <Right className='text'>
                    { STATUS }
                </Right>
            </Link>

            <Link className="Option" href="/savings">
                <Left className='icon'>
                    <WaterIcon />
                </Left>
                <Right className='text'>
                    { SAVINGS }
                </Right>
            </Link>

            <Link className="Option" href="/production">
                <Left className='icon'>
                   <FaucetIcon />
                </Left>
                <Right className='text'>
                    { PRODUCTION }
                </Right>
            </Link>

            <Link className="Option" href="/precipitation">
                <Left className='icon'>
                    <RainIcon />
                </Left>
                <Right className='text'>
                    { PRECIPITATION }
                </Right>
            </Link>

            <Link className="Option" href="/temperature">
                <Left className='icon'>
                    <TemperatureIcon />
                </Left>
                <Right className='text'>
                    { TEMPERATURE }
                </Right>
            </Link>

            <Link className="Option" href="/interruptions">
                <Left className='icon'>
                    <ToolIcon />
                </Left>
                <Right className='text'>
                    { INTERRUPTIONS }
                </Right>
            </Link>

            <Link className="Option" href="/savings-production">
                <Left className='icon'>
                    <ComposeIcon />
                </Left>
                <Right className='text'>
                    { SAVINGS_PRODUCTION }
                </Right>
            </Link>

            <Link className="Option" href="/savings-precipitation">
                <Left className='icon'>
                    <ComposeIcon />
                </Left>
                <Right className='text'>
                    { SAVINGS_PRECIPITATION }
                </Right>
            </Link>
        </div>
    );
}

