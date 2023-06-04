<h1 align="center">PIXEMO</h1>
A web application that empowers users to effortlessly upload images and instantly generates automatic captions with relevant emojis.

<h3 align="left">Features:</h3>

1. Image Captioning: Pixemo provides automatic captioning functionality for images uploaded by users. 

2. Emoji Generation: Pixemo also generates emojis that are contextually relevant to the comments and the captions provided by the model.

3. Multiple emoji options: Pixemo offers a wide range of emoji options that users can include in their comments or reactions to posts. This allows for more expressive and engaging interactions within the community.

4. Customization Options: Pixemo allows users to customize the generated captions and emojis according to their preferences. Users can edit, modify, or add their own captions and emojis to ensure that the generated content aligns with their intended message and creative vision.

5. Comment on a post: Users can engage with posts by leaving comments, allowing them to express their thoughts, ask questions, or engage in discussions.

6. Search through content: The web application provides search functionality that enables users to easily find specific posts or content based on keywords, tags, or other search criteria.

7. Bookmark and like a post: Users have the ability to bookmark or save posts they find interesting or want to revisit later. Additionally, they can express appreciation for posts by liking them, indicating their approval or enjoyment.

<h3 align="left">Technologies Used:</h3>

1. HTML5, CSS3, and JavaScript for the frontend

2. React.js for building the user interface components

3. Node.js and Express for the backend server

4. MongoDB for storing user-related data

5. AWS S3 Storage for storing user profile photo

6. Machine Learning for Predicting Image Captions and Emojis

<h3 align="left">Getting Started:</h3>
To run Pixemo locally on your machine, follow these steps:

1. Clone this repository: git clone https://github.com/Chinmay908/Pixemo.git

2. Install dependencies for the backend server: cd Pixemo/backend && npm install

3. Install dependencies for the frontend: cd ../frontend && npm install

4. Start the backend server: npm run start (in the backend directory)

5. Start the frontend development server: npm run start (in the frontend directory)

6. Run ML model files for image captioning and emoji prediction: cd ./client/model && python emoji_pred.py image_caption.py main.py (in the frontend directory)

7. Open your web browser and go to http://localhost:3000 to access Pixemo.

<h3 align="left">Results:</h3>
1. Dashboard Page
<img width="956" alt="Dashboard1" src="https://user-images.githubusercontent.com/67832334/232585432-8038bdd5-6a87-4532-9298-7e3c2c1ad5f4.png">

![Dashboard2](https://user-images.githubusercontent.com/67832334/232585655-fee36f30-56bb-49b8-9d32-3155827eea07.png)

![Dashboard3](https://user-images.githubusercontent.com/67832334/232585674-533b6d6d-c079-4c0f-aaec-12e85363c3e0.png)


2. Login Page

![Login](https://user-images.githubusercontent.com/67832334/232585847-77a94321-09ee-4385-b668-61ed1ddac352.png)


3. Signup Page

![Signup](https://user-images.githubusercontent.com/67832334/232586026-437ca245-36d3-4178-a662-bd5cf90ef790.png)


4. Home Page

<img width="951" alt="Home" src="https://user-images.githubusercontent.com/67832334/232586372-1d95dd39-50bc-4712-bc36-af2008f38983.png">


5. Create Post Page

![CreatePost](https://user-images.githubusercontent.com/67832334/232586453-f821b7b9-64ac-442d-b02e-552fe12daa0a.png)


6. View Post Page

![ViewPost](https://user-images.githubusercontent.com/67832334/232586485-962c161f-a913-416a-9725-017d62d81e2a.png)


7. Profile Page

![Profile](https://user-images.githubusercontent.com/67832334/232586528-a4c57713-8da8-475e-9d33-3a2a62a9edd7.png)


<h3 align="left">Contributing:</h3>
If you would like to contribute to Pixemo, you can follow these steps:

1. Fork the repository.

2. Create a new branch for your feature or bug fix: git checkout -b my-feature-branch

3. Make your changes and commit them: git commit -m "Add new feature"

4. Push your changes to your forked repository: git push origin my-feature-branch

5. Create a pull request to the main repository, explaining your changes and their purpose.

<h3 align="left">Licence:</h3>
Pixemo is released under the MIT License.


Feel free to update and customize this README to suit your specific project needs. If you have any questions or need further assistance, please feel free to ask.



