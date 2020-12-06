let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let xlsx = require("xlsx");

request("https://www.amazon.in/",whendataarrive1);
function whendataarrive1(err,resp,html){
   // console.log(html);
    console.log("received html");
    let sTool=cheerio.load(html);
    let MobileLink=sTool("a[data-csa-c-content-id='nav_cs_mobiles']").attr("href");
    url="https://www.amazon.in/"+MobileLink;
    console.log(url);
     secondpage(url);
}
function secondpage(url){
 request(url,whendataarrive);
 function whendataarrive(err,resp,html){
   // console.log(html);
    console.log("received html");
    let sTool=cheerio.load(html);
    let budgetlink=sTool("a[aria-label='15-20k']").attr("href");
    //  console.log(budgetlink);
    let furl="https://www.amazon.in/"+budgetlink;
    // console.log(furl);
    lastpage(furl);
    }
}
function lastpage(furl){
 request(furl,whendataarrive);
 function whendataarrive(err,resp,html){
    console.log("received html");
    let sTool=cheerio.load(html);
    let phoneNamelink=sTool("h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2"); 
    let priceLink=sTool(".a-row.a-size-base.a-color-base .a-price-whole");
    for(let i=0;i<phoneNamelink.length;++i){
        let phoneNameArr=sTool(phoneNamelink[i]).text();
        let phoneName=phoneNameArr.trim();
        let priceArr=sTool(priceLink[i]).text();
        let price=priceArr;
        // if(price)
        // console.log(phoneName);
        // console.log(price);
        processData(price,phoneName)  
    }
    
    // if(price<140000){
    //     console.log("cheap");
    // } 
  }
}

function processData(price,phoneName)
{
    let dirPath = "Amazon";
    catgry = "Budget Phones"
    let CData=
    {
        Price:price,
        Name:phoneName
    }

    if (fs.existsSync(dirPath))
    {

    }
    else
    {
        fs.mkdirSync(dirPath);
    }
    let Path= path.join(dirPath,catgry+".xlsx");
    let Data=[];

    if(fs.existsSync(Path))
    {
    Data=excelReader(Path,catgry)
    Data.push(CData);
    }

    else
    {
    console.log(Path,"created");
    Data=[CData];
    }
    excelWriter(Path,Data,catgry);
}

function excelReader(Path,catgry) 
{
    if (!fs.existsSync(Path)) 
    {
        return null;
    } 
    else
    {
    let wt = xlsx.readFile(Path);
    let excelData = wt.Sheets[catgry];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
    }
}

function excelWriter(Path, json, catgry) 
{
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, catgry); 
    xlsx.writeFile(newWB, Path);
}
