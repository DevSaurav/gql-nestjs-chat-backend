# 💬 GQL Chat Application

A real-time chat backend application built with **NestJS**, **GraphQL Subscriptions**, and **MongoDB**. Supports user authentication, message broadcasting, and active 1:1 chat room interface.


---

## 🧰 Tech Stack

* [NestJS](https://nestjs.com/) – Framework for building scalable Node.js server-side applications
* [GraphQL](https://graphql.org/) – API query language
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/) – GraphQL server
* [WebSockets (Subscriptions)](https://www.apollographql.com/docs/react/data/subscriptions/) – Real-time communication
* [MongoDB](https://www.mongodb.com/) – NoSQL database
* [Mongoose](https://mongoosejs.com/) – ODM for MongoDB

---

## 📦 Installation

### Clone the repository

```bash
git clone https://github.com/DevSaurav/gql-nestjs-chat-backend.git
cd gql-nestjs-chat-backend
```

### Install dependencies

```bash
npm install
# or
yarn install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/chat-app
JWT_SECRET=your_jwt_secret
```

---

## 🚀 Running the App

### Development

```bash
npm run start:dev
```

Visit: [http://localhost:3000/graphql](http://localhost:3000/graphql) for the GraphQL Playground

### Production

```bash
npm run build
npm run start:prod
```

---

## 🔄 GraphQL Subscriptions

This app uses **WebSockets** for real-time updates (via `graphql-ws` or `subscriptions-transport-ws`).

Example subscription:

```graphql
subscription MessageAdded {
  messageAdded {
    _id
    content
    createdAt
    content
    user {
      _id
      username
    }
    receiver{
      _id
      username
    }
  }
}
```

---

## 🧪 Testing

```bash
npm run test
```

---

## 🗂️ Project Structure

```
src/
│
├── chat/               # Chat module (messages, rooms)
├── auth/              # User module (auth, profile)
├── main.ts             # App entry point
└── app.module.ts       # Root module
```

---

## 📖 Features

* ✅ Real-time messaging with GraphQL Subscriptions
* ✅ MongoDB for persistent chat history
* ✅ JWT-based authentication
* ✅ User chat 1:1, new chat badge count
* ✅ Modular and scalable NestJS architecture

---
## 🌐 Enhancements to be done

```bash
* Message Broker for scaling chat using subscriptions
* Email and realtime message inbox
* Enhance authentication with proper auth server with OAUTH standards
* Merge user inbox with new recent message for a specific users an show inbox based on the chat history
* User Profile and email validations


```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙌 Acknowledgements

* [NestJS](https://nestjs.com/)
* [Apollo GraphQL](https://www.apollographql.com/)
* [MongoDB](https://www.mongodb.com/)

---

