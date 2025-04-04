var http = require('http');
var dt = require('./myfirstmodule');
var url = require('url');
var fs = require('fs');

// http.createServer(function (req, res) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write("The date and time are currently: " + dt.myDateTime());

    /* res.writeHead(200, {'Content-Type': 'text/html'});
       var q = url.parse(req.url, true).query;
       var txt = q.year + " " + q.month;
       res.end(txt);*/

    /*var query = url.parse(req.url, true);
    var txt = "." + query.pathname;
    console.log(txt)
    fs.readFile(txt, function (err,data){
        if(err){
            res.writeHead(400, {'Content-Type': 'text/html'});
            return res.end('404 not found')
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    })
    //http://localhost:8081/winter.html */

    /*fs.appendFile('mynewfile1.txt', 'Hello content!', function (err){
        if(err) throw err;
        console.log('Saved!')
    })*/

// }).listen(8081);

/*var rs = fs.createReadStream('./summer.html');
rs.on('open', function (){
    console.log('file is opened')
})*/
