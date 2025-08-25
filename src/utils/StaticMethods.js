export class StaticMethods {
  static GetDateInCSharpFormat = (JSDate = new Date()) => {
    let CSDate = ""; // CS DateTime format is MM/dd/yyyy hh:mm:ss tt
    // JavaScript ISO format: YYYY-MM-DDTHH:MM:SSZ
    let isTimeInAM = false;
    try {
      var month = JSDate.getUTCMonth() + 1; // Add +1 because Javascript months starts from 0-11
      if (month < 10) {
        CSDate += "0" + month; // insert starting 0 forcefully as month 1-9 are single digit months.
      } else {
        CSDate += month;
      }
      var date = JSDate.getUTCDate();
      if (date < 10) {
        CSDate += "/0" + date; // insert starting 0 forcefully as date 1-9 are single digit dates.
      } else {
        CSDate += "/" + date;
      }
      var year = JSDate.getUTCFullYear();
      CSDate += "/" + year;

      var hours = JSDate.getUTCHours();
      if (hours < 13) {
        if (hours == 0) {
          CSDate += " 12";
        } else if (hours < 10) {
          CSDate += " 0" + hours; // insert starting 0 forcefully as hour 1-9 are single digit hours.
        } else {
          CSDate += " " + hours;
        }
        isTimeInAM = true;
      } else {
        hours -= 12; // conversion of 24 hours to 12 hours with AM / PM
        if (hours < 10) {
          CSDate += " 0" + hours; // insert starting 0 forcefully as hour 1-9 are single digit hours.
        } else {
          CSDate += " " + hours;
        }
      }

      var minutes = JSDate.getUTCMinutes();
      if (minutes < 10) {
        CSDate += ":0" + minutes; // insert starting 0 forcefully as minute 1-9 are single digit minutes.
      } else {
        CSDate += ":" + minutes;
      }

      var seconds = JSDate.getUTCSeconds();
      if (seconds < 10) {
        CSDate += ":0" + seconds; // insert starting 0 forcefully as second 1-9 are single digit seconds.
      } else {
        CSDate += ":" + seconds;
      }

      if (isTimeInAM) {
        CSDate += " AM";
      } else {
        CSDate += " PM";
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      return CSDate;
    }
  };

  static GetDateMonthYearString = (JSDate = new Date()) => {
    let CSDate = ""; // CS DateTime format is MM/dd/yyyy hh:mm:ss tt
    // JavaScript ISO format: YYYY-MM-DDTHH:MM:SSZ
    try {
      var month = JSDate.getUTCMonth() + 1; // Add +1 because Javascript months starts from 0-11
      if (month < 10) {
        CSDate += "0" + month; // insert starting 0 forcefully as month 1-9 are single digit months.
      } else {
        CSDate += month;
      }
      var date = JSDate.getUTCDate();
      if (date < 10) {
        CSDate += "/0" + date; // insert starting 0 forcefully as date 1-9 are single digit dates.
      } else {
        CSDate += "/" + date;
      }
      var year = JSDate.getUTCFullYear();
      CSDate += "/" + year;
    } catch (error) {
      console.log(error.message);
    } finally {
      return CSDate;
    }
  };

  static getTwoDecimalPlacesString = (number) => {
    let num = Number(number);

    return (Math.round(num * 100) / 100)?.toFixed(2);
  }

}
