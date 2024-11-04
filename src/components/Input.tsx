import { isTypingYearMonthDay, isYearMonthDay } from "@/helpers/input/yearMonthDay";
import { isTypingMonthDay, isMonthDay } from "@/helpers/input/monthDay";

const YearMonthDayInput = ( props: any ) => {

    const { onChange } = props;

    const _onChange = ( event: React.ChangeEvent<HTMLInputElement>): void  => {
        if ( isTypingYearMonthDay( event.target.value ) ) {
            onChange( event );
        }
    }

    const _onBlur = ( event: React.ChangeEvent<HTMLInputElement> ): void => {
        if ( ! isYearMonthDay( event.target.value ) ) {
            event.target.value = '';
            onChange( event );
        }
    }

    props = { 
        ...props,
        placeholder: 'YYYY-MM-DD', 
        onChange: _onChange,
        onBlur: _onBlur,
    }

    return <input { ...props } />;
}

const MonthDayInput = ( props: any ) => {

    const { onChange } = props;

    const _onChange = ( event: React.ChangeEvent<HTMLInputElement>): void  => {
        if ( isTypingMonthDay( event.target.value ) ) {
            onChange( event );
        }
    }

    const _onBlur = ( event: React.ChangeEvent<HTMLInputElement> ): void => {
        if ( ! isMonthDay( event.target.value ) ) {
            event.target.value = '';
            onChange( event );
        }
    }

    props = { 
        ...props,
        placeholder: 'MM-DD', 
        onChange: _onChange,
        onBlur: _onBlur,
    }

    return <input { ...props } />;
}

export { YearMonthDayInput, MonthDayInput };
