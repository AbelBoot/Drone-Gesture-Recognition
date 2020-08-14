import React from "react"
import Camera from "./components/Camera"
import Canvas from "./components/Canvas"

export default class drone extends React.Component {
	
	state = {
		video: null
	}

	transfer = (stream) => {
		this.setState({video: stream})
	}

	render(){
		return (
			<>
			<Camera transfer={this.transfer}/>
			<Canvas 
				width="200px"
				height="150px"
				video={this.state.video}
			/>
			</>
			)
	}
}