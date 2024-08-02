from pydub import AudioSegment
from pydub.utils import make_chunks

#edit here
pathfile = "guitar/guitar-1.wav" #path of file
chunk_length_ms = 6000 # range of slide

last = pathfile.split(".")[1]
order = pathfile[-5]

myaudio = AudioSegment.from_file(pathfile , last) 
chunks = make_chunks(myaudio, chunk_length_ms) #Make chunks of one sec

#Export all of the individual chunks as wav files
for i, chunk in enumerate(chunks):
    fileOrder = str(i+1).zfill(2)
    chunk_name = "-"+order+fileOrder+"."+last
    print("exporting", chunk_name)
    chunk.export("guitar/"+chunk_name, format=last)
