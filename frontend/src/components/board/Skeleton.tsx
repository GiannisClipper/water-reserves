import { ReactNode } from "react";

type PropsType = { children?: ReactNode };

const DataSectionSkeleton = ( { children }: PropsType ) => 
    <div className="DataSectionSkeleton">
        { children }
    </div>;

export { DataSectionSkeleton };
