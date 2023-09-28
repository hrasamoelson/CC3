import http from "node:http";
import fs from "node:fs/promises";
import { error } from "node:console";

const host = "localhost";
const port = 8000;

console.log("NODE_ENV =", process.env.NODE_ENV);

///function requestListener(_request, response) {
/// response.writeHead(200);
///response.end("<html><h1>My first server!<h1></html>");
///}

//function requestListener(_request, response) {
// response.setHeader("Content-Type", "application/json");
// response.end(JSON.stringify({ message: "I'm OK" }));
// }

//function requestListener(_request, response) {
//fs.readFile("index.html", "utf8")
//.then((contents) => {
//response.setHeader("Content-Type", "text/html");
//response.writeHead(200);
//return response.end(contents);
//})
//.catch((error) => {
//response.writeHead(500);
//response.end(`${error}}`);
//});
//}

// async function requestListener(_request, response) {
//   try {
//     const contents = await fs.readFile("index.html", "utf8");
//     response.setHeader("Content-Type", "text/html");
//     response.writeHead(200);
//     return response.end(`${contents}`);
//   } catch (error) {
//     response.writeHead(500);
//     response.end(`${error}}`);
//   }
// }

let nb = 1;
async function requestListener(request, response) {
    response.setHeader("Content-Type", "text/html");
    let random_numbers = [];
    try {
        const contents = await fs.readFile("index.html", "utf8");
        switch (request.url.split("/")[1]) {
            case "random":
                response.writeHead(200);
                nb = request.url.split("/")[2];
                return response.end(`<html><p>Nouveau nb =${nb}</p></html>`);
            case "":
                response.writeHead(200);
                return response.end(contents);
            case "index.html":
                response.writeHead(200);
                return response.end(contents);
            case "random.html":
                response.writeHead(200);
                for (let i = 0; i < nb; i++) {
                    random_numbers.push(Math.floor(100 * Math.random()));
                }
                return response.end(`<html><p>${random_numbers}</p></html>`);
            default:
                response.writeHead(404);
                return response.end(`<html><p>404: NOT FOUND</p></html>`);
        }
    } catch (error) {
        console.error(error);
        response.writeHead(500);
        return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
    }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
