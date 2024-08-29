const NEXT_PUBLIC_SELF_BASE_URL: string | undefined = process.env.NEXT_PUBLIC_SELF_BASE_URL; 
const NEXT_PUBLIC_REST_API_BASE_URL: string | undefined = process.env.NEXT_PUBLIC_REST_API_BASE_URL;

const APP_TITLE: string = "Water reserves";
const APP_SUBTITLE: string = "Σύστημα παρακολούθησης υδάτινων πόρων";
const CURRENT_STATUS: string = "Προβολή τρέχουσας κατάστασης";
const SAVINGS: string = "Αποθέματα νερού";
const SAVINGS_RESERVOIR: string = "Αποθέματα νερού (ανά ταμιευτήρα)";
const PRODUCTION: string = "Παραγωγή πόσιμου νερού";
const PRODUCTiON_FACTORY: string = "Παραγωγή πόσιμου νερού (ανά μονάδα επεξεργασίας)";
const PRECIPITATION: string = "Ποσότητες υετού";
const SAVINGS_PRODUCTION: string = "Συνδυασμός αποθεμάτων και παραγωγής νερού";
const SAVINGS_PRECIPITATION: string = "Συνδυασμός αποθεμάτων νερού και ποσοτήτων υετού";

export { 
    NEXT_PUBLIC_REST_API_BASE_URL, 
    NEXT_PUBLIC_SELF_BASE_URL,

    APP_TITLE, 
    APP_SUBTITLE,
    CURRENT_STATUS,
    SAVINGS,
    SAVINGS_RESERVOIR,
    PRODUCTION,
    PRODUCTiON_FACTORY,
    PRECIPITATION,
    SAVINGS_PRODUCTION,
    SAVINGS_PRECIPITATION,    
};