// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAXuYcCatLisCJdLFeMZnBLFgXTsXqMm0E',
    authDomain: 'runningcalls-dev.firebaseapp.com',
    databaseURL: 'https://runningcalls-dev.firebaseio.com',
    projectId: 'runningcalls-dev',
    storageBucket: 'runningcalls-dev.appspot.com',
    messagingSenderId: '605801750550'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
