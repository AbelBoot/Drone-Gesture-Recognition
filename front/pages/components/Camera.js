import React from "react"

export default class Camera extends React.Component {
	
	video = React.createRef()

	getCamera = () => {
		navigator
			.mediaDevices
			.getUserMedia({video: true})
			.then(this.cameraSuccess)
			.catch(this.cameraFail)
	}

	cameraSuccess = (stream) => {
		this.video.current.srcObject = stream
		this.video.current.play()
		this.props.transfer(this.video.current)
	}

	cameraFail = (err) => {
		console.log("you cannot even get the camera", err)
	}

	render (){
		return (
			<>
			<video 
				ref={this.video}
				width="200px"
				height="150px"
			></video>
			<button onClick={this.getCamera}>Get Camera</button>
			</>
		)
	}
}