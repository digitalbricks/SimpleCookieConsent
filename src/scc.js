"use strict";


class SimpleCookieConsent{

    version = "0.2";
    className = "scc";
    bannerText = "This website uses cookies for technical reasons";
    bannerReadMoreText = "Learn more";
    bannerReadMoreUrl = "";
    buttonAccept = "Accept";
    buttonDeny = "Deny";
    cookieName = "scc_consented";
    cookieLifetime = 3600;
    cookieSecure = true;
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

        // check if page was NOT served via HTTPS and adapt cookieSecure property
        // which is used in setCookie() method
        /**
         * NOTE: Chrome will not set the cookie if it is configured as secure
         * but page isn't served via HTTPS. So we have to check which protocoll
         * is used before setting the secure attribute on the cookie. 
         */
        if(location.protocol !== 'https:') {
            this.cookieSecure = false;
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
        /**
         * NOTE: We delay the event emission with setTimeout
         * in order to give event listeners time to beeing
         * attached. This delay is only needed here in the 
         * constructor, because its the first function called
         * on object instantiation.
         */ 
        if(this.getCookie(this.cookieName)=='accepted'){
            setTimeout(function(){ 
                // emit event 'scc-accepted'
                var event = new Event('scc-accepted');
                window.dispatchEvent(event);
            }, 300);
            
        } else if(this.getCookie(this.cookieName)=='denied'){
            setTimeout(function(){ 
                // emit event 'scc-accepted'
                var event = new Event('scc-denied');
                window.dispatchEvent(event);
            }, 300);
        } else {
            setTimeout(function(){ 
                // emit event 'scc-accepted'
                var event = new Event('scc-nochoice');
                window.dispatchEvent(event);
            }, 300);
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

        // NOTE: the following line is a workaround for "document.body.prepend(sscMarkupContainer);"
        // because IE does not have the prepend() method and i won't add a polyfill for that.
        document.body.insertBefore(sscMarkupContainer, document.body.firstChild);

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

        // emit event 'scc-revoked'
        var event = new Event('scc-revoked');
        window.dispatchEvent(event);

        // load page, so (server side) scripts mays react
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

        // set cookie value "accepted"
        scope.setCookie(scope.cookieName,"accepted",scope.cookieLifetime);

        // emit event 'scc-accepted'
        var event = new Event('scc-accepted');
        window.dispatchEvent(event);

        // hide consent banner
        scope.hideConsentBanner();
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
        
        // set cookie value "denied"
        scope.setCookie(scope.cookieName,"denied",scope.cookieLifetime);

        // emit event 'scc-denied'
        var event = new Event('scc-denied');
        window.dispatchEvent(event);

        // hide consent banner
        scope.hideConsentBanner();
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
        
        // prepare cookie contents / configuration
        var cookiecontents = name + "=" + value + "; path=/; expires=" + d.toGMTString() + "; samesite=lax";
        if(this.cookieSecure){
            cookiecontents += "; secure=true";
        }
        document.cookie = cookiecontents;
        
        // dev message
        if(this.devMode){
            console.log('setCookie(): Cookie set. Contents: '+cookiecontents);
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



// Polyfill for prepend() – needed for IE
// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
/* (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('prepend')) {
        return;
      }
      Object.defineProperty(item, 'prepend', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function prepend() {
          var argArr = Array.prototype.slice.call(arguments),
            docFrag = document.createDocumentFragment();
          
          argArr.forEach(function (argItem) {
            var isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });
          
          this.insertBefore(docFrag, this.firstChild);
        }
      });
    });
  })([Element.prototype, Document.prototype, DocumentFragment.prototype]); */