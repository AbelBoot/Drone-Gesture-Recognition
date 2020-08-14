import React from "react"
import { main, socket } from "../Utilities/Main"

export default class Canvas extends React.Component {
	
	canvas = React.createRef()
	width = parseInt(this.props.width)
	height = parseInt(this.props.height)

	state = {
		previousFrame: null, 
		objShapes: {
			"red": [0, 0, this.width/4, this.height * 3/4],
			"blue": [this.width * 3/4, 0, this.width * 1/4, this.height * 3/4],
			"green": [this.width * 0.26, this.height * 3/4, this.width * 0.48, this.height * 1/4],
			"yellow": [this.width * 1/3, this.height * 1/5, this.width * 1/3, this.height * 1/5]
		}
	}

	refresh = () => {
		setInterval(() => {
			this.getCanvas()
			this.getStream()
		}, 16)
	}

	getCanvas = () => {
		const ctx = this.canvas.current.getContext("2d")
		ctx.drawImage(this.props.video, 0, 0, this.width, this.height)
		const currentFrame = ctx.getImageData(0, 0, this.width, this.height)
		const blank = ctx.createImageData(this.width, this.height)
		if (this.state.previousFrame === null){
			this.setState({previousFrame: currentFrame})
		}
		main(blank.data, this.state.previousFrame.data, currentFrame.data)
		ctx.putImageData(blank, 0, 0)
		this.setState({previousFrame: currentFrame})
		this.drawingShapes()
		for (const key in this.state.objShapes){
			const val = this.state.objShapes[key]
			const area = ctx.getImageData(val[0], val[1], val[2], val[3])
			let i = 0, average = 0
			while(i < area.data.length / 4){
				average += (area.data[4*i] + area.data[4*i + 1] + area.data[4*i + 2]) / 3
				i++
			}
			average = Math.round(average / (area.data.length / 4))
			if (average > 20){
				//console.log("average", `${key}: ${average}`)
				if (key == "red"){
					socket.emit("takeoff")	
				}
				if (key == "blue"){
					socket.emit("land")	
				}
				if (key == "yellow"){
					socket.emit("ccw")	
				}
			}
		}
	}

	drawingShapes = () => {
		const ctx = this.canvas.current.getContext("2d")
		for (const key in this.state.objShapes){
			const val = this.state.objShapes[key]
			ctx.strokeStyle = key	
			ctx.strokeRect(val[0], val[1], val[2], val[3])
		}		
	}

	getStream = () => {
		console.log("getting Stream")//, socket.json.io)
		// socket.json.io.connecting("message", sock=> {
		// 	console.log("getting Stream2")
		// 	sock.on("streaming", str => {
		// 		console.log("str", str)
		// 	})
		// })
	}

	render(){
		return (
			<>
			<canvas
				ref={this.canvas}
			></canvas>
			<button onClick={this.refresh}>
				Get Canvas
			</button>
			</>
		)
	}
}