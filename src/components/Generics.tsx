type PropsType = {
    className?: string
    children?: React.ReactNode
    [ key: string ]: any
}

const Box = ( { className, children, ...props }: PropsType ) => {

    className = ( "Box " + ( className ? className : "" ) ).trim();

    return (

        <div className={className} {...props}>
            { children }
        </div>
    );
}

const Top = ( { className, children, ...props }: PropsType ) => {

    className = ( "Top " + ( className ? className : "" ) ).trim();

    return (

        <div className={className} {...props}>
            { children }
        </div>
    );
}

const Bottom = ( { className, children, ...props }: PropsType ) => {

    className = ( "Bottom " + ( className ? className : "" ) ).trim();

    return (

        <div className={className} {...props}>
            { children }
        </div>
    );
}

const Middle = ( { className, children, ...props }: PropsType ) => {

    className = ( "Middle " + ( className ? className : "" ) ).trim();

    return (

        <div className={className} {...props}>
            { children }
        </div>
    );
}

const Left = ( { className, children, ...props }: PropsType ) => {

    className = ( "Left " + ( className ? className : "" ) ).trim();

    return (

        <div className={className} {...props}>
            { children }
        </div>
    );
}

const Right = ( { className, children, ...props }: PropsType ) => {

    className = ( "Right " + ( className ? className : "" ) ).trim();

    return (

        <div className={className} {...props}>
            { children }
        </div>
    );
}

export { Box, Top, Bottom, Middle, Left, Right };