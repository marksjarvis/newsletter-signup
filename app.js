const express = require("express");
const https = require("https");
// No need to install https in node as it is a native module //
const bodyParser = require("body-parser");

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

    const url = "https://us21.api.mailchimp.com/3.0/lists/3b03a1189a";

    const options = {
        method: "POST",
        auth: "mark1:216c85c57d746be733ccf7d41cd59d00-us21"
    };

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
            //res.send("Successfully subscribed");
        } else {
            res.sendFile(__dirname + "/failure.html");
            //res.send("There was an error in signing up. Please try again");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    //request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
});

// API Key
// 216c85c57d746be733ccf7d41cd59d00-us21

// List ID
// 3b03a1189a