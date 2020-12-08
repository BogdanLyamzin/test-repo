const fieldBoxesCount = document.querySelector("#controls .js-input");
const buttonCreateBoxes = document.querySelector("#controls [data-action='create']");
const buttonDestcroyBoxes = document.querySelector("#controls [data-action='destroy']");

const boxesContainer = document.querySelector("div#boxes");

buttonCreateBoxes.addEventListener("click", function() {
    const {value}  = fieldBoxesCount;
    createBoxes(+value);
    fieldBoxesCount.value = "";
});
buttonDestcroyBoxes.addEventListener("click", desctroyBoxes);

function createBoxes(amount) {
    const boxes = Array(amount).map((item, index) => {
        const size = 30 + 10 * index;
        const bgColor = getRandomRGBColor();
        const div = `<div style="width: ${size}px; height: ${size}px; background-color: ${bgColor}"></div>`;
        return div;
    });
    boxesContainer.insertAdjacentHTML("beforeend", boxes.join(""));
}

function desctroyBoxes() {
    boxesContainer.innerHTML = "";
}

function getRandomRGBColor(){
    const red = getRandomInt(0, 256);
    const green = getRandomInt(0, 256);
    const blue = getRandomInt(0, 256);
    return `rgb(${red}, ${green}, ${blue})`;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}