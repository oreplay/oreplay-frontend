# oreplay-react

If you use the application for the first time or if you get any error bound to missing packages execute
`npm install`

To run the application you should use:
`npm run dev`

Before pushing, remember to run the linter (you should also set it up in your IDE)
`npm run lint`

# Deployment

In order to deploy, change the version from docker-compose and any other file where the version is placed
(review the last version commit).

Remember to **properly define the .env** `VITE_API_DOMAIN` (development: http://localhost/ and production: https://www.oreplay.es/)

Once the version is changed, run docker-compose (this will build a new docker image).

After the image is built, push it with `docker push <tag_name>`
