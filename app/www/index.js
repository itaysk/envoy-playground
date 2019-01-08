(function () {
    'use strict';

    window.onload = function () {
        let editor = null;
        let button = document.getElementById('runButton');
        let resIframe = document.getElementById('resIframe');
        let resIframeLoadHtml = 'Loading...';
        let baseUrl = window.location.hostname;

        resIframe.src = `http://${baseUrl}:${env.serviceDiscovery.envoyListenerPort}`;

        require(['vs/editor/editor.main'], function () {
            let editorContainer = document.getElementById('monaco-container');
            let model = monaco.editor.createModel('Loading...', 'yaml');
            editor = monaco.editor.create(editorContainer, {
                model: model,
                minimap: {
                    enabled: false
                }
            });

            fetch('/getconfig').then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    console.error('error getting default yaml');
                    return 'error getting default yaml';
                }
            }).then(text => {
                model.setValue(text);
            });
        });

        button.addEventListener('click', () => {
            resIframe.srcdoc = resIframeLoadHtml;
            var value = editor.getValue();
            fetch('/applyconfig', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/yaml"
                },
                body: value
            }).then((res) => {
                if (res.ok) {
                    waitForPageLoaded(resIframe.src, 2000).then(() => { // allow envoy to reload
                        resIframe.attributes.removeNamedItem('srcdoc');
                        //resIframe.src = resIframe.src; //no need to refresh due to transition from srcdoc to src
                    });
                } else { //fetch doesn't reject on server errors
                    console.error(`catch applying config: ${res}`);
                    resIframe.srcdoc = `error applying config`;
                }
            }).catch((e) => {
                console.error(`catch applying config: ${e}`);
                resIframe.srcdoc = `error applying config`;
            });
        });

        const waitForPageLoaded = (url, period) => {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    fetch(url).then((res) => {
                        if (res.ok) {
                            clearInterval(interval);
                            resolve();
                        } else {
                            console.log('fetch result is not ok. retrying');
                        }
                    }).catch((e) => {
                        console.log('fetch rejected. retrying')
                    });
                }, period);
            });
        };
    };
})();