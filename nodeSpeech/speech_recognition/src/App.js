import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { 
	BarChart,
	LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
	Bar,
	Line
 } from 'recharts'

class App extends Component {
	
	constructor(props){
		super(props)
		if (!("webkitSpeechRecognition" in window)){
			this.state = {
				emotionData: [],
				sentimentData: [],
				keywords: [],
				running : false,
				support : false,
				identifiedText: ""
			}
		} else {
			this.recognition = new window.webkitSpeechRecognition()
			this.state = {
				running : false,
				support : true
			}
			this.recognition.onstart = () => {
				// console.log("Start")
				this.setState({running: true})
			}
			this.recognition.onerror = () => {
				// console.log("Error Occured")
				this.setState({running: false})
			}
			this.recognition.onend = () => {
				// console.log("Ended")
				this.setState({running: false})
				if (!this.state.running && !this.state.forceEnd){
					this.setState({running: true})
					this.recognition.start()
				}
				if (this.state.forceEnd) this.setState({forceEnd: false})
			}
			this.recognition.onresult = (event) => {
				// event is a SpeechRecognitionEvent object.
				// It holds all the lines we have captured so far.
				// We only need the current one.
				var current = event.resultIndex;

				// Get a transcript of what was said.
				var transcript = event.results[current][0].transcript;

				// Add the current transcript to the contents of our Note.
				var noteContent = ""
				noteContent += transcript;
				this.getEmotion(noteContent).then((result) => console.log(result) )
				this.setState({identifiedText: noteContent})
			}
		}
	}

	async getEmotion(noteContent) {
		await fetch('https://nltk-api.herokuapp.com/result', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				text: noteContent
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			var data = responseJson[1].probabilities
			var emotionGraphData = []
			for (var p in data) {
				if (data.hasOwnProperty(p)){
					var temp = {
						"name" : p,
						"value" : data[p]
					}
					emotionGraphData.push(temp)
				}
			}
			this.setState({emotionData: emotionGraphData})

			data = responseJson[2].probabilities
			temp = {
				"name" : "Sentiment",
				"positive" : data.positive,
				"neutral" : data.neutral,
				"negative" : data.negative,
			}
			var prevSentimentData
			if (this.state.sentimentData)
				prevSentimentData = this.state.sentimentData
			else
				prevSentimentData = []
			prevSentimentData.push(temp)
			this.setState({sentimentData: prevSentimentData})
			console.log(this.state.sentimentData)

			data = responseJson[0].keywords
			temp = []
			for(var i = 0; i < data.length; i++) {
				temp.push(data[i].keyword)
			}
			this.setState({keywords: temp})

			return responseJson
		})
		.catch((error) => {
			console.log(error)
		})
	}

	renderResult(){
		return (
			<p>
				{ this.state.identifiedText }
			</p>
		)
	}

	renderBarGraph(){
		return (
			<BarChart width={730} height={250} data={ this.state.emotionData }>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
		)
	}

	renderLineGraph(){
		return (
			<LineChart width={600} height={300} data={ this.state.sentimentData }
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
				<XAxis dataKey="name"/>
				<YAxis/>
				<CartesianGrid strokeDasharray="3 3"/>
				<Tooltip/>
				<Legend />
				<Line type="monotone" dataKey="positive" stroke="#8884d8" activeDot={{r: 8}}/>
				<Line type="monotone" dataKey="neutral" stroke="#82ca9d" activeDot={{r: 8}}/>
				<Line type="monotone" dataKey="negative" stroke="#FF0000" activeDot={{r: 8}}/>
				{/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
			</LineChart>
		)
	}

	renderKeywords(){
		return (
			<table>
				<tr>
					<td>
						<h3>Keywords</h3>
					</td>
				</tr>
				<tr>
					<td>
						{ this.state.keywords }
					</td>
				</tr>
			</table>
		)
	}

	renderButtons(){
		if (this.state.support){
			if (this.state.running)
				return (
					<button onClick = { () => { 
						if (!this.state.forceEnd)
							this.setState({forceEnd: true})
						this.recognition.stop() 
					} }>
						Stop !
					</button>
				)
			else {
				return (
					<button onClick = { () => { this.recognition.start() 
					} }>
						Start !
					</button>
				)
			}
		} else {
			return (
				<p> Not Supported </p>
			)
		}
	}

	render() {
		return (
			<div className="App">
				{ this.renderButtons() }
				{ this.renderResult() }
				{ this.renderBarGraph() }
				{ this.renderLineGraph() }
				{ this.renderKeywords() }
			</div> 
		);
	}
}

export default App;
