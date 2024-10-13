const NEXT_PUBLIC_REST_API_BASE_URL: string | undefined = process.env.NEXT_PUBLIC_REST_API_BASE_URL;

const APP_TITLE: string = "Water reserves";
const APP_SUBTITLE: string = "Σύστημα παρακολούθησης υδάτινων πόρων";
const STATUS: string = "Τρέχουσα κατάσταση";
const SAVINGS: string = "Αποθέματα νερού";
const PRODUCTION: string = "Παραγωγή πόσιμου νερού";
const PRECIPITATION: string = "Ενδεικτικές μετρήσεις υετού";
const TEMPERATURE: string = "Θερμοκρασίες Αθήνας";
const SAVINGS_PRODUCTION: string = "Αποθέματα και παραγωγή νερού";
const SAVINGS_PRECIPITATION: string = "Αποθέματα και μετρήσεις υετού";

export { 
    NEXT_PUBLIC_REST_API_BASE_URL, 

    APP_TITLE, 
    APP_SUBTITLE,
    STATUS,
    SAVINGS,
    PRODUCTION,
    PRECIPITATION,
    TEMPERATURE,
    SAVINGS_PRODUCTION,
    SAVINGS_PRECIPITATION,
};