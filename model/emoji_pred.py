import emoji
from zipfile import ZipFile

emoji_dictionary = {
    "0" : "\u2764\uFE0F",
    "1" : ":baseball:",
    "2" : ":grinning_face_with_big_eyes:",
    "3" : ":disappointed_face:",
    "4" : ":fork_and_knife:",
    "5" : ":dog:",
    "6" : ":sunrise:",
    "7" : ":person_surfing:",
    "8" : ":person_biking:",
}

import pandas as pd
import numpy as np

train = pd.read_csv('train_file.csv',header=None)
test = pd.read_csv('test_file.csv',header=None)

X_train = train[2]
Y_train = train[3]

sample = "I am enjoying today"
sample= pd.Series(sample)

Y_test = test[2]

  
# specifying the zip file name
file_name = "glove.6B.50d.zip"
  
# opening the zip file in READ mode
with ZipFile(file_name, 'r') as zip:
    data = zip.read("glove.6B.50d.txt").split(b"\n")
    data = [line.decode("utf-8") for line in data]

# f = open("glove.6B.50d.txt",encoding='utf-8')

embeddings_index = {}   # dict of 6B words

# for line in f:
#   values = line.split()
#   word = values[0]
#   coefs = np.asarray(values[1:],dtype='float')
#   embeddings_index[word] = coefs
# f.close()

for line in data:
    values = line.split()
    if(len(values) != 0):
      word = values[0]
      coefs = np.asarray(values[1:],dtype='float')
      embeddings_index[word] = coefs

emb_dim = embeddings_index['eat'].shape[0]

def getOutputEmbeddings(X):
  maxLen = 20
  embedding_matrix_output = np.zeros((X.shape[0],maxLen,emb_dim))

  for ix in range(X.shape[0]): #goto each sentence 
    X[ix] = X[ix].split()  # string to words
    for jx in range(len(X[ix])): # go to each word 
      try:
        embedding_matrix_output[ix][jx] = embeddings_index[X[ix][jx].lower()]
      except:
        embedding_matrix_output[ix][jx] = ((50,))

  return embedding_matrix_output

embeddings_matrix_train = getOutputEmbeddings(X_train)
embeddings_matrix_test = getOutputEmbeddings(sample)

from keras.utils import to_categorical

Y_train = to_categorical(Y_train,num_classes=9)
Y_test = to_categorical(Y_test,num_classes=9)

from keras.layers import *
from keras.models import Sequential

model = Sequential()

model.add(LSTM(64,input_shape=(20,50), return_sequences=True))
model.add(Dropout(0.5)) 
model.add(LSTM(64,return_sequences=False))
model.add(Dropout(0.5)) 
model.add(Dense(9))   # 9 classifications
model.add(Activation('softmax'))
model.compile(loss = "categorical_crossentropy",optimizer = "adam",metrics=['accuracy'])
model.summary()





