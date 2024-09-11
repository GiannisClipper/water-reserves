import type { ObjectType } from "@/types";

const lexicon: ObjectType = {
    date: 'Ημ/νία',
    month: 'Μήνας',
    year: 'Έτος',
    custom_year: 'Υδρολογικό έτος',
    reservoir: 'Ταμιευτήρας',
    quantity: 'Ποσότητα',
    diff: 'Διαφορά',
    percent: '%',
    total: 'Σύνολο',
};

const translate = ( key: string ): string => {
    if ( lexicon[ key ] ) {
        return lexicon[ key ];
    }
    return key;
}

export { lexicon, translate };