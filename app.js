// הספרייה אקספרס שיודעת לתפעל שרת בקלות
const express = require("express");
// מודול שעושה מיניפולציות על כתובות שהוא מקבל
const path = require("path");
// מודול שמאפשר לנו להריץ שרת HTTP
const http = require("http");
require("./db/mongoConnect");

const {routesInit,corsAccessControl} = require("./routes/config_routes")


// מגדיר משתנה שמשתמש ביכולות של אקספרס שיעבור ל
// מודול שרת HTTP
const app = express();

// מגדיר שכל מידע שנכנס ויוצא הוא בפורמט ג'ייסון
// קריטי במיוחד שאנחנו מייצרים איי פי אייי
app.use(express.json());
// מגדיר תקייה סטטית שחשופה לצד לקוח
// תמונות וקבצי הטמל לדוגמא שהמשתמש ינסה לפנות אליהם השרת ידע להציג
app.use(express.static(path.join(__dirname,"public")))

//פונקציה שמאפשרת לכל שרת מכל דומיין
// להתחבר אלינו
corsAccessControl(app);
// מאתחל את כל הרואטים הקיימים
routesInit(app);
// app.use("/", (req,res) => {
//   res.json({message:"Our api app work perfect!"});
// })

// מייצר את השרת ומשתמש ביכולות של האפ שהוא האקספרס
const server = http.createServer(app);
let port = process.env.PORT || "3000";
server.listen(port);