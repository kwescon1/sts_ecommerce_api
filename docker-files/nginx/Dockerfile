FROM nginx:stable-alpine

ADD docker-files/nginx/conf.d/app.conf /etc/nginx/conf.d/default.conf

ENV NGINXUSER=sts
ENV NGINXGROUP=sts

RUN sed -i "s/user www-data/user ${NGINXUSER}/g" /etc/nginx/nginx.conf

RUN adduser -g ${NGINXGROUP} -s /bin/sh -D ${NGINXUSER}
