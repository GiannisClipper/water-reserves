import Link from 'next/link';
import { Left, Right } from "@/components/Generics";
import { GaugeIcon, WaterIcon, FaucetIcon, RainIcon, ComposeIcon } from "@/components/Icons";

import { 
    CURRENT_STATUS,
    SAVINGS,
    PRODUCTION,
    PRECIPITATION,
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

            <Link className="Option" href="/current-status">
                <Left className='icon'>
                    <GaugeIcon />
                </Left>
                <Right className='text'>
                    { CURRENT_STATUS }
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

