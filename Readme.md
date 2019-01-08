This is a little tool that can help you experiment and learn Envoy proxy configuration.

It's a Kubernetes pod with a few containers:
1. httpbin - a webserver that allows inspection of requests
2. envoy - Envoy that proxies to httpbin (1)
3. envoy-playground - a web application that allows to edit the configuration of Envoy (2) and shows the result of httpbin (1)

## Example

1. Deploy and launch envoy-playground
2. Examine the default envoy config on the right pane, and the resulting httpbin in the right pane
3. Make a change to the configuration, for example, add a `host_rewrite: itaysk.com` to the default route
4. Click on 'Apply' and wait for the resulting httpbin pane to reload
5. In the resulting httpbin pane, click on `/get` to examine the HTTP GET request. Notice how the `HOST` header is seen as `itaysk.com`

## Deploy

An easy way to play with it is to `kubectl create -f ./deploy/`.  
This will create the pod and expose it using a NodePort Service. Then you will need to update (or create) the `envoy-playground-config` ConfigMap with the node port of the envoy listener.
In the future I may find a better way to automate this.

## Future

Stuff I may improve:

- Schema validation for the envoy config
- Better deployment story
- Cover more Envoy scenarios (like egress)

I'm open for suggestions, feedback and contributions.
