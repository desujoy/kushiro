import express from "express";
import axios from "axios";
import helmet from "helmet";
import "dotenv/config";
import cron from "node-cron";
import fetch from "node-fetch";

if (process.env.MAL_CLIENT_ID == undefined) {
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
const MAL_PTR_EXT = `/mangalist?status=plan_to_read&limit=${MAL_LIMIT}`;
const MAL_ANIME_FIELDS = "?fields=id,title,num_episodes,main_picture,synopsis,mean,status,genres";
const MAL_MANGA_FIELDS = "?fields=id,title,num_chapters,main_picture,synopsis,mean,status,genres";
const MAL_HEADER = {
  headers: {
    "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID,
  },
};
const AL_URL = 'https://graphql.anilist.co';
const AL_QUERY = (ID) => {
  return {
    query: `query ($ID: Int) {
      Media(idMal: $ID) {
        externalLinks {
          color
          icon
          url
          site
          type
        }
      }
    }`,
    variables: {
      ID: ID
    },
  }
};
const GITHUB_CONTRIBUTIONS_URL = process.env.GITHUB_CONTRIBUTIONS_URL;
const GITHUB_AUTH_HEADER = {
  headers: {
    Authorization: `token  ${process.env.GITHUB_TOKEN}`,
  },
};

app.get("/", async (req, res) => {
  if (list.length != 0) {
    const random = Math.floor(Math.random() * list.length);
    const MAL_ANIME_ID = list[random].id;
    const response = await axios.get(
      MAL_URL + "anime/" + MAL_ANIME_ID + MAL_ANIME_FIELDS,
      MAL_HEADER,
    );
    const AL_response = await axios.post(AL_URL, AL_QUERY(MAL_ANIME_ID), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    response.data.mediaLinks = AL_response.data.data.Media.externalLinks.filter((site) => site.type == "STREAMING");
    res.render("index.ejs", {
      data: response.data,
      type: "anime",
      limit: DISP_LIMIT,
      err: null,
    });
    list = [];
  } else {
    res.render("index.ejs", { data: null, type: "anime", err: null });
  }
});

app.get("/manga", async (req, res) => {
  if (list.length != 0) {
    const random = Math.floor(Math.random() * list.length);
    const MAL_MANGA_ID = list[random].id;
    const response = await axios.get(
      MAL_URL + "manga/" + MAL_MANGA_ID + MAL_MANGA_FIELDS,
      MAL_HEADER,
    );
    const AL_response = await axios.post(AL_URL, AL_QUERY(MAL_MANGA_ID), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    response.data.mediaLinks = AL_response.data.data.Media.externalLinks.filter((site) => site.type == "STREAMING");
    res.render("index.ejs", {
      data: response.data,
      type: "manga",
      limit: DISP_LIMIT,
      err: null,
    });
    list = [];
  } else {
    res.render("index.ejs", { data: null, type: "manga", err: null });
  }
});

app.post("/", async (req, res) => {
  console.log(req.body);
  const username = req.body.mal;
  const url = MAL_URL + "users/" + username + MAL_PTW_EXT;
  const response = await axios.get(url, MAL_HEADER).catch((err) => {
    console.log(err.status + " " + err.response.data.message);
    res.render("index.ejs", { data: null, type: "anime", err: err.toJSON() });
  });
  if (response) {
    const data = response.data.data;
    for (var i = 0; i < data.length; i++) {
      list.push(data[i].node);
    }
    res.redirect("/");
  }
});

app.post("/manga", async (req, res) => {
  console.log(req.body);
  const username = req.body.mal;
  const url = MAL_URL + "users/" + username + MAL_PTR_EXT;
  const response = await axios.get(url, MAL_HEADER).catch((err) => {
    console.log(err.status + " " + err.response.data.message);
    res.render("index.ejs", { data: null, type: "manga", err: err.toJSON() });
  });
  if (response) {
    const data = response.data.data;
    for (var i = 0; i < data.length; i++) {
      list.push(data[i].node);
    }
    res.redirect("/manga");
  }
});

app.get("/contributors", async (req, res) => {
  try {
    const { data } = await axios.get(
      GITHUB_CONTRIBUTIONS_URL,
      GITHUB_AUTH_HEADER,
    );
    res.render("contributors.ejs", { data: data });
  } catch (error) {
    console.log(error.status + " " + error.response.data.message);
    return res.render("404.ejs", { data: null });
  }
});

app.get("/healthcheck", (req, res) => {
  res.json({ message: "I am healthy" });
});

cron.schedule("*/5 * * * *", async () => {
  const url = process.env.PUBLIC_URL || `http://localhost:${port}`;
  try {
    const response = await fetch(`${url}/healthcheck`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
});

// For Handling 404
app.use((req, res) => {
  res.status(404).render("404.ejs", { data: null });
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
