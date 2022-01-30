# Break down
To be able to understand what is happening you would need basic React knowledge. If you dont have i would recoumend this [Video](https://www.youtube.com/watch?v=MRIMT0xPXFI) to get started and you can read more [here](https://reactjs.org/docs/getting-started.html).

## The structer of the application
When You view the `src/App.js` file you will see that we have a Drawer navigation type of thing going on. This is the main navigation bar that will be used to navigate through the application.

You will see that after the `</Drawer>` Component, we have a `<Main>` component. This is where the main content of the page is going to be and that is why we have router in there so that the content of the application is going to chage but not the menu and that is going to ease up the rendering time.

Everything in the `App.js` file is wraped in the `<BrowserRouter>` component. This is the router that is going to be used to navigate through the application.

You can view and edit the `<index />` and the `<Devices />` component in the `src/components` folder, where for now they just return text and nothing more.

The `<Route>` component is used to define the path of the application. It works by giving it the path and the component it is going to render when the application is on that path.

## What we are using
We are using [Material Ui](https://material-ui.com/) as our front end framework and [Material Ui Icons](https://material-ui.com/components/material-icons/) as our icons for now, more is bound to come in the future.