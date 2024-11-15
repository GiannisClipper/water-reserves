type PropsType = { [ key: string ]:any };

const CubicMeters = ( { ...props }: PropsType ) =>
    <span { ...props }>m<sup>3</sup></span>

export { CubicMeters };