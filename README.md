# Chat Application

This is a real-time chat application built with Node.js, Express, and Socket.IO. It allows users to register, log in, search for other users, add friends, and send/receive messages in real-time.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
  - [User Routes](#user-routes)
  - [Chat Routes](#chat-routes)
- [Models](#models)
- [Utils](#utils)
- [Language Model Settings](#language-model-settings)
- [Running the Application](#running-the-application)

## Installation

1. Clone the repository:

```
git clone https://github.com/your-username/chat-app.git
```

2. Navigate to the project directory:

```
cd chat-app
```

3. Install the dependencies:

```
npm install
```

## Environment Variables

Create a `.env` file in the project root directory and add the following environment variables:

```
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri
API_KEY=your_api_key
```

Replace the placeholders with your actual values.

## API Routes

### User Routes

| Route                          | Method | Description                                  | Input                                                                 | Output                                                    |
| ------------------------------ | ------ | -------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| `/api/users/register`          | POST   | Register a new user                          | JSON object containing user details (e.g., username, email, password) | Success/error message                                     |
| `/api/users/login`             | POST   | Log in a user and return a token             | JSON object containing login credentials (e.g., email, password)      | JSON object containing user data and authentication token |
| `/api/users/logout`            | POST   | Log out a user                               | Authentication token                                                  | Success/error message                                     |
| `/api/users/:username`         | GET    | Search for a user by username                | Username as a URL and authentication token as parameters              | JSON object containing user data                          |
| `/api/users/addfriend/:friend` | POST   | Add a friend to the user's friend list       | Friend's username as a URL parameter, authentication token            | Success/error message                                     |
| `/api/users/status`            | POST   | Change the user's status (AVAILABLE or BUSY) | JSON object containing the new status, authentication token           | Success/error message                                     |

### Chat Routes

| Route                         | Method | Description                          | Input                                                                             | Output                                |
| ----------------------------- | ------ | ------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------- |
| `/api/chat/:sender/:receiver` | GET    | Fetch all messages between two users | Sender's username and receiver's username as URL parameters, authentication token | JSON array containing message objects |

Note:

- The input and output formats mentioned above are general representations and may vary based on the specific implementation and data structure used.
- Authentication tokens are typically required for routes that involve user-specific actions or data retrieval, ensuring secure access.
- URL parameters like `:username` and `:friend` should be replaced with the actual values when making requests.
- The data structures for user details, messages, and other entities may differ based on the application's design.

This comprehensive representation provides a clearer understanding of the API routes, the HTTP methods used, the expected inputs, and the corresponding outputs for each route. |

## Models

### User Model

```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, default: "AVAILABLE" },
});
```

### Message Model

```javascript
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
```

## Utils

### `auth.js`

This file contains utility functions for generating and verifying JSON Web Tokens (JWT).

### `socket.js`

This file handles the Socket.IO connection and contains the logic for real-time messaging.

### `languageModel.js`

This file contains a utility function to generate text using the Google Generative AI API. It allows you to send a message to the AI model and receive a response. This Language Model (LLM) integration is used to respond to the sender when the receiver is busy or offline.

## Language Model Settings

The provided code applies several safety settings to the generative model, specifically for filtering out potential harmful content. The `safetySettings` array defines the categories of harmful content to be monitored and the corresponding thresholds for blocking the generation of such content.

The categories include:

Sure, here are the same points with the numbers changed to letters:

a. `HARM_CATEGORY_HARASSMENT`: Filters out content related to harassment or bullying.  
b. `HARM_CATEGORY_SEXUALLY_EXPLICIT`: Filters out sexually explicit or pornographic content.  
c. `HARM_CATEGORY_HATE_SPEECH`: Filters out hate speech or discriminatory language.  
d. `HARM_CATEGORY_DANGEROUS_CONTENT`: Filters out content that could be considered dangerous or promoting harmful activities.

For each of these categories, the threshold is set to `BLOCK_ONLY_HIGH`, which means that only content with a high risk of causing harm will be blocked from being generated. This setting aims to strike a balance between maintaining open-ended conversations while preventing the generation of potentially harmful or offensive content.

Certainly! The provided code also includes the following settings and parameters to tune the model's behavior:

1. **History**: The `history` parameter is an array of objects representing the conversation history. Each object has a `role` property indicating whether it's a user or model response, and a `parts` array containing the text of the message. This conversation history is used to provide context to the model, allowing it to generate more relevant and coherent responses based on the previous exchanges.

2. **Generation Configuration**:
   - `maxOutputTokens`: This parameter sets the maximum number of tokens (words or subwords) that the model can generate in its response. In the provided code, it's set to 100.
   - `temperature`: This parameter controls the randomness of the model's output. A higher temperature (closer to 1) makes the output more diverse and unpredictable, while a lower temperature (closer to 0) makes the output more focused and predictable. In the provided code, it's set to 1, allowing for more diverse and creative responses.
   - `topP`: This parameter is used for nucleus sampling, which filters out the least probable tokens from the model's output distribution. A lower value of `topP` (closer to 0) results in more focused and coherent responses, while a higher value (closer to 1) allows for more diversity. In the provided code, it's set to 0.1.
   - `topK`: This parameter is used for top-k sampling, which filters out all but the `topK` most probable tokens from the model's output distribution. In the provided code, it's set to 16, allowing the model to consider a relatively broad range of probable tokens.

These generation configuration parameters collectively control the model's output characteristics, such as creativity, coherence, and diversity. By adjusting these parameters, developers can fine-tune the model's behavior to suit their specific use case or desired output style.

## Running the Application

1. Start the server:

```
npm start
```

2. The server will be running at `http://localhost:3000`.

Now you can interact with the API routes using tools like Postman or a front-end application.
