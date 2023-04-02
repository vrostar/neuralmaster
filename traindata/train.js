import { createChart, updateChart } from "./scatterplot.js"

// neural network aanmaken
const nn = ml5.neuralNetwork({ task: 'regression', debug: true })

//
// DATA
//
const csvFile = "./data/utrecht-houseprices.csv"


function loadData() {
        Papa.parse(csvFile, {
                download: true,
                header: true,
                dynamicTyping: true,
                complete: results => trainModel(results.data) // gebruik deze data om te trainen
        })
}
loadData()

function trainModel(data) {
        // split data in traindata en testdata
        data.sort(() => (Math.random() - 0.5));
        let trainData = data.slice(0, Math.floor(data.length * 0.8))
        let testData = data.slice(Math.floor(data.length * 0.8) + 1)
        console.table(data)

        // data toevoegen aan neural network
        for(let house of trainData){
                nn.addData({ houseArea: house.houseArea, gardenSize: house.gardenSize, Buildyear: house.Buildyear },
                    { retailvalue: house.retailvalue })
        }

        nn.normalizeData()

        const chartdata = data.map(house => ({
                x: house.houseArea,
                y: house.retailvalue,
        }))

        createChart(chartdata, "House Area", "Retail Value")

        nn.train({ epochs: 100 }, () => finishedTraining())
}

async function finishedTraining(){
        console.log("Training Succes!")
}

const valuesBtn = document.getElementById("values");
valuesBtn.addEventListener("click", () => makePredictions())

async function makePredictions() {
        let houseArea = document.getElementById('houseAreas').value;

        let gardenSize = document.getElementById('gardenSizes').value;

        let Buildyear = document.getElementById('Buildyears').value;

        const results = await nn.predict({ houseArea:parseInt(houseArea), gardenSize:parseInt(gardenSize), Buildyear:parseInt(Buildyear) })

        const result = document.getElementById("results");
        result.innerText = `Geschat retail value: ${results[0].retailvalue}`
}

const saveBtn = document.getElementById("saveModel");
saveBtn.addEventListener("click", () => saveModel())

function saveModel() {
        nn.save()
}
