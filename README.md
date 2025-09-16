# Cafecitos NG

This is the Angular frontend for the Cafecitos application.

## Backend API

For local development, this application is configured to proxy API requests to a backend server running on `http://localhost:8000`. All requests made to `/api` from the application will be forwarded to the backend.

This is configured in the `proxy.conf.json` file.

## Deployment

The backend API for this project is located in the `cafecitos` repository. This frontend is designed to be deployed in conjunction with it. The project is maintained by `programmercito`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Building

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).