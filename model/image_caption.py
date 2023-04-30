import pandas as pd
import numpy as np
import tensorflow as tf
import keras.utils as image
from keras.applications.imagenet_utils import preprocess_input
from keras.applications import ResNet50

from keras.models import Model, load_model

model = ResNet50(weights="imagenet",input_shape=(224,224,3))

model_new = Model(model.input,model.layers[-2].output)

def preprocess_img(img):
    img = image.load_img(img,target_size=(224,224))
    img = image.img_to_array(img)
    img = np.expand_dims(img,axis=0)
    # Normalisation
    img = preprocess_input(img)
    return img

def encode_image(img):
    img = preprocess_img(img)
    feature_vector = model_new.predict(img)   # feed img to resnet
    feature_vector = feature_vector.reshape((-1,))  # only (2048,)
    return feature_vector
