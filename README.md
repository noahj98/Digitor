# Digitor
Noah Jackson's final project for Comp 426 Fall 2019

<h3>Background on Digitor</h3>

Digitor is a chat-based web app designed to allow easy connections and communication between underclassmen and upperclassmen. It is designed such that underclassmen can connect with upperclassmen in various majors to ask about courses, their major, career paths, or anything else questions they may have.

<h3>Technical Aspects of Digitor</h3>

Digitor is a web app that uses Axios, Express, MariaDB, jQuery, and several other frameworks. Development was done with browser-sync.

Digitor's frontend interacts with the backend via a RESTful API. The backend currently generates fake accounts using 3rd party APIs and similary generates fake messages between users using a 3rd party API. User data and messages are stored using MariaDB.

The web app itself is simple and intuitive. If you are not logged in, the only thing you can do is log in or create an account.

Users are either mentors or mentees. Mentors only have the option of replying to mentees. They cannot initiate chats.

Mentees, on the other hand, can create chats with mentors based on the mentors major, year, etc.

Both mentors and mentees can delete chat history at any time.
