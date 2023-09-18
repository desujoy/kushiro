import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

var list=[]
const BASEURL = "https://api.myanimelist.net/v2/"
const PTW_EXT = "/animelist?status=plan_to_watch&limit=200"
const GET_ANIME = "anime/"
const HEADER = {
    headers: {
        "X-MAL-CLIENT-ID": "ENTER YOUR CLIENT ID HERE"
    }
}

app.get("/", async (req, res) => {
    if(list.length!=0){
        const random = Math.floor(Math.random() * list.length);
        const url = BASEURL + GET_ANIME + list[random];
        const response = await axios.get(url, HEADER);
        const data = response.data;
        res.render("index.ejs", {data: data});
        // console.log(data);
        list=[];
    }
    else{
        res.render("index.ejs", {data: null});
    }
})

app.post("/search", async (req, res) => {
    // console.log(req.body)
    const username = req.body.mal;
    const url = BASEURL + "users/" + username + PTW_EXT;
    const response = await axios.get(url, HEADER);
    const data = response.data.data;
    list = []
    for(var i=0; i<data.length; i++){
        list.push(data[i].node.id)
    }
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
})