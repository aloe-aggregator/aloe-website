/**
 * get the gap between 2 dates
 * @param  {Date}            d1  Date 1
 * @param  {Date}            d2  Date 2 > Date 1
 * @param  {String[s|m|h|d]} u   Unit (s : seconds, m : minutes, h : hours, d : days)
 * @return the gap in number
 */
getDayGap = function(d1, d2, u) {
    div = 1;
    switch (u) {
        case 's':
            div = 1000;
            break;
        case 'm':
            div = 1000 * 60;
            break;
        case 'h':
            div = 1000 * 60 * 60;
            break;
        case 'd':
            div = 1000 * 60 * 60 * 24;
            break;
    }

    diff = d2.getTime() - d1.getTime();

    return Math.ceil((diff / div));
};

/**
 * get a date before an other with a gap in days
 * @param  {Number} nbDays  Number of days to remove
 * @return the date before the gap
 */
backToPastDay = function(nbDays) {
    return new Date(new Date().getTime() - nbDays * 1000 * 60 * 60 * 24);
};