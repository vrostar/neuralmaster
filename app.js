// load model
const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
nn.load('./model/model.json', modelLoaded)

function modelLoaded() {
    console.log('Loaded model successfully!')
}

const valueBtn = document.getElementById("value");
valueBtn.addEventListener("click", () => makePrediction())

const fmt = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })

async function makePrediction() {
    let houseArea = document.getElementById('houseArea').value;

    let gardenSize = document.getElementById('gardenSize').value;

    let Buildyear = document.getElementById('Buildyear').value;

    const results = await nn.predict({ houseArea:parseInt(houseArea), gardenSize:parseInt(gardenSize), Buildyear:parseInt(Buildyear) })

    const result = document.getElementById("result");
    result.innerText = `Estimated Retail Value: ${fmt.format(results[0].retailvalue)}`
    console.log(fmt.format(results[0].retailvalue))
}
