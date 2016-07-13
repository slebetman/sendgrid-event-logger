# ![Logo](https://github.com/slebetman/sendgrid-event-logger/raw/master/logo.png) Sendgrid Event Logger

Small, fast http server to log Sendgrid Event Callback API to Elasticsearch

[![Build Status](https://travis-ci.org/slebetman/sendgrid-event-logger.svg?branch=master)](https://travis-ci.org/slebetman/sendgrid-event-logger)
[![Coverage Status](https://coveralls.io/repos/github/slebetman/sendgrid-event-logger/badge.svg?branch=master)](https://coveralls.io/github/slebetman/sendgrid-event-logger?branch=master)

## Installing

1. Install Elasticsearch. Refer to the docs for details:
https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html

2. Upload the index template to elasticsearch:

        curl -XPUT elasticsearch_server:9200/_template/sendgrid_template -T elasticsearch-template.json

3. Edit config.json if necessary.

4. Run the server:

        ./sendgrid-event-logger

## License

Copyright (C) 2016 TrustedCompany.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License version 2 as
published bythe Free Software Foundation

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
