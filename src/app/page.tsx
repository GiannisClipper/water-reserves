import Link from 'next/link';
import { Left, Right } from "@/components/Generics";
import { GaugeIcon, WaterIcon, FaucetIcon, RainIcon, CompareIcon } from "@/components/Icons";

type ChildrenProps = {
    children: React.ReactNode
}

// const LinkIcon = ( { children }: ChildrenProps ) =>
//     <div className='LinkIcon'>
//         {children}
//     </div>

// const LinkText = ( { children }: ChildrenProps ) =>
//     <div className='LinkText'>
//         {children}
//     </div>

export default function Home() {
    return (
        <div className="app-options">            
            <Link className="option" href="/current-status">
                <Left className='icon'>
                    <GaugeIcon />
                </Left>
                <Right>
                    Τρέχουσα κατάσταση
                </Right>
            </Link>

            <Link className="option" href="/savings">
                <Left className='icon'>
                    <WaterIcon />
                </Left>
                <Right>
                    Αποθέματα νερού
                </Right>
            </Link>

            <Link className="option" href="/production">
                <Left className='icon'>
                   <FaucetIcon />
                </Left>
                <Right>
                    Παραγωγή πόσιμου νερού
                </Right>
            </Link>

            <Link className="option" href="/ratio">
                <Left className='icon'>
                    <CompareIcon />
                </Left>
                <Right>
                    Λόγος αποθεμάτων / παραγωγής
                </Right>
            </Link>

            <Link className="option" href="/precipitation">
                <Left className='icon'>
                    <RainIcon />
                </Left>
                <Right>
                    Ποσότητες υετού
                </Right>
            </Link>
        </div>
    );
}

