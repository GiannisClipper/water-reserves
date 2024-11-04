import { isTypingYearMonthDate, isYearMonthDate } from "@/helpers/input";

const DateInput = ( props: any ) => {

    const { onChange } = props;

    const onChangeDate = ( event: React.ChangeEvent<HTMLInputElement>): void  => {
        if ( isTypingYearMonthDate( event.target.value ) ) {
            onChange( event );
        }
    }

    const onBlurDate = ( event: React.ChangeEvent<HTMLInputElement> ): void => {
        if ( ! isYearMonthDate( event.target.value ) ) {
            event.target.value = '';
            onChange( event );
        }
    }

    props = { 
        ...props,
        placeholder: 'YYYY-MM-DD', 
        onChange: onChangeDate,
        onBlur: onBlurDate,
    }

    return <input { ...props } />;
}

export { DateInput };
