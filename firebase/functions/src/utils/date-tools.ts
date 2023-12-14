export class DateTools {
  /**
   * calculate the rest days for the aniversary day
   *
   * @param {Date} aniversaryDate
   * @return {number} positive number of the rest days
   */
  public static calculateRestDaysFor(aniversaryDate: Date): number {
    const now = new Date();

    const anivM = aniversaryDate.getMonth();
    const anivD = aniversaryDate.getDate();
    const nowM = now.getMonth();
    const nowD = aniversaryDate.getDate();

    if (nowM < anivM || (nowM === anivM && nowD < anivD)) {
      aniversaryDate.setFullYear(now.getFullYear());
    } else {
      aniversaryDate.setFullYear(now.getFullYear() + 1);
    }

    const diff = Math.floor(aniversaryDate.getTime() - now.getTime());
    const days = diff / (1000 * 3600 * 24);
    return days;
  }
}
