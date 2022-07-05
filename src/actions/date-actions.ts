/*
@types[1: Repeat, 2: Weekly, 3:Semester]
Repeat has an expiration date of 5 years
Weekly: Expiration date is scheduled a week from the date it's called
Semester: The expiratin date is based on periods
    The 2 periods are 
        [1 September - 31 January (1/9 - 31/1)]
        [1 Februray - 30 June (1/2 - 30/6)]
        Because of the meaning of semesters
*/
export function getDateBasedOnType(type: Number): Date {
    const expirationDate = new Date();
    const now = new Date();
    switch (type) {
        case 1: {
            expirationDate.setFullYear(expirationDate.getFullYear() + 5)
            break;
        }
        case 2: {
            expirationDate.setDate(expirationDate.getDate() + 7)
            break;
        }
        //Remember, months are 0-based so January is 0 and June is 5
        case 3: {
            const month = now.getMonth() + 1
            if (month > 1 && month <= 6) {
                const year = now.getFullYear().toString()
                const semExp = new Date('June 30, ' + year + ' 23:59:59');
                return semExp;
            }
            //Don't care about concrete semester dates, availability checks will be done at runtime
            //We only care about when the pass is created right now
            else if ((month >= 7 && month <= 12) || month === 1) {
                const nextYear = (now.getFullYear() + 1).toString()
                const semExp = new Date('January 31, ' + nextYear + ' 23:59:59')
                return semExp;
            }
        }
    }
    return expirationDate;
}

/*
@returns if a pass is active
The 2 semester periods are 
        [1 September - 31 January (1/9 - 31/1)]
        [1 Februray - 30 June (1/2 - 30/6)]
*/

export function isActive(passDate: Date, type: Number): Boolean {
    const now = new Date()

    //Pass is expired if the expirationDate is past
    if (now > passDate) {
        return false;
    }
    //Semester checks
    if (type === 3) {
        //reject if now is july or august
        //months are 0-based so july=6, august = 7
        if (now.getMonth() === 6 || now.getMonth() === 7) {
            return false;
        }
        //If the pass expires next year it means that all months past august are valid
        else if (passDate.getFullYear() > now.getFullYear()) {
            if (now.getMonth() > 7)
                return true;
            return false;
        }
        //If the year is the same then we only have to check that the month is before july
        else if (passDate.getFullYear() === now.getFullYear()) {
            if (passDate.getMonth() < 6)
                return true;
            return false;
        }
    }
    else
        return true;

    return false;
}
