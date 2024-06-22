class GeneralUtils {
  getFullCurrentDate() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const secunds = date.getSeconds();

    if (month < 10) {
      month = `0${month}`;
    }

    if (day < 10) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day} ${hours}:${minutes}:${secunds}`;
  }
}

module.exports = GeneralUtils;
