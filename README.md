
# Project Overview: Power Rangers Heroes of the Grid Group Finder

## Synopsis

This is a web application designed for players of the **Power Rangers Heroes of the Grid** board game to find, host, and join games. The app helps players connect with others in their area or online to organize game sessions. Key features include game scheduling, geolocation search, messaging between players, and hosting games at local game stores (FLGS). The app is built using **Next.js**, **Supabase**, **Clerk**, and **Drizzle ORM** for type-safe database management.

---

## Goal

The primary goal of this app is to facilitate group play for **Power Rangers Heroes of the Grid** by allowing users to:
- Create an account and manage time slots for hosting or joining games.
- Search for games within a specific radius of their location or zip code.
- Host games at either private residences or **Friendly Local Game Stores (FLGS)**.
- Communicate with other players using a chat system for each hosted game.
- Notify joiners if the game details change (e.g., time, location) or if the game is deleted.

---

## High-Level Structure

### 1. **User Authentication and Profiles**
- **Clerk** will handle user authentication, allowing players to sign up, log in, and manage their profiles.
- Users can configure their time slots, either hosting a game or joining one.
- Each user has a profile page that allows them to edit their information and manage up to **five time slots**.

### 2. **Game Hosting and Joining**
- Users can create a game by specifying the **date**, **time**, and **location**.
- Location can be manually entered via **zip code** or detected via **Geolocation API**.
- Users have the option to host at a **Friendly Local Game Store (FLGS)** by searching for nearby stores using **Google Places API** or **Mapbox**.
- Players can search for games within a set radius of their location to join.
- Each game has a status such as **Scheduled**, **Ongoing**, **Completed**, or **Cancelled**.

### 3. **Messaging System**
- Each hosted game has a dedicated chat interface.
- Hosts have **admin controls** to delete any messages.
- Joiners can edit or delete their own messages.
- If a joiner leaves a game, their messages become invisible to other players but are still visible to the host with a flag indicating that they are from a previous member.

### 4. **Notifications**
- Notifications are triggered for joiners when:
    - A host changes the game details (time, location, etc.).
    - The host cancels or deletes the game.
- Notifications will be sent through in-app notifications and/or email.
- Reminders will be sent to both hosts and joiners prior to the game (e.g., 24 hours before the game).

### 5. **Geolocation and Search**
- For global use, geolocation will be used to automatically detect the user’s location. For those who prefer manual entry, zip code input will be available.
- Users can search for hosted games within a radius of their location, configurable in the search settings.
- Users can choose to host games at **FLGS** locations through the app's FLGS search feature.

### 6. **Database Structure and Type Safety (Using Drizzle ORM)**
- **Drizzle ORM** will be used for database management to ensure strong type safety.
- The database will include tables for:
    - **Users**: To store user profiles and game slots.
    - **GameSlots**: To store user-specific hosting/joining time slots.
    - **Games**: To manage all hosted games and their details.
    - **Messages**: To store messages exchanged between users in each game’s chat.
    - **Notifications**: To track notifications sent to users.
- **Supabase** will provide the database, storage, and real-time capabilities like subscriptions for the messaging and notification systems.

### 7. **User Interface and Responsiveness**
- The user interface will be designed using **Next.js** with a focus on mobile responsiveness, as many users may access the app from smartphones.
- **Tailwind CSS** or **Material UI** can be used for styling.
- The design will prioritize clarity and ease of use, ensuring smooth navigation for creating and joining games, as well as communicating in the game chats.

---

## Core Features Checklist

- **Authentication**: Sign up, log in, and manage profiles using Clerk.
- **Game Hosting**: Create and manage games, input location, and time.
- **Game Joining**: Search for games within a certain radius of the user’s location.
- **Messaging System**: Chat interface for game coordination, admin privileges for hosts.
- **Geolocation**: Detect location or allow manual zip code entry for hosting/joining.
- **FLGS Integration**: Search for local game stores to host events.
- **Notifications**: Alerts for game changes or cancellations, reminders.
- **Database Management**: Type-safe schema with Drizzle ORM for Users, Games, Messages, and Notifications.
- **Mobile-First Design**: Prioritize mobile usability and responsiveness.

---

## Future Enhancements

- **User Ratings**: Introduce a system for rating hosts and joiners to build community trust.
- **Third-Party Integration**: Sync with calendars, Discord, or Slack for easier coordination.
- **Game Status and Analytics**: Provide analytics to hosts on joiners and game activity.
- **Localization**: Add multi-language support and time zone adjustments for international users.
- **Moderation and Reporting**: Allow users to report inappropriate behavior or messages in game chats.

---

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS / Material UI
- **Backend**: Supabase (Database, Authentication, Realtime)
- **Authentication**: Clerk
- **Database ORM**: Drizzle ORM
- **Location Services**: Geolocation API, Google Places API / Mapbox
- **Notifications**: Supabase Realtime, In-app, and Email Notifications

---

### Conclusion

This app aims to create a smooth and secure experience for **Power Rangers Heroes of the Grid** players to find groups, schedule games, and coordinate effectively through messaging. By leveraging modern web development tools, the app will ensure seamless performance, scalability, and a rich user experience.
