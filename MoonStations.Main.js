let num_spin
let num_case

function OnDocumentLoad(){

    SetGerigorianDate();
    SetPersianDate();
    //SetMoonPosition();
    setTimeout(spinClass, 1500);
    spin(5);
}

function SetMoonPosition(){

    let calendarData = GetConstellationData();
    let moonPosText = '';

    //(num_case)
    switch (calendarData) {
        case 12: moonPosText = 'The moon is in the Aries'; break;
        case 11: moonPosText = 'The moon is in the Taurus'; break;
        case 10: moonPosText = 'The moon is in the Gemini'; break;
        case 9: moonPosText = 'The moon is in the Cancer'; break;
        case 8: moonPosText = 'The moon is in the Leo'; break;
        case 7: moonPosText = 'The moon is in the Virgo'; break;
        case 6: moonPosText = 'The moon is in the Libra'; break;
        case 5: moonPosText = 'The moon is in the Scorpio'; break;
        case 4: moonPosText = 'The moon is in the Sagittarius'; break;
        case 3: moonPosText = 'The moon is in the Capricorn'; break;
        case 2: moonPosText = 'The moon is in the Aquarius'; break;
        case 1: moonPosText = 'The moon is in the Pisces'; break;
    }
    SetElementInnerText("pMoonPos", moonPosText)
}

function GetConstellationData(){

    // $.getJSON( "CalendarData.json", function( json ) {
    //     console.log( "JSON Data: " + json.users[ 3 ].name );
    //    });

    let todayIndex = GetTodayIndexOfData();
    let constelObj = calendarJSONData[todayIndex];

    for(let prop in constelObj)
    {
        if(prop == "MoonConstellationID")
        {
            return constelObj[prop] - 1;
        }
    }  
}

function GetTodayIndexOfData(){

    for(let i =0; i<calendarJSONData.length; i++)
    {
        let calendarObj = calendarJSONData[i];
        for(let prop in calendarObj)
        {            
            if(prop == "GDate")
            {
                let gDate =  calendarObj[prop];
                let todayDate = GetGerigorianDateSlashTemplate(new Date());
                
                if(gDate.toString() == todayDate.toString())
                {
                    //console.log(true);
                    return i;
                }
            }
        }
    }
}

function GetGerigorianDate(){

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const d = new Date();
    let day = d.getDate();
    let weekDay = days[d.getDay()];
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return weekDay + ' ' + day + ' ' + month + ' ' + year;
}
function GetGerigorianDateSlashTemplate(date){

    const d = date;
    let day = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();

    return  month +'/'+ day + '/' + year;
}

function SetGerigorianDate(){

    let gDate = GetGerigorianDate();
    SetElementInnerText("pGrgrnDate", gDate);
}

function SetPersianDate(){

    let pDate = "تاریخ روز:";
    SetElementInnerText("pPersianDate", pDate);
}

function SetElementInnerText(elementId, innerValue){

    let pElement = document.getElementById(elementId);
    pElement.innerHTML = innerValue;
}

 const spin = (num_case) =>{

    //num_case = Math.floor((Math.random()*12)+1)
     num_spin = num_case
//        console.log(num_spin + " - " + num_spin*30)

    $('.spin>img').addClass('spinClass');
}

function spinClass() {

    $('.spin>img').fadeOut(200);
    $('.spin>img').removeAttr('class');
    //$('.spin>img').css('transform', 'rotate('+((num_spin*30)-15)+'deg)')
    $('.spin>img').css('transform', 'rotate(' + ((num_spin * 30)) + 'deg)');
    $('.spin>img').fadeIn(500);
   
    SetMoonPosition();
}

