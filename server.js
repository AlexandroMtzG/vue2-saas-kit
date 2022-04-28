// Get dependencies
const express = require("express");
const bodyParser = require("body-parser");
const history = require("connect-history-api-fallback");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
let distDir = __dirname + "/dist";

app.use(express.static(distDir));
app.use(
    history({
        disableDotRule: true,
        verbose: true
    })
);
app.use(express.static(distDir));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);

    next();
});

app.get("/", function (req, res) {
    res.render(path.join(__dirname + "/dist/index.html"));
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log("App now running on port", port);
});
