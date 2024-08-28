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

import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { faChartArea } from '@fortawesome/free-solid-svg-icons';

import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { faCompress } from '@fortawesome/free-solid-svg-icons';

import{ faPencil } from '@fortawesome/free-solid-svg-icons';
import{ faDownload } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type PropsType = { [ key: string ]:any };

const GaugeIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faGaugeHigh} />
const WaterIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faWater} />
const FaucetIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faFaucetDrip} />
const RainIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faCloudRain} />
const ComposeIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faDownLeftAndUpRightToCenter} />

const ChartLineIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faChartLine} />
const ChartAreaIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faChartArea} />
const ChartBarIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faChartColumn} />

const ExpandIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faExpand} />
const CompressIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faCompress} />

const WriteIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faPencil} />
const DownloadIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faDownload} />
const LinkIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } { ...props } icon={faLink} />

const CloseIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faXmark} />
const InfoIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faCircleInfo} />
const SpinnerIcon = ( { ...props }: PropsType ) => <FontAwesomeIcon { ...props } icon={faSpinner} />

export { 
    GaugeIcon, WaterIcon, FaucetIcon, RainIcon, ComposeIcon,
    ChartLineIcon, ChartAreaIcon, ChartBarIcon,
    ExpandIcon, CompressIcon,
    WriteIcon, DownloadIcon, LinkIcon, 
    CloseIcon, InfoIcon, SpinnerIcon,
};