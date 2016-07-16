# ![Logo](./img/logo.png) Sendgrid Event Logger

Small, fast http server to log Sendgrid Event Webhook callback to Elasticsearch

[![Build Status](https://travis-ci.org/slebetman/sendgrid-event-logger.svg?branch=master)](https://travis-ci.org/slebetman/sendgrid-event-logger)
[![Coverage Status](https://coveralls.io/repos/github/slebetman/sendgrid-event-logger/badge.svg?branch=master)](https://coveralls.io/github/slebetman/sendgrid-event-logger?branch=master)

![Kibana](./img/Kibana-Screen-Shot.png)

*Monitoring sendgrid events on Kibana dashboard*

## Installing

Just install globally with npm:

    npm install -g sendgrid-event-logger

## Setup

1. Install and run Elasticsearch. Refer to the docs for details:
https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html

2. Install the default config file by running:

        sendgrid-event-logger install
		
    If you're running elasticsearch on a port other than 9200 the above command
    will generate an error. Don't worry about it for now.

3. Check `/etc/sendgrid-event-logger.json` and edit if necessary.

4. To run the server, simply type:

        sendgrid-event-logger

    It is highly recommended that you run the server using a process manager like
    [PM2](https://github.com/Unitech/pm2) or [forever](https://github.com/foreverjs/forever).

5. Configure your Sendgrid account to point the Event Webhook to:

        http://your.server.address:port/logger

    Refer to the docs for how to set up the Event Webhook:
    https://sendgrid.com/docs/API_Reference/Webhooks/event.html
    
    Note: If you enable basic auth then set the URL to:
    
        http://username:password@your.server.address:port/logger

## Integrating with Kibana

1. Install Kibana. Refer to the docs for details:
https://www.elastic.co/guide/en/kibana/current/setup.html

2. Configure a new index pattern.
    - Select **"Index contains time-based events"** checkbox
    
        ![Kibana config](./img/Kibana-index-type.png)
        
	- In the **"Index name or pattern"** entry type: `mail-*`
	
	    ![Kibana config](./img/Kibana-index-name.png)
	    
	- In the **"Time-field name"** entry select "timestamp"
	
	    ![Kibana config](./img/Kibana-time-field.png)
	
	- Press **"Create"**

## Configuration

The config file is located at: `/etc/sendgrid-event-logger.json`.
The following are the configurations available:

- `elasticsearch_host`
    Location of the elasticsearch server.
    
- `port`
    The port the server listens on

- `use_basicauth`
    Enable or disable basic authentication

- `basicauth.user`
    Login username if basicauth is enabled
    
- `basicauth.password`
    Login password if basicauth is enabled
    
- `use_https`
    Enable or disable TLS

- `https.key_file`
    Location of TLS key file on disk

- `https.cert_file`
    Location of TLS certificate file on disk

## Implementation details

All sendgrid events are logged to a time-series index with the prefix
`mail-`. The server logs events to a new index each day similar
to how [logstash](https://www.elastic.co/products/logstash) works.

By default the server listens to port 8080 but this can be changed in
the config file.

The server exposes 2 URL endpoints:

- `POST /logger`
    This receives data from Sendgrid Event Webhook callback
    It expects the data to be an array of events. At minimum, the
    data format must be at least:
    
        [
            {
                timestamp: ${unix_timestamp}
            }
        ]
        
    The only mandatory field is `timestamp`. Which means you can also
    post your own events to this URL if you want to correlate your
    data with sendgrid events.

- `GET /status`
    This simply returns `{status:'ok'}`. This URL may be used to check
    if the server is still alive.
    
## License

Copyright (C) 2016 TrustedCompany.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License version 2 
**(GPL-2.0)** as published bythe Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
