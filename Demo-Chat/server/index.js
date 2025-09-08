const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const usersRouter = require("./routers/usersRouter");
const authRouter = require("./routers/authRouter");
const convRouter = require("./routers/convRouter");

const usersBLL = require("./BLL/usersBLL");
const convBLL = require("./BLL/convBLL");

const path = require("path");
const mongoose = require("mongoose");

const port = 3000;

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

const clients = new Map();

wsServer.on("connection", (ws) => {
  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      // --- LOGIN ---
      if (parsedMessage.type === "LOGIN") {
        clients.set(parsedMessage._id, ws);
        return;
      }

      // --- MESSAGE ---
      if (parsedMessage.type === "MESSAGE") {
        const { text, sender, senderId, groupId } = parsedMessage;

        // שליפת השיחה
        const conv = await convBLL.getConversationById(groupId);
        if (!conv) {
          return ws.send(
            JSON.stringify({ type: "error", reason: "conversation_not_found" })
          );
        }

        // בניית הודעה חדשה
        const newMsg = {
          text,
          sender,
          senderId,
          sentAt: new Date().toLocaleString(),
        };

        // שמירת ההודעה בתוך מערך ה־messages של השיחה
        conv.messages.push(newMsg);
        await convBLL.updateConversation(conv._id, conv);

        // בדיקה אם לשולח כבר יש את השיחה ברשימת ה-conversations
        const user = await usersBLL.getUserById(senderId);
        if (user && !user.conversations.includes(groupId)) {
          user.conversations.push(groupId);
          await usersBLL.updateUser(user._id, user);
        }

        // שליחה בזמן אמת רק לחברי הקבוצה שמחוברים
        // כאן נניח ש־group.members = רשימת ה־userId בקבוצה
        // אם אין לך members, אז פשוט שולחים לכל מי שמחובר (אפשר לשפר בהמשך)
        if (conv.members && conv.members.length > 0) {
          for (const memberId of conv.members) {
            const client = clients.get(memberId);
            if (client) {
              client.send(
                JSON.stringify({
                  type: "MESSAGE",
                  groupId: conv._id,
                  ...newMsg,
                })
              );
            }
          }
        } else {
          // fallback - אם אין members בשיחה
          for (const [id, client] of clients.entries()) {
            client.send(
              JSON.stringify({
                type: "MESSAGE",
                groupId: conv._id,
                ...newMsg,
              })
            );
          }
        }
      }
    } catch (err) {
      console.error("message handler error:", err);
      ws.send(JSON.stringify({ type: "error", reason: "server_error" }));
    }
  });
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://checkpoint-chat-team-7-1.onrender.com",
    ],
  })
);
app.use(express.json());

app.use(express.json());

//Routers
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/conversations", convRouter);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.crzk4rq.mongodb.net/${process.env.DB_NAME}`
  )
  .then((result) => {
    server.listen(port), console.log("DB connected");
  });
