System.register(["./index-legacy-fb339c9d.js"],(function(e,n){"use strict";var i;return{setters:[e=>{i=e.X}],execute:function(){
/*!
       * (C) Ionic http://ionicframework.com - MIT License
       */
var n,t;!function(e){e.Unimplemented="UNIMPLEMENTED",e.Unavailable="UNAVAILABLE"}(n||(n={})),e("a",t),function(e){e.Body="body",e.Ionic="ionic",e.Native="native",e.None="none"}(t||e("a",t={})),e("K",{getEngine(){const e=i();if(null==e?void 0:e.isPluginAvailable("Keyboard"))return e.Plugins.Keyboard},getResizeMode(){const e=this.getEngine();return(null==e?void 0:e.getResizeMode)?e.getResizeMode().catch((e=>{if(e.code!==n.Unimplemented)throw e})):Promise.resolve(void 0)}})}}}));
