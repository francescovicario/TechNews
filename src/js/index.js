import css from "../css/styles.css"

const loadMoreBtn = document.getElementById('load-more')
const wrapperDiv = document.getElementById('wrapper')

const dateOptions = {year: 'numeric', month: 'long', day: 'numeric'}
const timeOptions = {hour: 'numeric', minute: 'numeric', hour12: true}

let newsCounter = 0
let newsID = 0
let storiesArray = []

class HttpError extends Error {
    constructor(message){
        super(message); 
        this.name = "HttpError";
    }
}

class InternalError extends Error {
    constructor(message){
        super(message); 
        this.name = "InternalError";
    }
}

function latestNewsCall() {
    fetch('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty') 
    .then(res => {
        if (!res.ok){
            throw new HttpError('Data are currently unavailable.')
        }
        return res.json()
    })
    .then(data => {
        newsID = data
        newsRender()
    })
    .catch(err => errorHandler(err))
}

function newsRender() {
    for (let i = newsCounter; i < newsCounter + 10; i++){
        storiesArray.push(newsID[i])
    }
    Promise.all(storiesArray.map(story => fetch(`https://hacker-news.firebaseio.com/v0/item/${story}.json?print=pretty`)))        
    .then(responses => {
        return Promise.all(responses.map(response => {
                if (!response.ok){
                    throw new HttpError('Data are currently unavailable.')
                }
                return response.json()
        }))
    })
    .then(specifics => {
        return Promise.all(specifics.map(specific => {
            let date = new Date(specific.time * 1000).toLocaleDateString('en-US', dateOptions)
            let time = new Date(specific.time * 1000).toLocaleTimeString('en-US', timeOptions)
            wrapperDiv.innerHTML += `
            <article class="article">
                <h3 class="title"><a href="${specific.url}" target='_blank'>${specific.title}</a></h3>
                <div class="container">
                    <p class="author">by <a href="https://news.ycombinator.com/user?id=${specific.by}" target='_blank'>${specific.by}</a></p>
                    <p class="time">posted on ${date} at ${time}</p>
                </div>
            </article>
            `
            if (!date || !time){
                throw new InternalError('Something went wrong.')
            }
        }))
    })
    .catch(err => errorHandler(err))
    loadMoreBtn.classList.remove('hidden')
    newsCounter += 10
    storiesArray = []
}

function errorHandler(e){
    loadMoreBtn.classList.add('hidden')
    wrapperDiv.innerHTML = `
    <div class='error'>
    <p>${e.message}</p>
    <p>Please reload the page or try later.</p>
    </div>
    `
}

latestNewsCall()
loadMoreBtn.addEventListener('click', newsRender)

