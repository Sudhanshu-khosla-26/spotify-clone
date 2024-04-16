let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder){ 
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for(let index=0; index< as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="images/music.svg" alt="">
        <div class="info">
        <div> ${song.replaceAll("%20",  " ")}
        </div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="images/play.svg" alt="">
        </div> </li>`;
    }


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{    
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs;
}

const playMusic = (track, pause=false) =>{
    currentSong.src = `/${currfolder}/` + track
    if(!pause){ 
        currentSong.play() 
        play.src = "images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums(){
    let c = await fetch("/songs/")
    let response = await c.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
        for (let index=0; index < array.length; index++){
            const e = array[index];
            console.log(e.href)
        if(e.href.includes("/songs/") && !e.href.includes(".htaccess")){
            let folder = e.href.split("/").slice(4)[0]
            let b = await fetch(`/songs/${folder}/info.json`)
            let response = await b.json();
            console.log(response)
            let cardContainer = document.querySelector(".cardcontainer")
            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div data-folder="${folder}" class="card">
                <div class="playcard">
                    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="">
                <h2 class="plalistbox-head">${response.title}</h2>
                <p>${response.description}</p>
            </div> `
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}


async function main(){
    await getsongs("songs/fav")
    // console.log(songs)  
    playMusic(songs[0], true)

    displayAlbums()
    

    // let play = document.querySelector(".play")
    play.addEventListener("click", ()=>{
            if(currentSong.paused){
                currentSong.play()
                play.src = "images/pause.svg"
            }
            else{
                currentSong.pause()
                play.src = "images/play.svg"
            }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) *100;
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration * percent))/100
    })

    previous.addEventListener("click", () => {
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currentSong.volume = parseInt(e.target.value)/100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").classList.remove("inst-h");
        document.querySelector(".hamburger").classList.add("inst-h");
        
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").classList.add("inst-h");
        document.querySelector(".hamburger").classList.remove("inst-h");
        
    })
}

    

window.addEventListener('load', ()=>{
    main()
})


