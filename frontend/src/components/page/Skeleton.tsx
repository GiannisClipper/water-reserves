import { ReactNode } from "react";

const DataSectionSkeleton = () => 
    <div className="DataSectionSkeleton">
        <ChartSectionSkeleton />
        <ListSectionSkeleton />
    </div>

type PropsType = { children?: ReactNode };

const ChartSectionSkeleton = ( { children }: PropsType ) => 
    <div className="ChartSectionSkeleton">
        { children }
    </div>;

const ListSectionSkeleton = ( { children }: PropsType ) => 
    <div className="ListSectionSkeleton">
        { children }
    </div>;

export { DataSectionSkeleton, ChartSectionSkeleton, ListSectionSkeleton };
