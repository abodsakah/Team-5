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

## Localization
The text in this project is modularized and localized. This means that the text is going to be in different languages and that is why we have the `t("<string>")` function that can be used to translate a string from the JSON files that we have created.

### How to use it

There is a file called `translator.js` in the `src/` directory and that file feeds its translation from JSON files located in the `src/locales/` directory.

In the `translator.js` file you can see how the `t` function which is a function that takes in a string and returns the translation of that string from corresponding JSON file.

If you look in the `App.js` file you will that we have passed in the `t()` function to every page that we are using and that is so that we can translate the text in the application.

In the function call of your component add `t` as a prop like so:
```js
const helloWorld = ({t}) => {

    return (
        ...
    )
}
```

The reason that we have `{}` in our parameter is to extract the specific props we are going to be using.

Using the `t` function is really simple, to translate a string that we have in our JSON file just use this:
```js
const helloWorld = ({t}) => {

    return (
        <div>
            <h1>{t("helloWorld")}</h1> // going to show Hello World if we have the string in the JSON file
        </div>
    )
}
```

It is that simple.

### Add a new language

To add a new language just copy the `_SAMPLE.json` file and name it as your language code. We are using the w3 convention for language codes. You can find more information about this [here](https://www.w3.org/WAI/ER/IG/ert/iso639.htm) and they formated in lower case.

Make sure the json file is in the `src/locales/` directory.

Later to be able to use your new language you can add a new `case` to the `switch` statement in the `translator.js` file in the `setLang()` function, the function takes in a lanuage code parameter and that code is going to be used to find the language file in the `src/locales` directory.