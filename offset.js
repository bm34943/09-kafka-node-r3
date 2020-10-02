const config = require("./config/config.js");

let kafka = require('kafka-node');

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

let offset = new kafka.Offset(kafkaClient);

offset.fetch
(
    [
        {
            topic: process.env.TOPIC_NAME,
            //default 0
            partition: 0, 
            // time:
            // Used to ask for all messages before a certain time (ms), default Date.now(),
            // Specify -1 to receive the latest offsets and -2 to receive the earliest available offset.
            time: -1,
            //default 1
            maxNum: 1 
         },
         {
            topic: process.env.TOPIC_NAME,
            //default 0
            partition: 1, 
            // time:
            // Used to ask for all messages before a certain time (ms), default Date.now(),
            // Specify -1 to receive the latest offsets and -2 to receive the earliest available offset.
            time: -1,
            //default 1
            maxNum: 1 
         },
         {
            topic: process.env.TOPIC_NAME,
            //default 0
            partition: 2, 
            // time:
            // Used to ask for all messages before a certain time (ms), default Date.now(),
            // Specify -1 to receive the latest offsets and -2 to receive the earliest available offset.
            time: -1,
            //default 1
            maxNum: 1 
         },
         {
            topic: process.env.TOPIC_NAME,
            //default 0
            partition: 3, 
            // time:
            // Used to ask for all messages before a certain time (ms), default Date.now(),
            // Specify -1 to receive the latest offsets and -2 to receive the earliest available offset.
            time: -1,
            //default 1
            maxNum: 1 
         },
         {
            topic: process.env.TOPIC_NAME,
            //default 0
            partition: 4, 
            // time:
            // Used to ask for all messages before a certain time (ms), default Date.now(),
            // Specify -1 to receive the latest offsets and -2 to receive the earliest available offset.
            time: -1,
            //default 1
            maxNum: 1 
         },
         {
            topic: process.env.TOPIC_NAME,
            //default 0
            partition: 5, 
            // time:
            // Used to ask for all messages before a certain time (ms), default Date.now(),
            // Specify -1 to receive the latest offsets and -2 to receive the earliest available offset.
            time: -1,
            //default 1
            maxNum: 1 
         },
    ], 
    (error, data) =>
    {
        if (error)
        {
            console.log(`Error: ${JSON.stringify(error)}`);
        }
        else
        {
            console.log(`Data: ${JSON.stringify(data)}`)
        }
    }
);

offset.fetchCommitsV1
(
    process.env.CONSUMER_GROUP_ID, 
    [
        { 
            topic: process.env.TOPIC_NAME, 
            partition: 0 
        },
        { 
            topic: process.env.TOPIC_NAME, 
            partition: 1 
        },
        { 
            topic: process.env.TOPIC_NAME, 
            partition: 2 
        },
        { 
            topic: process.env.TOPIC_NAME, 
            partition: 3 
        },
        { 
            topic: process.env.TOPIC_NAME, 
            partition: 4 
        },
        { 
            topic: process.env.TOPIC_NAME, 
            partition: 5
        },
    ], 
    (error, data) =>
    {
        if (error)
        {
            console.log(`Error: ${JSON.stringify(error)}`);
        }
        else
        {
            console.log(`Data: ${JSON.stringify(data)}`)
        }
    }
);