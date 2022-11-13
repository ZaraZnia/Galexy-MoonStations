/*
* JalaliJSCalendar - Jalali Extension for Date Object 
* Copyright (c) 2008 Ali Farhadi (http://farhadi.ir/)
* Released under the terms of the GNU General Public License.
* See the GPL for details (http://www.gnu.org/licenses/gpl.html).
* 
* Based on code from http://farsiweb.info
*/

JalaliDate = {
	g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
};

JalaliDate.jalaliToGregorian = function (j_y, j_m, j_d) {
	j_y = parseInt(j_y);
	j_m = parseInt(j_m);
	j_d = parseInt(j_d);
	var jy = j_y - 979;
	var jm = j_m - 1;
	var jd = j_d - 1;

	var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);
	for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

	j_day_no += jd;

	var g_day_no = j_day_no + 79;

	var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
	g_day_no = g_day_no % 146097;

	var leap = true;
	if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
	{
		g_day_no--;
		gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
		g_day_no = g_day_no % 36524;

		if (g_day_no >= 365)
			g_day_no++;
		else
			leap = false;
	}

	gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
	g_day_no %= 1461;

	if (g_day_no >= 366) {
		leap = false;

		g_day_no--;
		gy += parseInt(g_day_no / 365);
		g_day_no = g_day_no % 365;
	}

	for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap); i++)
		g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
	var gm = i + 1;
	var gd = g_day_no + 1;

	return [gy, gm, gd];
}

JalaliDate.checkDate = function (j_y, j_m, j_d) {
	return !(j_y < 0 || j_y > 32767 || j_m < 1 || j_m > 12 || j_d < 1 || j_d >
		(JalaliDate.j_days_in_month[j_m - 1] + (j_m == 12 && !((j_y - 979) % 33 % 4))));
}

JalaliDate.gregorianToJalali = function (g_y, g_m, g_d) {
	g_y = parseInt(g_y);
	g_m = parseInt(g_m);
	g_d = parseInt(g_d);
	var gy = g_y - 1600;
	var gm = g_m - 1;
	var gd = g_d - 1;

	var g_day_no = 365 * gy + parseInt((gy + 3) / 4) - parseInt((gy + 99) / 100) + parseInt((gy + 399) / 400);

	for (var i = 0; i < gm; ++i)
		g_day_no += JalaliDate.g_days_in_month[i];
	if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)))
	/* leap and after Feb */
		++g_day_no;
	g_day_no += gd;

	var j_day_no = g_day_no - 79;

	var j_np = parseInt(j_day_no / 12053);
	j_day_no %= 12053;

	var jy = 979 + 33 * j_np + 4 * parseInt(j_day_no / 1461);

	j_day_no %= 1461;

	if (j_day_no >= 366) {
		jy += parseInt((j_day_no - 1) / 365);
		j_day_no = (j_day_no - 1) % 365;
	}

	for (var i = 0; i < 11 && j_day_no >= JalaliDate.j_days_in_month[i]; ++i) {
		j_day_no -= JalaliDate.j_days_in_month[i];
	}
	var jm = i + 1;
	var jd = j_day_no + 1;


	return [jy, jm, jd];
}

Date.prototype.setJalaliFullYear = function (y, m, d) {
	var gd = this.getDate();
	var gm = this.getMonth();
	var gy = this.getFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	if (y < 100) y += 1300;
	j[0] = y;
	if (m != undefined) {
		if (m > 11) {
			j[0] += Math.floor(m / 12);
			m = m % 12;
		}
		j[1] = m + 1;
	}
	if (d != undefined) j[2] = d;
	var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
	return this.setFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.setJalaliMonth = function (m, d) {
	var gd = this.getDate();
	var gm = this.getMonth();
	var gy = this.getFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	if (m > 11) {
		j[0] += math.floor(m / 12);
		m = m % 12;
	}
	j[1] = m + 1;
	if (d != undefined) j[2] = d;
	var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
	return this.setFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.setJalaliDate = function (d) {
	var gd = this.getDate();
	var gm = this.getMonth();
	var gy = this.getFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	j[2] = d;
	var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
	return this.setFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.getJalaliFullYear = function () {
	var gd = this.getDate();
	var gm = this.getMonth();
	var gy = this.getFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	return j[0];
}

Date.prototype.getJalaliMonth = function () {
	var gd = this.getDate();
	var gm = this.getMonth();
	var gy = this.getFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	return j[1] - 1;
}

Date.prototype.getJalaliDate = function () {
	var gd = this.getDate();
	var gm = this.getMonth();
	var gy = this.getFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	return j[2];
}

Date.prototype.getJalaliDay = function () {
	var day = this.getDay();
	day = (day + 1) % 7;
	return day;
}


/**
* Jalali UTC functions 
*/

Date.prototype.setJalaliUTCFullYear = function (y, m, d) {
	var gd = this.getUTCDate();
	var gm = this.getUTCMonth();
	var gy = this.getUTCFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	if (y < 100) y += 1300;
	j[0] = y;
	if (m != undefined) {
		if (m > 11) {
			j[0] += Math.floor(m / 12);
			m = m % 12;
		}
		j[1] = m + 1;
	}
	if (d != undefined) j[2] = d;
	var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
	return this.setUTCFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.setJalaliUTCMonth = function (m, d) {
	var gd = this.getUTCDate();
	var gm = this.getUTCMonth();
	var gy = this.getUTCFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	if (m > 11) {
		j[0] += math.floor(m / 12);
		m = m % 12;
	}
	j[1] = m + 1;
	if (d != undefined) j[2] = d;
	var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
	return this.setUTCFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.setJalaliUTCDate = function (d) {
	var gd = this.getUTCDate();
	var gm = this.getUTCMonth();
	var gy = this.getUTCFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	j[2] = d;
	var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
	return this.setUTCFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.getJalaliUTCFullYear = function () {
	var gd = this.getUTCDate();
	var gm = this.getUTCMonth();
	var gy = this.getUTCFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	return j[0];
}

Date.prototype.getJalaliUTCMonth = function () {
	var gd = this.getUTCDate();
	var gm = this.getUTCMonth();
	var gy = this.getUTCFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	return j[1] - 1;
}

Date.prototype.getJalaliUTCDate = function () {
	var gd = this.getUTCDate();
	var gm = this.getUTCMonth();
	var gy = this.getUTCFullYear();
	var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
	return j[2];
}

Date.prototype.getJalaliUTCDay = function () {
	var day = this.getUTCDay();
	day = (day + 1) % 7;
	return day;
}

/* Fix time-zone and day-light-saving problem */
var __DatePatch = {
	hasPatched: false,
	MinLastDay: 20,
	MaxLastDay: 23,
	YearDelta: 2010 - 1389,

	isDaylightSavingTime: function (dt, hasDaylightSaving) {
		var month = dt.getUTCMonth() + 1;
		if (month < 3 || month > 9) {
			return false;
		}
		if (month > 3 && month < 9) {
			return true;
		}
		var year = dt.getUTCFullYear();
		var day = dt.getUTCDate();
		var hour = dt.getUTCHours();
		if (month == 3) {
			if (day < __DatePatch.MinLastDay) {
				return false;
			}
			if (day > __DatePatch.MaxLastDay) {
				return true;
			}
			var lastNonSavingDay = JalaliDate.jalaliToGregorian(year - __DatePatch.YearDelta, 1, 1)[2];
			if (day < lastNonSavingDay) {
				return false;
			}
			if (day > lastNonSavingDay) {
				return true;
			}
			if (!hasDaylightSaving && hour == 23) {
				return true;
			}
			return false;
		}
		else if (month == 9) {
			if (day < __DatePatch.MinLastDay) {
				return true;
			}
			if (day > __DatePatch.MaxLastDay) {
				return false;
			}
			var lastSavingDay = JalaliDate.jalaliToGregorian(year - __DatePatch.YearDelta, 6, 30)[2];
			if (day < lastSavingDay) {
				return true;
			}
			if (day > lastSavingDay) {
				return false;
			}
			return hour < 23;
		}
		throw new Error("Invalid month " + month);
	},

	pad: function (num, count) {
		if (!count) {
			count = 2;
		}
		var str = "0000" + num;
		return str.substr(str.length - count);
	},

	doPatch: function () {
		if (__DatePatch.hasPatched) {
			throw new Error("'Date' has been patched before");
		}
		__DatePatch.hasPatched = true;

		var dtp = Date.prototype;
		dtp._shiftToLocalTime = function () {
			var newDate = new Date(this.getTime());
			newDate.setUTCHours(newDate.getUTCHours() + 3, newDate.getUTCMinutes() + 30);
			if (__DatePatch.isDaylightSavingTime(newDate, false)) {
				newDate.setUTCHours(newDate.getUTCHours() + 1);
			}
			return newDate;
		};
		dtp._shiftToUniversalTime = function () {
			var newDate = new Date(this.getTime());
			if (__DatePatch.isDaylightSavingTime(newDate, true)) {
				newDate.setUTCHours(newDate.getUTCHours() - 1);
			}
			newDate.setUTCHours(newDate.getUTCHours() - 3, newDate.getUTCMinutes() - 30);
			return newDate;
		};
		dtp.getDate = function () {
			return this._shiftToLocalTime().getUTCDate();
		};
		dtp.getDay = function () {
			return this._shiftToLocalTime().getUTCDay();
		};
		dtp.getFullYear = function () {
			return this._shiftToLocalTime().getUTCFullYear();
		};
		dtp.getHours = function () {
			return this._shiftToLocalTime().getUTCHours();
		};
		dtp.getMilliseconds = function () {
			return this._shiftToLocalTime().getUTCMilliseconds();
		};
		dtp.getMinutes = function () {
			return this._shiftToLocalTime().getUTCMinutes();
		};
		dtp.getMonth = function () {
			return this._shiftToLocalTime().getUTCMonth();
		};
		dtp.getSeconds = function () {
			return this._shiftToLocalTime().getUTCSeconds();
		};
		dtp.getTimezoneOffset = function () {
			return (__DatePatch.isDaylightSavingTime(this._shiftToLocalTime(), true) ? 4.5 : 3.5) * 60;
		};
		dtp.getYear = function () {
			var year = this.getFullYear();
			if (year >= 1900 && year < 2000) {
				return year - 1900;
			}
			return year;
		};
		dtp.parse = function () {
			throw new Error("Date.parse is not supported");
		};
		dtp.setDate = function (numDate) {
			var dt = this._shiftToLocalTime();
			dt.setUTCDate(numDate);
			this.setTime(dt._shiftToUniversalTime().getTime());
		};
		dtp.setFullYear = function (numYear, numMonth, numDate) {
			var dt = this._shiftToLocalTime();
			if (typeof (numMonth) == "undefined") {
				dt.setUTCFullYear(numYear);
			} else if (typeof (numDate) == "undefined") {
				dt.setUTCFullYear(numYear, numMonth);
			} else {
				dt.setUTCFullYear(numYear, numMonth, numDate);
			}
			this.setTime(dt._shiftToUniversalTime().getTime());
		};
		dtp.setHours = function (numHours, numMin, numSec, numMilli) {
			var dt = this._shiftToLocalTime();
			if (typeof (numMin) == "undefined") {
				dt.setUTCHours(numHours);
			} else if (typeof (numSec) == "undefined") {
				dt.setUTCHours(numHours, numMin);
			} else if (typeof (numMilli) == "undefined") {
				dt.setUTCHours(numHours, numMin, numSec);
			} else {
				dt.setUTCHours(numHours, numMin, numSec, numMilli);
			}
			this.setTime(dt._shiftToUniversalTime().getTime());
		};
		dtp.setMilliseconds = function (numMilli) {
			var dt = this._shiftToLocalTime();
			dt.setUTCMilliseconds(numMilli);
			this.setTime(dt._shiftToUniversalTime().getTime());
		};
		dtp.setMinutes = function (numMinutes, numSeconds, numMilli) {
			var dt = this._shiftToLocalTime();
			if (typeof (numSeconds) == "undefined") {
				dt.setUTCMinutes(numMinutes);
			} else if (typeof (numMilli) == "undefined") {
				dt.setUTCMinutes(numMinutes, numSeconds);
			} else {
				dt.setUTCMinutes(numMinutes, numSeconds, numMilli);
			}
			this.setTime(dt._shiftToUniversalTime().getTime());
		};
		dtp.setYear = function (numYear) {
			if (numYear < 100) {
				this.setFullYear(numYear + 1900);
			} else {
				this.setFullYear(numYear);
			}
		};
		dtp.toDateString = function () {
			var dt = this._shiftToLocalTime();
			return __DatePatch.pad(dt.getUTCFullYear(), 4) + "/" + __DatePatch.pad(dt.getUTCMonth() + 1) + "/" +
				__DatePatch.pad(dt.getUTCDate());
		};
		dtp.toLocaleDateString = function () {
			return this.toDateString();
		};
		dtp.toLocaleString = function () {
			return this.toString();
		};
		dtp.toLocaleTimeString = function () {
			return this.toTimeString();
		};
		dtp.toString = function () {
			return this.toDateString() + " " + this.toTimeString();
		};
		dtp.toTimeString = function () {
			var dt = this._shiftToLocalTime();
			return __DatePatch.pad(dt.getUTCHours()) + ":" + __DatePatch.pad(dt.getUTCMinutes()) + ":" + __DatePatch.pad(dt.getUTCSeconds())
				+ " UTC+0" + (__DatePatch.isDaylightSavingTime(dt, true) ? "430" : "350");
		};
		dtp.setMonth = function (numMonth, dateVal) {
			var dt = this._shiftToLocalTime();
			if (typeof (dateVal) == "undefined") {
				dt.setUTCMonth(numMonth);
			} else {
				dt.setUTCMonth(numMonth, dateVal);
			}
			this.setTime(dt._shiftToUniversalTime().getTime());
		};
		dtp.setSeconds = function (numSeconds, numMilli) {
			var dt = this._shiftToLocalTime();
			if (typeof (numMilli) == "undefined") {
				dt.setUTCSeconds(numSeconds);
			} else {
				dt.setUTCSeconds(numSeconds, numMilli);
			}
			this.setTime(dt._shiftToUniversalTime().getTime());
		};
		Date.create = function (year, month, date, hours, minutes, seconds, ms) {
			var dt = new Date();
			if (typeof (year) == "undefined") {
				year = dt.getFullYear();
				month = dt.getMonth();
				date = dt.getDate();
				hours = dt.getHours();
				minutes = dt.getMinutes();
				seconds = dt.getSeconds();
				ms = dt.getMilliseconds();
			} else if (typeof (month) == "undefined") {
				if (typeof (year) == "number") {
					dt.setTime(year);
				} else if (typeof (year) == "object") {
					dt.setTime(year.getTime());
				} else {
					throw new Error("Invalid argument for Date.create");
				}
			} else {
				if (typeof (hours) == "undefined") {
					hours = minutes = seconds = ms = 0;
				} else if (typeof (minutes) == "undefined") {
					minutes = seconds = ms = 0;
				} else if (typeof (seconds) == "undefined") {
					seconds = ms = 0;
				} else if (typeof (ms) == "undefined") {
					ms = 0;
				}
				dt.setFullYear(year, month, date);
				dt.setHours(hours, minutes, seconds, ms);
			}
			return dt;
		};
	}
};
__DatePatch.doPatch();
