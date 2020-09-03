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
            // dev message
            if(this.devMode){
                console.log('constructor(): Cookie is set, but banner is shown anyway because we are in development mode.');
                this.showConsentBanner();
            }
        }

        // check of cookie consent is already accepted
        // and emit 'scc-accepted' event
        if(this.getCookie(this.cookieName)=='accepted'){
            // emit event 'scc-accepted'
            var event = new Event('scc-accepted');
            window.dispatchEvent(event);
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

            // dev message
            if(this.devMode){
                console.log('showConsentBanner(): Banner already present in DOM, just removed "inactive" class.');
            }

            return;
        }

        // dev message
        if(this.devMode){
            console.log('showConsentBanner(): Banner NOT present in DOM, so we create it.');
        }

        // markup creation (if not already exists)
        var sscMarkupContainer = document.createElement('div');
        sscMarkupContainer.classList.add(this.className);

        var sccMarkup = "<div class='"+this.className+"__inner'>";
        sccMarkup+="    <div class='"+this.className+"__text'>";
        sccMarkup+="        "+this.bannerText+" <a href='"+this.bannerReadMoreUrl+"' target='_blank'>"+this.bannerReadMoreText+"</a>";
        sccMarkup+="    </div>";
        sccMarkup+="    <div class='"+this.className+"__buttons'>";
        sccMarkup+="        <button class='"+this.className+"__btnAccept'>"+this.buttonAccept+"</button>";
        sccMarkup+="        <button class='"+this.className+"__btnDeny'>"+this.buttonDeny+"</button>";
        sccMarkup+="    </div>";
        sccMarkup+="</div>";

        sscMarkupContainer.innerHTML = sccMarkup;
        document.body.prepend(sscMarkupContainer);

        // add marker class to <html>, so we could adjust the site css if banner is opened
        // (e.g. adding some footer padding to prevent banner from overlapping important legal links)
        this.addBannerOpendMarker();

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
        // dev message
        if(this.devMode){
            console.log('hideConsentBanner(): Function called.');
        }

        var banner = document.getElementsByClassName(this.className)[0];
        // add CSS class wich may use for animation
        banner.classList.add('inactive');

        // remove marker from <html>
        this.removeBannerOpendMarker();

        // finally, remove the element from DOM
        setTimeout(function(){
            banner.remove();
        }, 3000);
    }


    /**
     * Revokes choice by deleting cookie and reloads page.
     */
    revokeChoice(){
        // dev message
        if(this.devMode){
            console.log('revokeChoice(): Function called.');
        }

        this.deleteCookie(this.cookieName);
        location.reload();
    }


    /**
     * Function wich is called on accept button click.
     * @param {object} scope 
     */
    consentAccept(scope){
        // dev message
        if(this.devMode){
            console.log('consentAccept(): Function called.');
        }

        // check if cookie previous value is not "denied"
        // which means we now have a consent state change
        if(scope.getCookie(scope.cookieName)=='denied'){
            scope.setCookie(scope.cookieName,"accepted",scope.cookieLifetime);
            
            // reload page to make sure all scipts may react to state change
            location.reload();
        } else {
            // dev message
            if(this.devMode){
                console.log('consentAccept(): NO state change, do not need to reload page.');
            }

            scope.setCookie(scope.cookieName,"accepted",scope.cookieLifetime);
            scope.hideConsentBanner();

            // emit event 'scc-accepted'
            var event = new Event('scc-accepted');
            window.dispatchEvent(event);
        }
    }


    /**
     * Function wich is called on deny button click.
     * @param {object} scope 
     */
    consentDeny(scope){
        // dev message
        if(this.devMode){
            console.log('consentDeny(): Function called.');
        }

        if(scope.getCookie(scope.cookieName)=='accepted'){
            scope.setCookie(scope.cookieName,"denied",scope.cookieLifetime);

            // reload page to make sure all scipts may react to state change
            location.reload();
        } else {
            // dev message
            if(this.devMode){
                console.log('consentAccept(): NO state change, do not need to reload page.');
            }

            scope.setCookie(scope.cookieName,"denied",scope.cookieLifetime);
            scope.hideConsentBanner();

            // emit event 'scc-denied'
            var event = new Event('scc-denied');
            window.dispatchEvent(event);
        }
    }


    /**
     * Adds "[this.className]-banner-open" to <html> 
     * so the site css could react to the presence of
     * the consent banner.
     */
    addBannerOpendMarker(){
        // dev message
        if(this.devMode){
            console.log('addBannerOpendMarker(): Function called.');
        }
        document.getElementsByTagName( 'html' )[0].classList.add(this.className+'-banner-open');
    }

    /**
     * Removes "[this.className]-banner-open" from <html> 
     * so the site css could react to the presence of
     * the consent banner.
     */
    removeBannerOpendMarker(){
        // dev message
        if(this.devMode){
            console.log('removeBannerOpendMarker(): Function called.');
        }
        document.getElementsByTagName( 'html' )[0].classList.remove(this.className+'-banner-open');
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
        
        // dev message
        if(this.devMode){
            console.log('setCookie(): Cookie set. NAME: '+name+' VALUE: '+value);
        }
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
    deleteCookie(name) { 
        // dev message
        if(this.devMode){
            console.log('deleteCookie(): Function called.');
        }
        this.setCookie(name, '', -1); 
    }
}




