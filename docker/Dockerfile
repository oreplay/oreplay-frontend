ARG NODE_VERSION=22.22.0
FROM node:${NODE_VERSION}
ADD . /var/www
RUN cd /var/www && npm install
RUN cd /var/www && npm run build --ignore-scripts
CMD cd /var/www && npm run preview
#CMD cd /var/www && npm run dev

