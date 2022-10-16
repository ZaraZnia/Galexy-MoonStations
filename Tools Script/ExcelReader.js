let fileReader = new FileReader();

function excelReader (event) {
   const data = event.target.result;
   const workbook = XLSX.read(data, { type: "binary" });
   const rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
}




function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
		if(roa.length > 0) result[sheetName] = roa;
	});
	return result;
}
