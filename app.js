const pdf = require('pdfkit');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx')
const inputArr = process.argv.slice(2)

// console.log(inputArr[0])
let inpstring = inputArr[0].split(" ")
const name = inpstring.join("+")
// console.log(name)
const request = require('request')
const cheerio = require('cheerio')

let url = `https://www.amazon.in/s?k=${name}`;
console.log(url);
request(url, function (err, response, html) {
    if (err) {
        console.log("Error");
    }
    else {
        // console.log(html);
        fetchdata(html);
    }
})
function fetchdata(html) {
    let $ = cheerio.load(html);

    let nameArr = $(".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2")
    let priceArr = $("span.a-price-whole")
    let badgeArr =  $("span.a-badge-text")
    let starsArr = $("span.a-icon-alt")
    let starsContribution = $("span.a-size-base")
    
    let arr = []
    for (let i = 0; i < nameArr.length ; i++) {
        let nameELe = $(nameArr[i]).text()
        let priceEle = "₹"+$(priceArr[i]).text()
        let badgeEle = $(badgeArr[i]).text()
        let starsEle = $(starsArr[i]).text()
        let starsContriEle = $(starsContribution[i]).text()
        // console.log(nameELe, "--", "₹"+priceEle,"--",badgeEle,"--",starsEle,"--",starsContriEle)
        arr.push({nameELe,priceEle,badgeEle,starsEle,starsContriEle})
        console.log((arr));
        processData(nameELe,priceEle,badgeEle,starsEle,starsContriEle)
        
    }

   /* To convert into pdf uncomment this
    let pdfDoc = new pdf
    pdfDoc.pipe(fs.createWriteStream('Data.pdf'));
    pdfDoc.text(JSON.stringify(arr));
    pdfDoc.end();*/

}

function processData(nameELe,priceEle,badgeEle,starsEle,starsContriEle){
    let dirpath = path.join(__dirname,"Amazon")
    dircreater(dirpath)
    data = "Data"
    let filePath= path.join(dirpath ,data+".xlsx");
    let content = excelReader(filePath,data);
    let dataObj = {
        "NAME " : nameELe,
        "PRICE ": priceEle,
        "BADGE" : badgeEle,
        "NO. OF STARS": starsEle,
        "STARS CONTRIBUTORS" : starsContriEle
    }
    content.push(dataObj)
    excelWriter(filePath,content,data);

}


function dircreater(filepath) {
    if (fs.existsSync(filepath) == false) {
        fs.mkdirSync(filepath);
    }
}
function excelWriter(filePath, json, sheetName) {
    //creates new workbook
    let newwb = xlsx.utils.book_new();
    let newws = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newwb, newws, sheetName);
    xlsx.writeFile(newwb, filePath);
}
function excelReader(filePath, sheetName) {
    // //creates new sheet - (data -> excel format )
    // // add sheet(newwb,ws,sheet name)
    // // file path
    // read
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let exceldata = wb.Sheets[sheetName];//sheet name inside wb
    let ans = xlsx.utils.sheet_to_json(exceldata);
    return ans;
}