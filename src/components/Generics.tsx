type PropsType = {
    className?: string
    children: React.ReactNode
}

const Top = ( { className, children }: PropsType ) => {

    className = ( "Top " + ( className ? className : "" ) ).trim();

    return (

        <div className={className}>
            { children }
        </div>
    );
}

const Bottom = ( { className, children }: PropsType ) => {

    className = ( "Bottom " + ( className ? className : "" ) ).trim();

    return (

        <div className={className}>
            { children }
        </div>
    );
}

const Middle = ( { className, children }: PropsType ) => {

    className = ( "Middle " + ( className ? className : "" ) ).trim();

    return (

        <div className={className}>
            { children }
        </div>
    );
}

const Left = ( { className, children }: PropsType ) => {

    className = ( "Left " + ( className ? className : "" ) ).trim();

    return (

        <div className={className}>
            { children }
        </div>
    );
}

const Right = ( { className, children }: PropsType ) => {

    className = ( "Right " + ( className ? className : "" ) ).trim();

    return (

        <div className={className}>
            { children }
        </div>
    );
}

export { Top, Bottom, Middle, Left, Right };