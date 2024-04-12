const readLine = require('readline');
const fs = require('fs');
const http = require('http');
const url = require('url'); // Nodejs Routing module
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

// const rl = readLine.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

// rl.question("Please enter your name: ", (name) => {
//     console.log("You entered: "+name)
//     rl.close();
// });

// rl.on('close', () => {
//     console.log("interface closed");
//     process.exit(0);
// })

///////////////////////////////////////////////////////
/* FILE READING & WRITING */

/* To read file syncrousnly (Blocking)*/
// let fileData = fs.readFileSync('./Files/input.txt', 'utf-8');
// console.log("Printing file data ----- ", fileData);

/* To write in file Synchronously */
// let writeContent = `${fileData} \n I am writing some test data in output file`;
// fs.writeFileSync('./Files/output.txt', writeContent);


/* To read file Asyncrousnly (Non-Blocking) */
// fs.readFile('./Files/input.txt', 'utf-8', (err, data) => {
//     if(data){
//         console.log("File Data is: ",data);
//     } else {
//         console.log(err);
//     }
// })
// console.log("Reading File data Asyncrousnly");


///////////////////////////////////////////////////////////
/* SERVER */


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/Data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));
console.log(slugs);

const server = http.createServer((req, res) => {
    const {query, pathname:pathName} = url.parse(req.url, true);

    //Overview
    if(pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    } 
    
    //Product
    else if (pathName === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    } 
    
    //API
    else if (pathName === '/apidata') {
        res.writeHead(200, {'Content-type': 'applicatiion/json'});
        res.end(data);
    } 
    
    //Not Found
    else {
        res.writeHead(404,{
            'Content-type' : 'text/html',
            'my-own-header' : 'testing server routing url'
        });
        res.end("<h1 style='text-align:center'>Page Not Found</h1>");
    }
})

server.listen(8000, 'localhost', () => {
    console.log('Listening to requests on port 8000');
})