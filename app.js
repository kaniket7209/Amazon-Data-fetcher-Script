const pdf = require('pdfkit');
const fs = require('fs');
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
        let priceEle = $(priceArr[i]).text()
        let badgeEle = $(badgeArr[i]).text()
        let starsEle = $(starsArr[i]).text()
        let starsContriEle = $(starsContribution[i]).text()
        // console.log(nameELe, "--", "₹"+priceEle,"--",badgeEle,"--",starsEle,"--",starsContriEle)
        arr.push({nameELe,priceEle,badgeEle,starsEle,starsContriEle})
        console.log((arr));
        
    }
    let pdfDoc = new pdf
    pdfDoc.pipe(fs.createWriteStream('Data.pdf'));
    pdfDoc.text(JSON.stringify(arr));
    pdfDoc.end();

}
