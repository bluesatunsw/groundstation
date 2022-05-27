# React frontend

Frontend for providing all user-level instructions to the groundstation; initial setup (i.e. hardware) not included. The frontend is built as a React app using ReactDOM/Router, served using NodeJS and written in Typescript. Material UI is also used a bunch.

(CHECK OUT THE REFERENCES AT THE BOTTOM OF THIS README!)

## Using the frontend

The frontend is broken up into three columns, with controls in the leftmost column, targeted satellite parameters + encounter info in the middle, and hardware/system parameters on the right. Run ``npm start`` (after following installation steps) and the frontend will begin to be served at ``http://localhost:3000/``.

Note: most of the frontend is automatically disabled until the backend is detected. By default it should run at ``http://localhost:4999``, but if port 4999 is occupied for some reason it may be elsewhere. In this case, just set the port in the system parameters column.

## Installing the frontend

### Installation of nodejs 16

By default node will be installed as version 10 if you install via apt on Linux.

If you are running the groundstation software on Windows or macOS, just make sure you downloaded the right thing from the website, but bear in mind that this entire project is meant to run on Debian on a Raspberry Pi.

To get the newest version:

Install build tools if you don't have them already

``
sudo apt install build-essential checkinstall libssl-dev
``

Install the node version manager

``
sudo npm install -g n
``

Switch to the current stable release

``
sudo n stable
``

### Setting up React

This package is already initialised with all the packages needed. To get started run

``
npm install
``

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More, references

[React documentation](https://reactjs.org/docs/getting-started.html)

[React hooks / function components](https://reactjs.org/docs/hooks-intro.html)

[Material UI elements and docs](https://mui.com/material-ui/)

[Typescript docs](https://www.typescriptlang.org/docs/)

[N2YO API](https://www.n2yo.com/api/)
