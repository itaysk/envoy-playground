// depending on how you exposed the service, set the browser to service discovery settings here
// this is intentionally not along the other static files, to allow for server generated config
var serviceDiscovery = {
    envoyListenerPort: process.env.ENVOY_LISTENER_PORT
}
module.exports = { 
    serviceDiscovery
};