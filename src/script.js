import { spawn } from 'node:child_process';


document.getElementById('speakButton').addEventListener('click', () => {
    
    console.log("2");
    /*
    // Data to pass to the Python script if needed to send something to python
    const data_to_pass_in = ['Requesting Data'];

    console.log('Data sent to Python Script: ', data_to_pass_in);

    // Spawn a Python process
    const python_process = spawn('python', ['./src/voice.py', JSON.stringify(data_to_pass_in)]);

    // Event handler for receiving data from the Python script
    python_process.stdout.on('data', (data) => {
        try {
            // Attempt to parse the data as JSON
            const parsedData = JSON.parse(data.toString());
            console.log('Data Received from Python Script: ', parsedData);
        } catch (error) {
            console.error('Error parsing JSON data from Python script:', error);
        }
    });

    // Error handler for any errors that occur with the Python process
    python_process.on('error', (error) => {
        console.error('Error spawning Python process:', error);
    });

    // Event handler for when the Python process closes
    python_process.on('close', (code) => {
        console.log('Python process exited with code', code);
    });*/


})





// // console.log("Hello world!");