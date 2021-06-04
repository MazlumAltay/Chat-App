import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"

function App() {
	const [state, setState] = useState({ message: "", name: "" })
	const [chat, setChat] = useState([])

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([...chat, { name, message }])
			})
			return () => socketRef.current.disconnect()
		},
		[chat]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		socketRef.current.emit("message", { name, message })
		e.preventDefault()
		setState({ message: "", name })
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}

	return (
		<div className="card" align="center">
			<form  onSubmit={onMessageSubmit}>
				<h1>Mesajlar</h1>
				<div className="render-chat">
					{renderChat()}
				</div>
				<hr></hr>
				<div className="name-field">
					<TextField className="input" name="name" onChange={(e) => onTextChange(e)} value={state.name} label="İsim" />
				</div>
				<div>
					<TextField
						className="input"
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Mesaj"
					/>
				</div>
				<button>Mesajı Gönder</button>

			</form>

		</div>
	)
}

export default App

