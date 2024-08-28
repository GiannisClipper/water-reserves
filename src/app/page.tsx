import Header from "./Header";
import Options from "./Options";
import { APP_SUBTITLE } from "./settings";

type ChildrenProps = {
    children: React.ReactNode
}

export default function Home() {
    return (
        <>
        <Header subTitle={APP_SUBTITLE} />
        <Options />
        </>
    );
}

