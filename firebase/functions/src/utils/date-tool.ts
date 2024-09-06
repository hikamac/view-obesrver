/**
 * calculate the rest days for the aniversary day
 *
 * @param {Date} aniversaryDate
 * @return {number} positive number of the rest days
 */
export const calculateRestDaysFor = (aniversaryDate: Date): number => {
  const now = new Date();

  const anivM = aniversaryDate.getMonth();
  const anivD = aniversaryDate.getDate();
  const nowM = now.getMonth();
  const nowD = now.getDate();

  if (nowM < anivM || (nowM === anivM && nowD < anivD)) {
    aniversaryDate.setFullYear(now.getFullYear());
  } else {
    aniversaryDate.setFullYear(now.getFullYear() + 1);
  }

  const diff = Math.floor(aniversaryDate.getTime() - now.getTime());
  const days = diff / (1000 * 3600 * 24);
  return days;
};

/**
 * get Date instanse n days ago since now
 *
 * @param {number} n
 * @return {Date} n days ago since now
 */
export const getDateNDaysAgo = (n: number): Date => {
  const today = new Date();
  today.setDate(today.getDate() - n);
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * @param {Date} date
 * @return {string} "yyyy/MM/dd"
 */
export const formatDateIntoYMDWithSlash = (date: Date): string => {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};

/**
 * @param {Date} date
 * @return {string} "HH:mm:ss"
 */
export const formatDateIntoHMSWithColon = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
