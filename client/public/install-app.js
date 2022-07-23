console.log('install-app.js');

//if launched as an app, do nothing ->
//if it's launched as an android-app, do nothing
//if we have @media display-mode: standalone, do nothing
//safari on iOS doesn't support that, so check navigator.standalone
function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  return (document.referrer.startsWith('android-app://') ||
		isStandalone ||
		navigator.standalone)
}

if (getPWADisplayMode()) {
	console.log('exit');
	exit();
}

//it's not an app!
console.log('its not an app');

//listen for the before-install-prompt event
window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault();
	showInstallPromotion();
})

//ask the user if they want to install the app
function showInstallPromotion() {
	console.log('do you want to install the app?')
}