const DataSectionSkeleton = () => 
    <div className="DataSectionSkeleton">
        <ChartSectionSkeleton />
        <ListSectionSkeleton />
    </div>

const ChartSectionSkeleton = () => 
    <div className="ChartSectionSkeleton">
        <LabelSkeleton />
        <ChartContentSkeleton />
    </div>;

const ChartContentSkeleton = () => 
    <div className="ChartContentSkeleton">
    </div>;

const ListSectionSkeleton = () => 
    <div className="ListSectionSkeleton">
        <LabelSkeleton />
        <ListContentSkeleton />
    </div>

const ListContentSkeleton = () => 
    <div className="ListContentSkeleton">
    </div>

const LabelSkeleton = () => 
    <div className="LabelSkeleton">
    </div>;

export { DataSectionSkeleton, ChartSectionSkeleton, ListSectionSkeleton };
