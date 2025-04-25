// export const monthsWithWeeks = (t) => {
//   let data = [
//     `JAN (${t("property_page.Week")}-1)`,
//     `JAN (${t("property_page.Week")}-2)`,
//     `JAN (${t("property_page.Week")}-3)`,
//     `JAN (${t("property_page.Week")}-4)`,
//     `JAN (${t("property_page.Week")}-5)`,
//     `FEB (${t("property_page.Week")}-6)`,
//     `FEB (${t("property_page.Week")}-7)`,
//     `FEB (${t("property_page.Week")}-8)`,
//     `FEB (${t("property_page.Week")}-9)`,
//     `MAR (${t("property_page.Week")}-10)`,
//     `MAR (${t("property_page.Week")}-11)`,
//     `MAR (${t("property_page.Week")}-12)`,
//     `MAR (${t("property_page.Week")}-13)`,
//     `APR (${t("property_page.Week")}-14)`,
//     `APR (${t("property_page.Week")}-15)`,
//     `APR (${t("property_page.Week")}-16)`,
//     `APR (${t("property_page.Week")}-17)`,
//     `MAY (${t("property_page.Week")}-18)`,
//     `MAY (${t("property_page.Week")}-19)`,
//     `MAY (${t("property_page.Week")}-20)`,
//     `MAY (${t("property_page.Week")}-21)`,
//     `JUN (${t("property_page.Week")}-22)`,
//     `JUN (${t("property_page.Week")}-23)`,
//     `JUN (${t("property_page.Week")}-24)`,
//     `JUN (${t("property_page.Week")}-25)`,
//     `JUN (${t("property_page.Week")}-26)`,
//     `JUL (${t("property_page.Week")}-27)`,
//     `JUL (${t("property_page.Week")}-28)`,
//     `JUL (${t("property_page.Week")}-29)`,
//     `JUL (${t("property_page.Week")}-30)`,
//     `AUG (${t("property_page.Week")}-31)`,
//     `AUG (${t("property_page.Week")}-32)`,
//     `AUG (${t("property_page.Week")}-33)`,
//     `AUG (${t("property_page.Week")}-34)`,
//     `SEP (${t("property_page.Week")}-35)`,
//     `SEP (${t("property_page.Week")}-36)`,
//     `SEP (${t("property_page.Week")}-37)`,
//     `SEP (${t("property_page.Week")}-38)`,
//     `OCT (${t("property_page.Week")}-39)`,
//     `OCT (${t("property_page.Week")}-40)`,
//     `OCT (${t("property_page.Week")}-41)`,
//     `OCT (${t("property_page.Week")}-42)`,
//     `OCT (${t("property_page.Week")}-43)`,
//     `NOV (${t("property_page.Week")}-44)`,
//     `NOV (${t("property_page.Week")}-45)`,
//     `NOV (${t("property_page.Week")}-46)`,
//     `NOV (${t("property_page.Week")}-47)`,
//     `DEC (${t("property_page.Week")}-48)`,
//     `DEC (${t("property_page.Week")}-49)`,
//     `DEC (${t("property_page.Week")}-50)`,
//     `DEC (${t("property_page.Week")}-51)`,
//     `DEC (${t("property_page.Week")}-52)`,
//   ];
//   return data;
// };
export const monthsWithWeeks = (t) => {
  // Get the current year
  const year = new Date().getFullYear();

  // Generate actual week data
  const data = [];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Start with January 1st
  let currentDate = new Date(year, 0, 1);

  // Get the last day of the year
  let endDate = new Date(year, 11, 31);

  while (currentDate <= endDate) {
    // Get ISO week number
    const weekNum = getWeekNumber(currentDate);

    // Get month
    const monthIndex = currentDate.getMonth();
    const monthName = months[monthIndex];

    // Add to data array
    data.push(`${monthName} (${t("property_page.Week")}-${weekNum})`);

    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return data;
};

// Add the ISO week calculation function
function getWeekNumber(date) {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);

  const firstThursday = new Date(target.getFullYear(), 0, 1);
  if (firstThursday.getDay() !== 4) {
    firstThursday.setMonth(0, 1 + ((4 - firstThursday.getDay() + 7) % 7));
  }

  const weekNumber =
    1 + Math.ceil((target - firstThursday) / (7 * 24 * 60 * 60 * 1000));
  return weekNumber;
}
