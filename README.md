# ![Logo](./img/logo.png) Sendgrid Event Logger

Small, fast http server to log Sendgrid Event API callback to Elasticsearch

[![Build Status](https://travis-ci.org/slebetman/sendgrid-event-logger.svg?branch=master)](https://travis-ci.org/slebetman/sendgrid-event-logger)
[![Coverage Status](https://coveralls.io/repos/github/slebetman/sendgrid-event-logger/badge.svg?branch=master)](https://coveralls.io/github/slebetman/sendgrid-event-logger?branch=master)

![Kibana](./img/Kibana-Screen-Shot.png)

*Monitoring sendgrid events on Kibana dashboard*

## Installing

Just install globally with npm:

    npm install -g sendgrid-event-logger

## Setup

1. Install Elasticsearch. Refer to the docs for details:
https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html

2. Upload the index template to elasticsearch:

        curl -XPUT elasticsearch_server:9200/_template/sendgrid_template -T elasticsearch-template.json

3. Run the server once to install default config:

        ./sendgrid-event-logger install

4. Check /etc/sendgrid-event-logger.json and edit if necessary.

## Integrating with Kibana

1. Install Kibana. Refer to the docs for details:

2. Configure a new index pattern.
    - Select **"Index contains time-based events"** checkbox
    
        ![Kibana config](./img/Kibana-index-type.png)
        
	- In the **"Index name or pattern"** entry type: `mail-*`
	
	    ![Kibana config](./img/Kibana-index-name.png)
	    
	- In the **"Time-field name"** entry select "timestamp"
	
	    ![Kibana config](./img/Kibana-time-field.png)
	
	- Press **"Create"**

## License

Copyright (C) 2016 TrustedCompany.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License version 2 
**(GPL-2.0)** as published bythe Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
