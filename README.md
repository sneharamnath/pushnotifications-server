# pushnotifications-server

# Dev

1. Install Kafka

2. Start zookeeper server
 ```
 bin/zookeeper-server-start.sh config/zookeeper.properties
 ```
 3. Start kafka server
 ```
 bin/kafka-server-start.sh config/server.properties
 ```
 4.Create a topic
 ```
 bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic test
 ```
 
 5. To send messages to a topic
 ```
 bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
> This is a message
> This is another message
```
 
 # Start
 
 1. npm install
 2. npm start
 
