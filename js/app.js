let image = document.getElementById('output')
const fileButton = document.querySelector("#file")
let label = document.getElementById('label')
let description = document.getElementById('description')

async function load() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
    await faceapi.nets.tinyFaceDetector.loadFromUri("./models")
    await faceapi.nets.faceRecognitionNet.loadFromUri('./models')
    await faceapi.nets.faceExpressionNet.loadFromUri('./models')
}

//
// Event listeners
//
window.addEventListener("DOMContentLoaded", () => {
    load()
    label.innerHTML = 'It is time to give me a picture.'
})

image.addEventListener('load', () => userImageUploaded())

//
//  File Upload
//
fileButton.addEventListener("change", (event) => {
    loadFile(event)
    label.innerHTML = 'Loading image...'
    description.innerHTML = ''
})

function loadFile(event) {
	image.src = URL.createObjectURL(event.target.files[0])
}

async function userImageUploaded() {
    label.innerHTML = 'Processing image...'
    if (!image.src.includes('ernie')) {
        const detectionWithExpressions = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
        const ex = {
            angry: detectionWithExpressions.expressions.angry,
            happy: detectionWithExpressions.expressions.happy,
            sad: detectionWithExpressions.expressions.sad,
            neutral: detectionWithExpressions.expressions.neutral
        }
        let res = Object.keys(ex).reduce((a, b) => ex[a] > ex[b] ? a : b)
        label.innerHTML = `You are ${res}.`
        if (res == 'happy') {
            description.innerHTML = 'Good job. You are worth it!'
            meme.src = "https://media1.tenor.com/images/bf90b30a60bdc2637efd0284cf0f3d5c/tenor.gif?itemid=14741109"
        } else {
            description.innerHTML = 'One smile a day, keeps the shrink away. Try it sometimes! Here is a little something that might cheer you up.'
            fetch("https://meme-api.herokuapp.com/gimme/1")
            .then(response =>  {
                return response.json()
            })
            .then(res => {
                let url = res.memes[0].url
                meme.src = url
            })
        }
    }
}