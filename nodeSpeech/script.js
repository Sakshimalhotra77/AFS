
try {
	var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	var recognition = new SpeechRecognition();

	function init(){
		recognition.onstart = () => {
			console.log("Started")
		}

		recognition.onspeechend = () => {
			console.log("Ended")
		}

		recognition.onresult = (event) => {
			// event is a SpeechRecognitionEvent object.
			// It holds all the lines we have captured so far.
			// We only need the current one.
			var current = event.resultIndex;

			// Get a transcript of what was said.
			var transcript = event.results[current][0].transcript;

			// Add the current transcript to the contents of our Note.
			var noteContent = ""
			noteContent += transcript;
			console.log(noteContent)
		}
	}

	recognition.start()
}

catch(e) {
	console.error(e);
}