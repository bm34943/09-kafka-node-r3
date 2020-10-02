let environment = process.env.NODE_ENV || "local";
console.log(`Environment: ${environment}`);

if(environment === "local")
{
    let config = require("./config.json");
    //console.log(config);
    
    let environmentConfig = config[environment];
    
    Object
    .keys(environmentConfig)
    .forEach
    (
        (key) =>
        {
            process.env[key] = environmentConfig[key];
        }
    );

    console.log();
}