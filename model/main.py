# Importing necessary libraries
import uvicorn
import emoji
import pandas as pd
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import emoji_pred as ep
import image_caption as ic
from keras.models import load_model
from keras.utils import pad_sequences
from PIL import Image
import io
import requests
from io import BytesIO

# Initializing the fast API server
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Loading up the trained model
emoji_model = load_model("./best_model.h5")
image_model =  load_model('./model_19.h5')

# Defining the model input types
class Comment(BaseModel):
    comment: str

class Img(BaseModel):
   imgURL: str

# Setting up the home route
@app.get("/")
def read_root():
    return {"data": "Welcome to online employee hireability prediction model"}

# Setting up the emoji prediction route
@app.post("/emoji_prediction/")
async def emoji_predict(data: Comment):

    print("input from form:",data.comment)
  
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

    sample = pd.Series(data.comment)

    print('sample:',sample)
    
    embeddings_matrix_test = ep.getOutputEmbeddings(sample)
    
    result = emoji_model.predict(embeddings_matrix_test)

    print('result:',result)
    
    lst1 = list(result)

    lst2 = lst1[0]

    dct = {}

    for i in range(0,len(lst2)):
        dct[lst2[i]] = i
    
    myKeys = list(dct.keys())
    myKeys.sort(reverse=True)
    sorted_dict = {i: dct[i] for i in myKeys}
    
    print(sorted_dict)
    
    final_emoji = []

    c=0
    for i in sorted_dict:
        final_emoji.append(emoji.emojize(emoji_dictionary[str(sorted_dict[i])]))
        print(emoji.emojize(emoji_dictionary[str(sorted_dict[i])]))
        c=c+1
        if(c==5):
            break


    return {
        "data":final_emoji
    }

# Setting up the emoji prediction route
@app.post("/generate_caption/")
async def caption_generate(data: Img):
    print("Image URL:",data.imgURL)

    total_words = ['in', 'the', 'on', 'is', 'and', 'dog', 'with', 'man', 'of', 'two', 'white', 'black', 'boy', 'are', 'woman', 'girl', 'to', 'wearing', 'at', 'people', 'water', 'red', 'young', 'brown', 'an', 'his', 'blue', 'dogs', 'running', 'through', 'playing', 'while', 'shirt', 'down', 'standing', 'ball', 'little', 'grass', 'snow', 'child', 'person', 'jumping', 'over', 'three', 'front', 'sitting', 'holding', 'up', 'field', 'small', 'by', 'large', 'green', 'one', 'group', 'yellow', 'her', 'walking', 'children', 'men', 'into', 'air', 'beach', 'near', 'mouth', 'jumps', 'another', 'for', 'street', 'runs', 'its', 'from', 'riding', 'stands', 'as', 'bike', 'girls', 'outside', 'other', 'off', 'out', 'rock', 'next', 'play', 'orange', 'looking', 'pink', 'player', 'camera', 'their', 'pool', 'hat', 'jacket', 'boys', 'women', 'around', 'behind', 'some', 'background', 'dirt', 'toy', 'soccer', 'sits', 'dressed', 'has', 'wall', 'mountain', 'walks', 'crowd', 'along', 'plays', 'stand', 'looks', 'building', 'park', 'climbing', 'four', 'top', 'face', 'football', 'across', 'grassy', 'holds', 'sand', 'stick', 'smiling', 'ocean', 'rides', 'swimming', 'hill', 'skateboard', 'carrying', 'doing', 'each', 'tennis', 'car', 'tree', 'snowy', 'baby', 'picture', 'bicycle', 'hair', 'together', 'jump', 'him', 'it', 'road', 'area', 'that', 'basketball', 'tan', 'back', 'trick', 'race', 'swing', 'head', 'shorts', 'bench', 'sidewalk', 'covered', 'run', 'catch', 'game', 'sit', 'helmet', 'ground', 'hand', 'dress', 'something', 'fence', 'kids', 'being', 'frisbee', 'lake', 'path', 'city', 'ramp', 'walk', 'wave', 'skateboarder', 'several', 'long', 'purple', 'side', 'there', 'slide', 'baseball', 'high', 'posing', 'track', 'players', 'wooden', 'big', 'sunglasses', 'watches', 'boat', 'uniform', 'dark', 'coat', 'trees', 'look', 'them', 'pants', 'table', 'rocks', 'ride', 'rope', 'watching', 'motorcycle', 'grey', 'suit', 'couple', 'towards', 'arms', 'beside', 'hands', 'under', 'rocky', 'sign', 'watch', 'snowboarder', 'river', 'horse', 'does', 'above', 'racing', 'older', 'jeans', 'lady', 'ice', 'colored', 'striped', 'colorful', 'pose', 'who', 'onto', 'woods', 'midair', 'guy', 'he', 'glasses', 'taking', 'leaps', 'mountains', 'haired', 'asian', 'climbs', 'playground', 'blonde', 'yard', 'against', 'collar', 'performing', 'cliff', 'hockey', 'cap', 'blond', 'bird', 'smiles', 'body', 'open', 'laying', 'surfer', 'team', 'many', 'rider', 'after', 'chasing', 'kid', 'wet', 'fountain', 'skier', 'surrounded', 'outdoors', 'flying', 'during', 'inside', 'old', 'brick', 'biker', 'others', 'shore', 'edge', 'away', 'takes', 'light', 'toddler', 'guitar', 'hanging', 'trying', 'very', 'middle', 'someone', 'forest', 'five', 'backpack', 'night', 'outfit', 'gray', 'pole', 'bed', 'talking', 'object', 'steps', 'making', 'floor', 'nearby', 'whilst', 'line', 'about', 'going', 'flowers', 'past', 'arm', 'sky', 'toward', 'tall', 'trail', 'surfboard', 'swinging', 'eating', 'dancing', 'board', 'waves', 'this', 'poses', 'bridge', 'leaves', 'all', 'day', 'leaping', 'window', 'outdoor', 'bag', 'course', 'clothes', 'legs', 'fighting', 'chair', 'room', 'costume', 'house', 'leash', 'plastic', 'shallow', 'clothing', 'splashing', 'stone', 'carries', 'shirts', 'ready', 'climber', 'between', 'obstacle', 'getting', 'bright', 'catches', 'sliding', 'adult', 'they', 'swings', 'skateboarding', 'waiting', 'bathing', 'sweater', 'concrete', 'sled', 'trampoline', 'lawn', 'gear', 'winter', 'wears', 'metal', 'mud', 'skiing', 'uniforms', 'male', 'jersey', 'railing', 'number', 'sandy', 'tongue', 'fire', 'stream', 'store', 'train', 'golden', 'pulling', 'set', 'stairs', 'catching', 'distance', 'throwing', 'upside', 'sun', 'lot', 'drink', 'bar', 'get', 'fishing', 'gets', 'tries', 'adults', 'smile', 'shirtless', 'overlooking', 'like', 'swims', 'flies', 'rail', 'ski', 'female', 'couch', 'wooded', 'tricks', 'makes', 'busy', 'drinking', 'puppy', 'chases', 'lying', 'animal', 'tire', 'vest', 'flag', 'surfing', 'swim', 'performs', 'american', 'cellphone', 'pond', 'reading', 'laughing', 'right', 'trunks', 'leaning', 'flip', 'shopping', 'huge', 'food', 'puddle', 'dock', 'she', 'slides', 'horses', 'eyes', 'hats', 'photo', 'bat', 'shoes', 'nose', 'sunset', 'left', 'kayak', 'bubbles', 'cart', 'truck', 'climb', 'coming', 'stunt', 'deep', 'snowboard', 'hold', 'scarf', 'feet', 'life', 'no', 'or', 'bikes', 'family', 'umbrella', 'waterfall', 'goal', 'view', 'elderly', 'equipment', 'restaurant', 'tent', 'skating', 'hurdle', 'greyhound', 'biting', 'both', 'skis', 'lone', 'setting', 'harness', 'take', 'falling', 'wetsuit', 'bus', 'mask', 'muddy', 'hiker', 'flags', 'vehicle', 'dry', 'paper', 'skirt', 'bags', 'guys', 'court', 'surf', 'crowded', 'fight', 'sweatshirt', 'dresses', 'structure', 'ledge', 'book', 'tank', 'bmx', 'six', 'be', 'pile', 'slope', 'go', 'cigarette', 'german', 'raft', 'airborne', 'short', 'driving', 'skate', 'kick', 'have', 'diving', 'faces', 'cross', 'cement', 'inflatable', 'goggles', 'wood', 'subway', 'costumes', 'graffiti', 'goes', 'canoe', 'parking', 'teenage', 'cyclist', 'dance', 'kicking', 'bottle', 'shaking', 'splashes', 'buildings', 'fallen', 'turn', 'parade', 'hit', 'shepherd', 'ears', 'ring', 'sports', 'jackets', 'gathered', 'blanket', 'pictures', 'low', 'backyard', 'throws', 'smaller', 'closeup', 'tunnel', 'band', 'full', 'silver', 'chairs', 'microphone', 'smoking', 'leather', 'held', 'sunny', 'bikini', 'wheel', 'piece', 'boots', 'event', 'balls', 'beard', 'bull', 'surface', 'cars', 'cat', 'fluffy', 'stage', 'kicks', 'painted', 'make', 'pushing', 'using', 'bicyclist', 'hiking', 'outfits', 'box', 'rugby', 'statue', 'stuffed', 'pointing', 'paint', 'sticks', 'steep', 'gold', 'bald', 'bucket', 'blowing', 'glass', 'tube', 'door', 'swimsuit', 'drinks', 'scooter', 'suits', 'sleeping', 'flower', 'throw', 'shot', 'volleyball', 'cow', 'furry', 'hugging', 'corner', 'wrestling', 'net', 'crossing', 'wrestle', 'same', 'hangs', 'hind', 'cowboy', 'points', 'leg', 'motorcyclist', 'staring', 'leans', 'attempting', 'police', 'kissing', 'spectators', 'lays', 'wading', 'sheep', 'party', 'attempts', 'few', 'teams', 'show', 'bunch', 'log', 'facing', 'below', 'beige', 'bicycles', 'close', 'puppies', 'cup', 'snowboarding', 'hoop', 'desert', 'garden', 'african', 'wide', 'fenced', 'way', 'sprinkler', 'fast', 'beautiful', 'sticking', 'underwater', 'attached', 'fish', 'gym', 'softball', 'gather', 'competition', 'eats', 'waving', 'end', 'onlookers', 'naked', 'filled', 'phone', 'wings', 'poles', 'racket', 'racetrack', 'which', 'dances', 'talks', 'rain', 'gravel', 'base', 'rolling', 'prepares', 'seat', 'lit', 'empty', 'clear', 'motocross', 'racer', 'seated', 'hula', 'do', 'headband', 'signs', 'platform', 'toys', 'heads', 'neck', 'wear', 'hits', 'ladies', 'pushes', 'plaid', 'branch', 'mohawk', 'market', 'downhill', 'birds', 'bride', 'round', 'pavement', 'paddling', 'having', 'public', 'handstand', 'just', 'shop', 'traffic', 'rough', 'shoulder', 'scene', 'among', 'skateboards', 'different', 'reads', 'bearded', 'gloves', 'chewing', 'school', 'beer', 'hose', 'thrown', 'landscape', 'rural', 'drives', 'dirty', 'bars', 'barefoot', 'tie', 'urban', 'kitchen', 'teeth', 'races', 'cream', 'balloon', 'resting', 'foot', 'tug', 'splash', 'display', 'carnival', 'before', 'bottom', 'cricket', 'painting', 'lies', 'paved', 'goalie', 'wait', 'indoor', 'mother', 'plants', 'carpet', 'creek', 'says', 'waits', 'younger', 'rapids', 'wedding', 'flight', 'smoke', 'match', 'opposing', 'lined', 'half', 'headphones', 'animals', 'pipe', 'lap', 'fall', 'showing', 'block', 'stadium', 'skates', 'greyhounds', 'blows', 'wrestler', 'moving', 'boats', 'gun', 'parked', 'reaching', 'onstage', 'santa', 'art', 'seen', 'paddle', 'video', 'where', 'mouths', 'foreground', 'war', 'talk', 'chase', 'bandanna', 'third', 'instruments', 'singing', 'lights', 'runner', 'falls', 'can', 'deck', 'atv', 'helmets', 'pulled', 'photograph', 'ear', 'motorbike', 'wire', 'funny', 'matching', 'poodle', 'curly', 'shooting', 'spotted', 'ropes', 'newspaper', 'outstretched', 'floating', 'fly', 'audience', 'brightly', 'hitting', 'fair', 'try', 'unicycle', 'reaches', 'amusement', 'hay', 'staircase', 'christmas', 'shakes', 'duck', 'hole', 'atop', 'spray', 'bushes', 'preparing', 'bank', 'alongside', 'purse', 'retriever', 'pack', 'martial', 'shoulders', 'wheelie', 'raises', 'bubble', 'teenagers', 'giant', 'grinding', 'appears', 'terrain', 'country', 'skiers', 'finger', 'hooded', 'stop', 'follows', 'formation', 'chain', 'roller', 'plate', 'pulls', 'hoops', 'kite', 'digging', 'larger', 'surfs', 'muzzle', 'rowing', 'putting', 'hikers', 'alone', 'station', 'denim', 'enjoys', 'cold', 'hoodie', 'music', 'balancing', 'jeep', 'covering', 'perform', 'muzzled', 'rodeo', 'row', 'kneeling', 'paddles', 'puts', 'pier', 'giving', 'shaggy', 'picnic', 'backwards', 'gives', 'indoors', 'spinning', 'himself', 'shadow', 'parachute', 'jumped', 'hang', 'break', 'shows', 'handrail', 'laughs', 'leap', 'bite', 'backs', 'cut', 'safety', 'pull', 'playfully', 'clouds', 'backpacks', 'writing', 'ladder', 'enjoying', 'owner', 'competing', 'necklace', 'gate', 'counter', 'sniffing', 'licking', 'riders', 'terrier', 'seven', 'bites', 'construction', 'machine', 'fetch', 'bikers', 'skinned', 'underneath', 'jungle', 'made', 'cloth', 'fur', 'mound', 'basket', 'violin', 'doorway', 'fingers', 'passing', 'tackle', 'bowl', 'rink', 'crouches', 'quickly', 'paws', 'sea', 'mid', 'collie', 'step', 'computer', 'camouflage', 'these', 'splashed', 'hillside', 'referee', 'taken', 'coats', 'professional', 'rollerblades', 'decorated', 'friend', 'pigeons', 'ducks', 'military', 'wheelchair', 'spots', 'waters', 'kayaking', 'hot', 'helps', 'bouncing', 'straw', 'float', 'tracks', 'balances', 'lean', 'trunk', 'skater', 'homeless', 'opposite', 'driver', 'caught', 'rollerblading', 'barrier', 'cone', 'stump', 'stroller', 'courtyard', 'heavy', 'balloons', 'streets', 'biking', 'without', 'wagon', 'landing', 'bear', 'coffee', 'shown', 'formal', 'frame', 'peace', 'kiss', 'land', 'mirror', 'dune', 'walkway', 'screen', 'karate', 'arts', 'watched', 'string', 'tents', 'chest', 'home', 'hug', 'laugh', 'clown', 'sooners', 'plane', 'climbers', 'uses', 'motorcycles', 'cardboard', 'helping', 'shaped', 'eat', 'suspended', 'makeup', 'blurry', 'monkey', 'speed', 'coaster', 'direction', 'fetching', 'reach', 'medium', 'sized', 'range', 'rolls', 'tattoo', 'barking', 'drum', 'frozen', 'kneels', 'mountainside', 'happily', 'jogging', 'put', 'bending', 'neon', 'asleep', 'eye', 'begins', 'jean', 'but', 'rubber', 'well', 'flowered', 'headscarf', 'practicing', 'touching', 'crashing', 'cyclists', 'see', 'petting', 'raised', 'dead', 'blow', 'blocks', 'knit', 'miami', 'jerseys', 'mountaintop', 'sprayed', 'attire', 'teenager', 'plain', 'cake', 'turning', 'dusk', 'balcony', 'leaving', 'crosses', 'only', 'forward', 'training', 'tires', 'corn', 'shoreline', 'bend', 'dribbles', 'surrounding', 'pass', 'indian', 'airplane', 'boxing', 'grinds', 'puck', 'overalls', 'working', 'lab', 'rest', 'porch', 'boardwalk', 'lay', 'curve', 'hugs', 'bicyclists', 'town', 'almost', 'lots', 'waterskiing', 'skirts', 'father', 'curb', 'patch', 'hills', 'snowball', 'photographer', 'square', 'fake', 'grocery', 'action', 'racquet', 'comes', 'policeman', 'coach', 'tackled', 'wrestlers', 'valley', 'rests', 'jet', 'pine', 'closed', 'friends', 'golf', 'cloudy', 'themselves', 'sides', 'disc', 'sport', 'kayaker', 'free', 'crouching', 'ahead', 'tail', 'tricycle', 'pit', 'wrapped', 'smokes', 'dives', 'muzzles', 'officer', 'eastern', 'sumo', 'rainbow', 'sculpture', 'mat', 'barrel', 'colors', 'strip', 'warm', 'time', 'type', 'flips', 'first', 'candles', 'towel', 'lift', 'moves', 'ribbon', 'spread', 'tattoos', 'following', 'class', 'vehicles', 'though', 'scuba', 'multicolored', 'image', 'students', 'hike', 'swimmer', 'gathering', 'redheaded', 'cheerleaders', 'part', 'cones', 'members', 'thumbs', 'groom', 'beam', 'patio', 'wheeler', 'woodland', 'cave', 'sharp', 'topless', 'sandals', 'leading', 'spraying', 'soda', 'passes', 'knee', 'bow', 'vests', 'scarves', 'wine', 'palm', 'catcher', 'speaking', 'multi', 'wheeled', 'dust', 'brush', 'silhouette', 'crosswalk', 'kisses', 'turns', 'surfers', 'enjoy', 'fans', 'move', 'leads', 'fancy', 'tiger', 'drums', 'merry', 'kiddie', 'chews', 'obama', 'also', 'turned', 'scaling', 'item', 'foam', 'shower', 'happy', 'itself', 'marching', 'apron', 'church', 'sofa', 'place', 'grab', 'tables', 'cheek', 'help', 'pirate', 'shoot', 'peak', 'touches', 'living', 'seats', 'bare', 'listening', 'crawls', 'embrace', 'sprinklers', 'carry', 'tutu', 'herself', 'sleeps', 'center', 'protest', 'banner', 'aged', 'swan', 'hard', 'various', 'played', 'carriage', 'benches', 'chased', 'rug', 'motion', 'birthday', 'boogie', 'skull', 'pitbull', 'circle', 'cover', 'case', 'innertube', 'agility', 'stares', 'ridden', 'teen', 'rafting', 'farm', 'beads', 'foggy', 'stomach', 'leashes', 'sword', 'inline', 'snowsuit', 'licks', 'protective', 'huddle', 'what', 'pitcher', 'japanese', 'walls', 'tackling', 'rollerblader', 'chinese', 'pajamas', 'workers', 'boxer', 'skinny', 'hallway', 'flops', 'boulder', 'print', 'thin', 'cafe', 'sideways', 'device', 'railroad', 'floats', 'sheet', 'you', 'retrieving', 'feeding', 'raising', 'fun', 'rows', 'not', 'wind', 'pouring', 'sings', 'picking', 'neighborhood', 'single', 'spiderman', 'work', 'markings', 'money', 'icy', 'desk', 'flock', 'pair', 'geese', 'natural', 'bowling', 'alley', 'musicians', 'ship', 'tulips', 'oklahoma', 'compete', 'how', 'followed', 'doberman', 'eight', 'so', 'silly', 'lead', 'chalk', 'new', 'lips', 'sleeved', 'post', 'stuck', 'attempt', 'beneath', 'sets', 'figure', 'fabric', 'foliage', 'narrow', 'fishes', 'bends', 'brunette', 'lifts', 'lands', 'teal', 'shade', 'bleachers', 'partially', 'scales', 'gallery', 'emerges', 'crawling', 'bounds', 'bounce', 'barren', 'teammate', 'headfirst', 'concert', 'photographs', 'wheels', 'mostly', 'swimsuits', 'fruit', 'worker', 'guard', 'glove', 'cheerleader', 'runners', 'camel', 'shoe', 'athlete', 'camels', 'treat', 'pillow', 'sheer', 'headed', 'drive', 'traveling', 'chew', 'van', 'plant', 'sneakers', 'hood', 'weather', 'caps', 'floral', 'males', 'daughter', 'pitch', 'racers', 'slightly', 'females', 'casting', 'monument', 'tops', 'speaks', 'touch', 'second', 'athletic', 'style', 'amidst', 'cloud', 'bathroom', 'distant', 'participate', 'pale', 'autumn', 'flipping', 'meadow', 'sniffs', 'stripes', 'grabs', 'polka', 'plaza', 'cape', 'starting', 'breaking', 'buckets', 'rear', 'robe', 'been', 'sail', 'deer', 'houses', 'officers', 'jockeys', 'tied', 'skyline', 'infant', 'chocolate', 'driveway', 'helmeted', 'relaxing', 'spins', 'advertisement', 'luggage', 'approaching', 'bikinis', 'jack', 'playpen', 'khaki', 'wakeboarding', 'stool', 'shaved', 'business', 'push', 'musical', 'instrument', 'retrieves', 'tossing', 'marked', 'bath', 'boarding', 'gentleman', 'bay', 'leafy', 'branches', 'murky', 'arena', 'jewelry', 'buried', 'electric', 'bathtub', 'festival', 'position', 'stairway', 'bush', 'human', 'crouched', 'campfire', 'candy', 'hardhat', 'pet', 'arcade', 'opponent', 'space', 'control', 'broken', 'binoculars', 'crossed', 'roof', 'masks', 'crying', 'whistle', 'sledding', 'shovel', 'speeds', 'grabbing', 'midst', 'straight', 'beagle', 'point', 'robes', 'appear', 'jumper', 'fireworks', 'stair', 'crane', 'elephant', 'tri', 'pigtails', 'meal', 'suv', 'flat', 'fountains', 'artist', 'follow', 'navy', 'intersection', 'cage', 'toddlers', 'strange', 'pacifier', 'reflection', 'uphill', 'club', 'wakeboard', 'booth', 'stops', 'lines', 'still', 'logs', 'either', 'bungee', 'tag', 'waist', 'scenic', 'kayaks', 'visible', 'diver', 'horizon', 'countryside', 'dimly', 'knees', 'link', 'dreadlocks', 'uniformed', 'tugging', 'multiple', 'clad', 'read', 'dusty', 'ponytail', 'opens', 'stretching', 'rowboat', 'photographed', 'flames', 'shoveling', 'horseback', 'digs', 'tripod', 'belly', 'numbered', 'stars', 'jockey', 'advertising', 'sparklers', 'kites', 'traditional', 'mural', 'soft', 'tv', 'pony', 'drawing', 'barn', 'pointed', 'snowmobile', 'cows', 'star', 'swimmers', 'opening', 'jogs', 'pushed', 'descending', 'growling', 'hiding', 'approaches', 'trotting', 'waterskier', 'hikes', 'checkered', 'floaties', 'museum', 'silhouetted', 'covers', 'swords', 'lane', 'far', 'tosses', 'camping', 'tub', 'excited', 'paw', 'lighting', 'fisherman', 'enclosed', 'gestures', 'attack', 'mall', 'slip', 'handlebars', 'performer', 'oriental', 'spot', 'wild', 'balance', 'costumed', 'dot', 'lounge', 'poodles', 'gliding', 'bundled', 'identical', 'cameras', 'snowcapped', 'toilet', 'individuals', 'doors', 'rollerskating', 'poster', 'dancer', 'stretches', 'cast', 'motorcyclists', 'apple', 'aerial', 'ridge', 'wig', 'sweaters', 'cards', 'firetruck', 'picks', 'office', 'hut', 'nighttime', 'feather', 'pathway', 'soaked', 'paints', 'wades', 'relaxes', 'snowboarders', 'tropical', 'items', 'summer', 'carts', 'windows', 'weeds', 'vendor', 'selling', 'underwear', 'stare', 'husky', 'barks', 'reflective', 'tight', 'power', 'skimpy', 'was', 'clapping', 'marker', 'shoots', 'laptop', 'pick', 'brother', 'handles', 'tattooed', 'hardwood', 'pen', 'goat', 'mom', 'cooking', 'babies', 'pedestrians', 'graffitied', 'fuzzy', 'rings', 'dribbling', 'parka', 'canoes', 'collars', 'chicken', 'army', 'tiny', 'wand', 'rally', 'color', 'ran', 'trainer', 'umbrellas', 'dropping', 'colourful', 'batman', 'railings', 'flute', 'crown', 'fan', 'squirted', 'burning', 'ribbons', 'sing', 'trashcan', 'member', 'helicopter', 'bee', 'dish', 'skateboarders', 'descends', 'dive', 'multicolor', 'come', 'incline', 'sunlight', 'elaborate', 'fireplace', 'sprays', 'folding', 'seaweed', 'stretch', 'sporting', 'flowery', 'stretched', 'cushion', 'sat', 'leashed', 'blocking', 'wakeboarder', 'including', 'leotard', 'headdress', 'boards', 'heavily', 'posts', 'own', 'peeks', 'leaf', 'container', 'overhead', 'parasailing', 'handle', 'facial', 'bouncy', 'limb', 'bottles', 'bread', 'halloween', 'tricycles', 'choppy', 'aqua', 'casts', 'floppy', 'works', 'tights', 'glider', 'calm', 'bounding', 'mess', 'hurdles', 'native', 'wade', 'observes', 'fellow', 'kicked', 'similar', 'snake', 'beverage', 'bearing', 'footballer', 'cheer', 'injured', 'skies', 'pitching', 'studio', 'bunny', 'carpeted', 'pan', 'drag', 'motor', 'seagulls', 'bridesmaids', 'cannon']

    word_to_idx = {}
    idx_to_word = {}

    for i,word in enumerate(total_words):
        word_to_idx[word] = i+1
        idx_to_word[i+1] = word

    # Two special words
    idx_to_word[1846] = 'startseq'
    word_to_idx['startseq'] = 1846

    idx_to_word[1847] = 'endseq'
    word_to_idx['endseq'] = 1847

    vocab_size = len(word_to_idx) + 1


    def predict_caption(photo):

        in_text = "startseq"
        max_len = 35
        for i in range(max_len):
            sequence = [word_to_idx[w] for w in in_text.split() if w in word_to_idx]
            sequence = pad_sequences([sequence],maxlen=max_len,padding='post')
            
            ypred = image_model.predict([photo,sequence])
            ypred = ypred.argmax() #Word with max prob always - Greedy Sampling
            word = idx_to_word[ypred]
            in_text += (' ' + word)
            
            if word == "endseq":
                break
        
        final_caption = in_text.split()[1:-1]   # remove startseq,endseq
        final_caption = ' '.join(final_caption)
        return final_caption
    
    
    encoding_test1 = {}
    
    # Make a GET request to the image URL
    img_url = data.imgURL

    response = requests.get(img_url)

    # Open the image directly from the response content
    img = Image.open(BytesIO(response.content))

    # Next, we create a BytesIO object from the img object by saving it to the buffer object and then seeking back to the beginning of the stream using the seek() method.

    buffer = io.BytesIO()     
    img.save(buffer, 'jpeg') 
    buffer.seek(0)

    final_image = buffer  

    print("final_image:",final_image)     

    encoding_test1['img'] = ic.encode_image(final_image)
        
    photo_2048 = encoding_test1['img'].reshape((1,2048))
    caption = predict_caption(photo_2048)
    print("caption:",caption)

    

    return {
        "data":caption
    }


# Configuring the server host and port
if __name__ == '__main__':
    uvicorn.run(app, port=8080, host='0.0.0.0')
