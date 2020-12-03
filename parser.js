let request = require("request");
let cheerio= require("cheerio");
let url='';
let furl='';
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
        if(price)
        console.log(phoneName);
        console.log(price);
         
    }
    
    // if(price<140000){
    //     console.log("cheap");
    // } 
  }
}
