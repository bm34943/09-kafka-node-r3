//require('events').EventEmitter.prototype._maxListeners = 100;

console.log("Starting producer...");

const config = require("./config/config.js");

let kafka = require('kafka-node');
let Producer = kafka.Producer;
let KeyedMessage = kafka.KeyedMessage;

//let client = new kafka.Client();
let kafkaClient = new kafka.KafkaClient
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

let producerOptions =
{
    // Configuration for when to consider a message as acknowledged, default 1
    requireAcks: process.env.PRODUCER_REQUIRE_ACKS,
    // The amount of time in milliseconds to wait for all acks before considered, default 100ms
    ackTimeoutMs: process.env.PRODUCER_ACKS_TIMEOUT,
    // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
    partitionerType: process.env.PRODUCER_PARTITONER_TYPE,
}

let producer = new Producer(kafkaClient, producerOptions);

producer.on
(
    'ready', 
    function () 
    {
        console.log("Producer ready...");

        for (let i = 1; i <= process.env.PRODUCER_MESSAGE_COUNT; i++)
        {        
            setTimeout
            (
                () =>
                {
                    let payloads = 
                    [
                        {
                            topic: process.env.TOPIC_NAME,
                            // multi messages should be a array, single message can be just a string or a KeyedMessage instance
                            messages: [i],
                            // string or buffer, only needed when using keyed partitioner
                            key: i.toString(),
                            // default 0
                            //partition: (i%process.env.TOPIC_PARTITION_COUNT), 
                            // default: 0; 0: No compression, 1: Compress using GZip, 2: Compress using snappy
                            attributes: process.env.PRODUCER_COMPRESSION_ATTRIBUTE, 
                            // defaults to Date.now() (only available with kafka v0.10 and KafkaClient only)
                            //timestamp: Date.now()
                        }
                    ];

                    produceData(payloads);
                },
                (i * process.env.PRODUCER_TIMEOUT)
            );
        }
    }
);
 
producer.on
(
    'error', 
    function (error) 
    {
        console.log("Producer error...");
        console.log("Error: " + JSON.stringify(error));
    }
);

let produceData = 
(payloads) =>
{
    producer.send
    (
        payloads, 
        function (error, data) 
        {
            if (error)
            {
                console.log("Error: " + JSON.stringify(error));
            }
            else
            {
                //console.log("Data: " + JSON.stringify(data[process.env.TOPIC_NAME]));

                for (let key in data[process.env.TOPIC_NAME]) 
                {
                    if (data[process.env.TOPIC_NAME].hasOwnProperty(key)) 
                    {
                        console.log(key + " -> " + data[process.env.TOPIC_NAME][key]);
                    }
                }
            }
        }
    );
}