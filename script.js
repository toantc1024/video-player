const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const progressSeek = document.querySelector('.progress-seek');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');
const playerSpeed = document.querySelector('.player-speed');
const previewImage = document.querySelector('.preview-image');
const inputVideo = document.querySelector('input');
const submitBtn = document.querySelector('button[type="submit"]');
const defaultBtn = document.querySelector('button[type="default-video"]');
const player = document.querySelector('.player');
// Play & Pause ----------------------------------- //
const showPlayIcon = () => {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
};

const showPauseIcon = () => {
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
}

const togglePlay = () => {
    if(video.paused) {
        video.play();
        showPauseIcon();
    } else {
        video.pause();
        showPlayIcon();
    }
}

// On Video End, show play button icon
video.addEventListener('ended', showPlayIcon);


// Progress Bar ---------------------------------- //
const displayTime = (time) => {
    let minutes = Math.floor(time / 60);   
    let seconds = Math.floor(time % 60);
    minutes = minutes > 9? minutes : `0${minutes}`;
    seconds = seconds > 9? seconds : `0${seconds}`
    return `${minutes}:${seconds}`;
}

// Update progress bar as video plays
const updateProgress = () => {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    currentTime.textContent = `${displayTime(video.currentTime)} /`;
    duration.textContent = `${displayTime(video.duration)}`;
}

// Click to seek within the video
const setProgress = (e) => {
    const width = e.offsetX/progressRange.offsetWidth;
    progressBar.style.width = `${width * 100}%`;
    video.currentTime = width * video.duration;
    console.log(video);
}

const setPreview = (e) => {
    const width = e.offsetX/progressRange.offsetWidth;
    progressSeek.style.width = `${width * 100}%`;
    previewImage.textContent = displayTime(video.duration * width);
    previewImage.style.left = `${width * 100}%`;
}

// Volume Controls --------------------------- //
let lastVolume = 1;

const setVolumeIcon = (volume, mute) => {
    volumeIcon.className = '';
    if(mute) {
        volumeIcon.classList.add('fa', 'fa-solid', 'fa-volume-mute');
    } else {
        if (volume > .7) {
            volumeIcon.classList.add('fa', 'fa-solid', 'fa-volume-up');
        } else {
            if (volume < .7 && volume > 0) {
                volumeIcon.classList.add('fa', 'fa-solid', 'fa-volume-down');
            } else {
                volumeIcon.classList.add('fa', 'fa-solid', 'fa-volume-off');
            }
        }
    }

}

const changeVolume = (e) => {
    let volume = e.offsetX / volumeRange.offsetWidth;
    volume = (volume < .1) ? 0 : (volume > .9) ? 1 : volume;
    volumeBar.style.width = `${volume * 100}%`;
    video.volume = volume;
    setVolumeIcon(volume, 0);
    lastVolume = volume;
}

const toggleVolume = () => {
    if(video.volume) {
        lastVolume = video.volume;
        video.volume = 0;
        volumeBar.style.width = 0;
        setVolumeIcon(0, 1);
        volumeIcon.setAttribute('title', 'Unmute');
    } else {
        video.volume = lastVolume;
        volumeBar.style.width = `${lastVolume * 100}%`;
        setVolumeIcon(lastVolume, 0);
        volumeIcon.setAttribute('title', 'Mute');

    }
}


// Change Playback Speed -------------------- //

// Set playback rate function
const updatePlayBack = () => {
    video.playbackRate = playerSpeed.value; 
}

playerSpeed.addEventListener('change', updatePlayBack)

// Fullscreen ------------------------------- //
const openFullscreen = () => {
    if (player.requestFullscreen) {
      player.requestFullscreen();
    } else if (player.webkitRequestFullscreen) { /* Safari */
        player.webkitRequestFullscreen();
    } else if (player.msRequestFullscreen) { /* IE11 */
        player.msRequestFullscreen();
    }
    video.classList.add('video-fullscreen');
    // Player in fullscreen so you can see your custom controls
    // Otherwise, with only video tag in fullscreen you will see the default controls!
}

const closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
  video.classList.remove('video-fullscreen');
}

let fullscreen = false;

const toggleFullscreen = () => {
    if (!fullscreen) {
        fullscreen = true;
        fullscreenBtn.children[0].classList.replace('fa-expand', 'fa-compress');
        openFullscreen();
    } else {
        fullscreen = false;
        fullscreenBtn.children[0].classList.replace('fa-compress', 'fa-expand');
        closeFullscreen();
    }
}

// Submit Video
const submitVideo = () => {
    if(inputVideo.value)
        video.src = inputVideo.value
}

const resetVideo = () => {
    if(!video.src.includes('/music.mp4'))
        video.src = './music.mp4';
}


const exitHandler = (event) => {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        if(video.classList.contains('video-fullscreen')) {
            video.classList.remove('video-fullscreen');
            fullscreenBtn.children[0].classList.replace('fa-compress', 'fa-expand');
        }        
    }
}
// Event Listeners
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
progressRange.addEventListener('mousemove', setPreview);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleVolume);
submitBtn.addEventListener('click', submitVideo);
defaultBtn.addEventListener('click', resetVideo);
fullscreenBtn.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);


