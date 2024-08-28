import Link from 'next/link';
import { Top, Bottom, Left, Right } from "@/components/Generics";
import { WaterIcon, InfoIcon  } from "@/components/Icons";

type PropsType = { subTitle: string }

const Header = ( { subTitle }: PropsType ) => {

    subTitle = `:: ${subTitle} ::`;

    return (
        <div className="Header">

            <Top>
                <Link className="Left" href="/">

                    <Left className="icon">
                        <WaterIcon />
                    </Left>
                    <Right className="text">
                        Water reserves
                    </Right>
                </Link>

                <Right>
                    <Right className="icon">
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
    );

}

export default Header;

