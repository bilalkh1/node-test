const mongoose = require("mongoose");

const dbConnection = (server, port) => {
        mongoose
            .connect(
                process.env.MONGO_URI, {useNewUrlParser: true}, (err) => {
                    if (err) {
                        console.log(err);
                        throw new Error('Error on connecting to database');
                    } else {
                        console.log('Connected to database');
                        server.listen(port);
                    }
                }
            )
}

module.exports = dbConnection;