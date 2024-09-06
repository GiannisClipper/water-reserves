const timeLabel = ( value: string ): string => {

    switch ( value.length ) {
        case 10:
            return 'Ημ/νία';
        case 7:
            return 'Μήνας';
        case 4:
            return 'Έτος';
    }
    return '';
}

export { timeLabel };