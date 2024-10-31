[![Rangers United](https://www.rangersunited.com/og-image.png)](https://www.rangersunited.com)

# Project Overview: Power Rangers Heroes of the Grid Group Finder

## Synopsis

This web application helps players of **Power Rangers Heroes of the Grid** connect and find local games, allowing users to host or join sessions with ease. Key features include location-based game search, real-time messaging, user notifications, and hosting options at private residences or **Friendly Local Game Stores (FLGS)**. Built with **Next.js**, **Supabase**, **Clerk**, and **Drizzle ORM** for type-safe database management, the app combines location-based search and interactive features to create a comprehensive player matchmaking experience.

---

## Goal

The app’s main objective is to simplify group play for **Power Rangers Heroes of the Grid** by enabling users to:

- Create accounts and manage game slots for hosting or joining.
- Find games within a radius of their set location, with a dynamic search feature.
- Host games at either private residences or **Friendly Local Game Stores (FLGS)**.
- Chat with other players in real-time for game coordination.
- Receive notifications if game details change (e.g., time, location) or if the game is deleted.
- Access a **saved search** feature for email notifications about new games within their preferred area.

---

## High-Level Structure

### 1. **User Authentication and Profiles**

- **Clerk** manages user authentication, supporting sign-up, login, and profile management.
- Users can configure time slots for hosting or joining games.
- Profile pages allow users to manage details and game slots, with **5 slots** for standard users, expanding to **20 slots** for premium members.

### 2. **Game Hosting and Joining**

- Users can specify **date**, **time**, and **location** for games, using zip code entry or **geolocation detection**.
- Game hosts can choose nearby **FLGS** locations through a search feature, using **PostGIS** for precise geolocation.
- Users search within a configurable radius for available games and receive real-time updates on game status, including **Scheduled**, **Ongoing**, **Completed**, and **Cancelled**.

### 3. **Messaging System**

- A dedicated chat for each game enables seamless communication.
- Hosts have **admin controls** to moderate the chat, with the ability to delete any message, while joiners can edit or delete their own messages.
- Messages from joiners who leave the game are flagged and visible only to the host, helping retain context in case of rejoining.

### 4. **Notifications**

- Notifications keep joiners updated on:
  - Host changes to game details.
  - Game cancellations or deletions.
- **Game-specific notifications** are shown on the game details page, while **user notifications** appear in the header for broader updates, like saved search results and game deletions.
- Real-time notifications are powered by **Supabase Realtime**, with additional email notifications for saved search results.

### 5. **Geolocation and Search**

- **PostGIS** geolocation enables efficient distance-based game searches, while **Supabase** facilitates spatial queries.
- **Saved Search**: Users can set a weekly saved search that emails them about new games within a specified radius.

### 6. **Database Structure and Type Safety (Using Drizzle ORM)**

- **Drizzle ORM** provides type-safe schema management for tables including:
  - **Users**: Profiles and game slot configurations.
  - **GameSlots**: Hosting/joining times linked to each user.
  - **Games**: Detailed game records.
  - **Messages**: Real-time message data for each game’s chat.
  - **Game and User Notifications**: Manages both game-specific and broader user notifications.
- **Supabase** powers real-time messaging and notifications, ensuring timely delivery and sync across devices.

### 7. **User Interface and Responsiveness**

- **Next.js** front-end is optimized for mobile, enhancing accessibility.
- **Tailwind CSS** offers flexible styling with a responsive, mobile-first approach.
- UI design is simple, emphasizing clear navigation and easy access to search, join, and messaging features.

---

## Core Features Checklist

- **Authentication**: Managed by Clerk for secure account and profile handling.
- **Game Hosting**: Create and customize game slots with date, time, and location.
- **Game Joining**: Radius-based search for nearby games, powered by PostGIS.
- **Messaging System**: Real-time chat with host moderation options.
- **Geolocation**: Automatically detect or manually enter location for hosting/joining.
- **FLGS Integration**: Easily find and host games at local game stores.
- **Notifications**: In-app and email notifications for game changes, cancellations, and saved search results.
- **Database Management**: Type-safe schema managed via Drizzle ORM for consistency.
- **Mobile-First Design**: Responsive layout designed for mobile accessibility.

---

## Future Enhancements

- **User Ratings**: Build a reputation system for trust within the community.
- **Third-Party Integration**: Sync with calendar apps, Discord, or Slack for game coordination.
- **Game Analytics**: Offer insights for hosts on player engagement and game participation.
- **Localization**: Add multi-language support for international players.
- **Moderation Tools**: Additional reporting and moderation controls for in-chat safety.

---

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS / Material UI
- **Backend**: Supabase (Database, Realtime, Notifications)
- **Authentication**: Clerk
- **Database ORM**: Drizzle ORM
- **Geolocation**: PostGIS
- **Notifications**: Supabase Realtime for real-time in-app notifications; scheduled emails for saved searches

---

### Conclusion

This app delivers a secure, intuitive, and dynamic experience for **Power Rangers Heroes of the Grid** players, allowing them to find and join game groups easily. By leveraging real-time messaging, geolocation, and automated notifications, the app provides a feature-rich environment that brings together players and enhances group coordination. The architecture prioritizes performance, scalability, and usability, ensuring an engaging and seamless user experience.
