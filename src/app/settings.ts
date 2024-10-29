const NEXT_PUBLIC_REST_API_BASE_URL: string | undefined = process.env.NEXT_PUBLIC_REST_API_BASE_URL;

const APP_TITLE: string = "Water reserves";
const APP_SUBTITLE: string = "Platform of water management data";
const STATUS: string = "Current status";
const SAVINGS: string = "Water reserves";
const PRODUCTION: string = "Drinking water production";
const PRECIPITATION: string = "Precipitation measurements";
const TEMPERATURE: string = "Temperature in Athens";
const INTERRUPTIONS: string = "Water supply interruptions";
const SAVINGS_PRODUCTION: string = "Water reserves & production";
const SAVINGS_PRECIPITATION: string = "Water reserves & precipitation";

const STATUS_DESCR: string = "The most recent measurements of reserves, production, precipitation and Athen's temperature. As well as evaluation of the current status compared to historical data.";
const SAVINGS_DESCR: string = "The available water quantities in the main reservoirs of Marathonas, Iliki, Mornos and, Evinos. Daily reported since 1985.";
const PRODUCTION_DESCR: string = "The drinking water production in the water treatment plants of EYDAP (Galatsi, Menidi, Kiourka, Aspropyrgos). Daily reported since 1996.";
const PRECIPITATION_DESCR: string = "Indicative precipitation measurements from Central Greece. Daily reported since 1985.";
const TEMPERATURE_DESCR: string = "The min/ mean/ max temperature in Athens. Daily reported since 1985.";
const INTERRUPTIONS_DESCR: string = "The events of water supply interruptions in Athens. Daily reported since 2021.";
const SAVINGS_PRODUCTION_DESCR: string = "Combination between water reservres and drinking water production data.";
const SAVINGS_PRECIPITATION_DESCR: string = "Combination between water reserves and precipitation measurements.";

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

    STATUS_DESCR,
    SAVINGS_DESCR,
    PRODUCTION_DESCR,
    PRECIPITATION_DESCR,
    TEMPERATURE_DESCR,
    INTERRUPTIONS_DESCR,
    SAVINGS_PRODUCTION_DESCR,
    SAVINGS_PRECIPITATION_DESCR
};