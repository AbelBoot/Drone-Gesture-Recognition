const dgram = require("dgram")
const drone = dgram.createSocket("udp4")
const io = require("socket.io")().listen(6767)

const HOST = "192.168.10.1"
const PORT = 8889

const { ffmpeg } = require("ffmpeg")
const { execFile } = require("child_process")

const child = execFile("ffmpeg", 
	["-i", "udp://192.168.10.1:11111", "outputVideo.mp4", "-y"], 
	(err, out) => {
		if(err){console.log("Error from drone webcam", err)}
		else{console.log("output from webcam drone", out)}
	})

child.stdout.pipe(process.stdout)

const commands = ["command", "battery?", "streamon", "takeoff"]//, "ccw 360"]//, "forward 300"]
const commandCcw = ["command", "ccw 360"]
const commandLand = ["command", "land"]

drone.on("message", msg => {
	console.log("message from drone", msg.toString())
})

function sendingCommands(){
	commands.forEach(command => {
		drone.send(command, 0, command.length, PORT, HOST)	
	})
}

function landing(){
	commandLand.forEach(command => {
		drone.send(command, 0, command.length, PORT, HOST)	
	})
}

function ccw(){
	commandCcw.forEach(command => {
		drone.send(command, 0, command.length, PORT, HOST)	
	})
}

io.on("connection", socket => {
	socket.on("takeoff", () => {
		console.log("takeoff ordered")
		sendingCommands()
	})
	socket.on("land", () => {
		console.log("please land")
		landing()
	})
	socket.on("ccw", () => {
		console.log("please ccw")
		ccw()
	})
})


drone.bind(PORT)