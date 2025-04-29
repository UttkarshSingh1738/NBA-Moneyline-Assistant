# Multiuser Chatroom Application

![Chatroom](https://img.shields.io/badge/Chatroom-Java_Play_React-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)
![React](https://img.shields.io/badge/React-Latest-blue.svg)
![sbt](https://img.shields.io/badge/sbt-1.1+-blue.svg)
![Java](https://img.shields.io/badge/Java-11+-blue.svg)

## Project Overview

This project is a full-stack multiuser chatroom application built using the **Java Play Framework** for the backend and **React.js** for the frontend. It uses a **MySQL** database for data storage. The application allows multiple users to register, log in, and chat in real-time.

## Tools and Technologies

### Backend
- **Java Play Framework**: 3.0.3
- **MySQL**: 8
- **sbt**: 1.1
- **Scala**: Compatible with cross versions 2.13.14 and 3.3.3

### Frontend
- **React.js**: Latest version (as of June 2024)

## Project Setup and Usage

### Prerequisites
- **Java**: JDK 11 or higher
- **Node.js**: Latest LTS version
- **MySQL**: Version 8
- **sbt**: Version 1.1 or higher

### Clone the Repository
```bash
git clone https://github.com/UttkarshSingh1738/Chatroom-Java-Play-MySQL-React.git
cd Chatroom-Java-Play-MySQL-React
```

### Backend Setup

**Database Configuration**:
   Configure your MySQL database in the `application.conf` file located in the `conf/` directory:
   ```conf
   db.default.driver=com.mysql.cj.jdbc.Driver
   db.default.url="jdbc:mysql://localhost:3306/chatdb"
   db.default.username="yourusername"
   db.default.password="yourpassword"
```

### Frontend Setup

1. **Navigate to the Frontend Directory:**:
```bash
cd frontend
```
2. **Install Dependencies**:
```bash
npm install
```

### Proxy Configuration
The React development server is configured to proxy API requests to the Play Framework backend running on port 9000. This is set up in the package.json file of the React project:

```json
{
  "proxy": "http://localhost:9000",
  ...
}
```
## Application Usage

### Access the Application
- Open your browser and navigate to `http://localhost:3000`. This will load the React frontend.

### Backend API
- The backend runs on `http://localhost:9000` in the background, handling API requests.

## Application Features

- **User Registration**: New users can register by providing a username and password.
- **User Login**: Registered users can log in with their credentials.
- **Chat Functionality**: Logged-in users can send and receive messages in real-time.

## Development Notes

### Run Backend and Frontend Concurrently
- Use `sbt run` to start the Play Framework backend. The frontend is served via React's development server on port 3000, with API requests proxied to the backend running on port 9000.

### Database Migrations
- Ensure MySQL is running and configured correctly in `application.conf`. Use the Play Framework's migration tool to apply any database changes.

## Dependencies

### Backend (Play Framework)
- `play-ebean`
- `mysql-connector-java`
- `play-json`
- `play-i18n`
- `play-guice`

### Frontend (React.js)
- `react`
- `react-dom`
- `react-scripts`

## Future Improvements

- **Real-time Notifications**: Implement real-time notifications using WebSockets.
- **User Profiles**: Add functionality for user profiles with custom avatars.
- **Message History**: Implement message history with pagination.

## Contributing

Feel free to submit issues or pull requests. For major changes, please open an issue first to discuss what you would like to change.


