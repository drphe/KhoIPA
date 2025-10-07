import UIAlert from './uialert.js';

window.showAlert = function () {
    const uiAlert = new UIAlert({
        title: 'Thanks for checking out uialert.js!',
        message: 'If you like this project or find it useful, give it a star on GitHub!',
    });
    uiAlert.addAction({
        title: 'Sure',
        style: 'default',
        handler: openGitHubRepo
    });
    uiAlert.addAction({
        title: 'No Thanks',
        style: 'destructive',
        handler: showAlert2
    });
    uiAlert.addAction({
        title: 'Cancel',
        style: 'cancel',
    });
    uiAlert.present();
}

function showAlert2() {
    const uiAlert = new UIAlert({
        title: 'Are you sure?',
        message: 'It would be really cool if you could give it a star on GitHub.\nIt\'s only a few clicks away. 🥺',
        // Add actions straight when instantiating
        actions: [
            {
                title: 'I\'m Sure',
                style: 'destructive',
                handler: showAlert1
            },
            {
                title: 'OK Fine',
                style: 'default',
                handler: openGitHubRepo
            }
        ]
    });
    uiAlert.present();
}

 function showAlert1() {
    const uiAlert = new UIAlert({
        title: 'Alright then!',
        message: 'Thanks for checking out uialert.js anyway! 🎉',
    });
    uiAlert.addAction({
        title: 'OK',
        style: 'default',
        handler: () => {
            window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        }
    });
    uiAlert.present();
}

function openGitHubRepo() {
    window.location.href = 'https://github.com/therealFoxster/uialert.js';
}

showAlert();