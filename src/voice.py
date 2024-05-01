import sys, json, ast, speech_recognition as sr

rec = sr.Recognizer()

input = ast.literal_eval(sys.argv[1])
output = input


def RecordText():

    while True:
        try:
            with sr.Microphone() as source2:

                rec.adjust_for_ambient_noise(source2, duration=0.2)

                audio2 = rec.listen(source2)

                transcribedText = rec.recognize_google(audio2)

                return transcribedText
    
        except sr.UnknownValueError:
            print("Something Happened It! Wasnt Recorded!")
        except sr.RequestError as e:
            print("Could not Request Result: {0}".format(e))
    return

data_to_pass=RecordText()

output.append(data_to_pass)
print(json.dumps(output))

sys.stdout.flush()


"""
# Retrieve the JavaScript script from command-line arguments
input_script = sys.argv[1]

# Process the script (you can perform any desired processing here)
processed_script = input_script.upper()  # Example: Convert script to uppercase

# Return the processed script as JSON
output = {"processed_script": processed_script}
print(json.dumps(output))

"""