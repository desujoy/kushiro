import express from "express";
import axios from "axios";
import helmet from "helmet";
import "dotenv/config";

if(process.env.MAL_CLIENT_ID == undefined){
  console.log("Please set the environment variables");
  process.exit(1);
}

const app = express();
const port = 3000;
const DISP_LIMIT = 1;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(helmet.hidePoweredBy());

var list = [];
const MAL_URL = "https://api.myanimelist.net/v2/";
const MAL_LIMIT = process.env.MAL_LIMIT || 1000;
const MAL_PTW_EXT = `/animelist?status=plan_to_watch&limit=${MAL_LIMIT}`;
const MAL_FIELDS="?fields=id,title,num_episodes,main_picture,synopsis,mean,status,genres"
const MAL_HEADER = {
  headers: {
    "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID,
  },
};

app.get("/", async (req, res) => {
  if (list.length != 0) {
    const random = Math.floor(Math.random() * list.length);
    const response = await axios.get(MAL_URL + 'anime/' + list[random].id + MAL_FIELDS, MAL_HEADER);
    const data = response.data;
    const genres = data.genres.map((genre) => genre.name);
    const anime = {
      title: data.title,
      poster: data.main_picture.large,
      genre: genres,
      synopsis: data.synopsis,
      rating: data.mean,
      status: data.status,
      episodeCount: data.num_episodes,
    };
    res.render("index.ejs", { data: anime, mal: list[random], limit: DISP_LIMIT, err:null });
    list = [];
  } else {
    res.render("index.ejs", { data: null, err:null });
  }
});

app.post("/", async (req, res) => {
  console.log(req.body);
  const username = req.body.mal;
  const url = MAL_URL + "users/" + username + MAL_PTW_EXT;
  const response = await axios.get(url, MAL_HEADER).catch((err) => {
    console.log(err.toJSON().status + " " + err.toJSON().code);
    res.render("index.ejs", {data: null, err: err.toJSON()});
  });
  if (response) {
    const data = response.data.data;
    for (var i = 0; i < data.length; i++) {
      list.push(data[i].node);
    }
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
