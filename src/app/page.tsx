import Link from 'next/link';
import { FaChartLine, FaWater, FaFaucet, FaCloudRain } from "react-icons/fa";

type ChildrenProps = {
    children: React.ReactNode
}

const LinkIcon = ( { children }: ChildrenProps ) =>
    <div className='LinkIcon'>
        {children}
    </div>

const LinkText = ( { children }: ChildrenProps ) =>
    <div className='LinkText'>
        {children}
    </div>

export default function Home() {
    return (
        <div className="app-options">
            
            <Link className="option" href="/current-status">
                <LinkIcon>
                    <FaChartLine />
                </LinkIcon>
                <LinkText>
                    Τρέχουσα κατάσταση
                </LinkText>
            </Link>

            <Link className="option" href="/savings">
                <LinkIcon>
                    <FaWater />
                </LinkIcon>
                <LinkText>
                    Αποθέματα νερού
                </LinkText>
            </Link>

            <Link className="option" href="/production">
                <LinkIcon>
                    <FaFaucet />
                </LinkIcon>
                <LinkText>
                    Παραγωγή πόσιμου νερού
                </LinkText>
            </Link>

            <Link className="option" href="/ratio">
                <LinkIcon>
                    <FaWater />
                </LinkIcon>
                <LinkText>
                    Λόγος αποθεμάτων / παραγωγής
                </LinkText>
            </Link>

            <Link className="option" href="/precipitation">
                <LinkIcon>
                    <FaCloudRain />
                </LinkIcon>
                <LinkText>
                    Ποσότητες υετού
                </LinkText>
            </Link>
        </div>
    );
}

