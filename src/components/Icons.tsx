// (fontawesome) Set Up with React
// https://docs.fontawesome.com/web/use-with/react/
// Can't import font-awesome in React JS
// https://stackoverflow.com/questions/62578444/cant-import-font-awesome-in-react-js
// to search fonts:
// https://fontawesome.com/search?q=profile&o=r&m=free

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh } from '@fortawesome/free-solid-svg-icons';
import { faWater } from '@fortawesome/free-solid-svg-icons';
import { faFaucetDrip } from '@fortawesome/free-solid-svg-icons';
import { faCloudRain } from '@fortawesome/free-solid-svg-icons';
import{ faDownLeftAndUpRightToCenter } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const GaugeIcon = () => <FontAwesomeIcon icon={faGaugeHigh} />
const WaterIcon = () => <FontAwesomeIcon icon={faWater} />
const FaucetIcon = () => <FontAwesomeIcon icon={faFaucetDrip} />
const RainIcon = () => <FontAwesomeIcon icon={faCloudRain} />
const ComposeIcon = () => <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />

const CloseIcon = () => <FontAwesomeIcon icon={faXmark} />
const InfoIcon = () => <FontAwesomeIcon icon={faCircleInfo} />
const SpinnerIcon = () => <FontAwesomeIcon icon={faSpinner} />

type PropsType = {
    className?: string
    children: React.ReactNode
}

export { 
    GaugeIcon, WaterIcon, FaucetIcon, RainIcon, ComposeIcon,
    CloseIcon, InfoIcon, SpinnerIcon,
};