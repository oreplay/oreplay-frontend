import i18next from "i18next";
import moment from "moment";

export function getCurrentDate()
{
    let today = moment()
    return today;
};

export function parseDate(dateString: string)
{
    let language = i18next.language;
    
    switch (language){
        case 'en-GB':
            moment.locale('en');
            break;
        case 'es-ES':
            moment.locale('es');
            break;
            
    }
    return moment(dateString).format('L');
};