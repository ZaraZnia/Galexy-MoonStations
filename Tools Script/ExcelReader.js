
// Button Click Event
// function excelReader (event) {
//    const data = event.target.result;
//    const workbook = XLSX.read(data, { type: "binary" });
//    const rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
// }

// let AuthUser = function(data) {
//     return google.login(data.username, data.password)
//   }
  
//   let userToken = await AuthUser(data)
//   console.log(userToken) // your data

// function ReadDataFromExcel(){
   
//     const excelFile = getExcelFileFromUrl("D:\Work\GitRepositories\Galexy-MoonStations\Resources\CalendarData.xlsx", "binary/xlsx")
//         .then(token => { return token });

//     //console.log(exelFile);
//     // let file = excelFile().then(result);
//     // return excelFileToJSON(file);
// }

// async function getExcelFileFromUrl(url){
//     let response = await fetch(url);
//     let data = await response.blob();
//     console.log(data);
//     let metadata = {
//       type: "binary/xlsx"
//     };
//     return new File([data], "result.xlsx", metadata);
//   } 

function uploadExcelFile(){
	var files = document.getElementById('temp_file_upload').files;
        if(files.length==0){
          alert("Please choose any file...");
          return;
        }
        var filename = files[0].name;
        var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
        if (extension == '.XLS' || extension == '.XLSX') {
          excelFileToJSON(files[0]);
        }
        else{
          alert("Please select a valid excel file.");
        }
}

function excelFileToJSON(file){
    try {
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = function(e) {
        var data = e.target.result;
		
        var workbook = XLSX.read(data, {
          type : 'binary'
        });
        var result = {
        };
        workbook.SheetNames.forEach(function(sheetName) {
          var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          if (roa.length > 0) {
            result[sheetName] = roa;
          }
        }
                                   );
        //displaying the json result
        var resultEle=document.getElementById("json-result");
        resultEle.value=JSON.stringify(result, null, 4);
        resultEle.style.display='block';
      }
    }
    catch(e){
      console.error(e);
    }
  }
