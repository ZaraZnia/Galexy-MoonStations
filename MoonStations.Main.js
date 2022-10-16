let num_spin
let num_case

function OnDocumentLoad(){
    SetGerigorianDate();
    SetPersianDate();
    SetMoonPosition();
}

function SetMoonPosition(){
    var data = ReadDataFromExcel();
}

function ReadDataFromExcel(){
    fileReader.readAsBinaryString(file);
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
 const spin = () =>{
    num_case = Math.floor((Math.random()*12)+1)
     num_spin = num_case
//        console.log(num_spin + " - " + num_spin*30)

    $('.spin>img').addClass('para1');
}

const para2 = () =>{
    $('.spin>img').fadeOut(200)
    $('.spin>img').removeAttr('class')
    //$('.spin>img').css('transform', 'rotate('+((num_spin*30)-15)+'deg)')
    $('.spin>img').css('transform', 'rotate('+((num_spin*30))+'deg)')
    $('.spin>img').fadeIn(500)
    
    const cnstltn = document.getElementById("pCnstltn");

    switch(num_case){
        case 12: $('p').text('The moon is in the Aries'); break;
        case 11: $('p').text('The moon is in the Taurus'); break;
        case 10: $('p').text('The moon is in the Gemini'); break;
        case 9: $('p').text('The moon is in the Cancer'); break;
        case 8: $('p').text('The moon is in the Leo'); break;
        case 7: $('p').text('The moon is in the Virgo'); break;
        case 6: $('p').text('The moon is in the Libra'); break;
        case 5: $('p').text('The moon is in the Scorpio'); break;
        case 4: $('p').text('The moon is in the Sagittarius'); break;
        case 3: $('p').text('The moon is in the Capricorn'); break;
        case 2: $('p').text('The moon is in the Aquarius'); break;
        case 1: $('p').text('The moon is in the Pisces'); break;
    }   
    
}

