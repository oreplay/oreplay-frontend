FROM node:22.14.0
ADD . /var/www
RUN cd /var/www && npm install
RUN cd /var/www && npm run build --ignore-scripts
CMD cd /var/www && npm run preview
#CMD cd /var/www && npm run dev

