import express from "express";
import axios from "axios";
import helmet from "helmet";
import "dotenv/config";

if(process.env.MAL_CLIENT_ID == undefined || process.env.MAL_LIMIT == undefined){
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
const MAL_LIMIT = process.env.MAL_LIMIT;
const MAL_PTW_EXT = `/animelist?status=plan_to_watch&limit=${MAL_LIMIT}`;
const MAL_HEADER = {
  headers: {
    "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID,
  },
};

const KITSU_URL = "https://kitsu.io/api/edge/anime?filter[text]=";

app.get("/", async (req, res) => {
  if (list.length != 0) {
    const random = Math.floor(Math.random() * list.length);
    const response = await axios.get(KITSU_URL + list[random].title);
    const data = response.data.data;
    var animelist = [];
    for (var i = 0; i < data.length; i++) {
      const anime = {
        title: data[i].attributes.canonicalTitle,
        poster: data[i].attributes.posterImage.original,
        genre: data[i].attributes.genres,
        synopsis: data[i].attributes.synopsis,
        rating: data[i].attributes.averageRating/10,
        status: data[i].attributes.status,
        episodeCount: data[i].attributes.episodeCount,
      };
      animelist.push(anime);
    }
    res.render("index.ejs", { data: animelist, mal: list[random], limit: DISP_LIMIT, err:null });
    console.log(animelist);
    console.log(list[random]);
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
    console.log(err.toJSON());
    res.render("index.ejs", {data: null, err: err.toJSON()});
  });
  if (response) {
    const data = response.data.data;
    for (var i = 0; i < data.length; i++) {
      list.push(data[i].node);
    }
    console.log(list);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
