const querystring = require("querystring");
const fs = require("fs");
const formidable = require("formidable");

function start(response) {
    console.log("Request handler 'start' was called.");

    const body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" method="post" enctype="multipart/form-data">' +
        '<input type="file" name="upload">' +
        '<input type="submit" value="Upload file" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();

}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    let form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, (error, fields, files) => {
        console.log("parsing done.");
        fs.rename(files.upload.path, "./test.png", (err) => {
            if (error) {
                fs.unlink("./test.png");
                fs.rename(files.upload.path, "./test.png");
            }
        });
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image")
    })
}

function show(response, request) {
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("./test.png").pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;