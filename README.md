# Object Detection Dataset Builder

This is a quick and dirty React application to allow for easy labelling of objects in images. It was created to produce a training dataset for a project at the [UT Dallas Center for Machine Learning](https://cs.utdallas.edu/cmachinelearning/).

## Setting up the project locally

The application is setup to work with a [Firestore database](https://firebase.google.com/docs/firestore). You'll need to copy the `firebaseConfig` JSON into `/src/firebaseConfig.json` to link your application with the backend.

The following constants can be edited:
- `NUM_IMAGES = 2243` (`src/components/ImageContainer/index.js`)
- `classes = [...]` (`src/components/ImageContainer/index.js`)
- `NUM_LABELS = classes.length` (`src/components/ImageContainer/index.js`)
- `IMAGE_WIDTH = 640` (`src/components/BoundingBox/index.js`)
- `IMAGE_HEIGHT = 360` (`src/components/BoundingBox/index.js`)

The application assumes images are stored as `img/<number from 1 to NUM_IMAGES>.jpg`.

## Available scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
