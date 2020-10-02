const mysql = require("mysql");

let connectionPool = 
mysql.createPool
(
    {
        host            : process.env.DB_HOST,
        user            : process.env.DB_USER,
        password        : process.env.DB_PASSWORD,
        database        : process.env.DB_NAME,
        connectionLimit : parseInt(process.env.DB_POOL_SIZE),
        acquireTimeout  : parseInt(process.env.DB_ACQUIRE_TIMEOUT)
    }
);

let connectionDirect = 
mysql.createConnection
(
    {
        host            : process.env.DB_HOST,
        user            : process.env.DB_USER,
        password        : process.env.DB_PASSWORD,
        database        : process.env.DB_NAME
    }
);
  
connectionDirect.connect
(
    (error) =>
    {
        if (error) 
        {
            console.log("Error connecting to database:\n" + error.stack);
            utilities.logError(process.env.LOG_CONSUMER, "append", "Database Connection Error", error);

            return;
        }
  
        console.log("Database connected as ID: " + connectionDirect.threadId);
    }
);

module.exports = 
{
    mysql: mysql,
    connectionPool: connectionPool,
    connectionDirect: connectionDirect
};