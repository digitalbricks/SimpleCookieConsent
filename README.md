# SimpleCookieConsent

**work in progress**

A simple cookie consent banner (SCC) with Opt-IN (accept / deny) only. Very basic and small. No fancy delicate settings for different cookie types – just yes or no (of course you can label the buttons however you want).

Living and working in germany, this software was made with our local and EU laws in mind so it may or may not fit your needs.

**As far as I know** (see disclaimer) there is no consent needed for technically necessary cookies (as they are ... technically necessary) but for (unnecessary) cookies e.g. for tracking purposes. So SCC gives you a simple tool for loading and unloading tracking related stuff depending on given consent.


## Disclaimer
**I'm not a lawyer, just an online media designer & developer. So I cannot give any warranty that his consent banner does comply to the GPDR or any other local laws and rules.**

## Basic setup
Basically you just need the two files located in the `/dist` folder. The rest is developement and demo stuff you may discard.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your document</title>
    <!-- load SCC styles -->
    <link rel="stylesheet" href="scc.min.css">
</head>
<body>
    Your content.
</body>

    <!-- load SCC script -->
    <script src=".scc.min.js"></script>

    <!-- set up SCC -->
    <script>
        // instatiate and configure
        var scc = new SimpleCookieConsent({
            'bannerText' : "This websites uses tracking cookies",
            'bannerReadMoreText' : "Lern&nbsp;more",
            'bannerReadMoreUrl' : "http://www.example.com/privacypolice",
            'buttonAccept' : "Allow",
            'buttonDeny' : "Deny",
            'cookieLifetime' : 7200,
        });


        // Now you can add event listeners for accept, deny & revoke
        // and execute your custom functions on each event

        // event listener for accept (emitted from window object)
        window.addEventListener('scc-accepted', function (e) { 
            console.log('ssc-accepted event detected');
        }, false);

        // event listener for deny (emitted from window object)
        window.addEventListener('scc-denied', function (e) { 
            console.log('ssc-denied event detected');
        }, false);

        // event listener for revoke (emitted from window object)
        window.addEventListener('scc-revoked', function (e) { 
            console.log('ssc-revoked event detected');
            alert('revoked');
        }, false);
    </script>
</html>
```

You will find this simple demo in <a href="demo/index.html">`/demo/index.html`</a>. 

## Configuration options
| Property            | Default                      | Description                          |
|---------------------|------------------------------|--------------------------------------|
| `className`         | "scc";                       | CSS class name of consent banner     |
| `bannerText`        | "This website uses (...))";  | Banner text, you may use HTML        |
| `bannerReadMoreText`|  "Learn more";               | Text for link to privacy police      |
| `bannerReadMoreUrl` | "";                          | URL to the privacy police            |
| `buttonAccept`      | "Accept";                    | Label of the button to accept        |
| `buttonDeny`        | "Deny";                      | Label of the button to deny          |
| `cookieName`        | "scc_consented";             | Name of the consent state cookie     |
| `cookieLifetime`    | 3600;                        | Lifetime of consent state cookie in s|
| `devMode`           | false;                       | Set to true for verbose consloe logs |


## Usefull methods
| Method                | Description                                                       |
|-----------------------|-------------------------------------------------------------------|
| `revokeChoice()`      | Delets the consent state cookie and emitts the `scc-revoked` event|
| `showConsentBanner()` | (Re)creates the banner in the DOM                                 |

For an example on how you may use these methods on your site, see <a href="demo/index.html">`/demo/index.html`</a>.


## Control tracking cookies with SCC
### MATOMO
If you are using MATOMO (formerly known as PIWIK), you will a find an example in <a href="demo/demo-matomo.html">`/demo/demo-matomo.html`</a>.

### Google Analytics
At the moment there is no demo for the use with Google Analytics – because I personally dislike GA an encourage you to NOT giving analytic data to other companies. But I will add a demo in the future – meanwhile you may check my (german) blog post on <a href="https://www.vektorkneter.de/google-analytics-tracking-cookie-opt-in/">how to do a Google Analytics OPT-IN</a> with Osano Cookie Consent. The function for enabling / disabling GA Cookies will also work with SCC i assume.

## Browser support
I testet SSC in the following browser. For Firefox, Chrome, Safari and (Blink-)Edge it should also work in older versions – but be carefull if you want to support older IEs. 

| Browser | Version         |
|---------|-----------------|
| Firefox | 81.0b8          |
| Chrome  | 85.0.4183.83    |
| Safari  | 13.1.1          |
| Edge    | 85.0.564.44     |
| IE11    | 11.1082.18362.0 |

