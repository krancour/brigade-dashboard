FROM node:16.13.2-alpine3.15 as builder

WORKDIR /app

COPY package.json yarn.lock ./

# Doing this in a separate layer will prevent unnecessary dependency resolution
# on each build
RUN yarn install

COPY . .

# Build the react app in production mode. Artifacts will be stored in build/
RUN yarn build

FROM nginx:1.20.2-alpine

# Remove default nginx website
RUN rm /etc/nginx/conf.d/default.conf && rm -rf /usr/share/nginx/html/*

COPY kashti.nginx.conf /etc/nginx/conf.d/kashti.conf

# Make a directory where we can later put Brigade API server reverse proxy
# configuration
RUN mkdir -p /etc/nginx/kashti.conf.d

# Copy build artifacts from build stage
COPY --from=builder /app/build /usr/share/nginx/kashti

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
