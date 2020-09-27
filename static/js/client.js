console.log("Hello from the CLient");

function createPortfolioElement(imgSrc) {
  let portfolioItem = document.createElement("div");
  portfolioItem.setAttribute("class", "portfolio_item");
  
  let inputElement = document.createElement("input");
  inputElement.setAttribute("type", "image");
  inputElement.setAttribute("class", "img-responsive");
  inputElement.setAttribute("src", imgSrc);
  portfolioItem.appendChild(inputElement)

  let hoverElement = document.createElement("div");
  hoverElement.setAttribute("class", "portfolio_item_hover");
  portfolioItem.appendChild(hoverElement);

  let gridDiv = document.createElement("div");
  gridDiv.setAttribute("class", "col-md-4 nopadding");
  gridDiv.appendChild(portfolioItem);
  return(gridDiv);
}

const portfolioDif = document.getElementById("portfolio")

for(let i = 0; i < 9*1; i++) {
  portfolioDif.appendChild(createPortfolioElement("static/img/water.jpg"));
}
