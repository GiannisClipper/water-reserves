import Header from "./Header";
import Options from "./Options";
import { APP_SUBTITLE } from "./settings";

export default function Home() {
    return (
        <>
        <Header subTitle={APP_SUBTITLE} />
        <Options />
        </>
    );
}

