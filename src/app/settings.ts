const NEXT_PUBLIC_REST_API_BASE_URL: string | undefined = process.env.NEXT_PUBLIC_REST_API_BASE_URL;

const APP_TITLE: string = "Water reserves";
const APP_SUBTITLE: string = "Platform of water management data";
const STATUS: string = "Current status";
const SAVINGS: string = "Water reserves";
const PRODUCTION: string = "Drinking water production";
const PRECIPITATION: string = "Precipitation measurements";
const TEMPERATURE: string = "Temperatures in Athens";
const INTERRUPTIONS: string = "Water supply interruptions";
const SAVINGS_PRODUCTION: string = "Water reserves & production";
const SAVINGS_PRECIPITATION: string = "Water reserves & precipitation";

export { 
    NEXT_PUBLIC_REST_API_BASE_URL, 

    APP_TITLE, 
    APP_SUBTITLE,
    STATUS,
    SAVINGS,
    PRODUCTION,
    PRECIPITATION,
    TEMPERATURE,
    INTERRUPTIONS,
    SAVINGS_PRODUCTION,
    SAVINGS_PRECIPITATION,
};