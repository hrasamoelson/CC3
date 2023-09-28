import express from "express";
import morgan from "morgan";
import createError from "http-errors";
import logger from "loglevel";

logger.setLevel(logger.levels.DEBUG);
const host = "localhost";
const port = 8000;

const app = express();

app.set("view engine", "ejs");

if (app.get("env") === "development") app.use(morgan("dev"));

app.use(express.static("static"));

app.get(["/", "/index.html"], async function (request, response, next) {
    response.sendFile("index.html", { root: "./" });
});

app.get("/random/:nb", async function (request, response, next) {
    const length = Number.parseInt(request.params.nb,10);
    if (Number.isNaN(length)){
        return next(createError(400))
    }
    const contents = Array.from({ length }).map((_) =>
        Math.floor(100 * Math.random())
    );
    return response.render("random", {
        welcome: "Random numbers:",
        numbers: contents,
    });
});

const server = app.listen(port, host);

server.on("listening", () =>
    logger.info(
        `HTTP listening on http://${server.address().address}:${
            server.address().port
        } with mode '${process.env.NODE_ENV}'`
    )
);

logger.info(`File ${import.meta.url} executed.`);
