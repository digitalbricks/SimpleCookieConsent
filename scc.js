"use strict";


class SimpleCookieConsent{

    version = "0.1";
    className = "scc";
    bannerText = "This website uses cookies for technical reasons";
    bannerReadMoreText = "Lern more";
    bannerReadMoreUrl = "";
    buttonAccept = "Accept";
    buttonDeny = "Deny";
    cookieName = "scc_consented";
    cookieLifetime = 3600;
    acceptFunction = function(){};
    denyFunction = function(){};
    devMode = false;
    
    /**
     * Basic setup.
     * @param {object} sccConfig 
     */
    constructor(sccConfig){

        // overwrite defaults if set
        // -- className
        if(sccConfig.className){
            this.className = sccConfig.className;
        }
        // -- bannerText
        if(sccConfig.bannerText){
            this.bannerText = sccConfig.bannerText;
        }
        // -- bannerReadMoreText
        if(sccConfig.bannerReadMoreText){
            this.bannerReadMoreText = sccConfig.bannerReadMoreText;
        }
        // -- bannerReadMoreUrl
        if(sccConfig.bannerReadMoreUrl){
            this.bannerReadMoreUrl = sccConfig.bannerReadMoreUrl;
        }
        // -- buttonAccept
        if(sccConfig.buttonAccept){
            this.buttonAccept = sccConfig.buttonAccept;
        }
        // -- buttonAccept
        if(sccConfig.buttonDeny){
            this.buttonDeny = sccConfig.buttonDeny;
        }
        // -- cookieName
        if(sccConfig.cookieName){
            this.cookieName = sccConfig.cookieName;
        }
        // -- cookieLifetime
        if(sccConfig.cookieLifetime){
            this.cookieLifetime = parseInt(sccConfig.cookieLifetime);
        }
        // -- acceptFunction
        if(sccConfig.acceptFunction){
            this.acceptFunction = sccConfig.acceptFunction;
        }
        // -- denyFunction
        if(sccConfig.denyFunction){
            this.denyFunction = sccConfig.denyFunction;
        }
        // -- devMode
        if(sccConfig.devMode===true){
            this.devMode = true;
        }

        // check if we are in dev mode
        if(this.devMode){
            console.warn('NOTE: Script is in devolpement mode. Set devMode to "false" to disable.')
        }


        // check if cookie exists and create banner if not
        if(this.getCookie(this.cookieName)===null){
            // create markup
            this.showConsentBanner();
        } else {
            if(this.devMode){
                console.log('Cookie is set, but banner is shown anyway because we are in development mode.');
                this.showConsentBanner();
            }
        }

    }

    /**
     * Shows the consent banner.
     * and creates markup, if necessary
     */
    showConsentBanner(){
        // check if banner already exisits in dom
        var banner = !!document.getElementsByClassName(this.className)[0];
        if(banner){
            // make sure it is visible (remove class wich controls visibility via CSS)
            document.getElementsByClassName(this.className)[0].classList.remove('inactive');
            return;
        }

        // markup creation (if not already exists)
        var sscMarkupContainer = document.createElement('div');
        sscMarkupContainer.classList.add(this.className);

        var sccMarkup = "<div class='"+this.className+"__inner'>";
        sccMarkup+="    <div class='"+this.className+"__text'>";
        sccMarkup+="        "+this.bannerText+" <a href='"+this.bannerReadMoreUrl+"' target='_blank'>"+this.bannerReadMoreText+"</a>";
        sccMarkup+="    </div>";
        sccMarkup+="    <div class='"+this.className+"__buttons'>";
        sccMarkup+="        <span class='"+this.className+"__btnAccept'>"+this.buttonAccept+"</span>";
        sccMarkup+="        <span class='"+this.className+"__btnDeny'>"+this.buttonDeny+"</span>";
        sccMarkup+="    </div>";
        sccMarkup+="</div>";

        sscMarkupContainer.innerHTML = sccMarkup;
        document.body.appendChild(sscMarkupContainer);

        // add event listener to buttons
        // -- accept button
        var scope = this;
        var acceptButton = document.getElementsByClassName(this.className+"__btnAccept")[0];
        acceptButton.addEventListener("click", function(){scope.consentAccept(scope)}, false);
        // -- deny button
        var denyButton = document.getElementsByClassName(this.className+"__btnDeny")[0];
        denyButton.addEventListener("click", function(){scope.consentDeny(scope)}, false);
        
    }


    /**
     * Hides the consent banner.
     */
    hideConsentBanner(){
        var banner = document.getElementsByClassName(this.className)[0];
        // add CSS class wich may use for animation
        banner.classList.add('inactive');
        // finally, remove the element from DOM
        setTimeout(function(){
            banner.remove();
        }, 3000);
    }


    /**
     * Function wich is called on accept button click.
     * Also runs custom acceptFunction.
     * @param {object} scope 
     */
    consentAccept(scope){
        //console.log('Accepted');   
        scope.setCookie(scope.cookieName,"accepted",scope.cookieLifetime);
        scope.hideConsentBanner();
        scope.acceptFunction();
    }


    /**
     * Function wich is called on deny button click.
     * Also runs custom acceptFunction.
     * @param {object} scope 
     */
    consentDeny(scope){
        //console.log('Denied');
        scope.setCookie(scope.cookieName,"denied",scope.cookieLifetime);
        scope.hideConsentBanner();
        scope.denyFunction();
    }


    /**
     * Sets the cookie
     * @source https://plainjs.com/javascript/utilities/set-cookie-get-cookie-and-delete-cookie-5/
     * @param {string} name 
     * @param {string} value 
     * @param {int} seconds 
     */
    setCookie(name, value, seconds) {
        var d = new Date;
        var timestamp = d.getTime();
	    d.setTime(timestamp + parseInt(seconds)*1000);
	    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString() + "samesite=lax; secure=true";
    }
    

    /**
     * Gets the cookie.
     * @source https://plainjs.com/javascript/utilities/set-cookie-get-cookie-and-delete-cookie-5/
     * @param {string} name 
     */
    getCookie(name) {
	    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	    return v ? v[2] : null;
    }
    

    /**
     * Deletes the cookie (set expire date in the past –1).
     * @source https://plainjs.com/javascript/utilities/set-cookie-get-cookie-and-delete-cookie-5/
     * @param {string} name 
     */
    deleteCookie(name) { setCookie(name, '', -1); }
}




// TEST

// instatiate
var scc = new SimpleCookieConsent({
    'className' :  "scc1",
    'bannerText' : "Diese Website benutzt Cookies",
    'bannerReadMoreText' : "Mehr erfahren",
    'bannerReadMoreUrl' : "http://www.example.com",
    'buttonAccept' : "Erlauben",
    'buttonDeny' : "Ablehnen",
    'cookieName' : "scc_consented1",
    'cookieLifetime' : 7200,
    'acceptFunction' : myCustomAcceptFunction,
    'denyFunction' : myCustomDenyFunction,
    'devMode': true

});


// functions to be executed on accept / deny

function myCustomAcceptFunction(){
    console.log('accept function');
}

function myCustomDenyFunction(){
    console.log('deny function');
}




