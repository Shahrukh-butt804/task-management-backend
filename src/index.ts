import { app } from "./app.js";
import { connectDb } from "./config/db.js";
const PORT = process.env.PORT || 4000;
connectDb().then(({host , dbName}) => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${host} port ${PORT} connected Db name ${dbName}` );
    });
}).catch((err) => {
    console.error(`Error connecting to the database: ${err.message}`)
})