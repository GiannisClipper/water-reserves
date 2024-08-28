import Link from 'next/link';
import Header from "./Header";
import { Left, Right } from "@/components/Generics";
import { GaugeIcon, WaterIcon, FaucetIcon, RainIcon, ComposeIcon } from "@/components/Icons";

import { 
    APP_SUBTITLE,
    CURRENT_STATUS,
    SAVINGS, SAVINGS_RESERVOIR,
    PRODUCTION, PRODUCTiON_FACTORY,
    PRECIPITATION,
    SAVINGS_PRODUCTION, SAVINGS_PRECIPITATION,    
} from "./settings";

type ChildrenProps = {
    children: React.ReactNode
}

export default function Home() {
    return (
        <>
        <Header subTitle={APP_SUBTITLE} />

        <div className="app-options"> 
            <Link className="option" href="/current-status">
                <Left className='icon'>
                    <GaugeIcon />
                </Left>
                <Right className='text'>
                    { CURRENT_STATUS }
                </Right>
            </Link>

            <Link className="option" href="/savings">
                <Left className='icon'>
                    <WaterIcon />
                </Left>
                <Right className='text'>
                    { SAVINGS }
                </Right>
            </Link>

            <Link className="option" href="/savings-reservoir">
                <Left className='icon'>
                    <WaterIcon />
                </Left>
                <Right className='text'>
                    { SAVINGS_RESERVOIR }
                </Right>
            </Link>

            <Link className="option" href="/production">
                <Left className='icon'>
                   <FaucetIcon />
                </Left>
                <Right className='text'>
                    { PRODUCTION }
                </Right>
            </Link>

            <Link className="option" href="/production-factory">
                <Left className='icon'>
                   <FaucetIcon />
                </Left>
                <Right className='text'>
                    { PRODUCTiON_FACTORY }
                </Right>
            </Link>

            <Link className="option" href="/precipitation">
                <Left className='icon'>
                    <RainIcon />
                </Left>
                <Right className='text'>
                    { PRECIPITATION }
                </Right>
            </Link>

            <Link className="option" href="/savings-production">
                <Left className='icon'>
                    <ComposeIcon />
                </Left>
                <Right className='text'>
                    { SAVINGS_PRODUCTION }
                </Right>
            </Link>

            <Link className="option" href="/savings-precipitation">
                <Left className='icon'>
                    <ComposeIcon />
                </Left>
                <Right className='text'>
                    { SAVINGS_PRECIPITATION }
                </Right>
            </Link>
        </div>
        </>
    );
}

