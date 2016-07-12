# ![Logo](https://github.com/slebetman/typhos/raw/master/logo.png) Sendgrid Event Logger

Small, fast http server to log Sendgrid Event Callback API to Elasticsearch

## Installing

1. Install Elasticsearch. Refer to the docs for details:
https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html

2. Upload the index template to elasticsearch:

    curl -XPUT elasticsearch_server:9200/_template/sendgrid_template -T elasticsearch-template.json

3. Edit config.json if necessary.

4. Run the server:

    ./sendgrid-event-logger

