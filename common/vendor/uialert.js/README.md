# uialert.js

Kinda like [`UIAlertController`](https://developer.apple.com/documentation/uikit/uialertcontroller) but in vanilla JavaScript.

[Demo](https://therealfoxster.github.io/uialert.js/)

## Get started

Import `uialert.css` in your `html` file:

```html
<link rel="stylesheet" href="uialert.css">
```

or alternatively in your `css` file:

```css
@import url("uialert.css");
```

Import `UIAlert` in your script:

```js
import UIAlert from 'uialert.js';
```

## Usage

### Creating an instance

```js
const uiAlert = new UIAlert({
    title: 'Thanks for checking out uialert.js!',
    message: 'If you like this project or find it useful, give it a star on GitHub!',
});
```

By default, this instance has an action titled `'OK'` which dismisses the alert on click.

### Adding actions

To add you own actions (and remove the default action), call the `addAction({ title, style, handler }` instance method.

```js
uiAlert.addAction({
    title: 'Sure',
    style: 'default',
    handler: () => {
        // Code
    }
});

uiAlert.addAction({
    title: 'No Thanks',
    style: 'destructive',
    handler: () => {
        // Code
    }
});

uiAlert.addAction({
    title: 'Cancel',
    style: 'cancel',
});
```

**Parameters**

- `title`: Action title (default: `'OK'`).
- `style`: One of `'destructive'`, `'cancel'`, or `''` (default: `''`).
- `handler`: Action callback.

You can also specify actions when creating an instance:

```js
const uiAlert = new UIAlert({
    title: 'Thanks for checking out uialert.js!',
    message: 'If you like this project or find it useful, give it a star on GitHub!',
    actions: [
        {
            title: 'Sure',
            style: 'default',
            handler: () => {
                // Code
            }
        },
        {
            title: 'No Thanks',
            style: 'destructive',
            handler: () => {
                // Code
            }
        },
        {
            title: 'Cancel',
            style: 'cancel',
        }
    ]
});
```

### Presenting the alert

Finally, to present the instance, call the `present()` instance method:
```js
uiAlert.present();
```

## License
[The MIT License](https://github.com/therealFoxster/uialert.js/blob/master/LICENSE.md)
