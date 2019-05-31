const restartHeroku = () => {
  console.log("RESTARTING HEROKU");
  fetch("https://api.heroku.com/apps/find-replace/dynos/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.heroku+json; version=3",
      Authorization: "Bearer " + process.env.HEROKU_TOKEN
    }
  });
};

module.exports = restartHeroku;
