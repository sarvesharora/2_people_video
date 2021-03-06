const PRE = "DELTA"
const SUF = "MEET"
var room_id;
var getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
var local_stream;
let mainpeer;

function createRoom() {
    console.log("Creating Room")
    let room = document.getElementById("room-input").value;
    if (room == " " || room == "") {
        alert("Please enter room number")
        return;
    }
    room_id = PRE + room + SUF;
    let peer = new Peer(room_id)
    mainpeer = peer;
    peer.on('open', (id) => {
        console.log("Peer Connected with ID: ", id)
        hideModal()
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream)
        }, (err) => {
            console.log(err)
        })
        notify("Waiting for peer to join.")
    })
    peer.on('call', (call) => {
        call.answer(local_stream);
        call.on('stream', (stream) => {
            setRemoteStream(stream);
        })
    })
}

function setLocalStream(stream) {

    let video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = true;
    video.autoplay = true;
}
function setRemoteStream(stream) {

    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.autoplay = true;
}

function hideModal() {
    document.getElementById("entry-modal").hidden = true
}

function notify(msg) {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(() => {
        notification.hidden = true;
    }, 3000)
}

function joinRoom() {
    console.log("Joining Room");
    let room = document.getElementById("room-input").value;
    if (room == " " || room == "") {
        alert("Please enter room number")
        return;
    }
    room_id = PRE + room + SUF;
    hideModal()
    let peer = new Peer()
    mainpeer = peer;
    peer.on('open', (id) => {
        console.log("Connected with Id: " + id)
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream)
            notify("Joining peer")
            let call = peer.call(room_id, stream)
            call.on('stream', (stream) => {
                setRemoteStream(stream);
            })
        }, (err) => {
            console.log(err)
        })

    })
}

const muteunmute = () => {
    const enabled = local_stream.getAudioTracks()[0].enabled;
    if (enabled) {
        console.log('muted');
        local_stream.getAudioTracks()[0].enabled = false;
    }
    else {
        console.log('unmuted');
        local_stream.getAudioTracks()[0].enabled = true;
    }
}

const playstop = () => {
    const enabled = local_stream.getVideoTracks()[0].enabled;
    if (enabled) {
        console.log('the video stopped');
        local_stream.getVideoTracks()[0].enabled = false;
    }
    else {
        console.log('the video is on');
        local_stream.getVideoTracks()[0].enabled = true;
    }
}

const disconnect = () => {
    // mainpeer.disconnect();
    // window.location = "/";
    mainpeer.destroy();
    window.location = "/";
}