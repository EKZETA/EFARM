const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

const SUBSCRIBERS_FILE = path.join(__dirname, "subscribers.json");
const CONTACTS_FILE = path.join(__dirname, "contacts.json");

function readSubscribers() {
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(SUBSCRIBERS_FILE, "utf8");
  return JSON.parse(data);
}

function writeSubscribers(subscribers) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

function readContacts() {
  if (!fs.existsSync(CONTACTS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(CONTACTS_FILE, "utf8");
  return JSON.parse(data);
}

function writeContacts(contacts) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

app.post("/api/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const subscribers = readSubscribers();

  if (subscribers.includes(email)) {
    return res.status(400).json({ message: "Email already subscribed" });
  }

  subscribers.push(email);
  writeSubscribers(subscribers);

  res.json({ message: "Successfully subscribed to our newsletter!" });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const contacts = readContacts();

  const newContact = {
    id: Date.now(),
    name,
    email,
    phone: phone || "",
    subject,
    message,
    date: new Date().toISOString(),
  };

  contacts.push(newContact);
  writeContacts(contacts);

  res.json({ 
    message: "Thank you for contacting us! We will get back to you within 24 hours.",
    contactId: newContact.id 
  });
});

app.get("/api/subscribers", (req, res) => {
  const subscribers = readSubscribers();
  res.json({ count: subscribers.length, subscribers });
});

app.get("/api/contacts", (req, res) => {
  const contacts = readContacts();
  res.json({ count: contacts.length, contacts });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});