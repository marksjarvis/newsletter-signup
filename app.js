const express = require("express");
const https = require("https");
// No need to install https in node as it is a native module //
const bodyParser = require("body-parser");

require('dotenv').config({ path: 'vars/.env' });
const MAPI_KEY = process.env.API_KEY
const MLIST_ID = process.env.LIST_ID
const MAPI_SERVER = process.env.API_SERVER

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const emailAddress = req.body.eAddress;

    const data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://" + MAPI_SERVER + ".api.mailchimp.com/3.0/lists/" + MLIST_ID;

    const options = {
        method: "POST",
        auth: "mark1:" + MAPI_KEY
    };

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");

        } else {
            res.sendFile(__dirname + "/failure.html");

        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    // USE THIS FOR LOCALHOST request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
});

