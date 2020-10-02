console.log("Starting consumer...");
console.log();

process.argv.forEach
(
    (val, index, array) =>
    {
        console.log(index + ': ' + val);
    }
);

const config = require("./config/config.js");

const {mysql, connectionPool, connectionDirect} = require("./database/database.js");

let kafka = require('kafka-node');
let Consumer = kafka.Consumer;
let ConsumerGroup = kafka.ConsumerGroup;

let kafkaClient = 
new kafka.KafkaClient
(
    {
        // kafkaHost : A string of kafka broker/host combination delimited by comma for example: kafka-1.us-east-1.myapp.com:9093,kafka-2.us-east-1.myapp.com:9093,kafka-3.us-east-1.myapp.com:9093 default: localhost:9092
        kafkaHost: process.env.BROKER_HOST,
        // connectTimeout : in ms it takes to wait for a successful connection before moving to the next host default: 10000
        connectTimeout: process.env.BROKER_CONNECT_TIMEOUT,
        // requestTimeout : in ms for a kafka request to timeout default: 30000
        requestTimeout: process.env.BROKER_REQUEST_TIMEOUT,
        // autoConnect : automatically connect when KafkaClient is instantiated otherwise you need to manually call connect default: true
        autoConnect: process.env.BROKER_AUTO_CONNECT,
        // connectRetryOptions : object hash that applies to the initial connection. see retry module for these options.
        //connectRetryOptions: ,
        // idleConnection : allows the broker to disconnect an idle connection from a client (otherwise the clients continues to reconnect after being disconnected). The value is elapsed time in ms without any data written to the TCP socket. default: 5 minutes
        //idleConnection: ,
        // maxAsyncRequests : maximum async operations at a time toward the kafka cluster. default: 10
        maxAsyncRequests: process.env.BROKER_MAX_ASYNC_REQUESTS,
        // sslOptions: Object, options to be passed to the tls broker sockets, ex. { rejectUnauthorized: false }
        //sslOptions: ,
        // sasl: Object, SASL authentication configuration (only SASL/PLAIN is currently supported), ex. { mechanism: 'plain', username: 'foo', password: 'bar' }
        //sasl: ,
    }
);

var options = 
{
    // connect directly to kafka broker (instantiates a KafkaClient)
    kafkaHost: process.env.BROKER_HOST, 
    // put client batch settings if you need them
    batch: undefined, 
    // optional (defaults to false) or tls options hash
    ssl: false, 
    groupId: 'ExampleTestGroup',
    sessionTimeout: 15000,
    // An array of partition assignment protocols ordered by preference.
    // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
    protocol: ['roundrobin'],
    // default is utf8, use 'buffer' for binary data
    encoding: 'utf8', 
    // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
    // equivalent to Java client's auto.offset.reset
    // default
    fromOffset: 'latest', 
    // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
    commitOffsetsOnFirstJoin: true, 
    // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
    // default
    outOfRangeOffset: 'earliest', 
    // for details please see Migration section below
    migrateHLC: false,    
    migrateRolling: true,
    // Callback to allow consumers with autoCommit false a chance to commit before a rebalance finishes
    // isAlreadyMember will be false on the first connection, and true on rebalances triggered after that
    onRebalance: (isAlreadyMember, callback) => { callback(); } // or null
};
   
// for a single topic pass in a string
var consumerGroup = new ConsumerGroup(options, process.env.TOPIC_NAME);

consumerGroup.on
(
    'message', 
    (message) =>
    {
        //console.log(JSON.stringify(message));
        console.log(`${message["partition"]} - ${message["offset"]} - ${message["value"]}`);

        if(process.env.DB_POOL === "true")
        {
            //console.log(process.env.DB_POOL);

            connectionPool
            .getConnection
            (
                (error, connection) =>
                {
                    if (error) 
                    {
                        // There was an error connection to the pool
                        console.log(error);
                    }
                    
                    connection
                    .query
                    (
                        "INSERT INTO timeline_transaction SET ?",
                        {
                            timeline_timestamp: mysql.raw("CURRENT_TIMESTAMP()"),
                            timeline_data: String(message["value"]),
                            topic_id: parseInt(process.env.TOPIC_TIMELINE_ID),
                            topic_partition_id: message["partition"],
                            topic_partition_offset: message["offset"]
                        }, 
                        (error, results, fields) =>
                        {
                            if (error) 
                            {
                                // There was an error inserting
                                console.log(error);
                            }
                            else
                            {
                                //console.log(results.insertId);
                                connection.release();
                            }
                        }
                    );
                }
            );
        }
        else
        {
            connectionDirect
            .query
            (
                "INSERT INTO timeline_transaction SET ?",
                {
                    timeline_timestamp: mysql.raw("CURRENT_TIMESTAMP()"),
                    timeline_data: String(message["value"]),
                    topic_id: parseInt(process.env.TOPIC_TIMELINE_ID),
                    topic_partition_id: message["partition"],
                    topic_partition_offset: message["offset"]
                }, 
                (error, results, fields) =>
                {
                    if (error) 
                    {
                        // There was an error inserting
                        //console.log(error);
                    }
                    else
                    {
                        //console.log(results.insertId);
                    }
                }
            );
        }
    }
);

consumerGroup.on
(
    'error', 
    (error) =>
    {
        console.log(`Error: ${JSON.stringify(error)}`);
    }
);

consumerGroup.on
(
    'offsetOutOfRange', 
    (error) =>
    {
        console.log(`Error: ${JSON.stringify(error)}`);
    }
);