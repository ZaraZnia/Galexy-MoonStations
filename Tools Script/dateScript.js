/******************************************************************************
' Filename:       dateScript.js
' Author:         Hooman Behmanesh
' E-Mail:		  hoomb@web.de (please mention persianPopupCalendar in subject)
' Project:        Persian Popup Calendar
' =============================================================================
' Copyright (c) 2008, Hooman Behmanesh. All rights reserved.
'
' Permission is hereby granted, free of charge, to any person obtaining a copy
' of this script and associated files, to deal in the Software without restriction
' including without limitation the rights.
' to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
' copies of the Script, and to permit persons to whom the Software is
' furnished to do so, subject to the following conditions:
'
' The above copyright notice and this permission notice shall be included in
' all copies or substantial portions of the Scripts:
'
' THE SCRIPT IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
' IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
' FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
' AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
' LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
' OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
' SOFTWARE.
'
' =============================================================================
'	Thanks to:
' - Xin Yang (http://www.yxscripts.com) for his earlier version of "Popup Calendar(Window)"
' which I have used as base kernel of this script.
' - John Walker (http://www.fourmilab.ch/documents/calendar/)
' JavaScript functions for the Fourmilab Calendar Converter
' =============================================================================
'
' I will really appreciate if you send me any changed, fixed bugs or
' extended version of this Script by you to help to extend the script.
' Also I will have the pleasure to receive any reported bug and suggestions.
'
' You can use following fields to record your name to prove your
' Development participate in Persian Popup Calendar Script project.
'
' =============================================================================
' Date          Person							Description
' ----------    ----------------		---------------------------------
' 30.03.2006    Hooman Behmanesh  	Initial Version
' 25.09.2006    Hooman Behmanesh  	Fix the wrong date issue
' 28.09.2006    Hooman Behmanesh	Fix the Weekday bug
' 06.06.2008	Hooman Behmanesh	Completely redesigned with Fourmilab date algorithms
*******************************************************************************/
document.write("<scr" + "ipt src='./astro.js'></script>");

var dkSolar = 0;
var dkGregorian = 1;

function isLeapYear(DateKind, Year)
{
	if (DateKind == dkSolar)
		return leapPersian(Year);
	else
		return leapGregorian(Year);
}

//  LEAP_PERSIAN  --  Is a given year a leap year in the Persian calendar ?

function leapPersian(year)
{
    return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
}

//  persianToJd  --  Determine Julian day from Persian date
var PERSIAN_EPOCH = 1948320.5;

function persianToJd(year, month, day)
{
    var epbase, epyear;

    epbase = year - ((year >= 0) ? 474 : 473);
    epyear = 474 + mod(epbase, 2820);

    return day +
            ((month <= 7) ?
                ((month - 1) * 31) :
                (((month - 1) * 30) + 6)
            ) +
            Math.floor(((epyear * 682) - 110) / 2816) +
            (epyear - 1) * 365 +
            Math.floor(epbase / 2820) * 1029983 +
            (PERSIAN_EPOCH - 1); 
}

//  JD_TO_PERSIAN  --  Calculate Persian date from Julian day
function jdToPersian(jd)
{
    var year, month, day, depoch, cycle, cyear, ycycle,
        aux1, aux2, yday;

    jd = Math.floor(jd) + 0.5;

    depoch = jd - persianToJd(475, 1, 1);
    cycle = Math.floor(depoch / 1029983);
    cyear = mod(depoch, 1029983);
    if (cyear == 1029982) {
        ycycle = 2820;
    } else {
        aux1 = Math.floor(cyear / 366);
        aux2 = mod(cyear, 366);
        ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
                    aux1 + 1;
    }
    year = ycycle + (2820 * cycle) + 474;
    if (year <= 0) {
        year--;
    }
    yday = (jd - persianToJd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day = (jd - persianToJd(year, month, 1)) + 1;
    return new Array(year, month, day);
}

//  leapGregorian  --  Is a given year in the Gregorian calendar a leap year ?

function leapGregorian(year)
{
    return ((year % 4) == 0) &&
            (!(((year % 100) == 0) && ((year % 400) != 0)));
}

//  gregorianToJd  --  Determine Julian day number from Gregorian calendar date

var GREGORIAN_EPOCH = 1721425.5;

function gregorianToJd(year, month, day)
{
    return (GREGORIAN_EPOCH - 1) +
           (365 * (year - 1)) +
           Math.floor((year - 1) / 4) +
           (-Math.floor((year - 1) / 100)) +
           Math.floor((year - 1) / 400) +
           Math.floor((((367 * month) - 362) / 12) +
           ((month <= 2) ? 0 : (leapGregorian(year) ? -1 : -2) ) + day);
}

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day
function jdToGregorian(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
        yindex, dyindex, year, yearday, leapadj;

    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
        year++;
    }
    yearday = wjd - gregorianToJd(year, 1, 1);
    leapadj = ((wjd < gregorianToJd(year, 3, 1)) ? 0
                                                  :
                  (leapGregorian(year) ? 1 : 2)
              );
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day = (wjd - gregorianToJd(year, month, 1)) + 1;

    return new Array(year, month, day);
}

function gregorianToSolar(gYear, gMonth, gDay) {
  var dDate = new Date();
  if (gDay == 0 && gMonth == 0 && gYear == 0)	{
			gDay = dDate.getDate();
			gMonth = dDate.getMonth() + 1;
			gYear = dDate.getFullYear();
			gWeekDay = dDate.getDay();
  } else {
			dDate = new Date(gYear, gMonth, gDay);
			gWeekDay = dDate.getDay();
  }
  
  var persianDate = jdToPersian(gregorianToJd(gYear, gMonth, gDay));
	this.pYear = persianDate[0];
	this.pMonth = persianDate[1] - 1;
	this.pDay = persianDate[2];
	
	this.getDate  = function () { return this.pDay; };
	this.getMonth = function () { return this.pMonth; };
	this.getYear  = function () { return this.pYear; };
	this.getFullYear = function () { return this.pYear; };
}

function solarToGregorian(sYear, sMonth, sDay) {

    if (sDay == 0 && sMonth == 0 && sYear == 0) {
			dDate = new Date();

			return dDate;
    }
    
    var gregorianDate = jdToGregorian(persianToJd(sYear, sMonth, sDay));
    
	return new Date(gregorianDate[0], gregorianDate[1] - 1, gregorianDate[2]);
}

function calcWeekday(year, mon, mday) {
    var sec, min, hour;
    hour = sec = min = 0;
    var j = gregorianToJd(year, mon + 1, mday) +
        (Math.floor(sec + 60 * (min + 60 * hour) + 0.5) / 86400.0);

    return jwday(j);
}
