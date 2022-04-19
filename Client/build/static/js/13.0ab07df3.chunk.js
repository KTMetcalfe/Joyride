/*! For license information please see 13.0ab07df3.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkjoyride=self.webpackChunkjoyride||[]).push([[13,928,6668,1994,9383],{928:function(t,e,r){r.r(e),r.d(e,{C:function(){return s},a:function(){return i},d:function(){return a}});var n=r(3431),o=r(1927),i=function(t,e,r,i,a,s){return(0,n.mG)(void 0,void 0,void 0,(function(){var d,c;return(0,n.Jh)(this,(function(n){switch(n.label){case 0:if(t)return[2,t.attachViewToDom(e,r,a,i)];if(!s&&"string"!==typeof r&&!(r instanceof HTMLElement))throw new Error("framework delegate is missing");return c="string"===typeof r?null===(d=e.ownerDocument)||void 0===d?void 0:d.createElement(r):r,i&&i.forEach((function(t){return c.classList.add(t)})),a&&Object.assign(c,a),e.appendChild(c),[4,new Promise((function(t){return(0,o.c)(c,t)}))];case 1:return n.sent(),[2,c]}}))}))},a=function(t,e){if(e){if(t){var r=e.parentElement;return t.removeViewFromDom(r,e)}e.remove()}return Promise.resolve()},s=function(){var t,e;return{attachViewToDom:function(r,i,a,s){return void 0===a&&(a={}),void 0===s&&(s=[]),(0,n.mG)(void 0,void 0,void 0,(function(){var d,c,l,p,h;return(0,n.Jh)(this,(function(n){switch(n.label){case 0:return t=r,i?(l="string"===typeof i?null===(d=t.ownerDocument)||void 0===d?void 0:d.createElement(i):i,s.forEach((function(t){return l.classList.add(t)})),Object.assign(l,a),t.appendChild(l),[4,new Promise((function(t){return(0,o.c)(l,t)}))]):[3,2];case 1:return n.sent(),[3,3];case 2:t.children.length>0&&(p=null===(c=t.ownerDocument)||void 0===c?void 0:c.createElement("div"),s.forEach((function(t){return p.classList.add(t)})),p.append.apply(p,t.children),t.appendChild(p)),n.label=3;case 3:return h=document.querySelector("ion-app")||document.body,e=document.createComment("ionic teleport"),t.parentNode.insertBefore(e,t),h.appendChild(t),[2,t]}}))}))},removeViewFromDom:function(){return t&&e&&(e.parentNode.insertBefore(t,e),e.remove()),Promise.resolve()}}}},6668:function(t,e,r){r.r(e),r.d(e,{a:function(){return a},b:function(){return i},p:function(){return o}});var n=r(3431),o=function(t){return console.warn("[Ionic Warning]: ".concat(t))},i=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];return console.error.apply(console,(0,n.ev)(["[Ionic Error]: ".concat(t)],e,!1))},a=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];return console.error("<".concat(t.tagName.toLowerCase(),"> must be used inside ").concat(e.join(" or "),"."))}},13:function(t,e,r){r.r(e),r.d(e,{ion_modal:function(){return C}});var n=r(3431),o=r(5785),i=r(9713),a=r(928),s=r(1927),d=r(1994),c=r(6668),l=r(55),p=r(9383),h=r(5577),u=r(3059),f=r(2253),m=r(2779),b=(r(3358),function(t,e){return(0,n.mG)(void 0,void 0,void 0,(function(){return(0,n.Jh)(this,(function(r){switch(r.label){case 0:return"function"!==typeof t.canDismiss?[2]:[4,t.canDismiss()];case 1:return r.sent()?(e.isRunning()?e.onFinish((function(){t.dismiss(void 0,"handler")}),{oneTimeCallback:!0}):t.dismiss(void 0,"handler"),[2]):[2]}}))}))}),v=function(t){return.00255275*Math.pow(2.71828,-14.9619*t)-1.00255*Math.pow(2.71828,-.0380968*t)+1},g=.93,w=function(t,e){return(0,s.k)(400,t/Math.abs(1.1*e),500)},y=function(t,e){var r=1/(1-e);return t*r+-e*r},k=function(t){var e=t.currentBreakpoint,r=t.backdropBreakpoint,n=void 0===r||r<e,o=n?"calc(var(--backdrop-opacity) * ".concat(e,")"):"0",i=(0,u.c)("backdropAnimation").fromTo("opacity",0,o);return n&&i.beforeStyles({"pointer-events":"none"}).afterClearStyles(["pointer-events"]),{wrapperAnimation:(0,u.c)("wrapperAnimation").keyframes([{offset:0,opacity:1,transform:"translateY(100%)"},{offset:1,opacity:1,transform:"translateY(".concat(100-100*e,"%)")}]),backdropAnimation:i}},x=function(t){var e=t.currentBreakpoint,r=t.backdropBreakpoint,n="calc(var(--backdrop-opacity) * ".concat(y(e,r),")"),o=[{offset:0,opacity:n},{offset:1,opacity:0}],i=[{offset:0,opacity:n},{offset:r,opacity:0},{offset:1,opacity:0}],a=(0,u.c)("backdropAnimation").keyframes(0!==r?i:o);return{wrapperAnimation:(0,u.c)("wrapperAnimation").keyframes([{offset:0,opacity:1,transform:"translateY(".concat(100-100*e,"%)")},{offset:1,opacity:1,transform:"translateY(100%)"}]),backdropAnimation:a}},D=function(t,e){var r=e.presentingEl,n=e.currentBreakpoint,o=(0,s.g)(t),i=void 0!==n?k(e):{backdropAnimation:(0,u.c)().fromTo("opacity",.01,"var(--backdrop-opacity)").beforeStyles({"pointer-events":"none"}).afterClearStyles(["pointer-events"]),wrapperAnimation:(0,u.c)().fromTo("transform","translateY(100vh)","translateY(0vh)")},a=i.wrapperAnimation,d=i.backdropAnimation;d.addElement(o.querySelector("ion-backdrop")),a.addElement(o.querySelectorAll(".modal-wrapper, .modal-shadow")).beforeStyles({opacity:1});var c=(0,u.c)("entering-base").addElement(t).easing("cubic-bezier(0.32,0.72,0,1)").duration(500).addAnimation(a);if(r){var l=window.innerWidth<768,p="ION-MODAL"===r.tagName&&void 0!==r.presentingElement,h=(0,s.g)(r),f=(0,u.c)().beforeStyles({transform:"translateY(0)","transform-origin":"top center",overflow:"hidden"}),m=document.body;if(l){var b=CSS.supports("width","max(0px, 1px)")?"max(30px, var(--ion-safe-area-top))":"30px",v=g,w="translateY(".concat(p?"-10px":b,") scale(").concat(v,")");f.afterStyles({transform:w}).beforeAddWrite((function(){return m.style.setProperty("background-color","black")})).addElement(r).keyframes([{offset:0,filter:"contrast(1)",transform:"translateY(0px) scale(1)",borderRadius:"0px"},{offset:1,filter:"contrast(0.85)",transform:w,borderRadius:"10px 10px 0 0"}]),c.addAnimation(f)}else if(c.addAnimation(d),p){w="translateY(-10px) scale(".concat(v=p?g:1,")");f.afterStyles({transform:w}).addElement(h.querySelector(".modal-wrapper")).keyframes([{offset:0,filter:"contrast(1)",transform:"translateY(0) scale(1)"},{offset:1,filter:"contrast(0.85)",transform:w}]);var y=(0,u.c)().afterStyles({transform:w}).addElement(h.querySelector(".modal-shadow")).keyframes([{offset:0,opacity:"1",transform:"translateY(0) scale(1)"},{offset:1,opacity:"0",transform:w}]);c.addAnimation([f,y])}else a.fromTo("opacity","0","1")}else c.addAnimation(d);return c},E=function(t,e,r){void 0===r&&(r=500);var n=e.presentingEl,o=e.currentBreakpoint,i=(0,s.g)(t),a=void 0!==o?x(e):{backdropAnimation:(0,u.c)().fromTo("opacity","var(--backdrop-opacity)",0),wrapperAnimation:(0,u.c)().fromTo("transform","translateY(0vh)","translateY(100vh)")},d=a.wrapperAnimation,c=a.backdropAnimation;c.addElement(i.querySelector("ion-backdrop")),d.addElement(i.querySelectorAll(".modal-wrapper, .modal-shadow")).beforeStyles({opacity:1});var l=(0,u.c)("leaving-base").addElement(t).easing("cubic-bezier(0.32,0.72,0,1)").duration(r).addAnimation(d);if(n){var p=window.innerWidth<768,h="ION-MODAL"===n.tagName&&void 0!==n.presentingElement,f=(0,s.g)(n),m=(0,u.c)().beforeClearStyles(["transform"]).afterClearStyles(["transform"]).onFinish((function(t){if(1===t){n.style.setProperty("overflow","");var e=Array.from(b.querySelectorAll("ion-modal")).filter((function(t){return void 0!==t.presentingElement})).length;e<=1&&b.style.setProperty("background-color","")}})),b=document.body;if(p){var v=CSS.supports("width","max(0px, 1px)")?"max(30px, var(--ion-safe-area-top))":"30px",w=g,y="translateY(".concat(h?"-10px":v,") scale(").concat(w,")");m.addElement(n).keyframes([{offset:0,filter:"contrast(0.85)",transform:y,borderRadius:"10px 10px 0 0"},{offset:1,filter:"contrast(1)",transform:"translateY(0px) scale(1)",borderRadius:"0px"}]),l.addAnimation(m)}else if(l.addAnimation(c),h){y="translateY(-10px) scale(".concat(w=h?g:1,")");m.addElement(f.querySelector(".modal-wrapper")).afterStyles({transform:"translate3d(0, 0, 0)"}).keyframes([{offset:0,filter:"contrast(0.85)",transform:y},{offset:1,filter:"contrast(1)",transform:"translateY(0) scale(1)"}]);var k=(0,u.c)().addElement(f.querySelector(".modal-shadow")).afterStyles({transform:"translateY(0) scale(1)"}).keyframes([{offset:0,opacity:"0",transform:y},{offset:1,opacity:"1",transform:"translateY(0) scale(1)"}]);l.addAnimation([m,k])}else d.fromTo("opacity","1","0")}else l.addAnimation(c);return l},A=function(t,e){var r=e.currentBreakpoint,n=(0,s.g)(t),o=void 0!==r?k(e):{backdropAnimation:(0,u.c)().fromTo("opacity",.01,"var(--backdrop-opacity)").beforeStyles({"pointer-events":"none"}).afterClearStyles(["pointer-events"]),wrapperAnimation:(0,u.c)().keyframes([{offset:0,opacity:.01,transform:"translateY(40px)"},{offset:1,opacity:1,transform:"translateY(0px)"}])},i=o.wrapperAnimation,a=o.backdropAnimation;return a.addElement(n.querySelector("ion-backdrop")),i.addElement(n.querySelector(".modal-wrapper")),(0,u.c)().addElement(t).easing("cubic-bezier(0.36,0.66,0.04,1)").duration(280).addAnimation([a,i])},S=function(t,e){var r=e.currentBreakpoint,n=(0,s.g)(t),o=void 0!==r?x(e):{backdropAnimation:(0,u.c)().fromTo("opacity","var(--backdrop-opacity)",0),wrapperAnimation:(0,u.c)().keyframes([{offset:0,opacity:.99,transform:"translateY(0px)"},{offset:1,opacity:0,transform:"translateY(40px)"}])},i=o.wrapperAnimation,a=o.backdropAnimation;return a.addElement(n.querySelector("ion-backdrop")),i.addElement(n.querySelector(".modal-wrapper")),(0,u.c)().easing("cubic-bezier(0.47,0,0.745,0.715)").duration(200).addAnimation([a,i])},C=function(){function t(t){var e=this;(0,o.r)(this,t),this.didPresent=(0,o.e)(this,"ionModalDidPresent",7),this.willPresent=(0,o.e)(this,"ionModalWillPresent",7),this.willDismiss=(0,o.e)(this,"ionModalWillDismiss",7),this.didDismiss=(0,o.e)(this,"ionModalDidDismiss",7),this.ionBreakpointDidChange=(0,o.e)(this,"ionBreakpointDidChange",7),this.didPresentShorthand=(0,o.e)(this,"didPresent",7),this.willPresentShorthand=(0,o.e)(this,"willPresent",7),this.willDismissShorthand=(0,o.e)(this,"willDismiss",7),this.didDismissShorthand=(0,o.e)(this,"didDismiss",7),this.modalIndex=T++,this.coreDelegate=(0,a.C)(),this.isSheetModal=!1,this.inline=!1,this.gestureAnimationDismissing=!1,this.presented=!1,this.hasController=!1,this.keyboardClose=!0,this.backdropBreakpoint=0,this.backdropDismiss=!0,this.showBackdrop=!0,this.animated=!0,this.swipeToClose=!1,this.isOpen=!1,this.configureTriggerInteraction=function(){var t=e,r=t.trigger,n=t.el,o=t.destroyTriggerInteraction;o&&o();var i=void 0!==r?document.getElementById(r):null;if(i){e.destroyTriggerInteraction=function(t,e){var r=function(){e.present()};return t.addEventListener("click",r),function(){t.removeEventListener("click",r)}}(i,n)}},this.onBackdropTap=function(){e.dismiss(void 0,l.B)},this.onLifecycle=function(t){var r=e.usersElement,n=B[t.type];if(r&&n){var o=new CustomEvent(n,{bubbles:!1,cancelable:!1,detail:t.detail});r.dispatchEvent(o)}}}return t.prototype.onIsOpenChange=function(t,e){!0===t&&!1===e?this.present():!1===t&&!0===e&&this.dismiss()},t.prototype.onTriggerChange=function(){this.configureTriggerInteraction()},t.prototype.swipeToCloseChanged=function(t){this.gesture?this.gesture.enable(t):t&&this.initSwipeToClose()},t.prototype.breakpointsChanged=function(t){void 0!==t&&(this.sortedBreakpoints=t.sort((function(t,e){return t-e})))},t.prototype.connectedCallback=function(){(0,l.e)(this.el)},t.prototype.componentWillLoad=function(){var t=this,e=t.breakpoints,r=t.initialBreakpoint,n=t.swipeToClose;this.modalId=this.el.hasAttribute("id")?this.el.getAttribute("id"):"ion-modal-".concat(this.modalIndex),(this.isSheetModal=void 0!==e&&void 0!==r)&&(this.currentBreakpoint=this.initialBreakpoint),void 0===e||void 0===r||e.includes(r)||(0,c.p)("Your breakpoints array must include the initialBreakpoint value."),n&&(0,c.p)("swipeToClose has been deprecated in favor of canDismiss.\n\nIf you want a card modal to be swipeable, set canDismiss to `true`. In the next major release of Ionic, swipeToClose will be removed, and all card modals will be swipeable by default.")},t.prototype.componentDidLoad=function(){var t=this;!0===this.isOpen&&(0,s.r)((function(){return t.present()})),this.breakpointsChanged(this.breakpoints),this.configureTriggerInteraction()},t.prototype.getDelegate=function(t){if(void 0===t&&(t=!1),this.workingDelegate&&!t)return{delegate:this.workingDelegate,inline:this.inline};var e=this.el.parentNode,r=this.inline=null!==e&&!this.hasController;return{inline:r,delegate:this.workingDelegate=r?this.delegate||this.coreDelegate:this.delegate}},t.prototype.checkCanDismiss=function(){return(0,n.mG)(this,void 0,void 0,(function(){var t;return(0,n.Jh)(this,(function(e){return void 0===(t=this.canDismiss)?[2,!0]:"function"===typeof t?[2,t()]:[2,t]}))}))},t.prototype.present=function(){return(0,n.mG)(this,void 0,void 0,(function(){var t,e,r,i,c,p=this;return(0,n.Jh)(this,(function(n){switch(n.label){case 0:return this.presented?[2]:void 0===this.currentTransition?[3,2]:[4,this.currentTransition];case 1:n.sent(),n.label=2;case 2:return t=Object.assign(Object.assign({},this.componentProps),{modal:this.el}),e=this.getDelegate(!0),r=e.inline,i=e.delegate,c=this,[4,(0,a.a)(i,this.el,this.component,["ion-page"],t,r)];case 3:return c.usersElement=n.sent(),[4,(0,h.e)(this.usersElement)];case 4:return n.sent(),(0,o.c)((function(){return p.el.classList.add("show-modal")})),this.currentTransition=(0,l.d)(this,"modalEnter",D,A,{presentingEl:this.presentingElement,currentBreakpoint:this.initialBreakpoint,backdropBreakpoint:this.backdropBreakpoint}),[4,this.currentTransition];case 5:return n.sent(),this.isSheetModal?this.initSheetGesture():(this.swipeToClose||void 0!==this.canDismiss&&void 0!==this.presentingElement)&&this.initSwipeToClose(),"undefined"!==typeof window&&(this.keyboardOpenCallback=function(){p.gesture&&(p.gesture.enable(!1),(0,s.r)((function(){p.gesture&&p.gesture.enable(!0)})))},window.addEventListener(d.KEYBOARD_DID_OPEN,this.keyboardOpenCallback)),this.currentTransition=void 0,[2]}}))}))},t.prototype.initSwipeToClose=function(){var t=this;if("ios"===(0,i.b)(this)){var e=this.leaveAnimation||i.c.get("modalLeave",E),r=this.animation=e(this.el,{presentingEl:this.presentingElement});this.gesture=function(t,e,r){var n=t.offsetHeight,o=!1,i=!1,a=(0,m.createGesture)({el:t,gestureName:"modalSwipeToClose",gesturePriority:40,direction:"y",threshold:10,canStart:function(t){var e=t.event.target;return null===e||!e.closest||null===e.closest("ion-content, ion-footer")},onStart:function(){i=void 0!==t.canDismiss&&!0!==t.canDismiss,e.progressStart(!0,o?1:0)},onMove:function(t){var r=t.deltaY/n,o=r>=0&&i,a=o?.2:.9999,d=o?v(r/a):r,c=(0,s.k)(1e-4,d,a);e.progressStep(c)},onEnd:function(d){var c=d.velocityY,l=d.deltaY/n,p=l>=0&&i,h=p?.2:.9999,u=p?v(l/h):l,m=(0,s.k)(1e-4,u,h),g=(d.deltaY+1e3*c)/n,y=!p&&g>=.5,k=y?-.001:.001;y?(e.easing("cubic-bezier(0.32, 0.72, 0, 1)"),k+=(0,f.g)([0,0],[.32,.72],[0,1],[1,1],m)[0]):(e.easing("cubic-bezier(1, 0, 0.68, 0.28)"),k+=(0,f.g)([0,0],[1,0],[.68,.28],[1,1],m)[0]);var x=w(y?l*n:(1-m)*n,c);o=y,a.enable(!1),e.onFinish((function(){y||a.enable(!0)})).progressEnd(y?1:0,k,x),p&&m>h/4?b(t,e):y&&r()}});return a}(this.el,r,(function(){t.gestureAnimationDismissing=!0,t.animation.onFinish((function(){return(0,n.mG)(t,void 0,void 0,(function(){return(0,n.Jh)(this,(function(t){switch(t.label){case 0:return[4,this.dismiss(void 0,"gesture")];case 1:return t.sent(),this.gestureAnimationDismissing=!1,[2]}}))}))}))})),this.gesture.enable(!0)}},t.prototype.initSheetGesture=function(){var t=this,e=this,r=e.wrapperEl,o=e.initialBreakpoint,a=e.backdropBreakpoint;if(r&&void 0!==o){var d=this.enterAnimation||i.c.get("modalEnter",D),c=this.animation=d(this.el,{presentingEl:this.presentingElement,currentBreakpoint:o,backdropBreakpoint:a});c.progressStart(!0,1);var l=function(t,e,r,o,i,a,d,c,l,p){void 0===d&&(d=[]);var h={WRAPPER_KEYFRAMES:[{offset:0,transform:"translateY(0%)"},{offset:1,transform:"translateY(100%)"}],BACKDROP_KEYFRAMES:0!==i?[{offset:0,opacity:"var(--backdrop-opacity)"},{offset:1-i,opacity:0},{offset:1,opacity:0}]:[{offset:0,opacity:"var(--backdrop-opacity)"},{offset:1,opacity:.01}]},u=t.querySelector("ion-content"),f=r.clientHeight,g=o,w=0,k=!1,x=a.childAnimations.find((function(t){return"wrapperAnimation"===t.id})),D=a.childAnimations.find((function(t){return"backdropAnimation"===t.id})),E=d[d.length-1],A=d[0],S=function(){t.style.setProperty("pointer-events","auto"),e.style.setProperty("pointer-events","auto"),t.classList.remove("ion-disable-focus-trap")},C=function(){t.style.setProperty("pointer-events","none"),e.style.setProperty("pointer-events","none"),t.classList.add("ion-disable-focus-trap")};x&&D&&(x.keyframes((0,n.ev)([],h.WRAPPER_KEYFRAMES,!0)),D.keyframes((0,n.ev)([],h.BACKDROP_KEYFRAMES,!0)),a.progressStart(!0,1-g),g>i?S():C()),u&&g!==E&&(u.scrollY=!1);var B=function(e){var r=e.breakpoint,o=e.canDismiss,c=e.breakpointOffset,f=o&&0===r,m=f?g:r,v=0!==m;g=0,x&&D&&(x.keyframes([{offset:0,transform:"translateY(".concat(100*c,"%)")},{offset:1,transform:"translateY(".concat(100*(1-m),"%)")}]),D.keyframes([{offset:0,opacity:"calc(var(--backdrop-opacity) * ".concat(y(1-c,i),")")},{offset:1,opacity:"calc(var(--backdrop-opacity) * ".concat(y(m,i),")")}]),a.progressStep(0)),T.enable(!1),a.onFinish((function(){v&&(x&&D?(0,s.r)((function(){x.keyframes((0,n.ev)([],h.WRAPPER_KEYFRAMES,!0)),D.keyframes((0,n.ev)([],h.BACKDROP_KEYFRAMES,!0)),a.progressStart(!0,1-m),p(g=m),u&&g===d[d.length-1]&&(u.scrollY=!0),g>i?S():C(),T.enable(!0)})):T.enable(!0))}),{oneTimeCallback:!0}).progressEnd(1,0,500),f?b(t,a):v||l()},T=(0,m.createGesture)({el:r,gestureName:"modalSheet",gesturePriority:40,direction:"y",threshold:10,canStart:function(t){var e=t.event.target.closest("ion-content");return 1!==(g=c())||!e},onStart:function(){k=void 0!==t.canDismiss&&!0!==t.canDismiss&&0===A,u&&(u.scrollY=!1),(0,s.r)((function(){t.focus()})),a.progressStart(!0,1-g)},onMove:function(t){var e=1-g,r=d.length>1?1-d[1]:void 0,n=e+t.deltaY/f,o=void 0!==r&&n>=r&&k,i=o?.95:.9999,c=o&&void 0!==r?r+v((n-r)/(i-r)):n;w=(0,s.k)(1e-4,c,i),a.progressStep(w)},onEnd:function(t){var e=t.velocityY,r=(t.deltaY+100*e)/f,n=g-r,o=d.reduce((function(t,e){return Math.abs(e-n)<Math.abs(t-n)?e:t}));B({breakpoint:o,breakpointOffset:w,canDismiss:k})}});return{gesture:T,moveSheetToBreakpoint:B}}(this.el,this.backdropEl,r,o,a,c,this.sortedBreakpoints,(function(){var e;return null!==(e=t.currentBreakpoint)&&void 0!==e?e:0}),(function(){return t.sheetOnDismiss()}),(function(e){t.currentBreakpoint!==e&&(t.currentBreakpoint=e,t.ionBreakpointDidChange.emit({breakpoint:e}))})),p=l.gesture,h=l.moveSheetToBreakpoint;this.gesture=p,this.moveSheetToBreakpoint=h,this.gesture.enable(!0)}},t.prototype.sheetOnDismiss=function(){var t=this;this.gestureAnimationDismissing=!0,this.animation.onFinish((function(){return(0,n.mG)(t,void 0,void 0,(function(){return(0,n.Jh)(this,(function(t){switch(t.label){case 0:return this.currentBreakpoint=0,this.ionBreakpointDidChange.emit({breakpoint:this.currentBreakpoint}),[4,this.dismiss(void 0,"gesture")];case 1:return t.sent(),this.gestureAnimationDismissing=!1,[2]}}))}))}))},t.prototype.dismiss=function(t,e){return(0,n.mG)(this,void 0,void 0,(function(){var r,i,s,c,p=this;return(0,n.Jh)(this,(function(n){switch(n.label){case 0:return this.gestureAnimationDismissing&&"gesture"!==e?[2,!1]:(r="handler"!==e)?[4,this.checkCanDismiss()]:[3,2];case 1:r=!n.sent(),n.label=2;case 2:return r?[2,!1]:("undefined"!==typeof window&&this.keyboardOpenCallback&&window.removeEventListener(d.KEYBOARD_DID_OPEN,this.keyboardOpenCallback),void 0===this.currentTransition?[3,4]:[4,this.currentTransition]);case 3:n.sent(),n.label=4;case 4:return i=l.h.get(this)||[],this.currentTransition=(0,l.f)(this,t,e,"modalLeave",E,S,{presentingEl:this.presentingElement,currentBreakpoint:this.currentBreakpoint||this.initialBreakpoint,backdropBreakpoint:this.backdropBreakpoint}),[4,this.currentTransition];case 5:return(s=n.sent())?(c=this.getDelegate().delegate,[4,(0,a.d)(c,this.usersElement)]):[3,7];case 6:n.sent(),(0,o.c)((function(){return p.el.classList.remove("show-modal")})),this.animation&&this.animation.destroy(),this.gesture&&this.gesture.destroy(),i.forEach((function(t){return t.destroy()})),n.label=7;case 7:return this.currentTransition=void 0,this.animation=void 0,[2,s]}}))}))},t.prototype.onDidDismiss=function(){return(0,l.g)(this.el,"ionModalDidDismiss")},t.prototype.onWillDismiss=function(){return(0,l.g)(this.el,"ionModalWillDismiss")},t.prototype.setCurrentBreakpoint=function(t){return(0,n.mG)(this,void 0,void 0,(function(){var e,r,o,i,a;return(0,n.Jh)(this,(function(n){return this.isSheetModal?this.breakpoints.includes(t)?(r=(e=this).currentBreakpoint,o=e.moveSheetToBreakpoint,i=e.canDismiss,a=e.breakpoints,r===t||o&&o({breakpoint:t,breakpointOffset:1-r,canDismiss:void 0!==i&&!0!==i&&0===a[0]}),[2]):((0,c.p)("Attempted to set invalid breakpoint value ".concat(t,". Please double check that the breakpoint value is part of your defined breakpoints.")),[2]):((0,c.p)("setCurrentBreakpoint is only supported on sheet modals."),[2])}))}))},t.prototype.getCurrentBreakpoint=function(){return(0,n.mG)(this,void 0,void 0,(function(){return(0,n.Jh)(this,(function(t){return[2,this.currentBreakpoint]}))}))},t.prototype.render=function(){var t,e=this,r=this,n=r.handle,a=r.isSheetModal,s=r.presentingElement,d=r.htmlAttributes,c=!1!==n&&a,l=(0,i.b)(this),h=this.modalId,u=void 0!==s&&"ios"===l;return(0,o.h)(o.H,Object.assign({"no-router":!0,"aria-modal":"true",tabindex:"-1"},d,{style:{zIndex:"".concat(2e4+this.overlayIndex)},class:Object.assign((t={},t[l]=!0,t["modal-default"]=!u&&!a,t["modal-card"]=u,t["modal-sheet"]=a,t["overlay-hidden"]=!0,t),(0,p.g)(this.cssClass)),id:h,onIonBackdropTap:this.onBackdropTap,onIonModalDidPresent:this.onLifecycle,onIonModalWillPresent:this.onLifecycle,onIonModalWillDismiss:this.onLifecycle,onIonModalDidDismiss:this.onLifecycle}),(0,o.h)("ion-backdrop",{ref:function(t){return e.backdropEl=t},visible:this.showBackdrop,tappable:this.backdropDismiss,part:"backdrop"}),"ios"===l&&(0,o.h)("div",{class:"modal-shadow"}),(0,o.h)("div",{role:"dialog",class:"modal-wrapper ion-overlay-wrapper",part:"content",ref:function(t){return e.wrapperEl=t}},c&&(0,o.h)("div",{class:"modal-handle",part:"handle"}),(0,o.h)("slot",null)))},Object.defineProperty(t.prototype,"el",{get:function(){return(0,o.i)(this)},enumerable:!1,configurable:!0}),Object.defineProperty(t,"watchers",{get:function(){return{isOpen:["onIsOpenChange"],trigger:["onTriggerChange"],swipeToClose:["swipeToCloseChanged"]}},enumerable:!1,configurable:!0}),t}(),B={ionModalDidPresent:"ionViewDidEnter",ionModalWillPresent:"ionViewWillEnter",ionModalWillDismiss:"ionViewWillLeave",ionModalDidDismiss:"ionViewDidLeave"},T=0;C.style={ios:":host{--width:100%;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--overflow:hidden;--border-radius:0;--border-width:0;--border-style:none;--border-color:transparent;--background:var(--ion-background-color, #fff);--box-shadow:none;--backdrop-opacity:0;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;outline:none;contain:strict}.modal-wrapper,ion-backdrop{pointer-events:auto}:host(.overlay-hidden){display:none}.modal-wrapper,.modal-shadow{border-radius:var(--border-radius);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow);overflow:var(--overflow);z-index:10}.modal-shadow{position:absolute;background:transparent}@media only screen and (min-width: 768px) and (min-height: 600px){:host{--width:600px;--height:500px;--ion-safe-area-top:0px;--ion-safe-area-bottom:0px;--ion-safe-area-right:0px;--ion-safe-area-left:0px}}@media only screen and (min-width: 768px) and (min-height: 768px){:host{--width:600px;--height:600px}}.modal-handle{left:0px;right:0px;top:5px;border-radius:8px;margin-left:auto;margin-right:auto;position:absolute;width:36px;height:5px;-webkit-transform:translateZ(0);transform:translateZ(0);background:var(--ion-color-step-350, #c0c0be);z-index:11}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.modal-handle{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}:host(.modal-sheet){--height:calc(100% - (var(--ion-safe-area-top) + 10px))}:host(.modal-sheet) .modal-wrapper,:host(.modal-sheet) .modal-shadow{position:absolute;bottom:0}:host{--backdrop-opacity:var(--ion-backdrop-opacity, 0.4)}:host(.modal-card),:host(.modal-sheet){--border-radius:10px}@media only screen and (min-width: 768px) and (min-height: 600px){:host{--border-radius:10px}}.modal-wrapper{-webkit-transform:translate3d(0,  100%,  0);transform:translate3d(0,  100%,  0)}@media screen and (max-width: 767px){@supports (width: max(0px, 1px)){:host(.modal-card){--height:calc(100% - max(30px, var(--ion-safe-area-top)) - 10px)}}@supports not (width: max(0px, 1px)){:host(.modal-card){--height:calc(100% - 40px)}}:host(.modal-card) .modal-wrapper{border-top-left-radius:var(--border-radius);border-top-right-radius:var(--border-radius);border-bottom-right-radius:0;border-bottom-left-radius:0}:host-context([dir=rtl]):host(.modal-card) .modal-wrapper,:host-context([dir=rtl]).modal-card .modal-wrapper{border-top-left-radius:var(--border-radius);border-top-right-radius:var(--border-radius);border-bottom-right-radius:0;border-bottom-left-radius:0}:host(.modal-card){--backdrop-opacity:0;--width:100%;-ms-flex-align:end;align-items:flex-end}:host(.modal-card) .modal-shadow{display:none}:host(.modal-card) ion-backdrop{pointer-events:none}}@media screen and (min-width: 768px){:host(.modal-card){--width:calc(100% - 120px);--height:calc(100% - (120px + var(--ion-safe-area-top) + var(--ion-safe-area-bottom)));--max-width:720px;--max-height:1000px;--backdrop-opacity:0;--box-shadow:0px 0px 30px 10px rgba(0, 0, 0, 0.1);-webkit-transition:all 0.5s ease-in-out;transition:all 0.5s ease-in-out}:host(.modal-card) .modal-wrapper{-webkit-box-shadow:none;box-shadow:none}:host(.modal-card) .modal-shadow{-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow)}}:host(.modal-sheet) .modal-wrapper{border-top-left-radius:var(--border-radius);border-top-right-radius:var(--border-radius);border-bottom-right-radius:0;border-bottom-left-radius:0}:host-context([dir=rtl]):host(.modal-sheet) .modal-wrapper,:host-context([dir=rtl]).modal-sheet .modal-wrapper{border-top-left-radius:var(--border-radius);border-top-right-radius:var(--border-radius);border-bottom-right-radius:0;border-bottom-left-radius:0}",md:":host{--width:100%;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--overflow:hidden;--border-radius:0;--border-width:0;--border-style:none;--border-color:transparent;--background:var(--ion-background-color, #fff);--box-shadow:none;--backdrop-opacity:0;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;outline:none;contain:strict}.modal-wrapper,ion-backdrop{pointer-events:auto}:host(.overlay-hidden){display:none}.modal-wrapper,.modal-shadow{border-radius:var(--border-radius);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow);overflow:var(--overflow);z-index:10}.modal-shadow{position:absolute;background:transparent}@media only screen and (min-width: 768px) and (min-height: 600px){:host{--width:600px;--height:500px;--ion-safe-area-top:0px;--ion-safe-area-bottom:0px;--ion-safe-area-right:0px;--ion-safe-area-left:0px}}@media only screen and (min-width: 768px) and (min-height: 768px){:host{--width:600px;--height:600px}}.modal-handle{left:0px;right:0px;top:5px;border-radius:8px;margin-left:auto;margin-right:auto;position:absolute;width:36px;height:5px;-webkit-transform:translateZ(0);transform:translateZ(0);background:var(--ion-color-step-350, #c0c0be);z-index:11}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.modal-handle{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}:host(.modal-sheet){--height:calc(100% - (var(--ion-safe-area-top) + 10px))}:host(.modal-sheet) .modal-wrapper,:host(.modal-sheet) .modal-shadow{position:absolute;bottom:0}:host{--backdrop-opacity:var(--ion-backdrop-opacity, 0.32)}@media only screen and (min-width: 768px) and (min-height: 600px){:host{--border-radius:2px;--box-shadow:0 28px 48px rgba(0, 0, 0, 0.4)}}.modal-wrapper{-webkit-transform:translate3d(0,  40px,  0);transform:translate3d(0,  40px,  0);opacity:0.01}"}},1994:function(t,e,r){r.r(e),r.d(e,{KEYBOARD_DID_CLOSE:function(){return o},KEYBOARD_DID_OPEN:function(){return n},copyVisualViewport:function(){return w},keyboardDidClose:function(){return m},keyboardDidOpen:function(){return u},keyboardDidResize:function(){return f},resetKeyboardAssist:function(){return d},setKeyboardClose:function(){return h},setKeyboardOpen:function(){return p},startKeyboardAssist:function(){return c},trackViewportChanges:function(){return g}});var n="ionKeyboardDidShow",o="ionKeyboardDidHide",i={},a={},s=!1,d=function(){i={},a={},s=!1},c=function(t){l(t),t.visualViewport&&(a=w(t.visualViewport),t.visualViewport.onresize=function(){g(t),u()||f(t)?p(t):m(t)&&h(t)})},l=function(t){t.addEventListener("keyboardDidShow",(function(e){return p(t,e)})),t.addEventListener("keyboardDidHide",(function(){return h(t)}))},p=function(t,e){b(t,e),s=!0},h=function(t){v(t),s=!1},u=function(){var t=(i.height-a.height)*a.scale;return!s&&i.width===a.width&&t>150},f=function(t){return s&&!m(t)},m=function(t){return s&&a.height===t.innerHeight},b=function(t,e){var r=e?e.keyboardHeight:t.innerHeight-a.height,o=new CustomEvent(n,{detail:{keyboardHeight:r}});t.dispatchEvent(o)},v=function(t){var e=new CustomEvent(o);t.dispatchEvent(e)},g=function(t){i=Object.assign({},a),a=w(t.visualViewport)},w=function(t){return{width:Math.round(t.width),height:Math.round(t.height),offsetTop:t.offsetTop,offsetLeft:t.offsetLeft,pageTop:t.pageTop,pageLeft:t.pageLeft,scale:t.scale}}},9383:function(t,e,r){r.r(e),r.d(e,{c:function(){return i},g:function(){return a},h:function(){return o},o:function(){return d}});var n=r(3431),o=function(t,e){return null!==e.closest(t)},i=function(t,e){var r;return"string"===typeof t&&t.length>0?Object.assign(((r={"ion-color":!0})["ion-color-".concat(t)]=!0,r),e):e},a=function(t){var e={};return function(t){return void 0!==t?(Array.isArray(t)?t:t.split(" ")).filter((function(t){return null!=t})).map((function(t){return t.trim()})).filter((function(t){return""!==t})):[]}(t).forEach((function(t){return e[t]=!0})),e},s=/^[a-z][a-z0-9+\-.]*:/,d=function(t,e,r,o){return(0,n.mG)(void 0,void 0,void 0,(function(){var i;return(0,n.Jh)(this,(function(n){return null!=t&&"#"!==t[0]&&!s.test(t)&&(i=document.querySelector("ion-router"))?(null!=e&&e.preventDefault(),[2,i.push(t,r,o)]):[2,!1]}))}))}}}]);
//# sourceMappingURL=13.0ab07df3.chunk.js.map