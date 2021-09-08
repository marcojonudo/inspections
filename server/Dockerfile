FROM openjdk:8u171-alpine3.7
LABEL maintainer="marco.martinez@feuvert.es"
VOLUME /logs/inspections
EXPOSE 8095
ARG LOCALHOST=localhost
ENV HOST_IP=$LOCALHOST
RUN apk --no-cache add curl
COPY build/libs/*.jar inspections.jar
CMD java -Dcom.sun.management.jmxremote -Dmicronaut.environments=$ENV -Xmx$MAX_MEMORY -jar inspections.jar
