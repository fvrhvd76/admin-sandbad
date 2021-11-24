//@ts-ignore
import moment from "moment-jalaali";

export function urlToFile(url: string, filename: string, mimeType?: string) {
  mimeType = mimeType || (url.match(/^data:([^;]+);/) || "")[1];
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}

export function delay(ms: number): Promise<number> {
  return new Promise(resolve => setTimeout(() => resolve(2), ms));
}

export function tripTimeData(num: number) {
  let hour = 0;
  let minute = 0;
  let time = "";
  hour = Math.floor(num ? num / 60 : 0);
  minute = num ? num % 60 : 0;
  const hourStr = hour.toString().length === 1 ? "0" + hour : hour;
  const minStr = minute.toString().length === 1 ? "0" + minute : minute;
  time = hourStr + " : " + minStr;
  return time;
}

export function factorStatus(status: string) {
  var s = ''
  if (status === 'created') {
    s = 'آماده‌ی پرداخت'
  } else if (status === 'canceled') {
    s = 'لغو شده'
  } else if (status === 'paid') {
    s = 'پرداخت شده'
  } else if (status === 'ready') {
    s = 'پرداخت شده'
  } else if (status === 'searching') {
    s = 'درحال جستجو'
  } else if (status === 'accepted') {
    s = 'پذیرش سفیر'
  } else if (status === 'arrived') {
    s = 'رسیدن به مبدا'
  } else if (status === 'received') {
    s = 'دریافت مرسوله'
  } else if (status === 'sending') {
    s = 'در مسیر مقصد'
  } else if (status === 'reached') {
    s = 'رسیدن به مقصد'
  } else if (status === 'delivered') {
    s = 'تحویل مرسوله'
  } else if (status === 'verified') {
    s = 'تایید دریافت کالا'
  } else if (status === 'failed') {
    s = 'در حال تست'
  } else if (status === 'testing') {
    s = 'در حال تست'
  } else if (status === 'returning') {
    s = 'در حال مرجوع کالا'
  } else if (status === 'rtrnd_accepted') {
    s = 'پذیرش سفیر مرجوعی'
  } else if (status === 'rtrnd_arrived') {
    s = 'رسیدن به مرجوع کننده'
  } else if (status === 'rtrnd_received') {
    s = 'دریافت مرجوعی'
  } else if (status === 'rtrnd_reached') {
    s = 'رسیدن به فروشنده'
  } else if (status === 'rtrnd_delivered') {
    s = 'تحویل مرجوعی'
  } else if (status === 'rtrnd_verified') {
    s = 'تایید دریافت مرجوعی'
  } else if (status === 'returned') {
    s = 'مرجوع شده'
  } else if (status === 'done') {
    s = 'پایان سفارش'
  } else {
    s = 'در حال جستجو'
  }
  return s
}

export function statusColor(status: string) {
  var s = ''
  if (status === 'canceled' || status === 'failed') {
    s = '#f44336'
  } else if (status === 'delivered' || status === 'verified' || status === 'rtrnd_delivered' || status === 'rtrnd_verified' || status === 'returned' || status === 'done') {
    s = '#4caf50'
  } else {
    s = '#ff861f'
  }
  return s
}

export function transmissionStatus(transmission: any) {
  var s = "";
  if (transmission.is_canceled) {
    s = "لغو شده";
  } else if (transmission.is_done) {
    s = "انجام شده";
  } else if (transmission.is_delivered) {
    s = "دریافت شده";
  } else if (transmission.is_reached) {
    s = "رسیدن به مقصد";
  } else if (transmission.is_received) {
    s = "دریافت مرسوله";
  } else if (transmission.is_arrived) {
    s = "رسیدن به مبدا";
  }
  return s;
}

export function checkURL(url: string) {
  return url.match(/\.(jpeg|jpg|gif|png|svg|jfif)$/) != null;
}

export function jalaliConvert(date: string) {
  return moment(date).format("jYYYY/jMM/jDD");
}

export function jalaliConvertWithTime(date: string) {
  return moment(date).format("jYYYY/jMM/jDD - HH:mm");
}

export function truncate(text: string, length: number) {
  return text.length > length ? text.slice(0, length) + "..." : text;
}

export function timeConvertor(num: number) {
  return new Date(num * 1000).toISOString().substr(11, 8)
}