const http = require("http");
const fs = require("fs");
const url = require("url");

//html
const overviewTemp = fs.readFileSync("./templates/overview.html", "utf-8");
const cardTemp = fs.readFileSync("./templates/card.html", "utf-8");
const productTemp = fs.readFileSync("./templates/product.html", "utf-8");

const data = fs.readFileSync("./data/vitamins.json", "utf-8");
const dataValid = JSON.parse(data);

let count = 0;
let colors = ["yellow", "orange", "green", "peach", "blue", "red"];
const replaceProperties = (cardTemp, vitamin) => {
  if (count > colors.length - 1) {
    count = 0;
  }
  let output = cardTemp.replace(/{%NAME%}/g, vitamin.name);
  output = output.replace(/{%ID%}/g, vitamin.id);
  output = output.replace(/{%CARD_COLOR%}/g, colors[count]);
  output = output.replace(/{%VITAMIN_PRODUCTS%}/g, vitamin.products);
  output = output.replace(/{%VITAMIN_BENIFIT%}/g, vitamin.benifit);
  output = output.replace(/{%REALNAME%}/g, vitamin.realName);
  output = output.replace(/{%IMAGE%}/g, vitamin.image);
  count++;

  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/") {
    const cardsHTML = dataValid
      .map((vitamin) => replaceProperties(cardTemp, vitamin))
      .join("");

    const output = overviewTemp.replace(/{%PRODUCT_CARDS%}/, cardsHTML);
    count = 0;

    res.end(output);
  } else if (pathname === "/vitamin") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataValid[query.id];
    const output = replaceProperties(productTemp, product);
    count = 0;
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404);
    res.end("Page not found!");
  }
});

server.listen(3000);
