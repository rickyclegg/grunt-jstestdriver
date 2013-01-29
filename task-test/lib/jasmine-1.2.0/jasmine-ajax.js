function FakeXMLHttpRequest() {
    this.requestHeaders = {};
    this.readyState = 0;
    this.status = null;
    this.responseText = null;
    this.responses = [];

    jasmine.Ajax.server = this;
}

(function (objectPrototype) {

    function open() {
        this.method = arguments[0];
        this.url = arguments[1];
        this.readyState = 1;
    }

    function setRequestHeader(header, value) {
        this.requestHeaders[header] = value;
    }

    function abort() {
        this.readyState = 0;
    }

    function onreadystatechange(isTimeout) {}

    function send(data) {
        this.params = data;
        this.readyState = 2;
    }

    function getResponseHeader(name) {
        return this.responseHeaders[name];
    }

    function getAllResponseHeaders() {
        var responseHeaders = [];
        for (var i in this.responseHeaders) {
            if (this.responseHeaders.hasOwnProperty(i)) {
                responseHeaders.push(i + ': ' + this.responseHeaders[i]);
            }
        }
        return responseHeaders.join('\r\n');
    }

    function respond() {
        var response = getResponseByUrl(this.responses, this.url);

        if (response) {
            this.status = response.status;
            this.responseText = response.responseText || "";
            this.readyState = 4;
            this.responseHeaders = response.responseHeaders ||
            {"Content-type": response.contentType || "application/json" };

            this.onreadystatechange();
        }
    }

    function getResponseByUrl(responses, url) {
        var i,
            l = responses.length,
            response;

        for (i = 0; i < l; i += 1) {
            if (responses[i].url === url) {
                response = responses[i];
            }
        }

        return response;
    }

    function respondWith(response) {
        this.responses.push(response);
    }

    function responseTimeout() {
        this.readyState = 4;
        jasmine.Clock.tick(30000);
        this.onreadystatechange('timeout');
    }

    objectPrototype.open = open;
    objectPrototype.setRequestHeader = setRequestHeader;
    objectPrototype.abort = abort;
    objectPrototype.onreadystatechange = onreadystatechange;
    objectPrototype.send = send;
    objectPrototype.getResponseHeader = getResponseHeader;
    objectPrototype.getAllResponseHeaders = getAllResponseHeaders;
    objectPrototype.respond = respond;
    objectPrototype.respondWith = respondWith;
    objectPrototype.responseTimeout = responseTimeout;

}(FakeXMLHttpRequest.prototype));

jasmine.Ajax = {

    isInstalled: function () {
        return jasmine.Ajax.installed;
    },

    assertInstalled: function () {
        if (!jasmine.Ajax.isInstalled()) {
            throw new Error("Mock ajax is not installed, use jasmine.Ajax.useMock()");
        }
    },

    useMock: function () {
        if (!jasmine.Ajax.isInstalled()) {
            var spec = jasmine.getEnv().currentSpec;
            spec.after(jasmine.Ajax.uninstallMock);

            jasmine.Ajax.installMock();
        }
    },

    installMock: function () {
        jasmine.Ajax.installXHR();
        jasmine.Ajax.installed = true;
    },

    installXHR: function () {
        jasmine.Ajax.xhrMock();
    },

    uninstallMock: function () {
        jasmine.Ajax.assertInstalled();
        jasmine.Ajax.server = jasmine.Ajax.server;
        window.XMLHttpRequest = jasmine.Ajax.real;

        jasmine.Ajax.reset();
    },

    reset: function () {
        jasmine.Ajax.installed = false;
        jasmine.Ajax.real = null;
        jasmine.Ajax.server = null;
        jasmine.Ajax.responses = [];
    },

    xhrMock: function () {
        jasmine.Ajax.real = XMLHttpRequest;
        window.XMLHttpRequest = FakeXMLHttpRequest;
        return XMLHttpRequest;
    },

    installed: false
};