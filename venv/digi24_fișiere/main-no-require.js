/* ------------------------------------------------------------------------------------------------------------------ */
/* -- START -- IAD contributors ------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------ */


if (typeof appCfg === "undefined") {
    console.warn('JWPlayer not present');
}

if (typeof $ === "undefined") {
    console.warn('jQuery not present');
}

if (typeof jwplayer === "undefined") {
    console.warn('JWPlayer not present');
}


/**
 * Main AppEngine Object
 *
 *
 * @info For debug use in browser console <code>appEngine.dump();</code>
 *
 * @type {{ns, registrySet, registryGet, definitionSet, definitionGet, dump}}
 */
window.appEngine = (function (config, undefined) {
    // 'use strict';
    var _window = window;
    var cfg = config || {};
    var registry = {};
    var def = {};
    function nsFn (str) {
        var vs = str.split('.');
        var last = def;
        var n = vs.length;
        for (var i = 0; i < n; i++) {
            if (typeof last[vs[i]] !== "object") {
                last[vs[i]] = {};
            }
            last = last[vs[i]];
        }
        return last;
    }
    function nsSplit (str) {
        var vs = str.split('.');
        var n = vs.length - 1;
        var o1 = [];
        var o2 = vs[n];
        for (var i = 0; i < n; i++) {
            o1.push(vs[i]);
        }
        return {
            'path' : o1.join('.'),
            'file' : o2
        };
    }
    function registrySetFn (k, v) {
        registry[k] = v;
    }
    function registryGetFn (k) {
        return registry[k];
    }
    function definitionSetFn(key, def) {
        var ps = nsSplit(key);
        var obj = nsFn(ps.path);
        obj[ps.file] = def;
    }
    function definitionGetFn(key) {
        var ps = nsSplit(key);
        var obj = nsFn(ps.path);
        return obj[ps.file];
    }
    function dumpFn() {
        return {
            ns: nsFn,
            registrySet: registrySetFn,
            registryGet: registryGetFn,
            definitionSet: definitionSetFn,
            definitionGet: definitionGetFn,
            dump: dumpFn,
            _window: _window,
            cfg: cfg,
            registry: registry,
            def: def
        };
    }
    return {
        ns: nsFn,
        registrySet: registrySetFn,
        registryGet: registryGetFn,
        definitionSet: definitionSetFn,
        definitionGet: definitionGetFn,
        dump: dumpFn
    };
})({});




/**
 * Decorate AppEngine with 'app.utils.getAssetsBaseUrl'
 */
(function (appEngine) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.getAssetsBaseUrl',
        (function () {
            var url = window.appCfg.assetsBaseUrl;
            var urlDev = window.appCfg.assetsBaseDevUrl;
            return function (type) {
                if (type === 'dev') {
                    return urlDev;
                }
                return url;
            };
        })()
    );
    appEngine.definitionSet(
        'app.utils.getMobileAssetsBaseUrl',
        (function () {
            var url = window.appCfg.mobileAssetsBaseUrl;
            var urlDev = window.appCfg.mobileAssetsBaseDevUrl;
            return function (type) {
                if (type === 'dev') {
                    return urlDev;
                }
                return url;
            };
        })()
    );
    appEngine.definitionSet(
        'app.utils.isMobileEnv',
        (function () {
            var env = window.appCfg.assetsEnv;
            return function () {
                if (env === 'mobile') {
                    return true;
                }
                return false;
            };
        })()
    );
    appEngine.definitionSet(
        'app.utils.isEnvWithRedirActive',
        (function () {
            var env = window.appCfg.redirEnvActive;
            return function () {
                if (env) {
                    return true;
                }
                return false;
            };
        })()
    );
})(appEngine);


/**
 * Decorate AppEngine with 'app.utils.uniqid'
 */
(function (appEngine) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.uniqid',
        (function () {
            var id = 0;
            return function () {
                if (arguments[0] === 0) {
                    id = 0;
                }
                return id++;
            };
        })()
    );
})(appEngine);

/**
 * Decorate AppEngine with 'app.utils.randomstr'
 */
(function (appEngine) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.randomstr',
        (function () {
            return function (len) {
                var str = "";                                         // String result
                for(var i=0; i<len; i++){                             // Loop `len` times
                    var rand = Math.floor( Math.random() * 62 );        // random: 0..61
                    var charCode = rand+= rand>9? (rand<36?55:61) : 48; // Get correct charCode
                    str += String.fromCharCode( charCode );             // add Character to str
                }
                return str;       // After all loops are done, return the concatenated string
            };
        })()
    );
})(appEngine);

(function (appEngine) {
    appEngine.definitionSet(
        'app.utils.md5',
        (function () {

            var HEX_CHARS = "0123456789abcdef";
            var HEX_TABLE = {
                '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
                'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15,
                'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15
            };

            var R = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
                5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
                4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
                6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

            var K = [0XD76AA478, 0XE8C7B756, 0X242070DB, 0XC1BDCEEE,
                0XF57C0FAF, 0X4787C62A, 0XA8304613, 0XFD469501,
                0X698098D8, 0X8B44F7AF, 0XFFFF5BB1, 0X895CD7BE,
                0X6B901122, 0XFD987193, 0XA679438E, 0X49B40821,
                0XF61E2562, 0XC040B340, 0X265E5A51, 0XE9B6C7AA,
                0XD62F105D, 0X02441453, 0XD8A1E681, 0XE7D3FBC8,
                0X21E1CDE6, 0XC33707D6, 0XF4D50D87, 0X455A14ED,
                0XA9E3E905, 0XFCEFA3F8, 0X676F02D9, 0X8D2A4C8A,
                0XFFFA3942, 0X8771F681, 0X6D9D6122, 0XFDE5380C,
                0XA4BEEA44, 0X4BDECFA9, 0XF6BB4B60, 0XBEBFBC70,
                0X289B7EC6, 0XEAA127FA, 0XD4EF3085, 0X04881D05,
                0XD9D4D039, 0XE6DB99E5, 0X1FA27CF8, 0XC4AC5665,
                0XF4292244, 0X432AFF97, 0XAB9423A7, 0XFC93A039,
                0X655B59C3, 0X8F0CCC92, 0XFFEFF47D, 0X85845DD1,
                0X6FA87E4F, 0XFE2CE6E0, 0XA3014314, 0X4E0811A1,
                0XF7537E82, 0XBD3AF235, 0X2AD7D2BB, 0XEB86D391];

            var jsmd5 = function(message) {
                var blocks = hasUTF8(message) ? UTF8toBlocks(message) : ASCIItoBlocks(message);
                var h0 = 0x67452301;
                var h1 = 0xEFCDAB89;
                var h2 = 0x98BADCFE;
                var h3 = 0x10325476;

                for(var i = 0, length = blocks.length;i < length;i += 16)
                {
                    var a = h0;
                    var b = h1;
                    var c = h2;
                    var d = h3;
                    var f, g, tmp, x, y;

                    for(var j = 0;j < 64;++j)
                    {
                        if(j < 16)
                        {
                            // f = (b & c) | ((~b) & d);
                            f = d ^ (b & (c ^ d));
                            g = j;
                        }
                        else if(j < 32)
                        {
                            // f = (d & b) | ((~d) & c);
                            f = c ^ (d & (b ^ c));
                            g = (5 * j + 1) % 16;
                        }
                        else if(j < 48)
                        {
                            f = b ^ c ^ d;
                            g = (3 * j + 5) % 16;
                        }
                        else
                        {
                            f = c ^ (b | (~d));
                            g = (7 * j) % 16;
                        }

                        tmp = d;
                        d = c;
                        c = b;

                        // leftrotate
                        x = (a + f + K[j] + blocks[i + g]);
                        y = R[j];
                        b += (x << y) | (x >>> (32 - y));
                        a = tmp;
                    }
                    h0 = (h0 + a) | 0;
                    h1 = (h1 + b) | 0;
                    h2 = (h2 + c) | 0;
                    h3 = (h3 + d) | 0;
                }
                return toHexString(h0) + toHexString(h1) + toHexString(h2) + toHexString(h3);
            };

            var toHexString = function(num) {
                var hex = "";
                for(var i = 0; i < 4; i++)
                {
                    var offset = i << 3;
                    hex += HEX_CHARS.charAt((num >> (offset + 4)) & 0x0F) + HEX_CHARS.charAt((num >> offset) & 0x0F);
                }
                return hex;
            };

            var hasUTF8 = function(message) {
                var i = message.length;
                while(i--)
                    if(message.charCodeAt(i) > 127)
                        return true;
                return false;
            };

            var ASCIItoBlocks = function(message) {
                // a block is 32 bits(4 bytes), a chunk is 512 bits(64 bytes)
                var length = message.length;
                var chunkCount = ((length + 8) >> 6) + 1;
                var blockCount = chunkCount << 4; // chunkCount * 16
                var blocks = [];
                var i;
                for(i = 0;i < blockCount;++i)
                    blocks[i] = 0;
                for(i = 0;i < length;++i)
                    blocks[i >> 2] |= message.charCodeAt(i) << ((i % 4) << 3);
                blocks[i >> 2] |= 0x80 << ((i % 4) << 3);
                blocks[blockCount - 2] = length << 3; // length * 8
                return blocks;
            };

            var UTF8toBlocks = function(message) {
                var uri = encodeURIComponent(message);
                var blocks = [];
                for(var i = 0, bytes = 0, length = uri.length;i < length;++i)
                {
                    var c = uri.charCodeAt(i);
                    if(c == 37) // %
                        blocks[bytes >> 2] |= ((HEX_TABLE[uri.charAt(++i)] << 4) | HEX_TABLE[uri.charAt(++i)]) << ((bytes % 4) << 3);
                    else
                        blocks[bytes >> 2] |= c << ((bytes % 4) << 3);
                    ++bytes;
                }
                var chunkCount = ((bytes + 8) >> 6) + 1;
                var blockCount = chunkCount << 4; // chunkCount * 16
                var index = bytes >> 2;
                blocks[index] |= 0x80 << ((bytes % 4) << 3);
                for(var i = index + 1;i < blockCount;++i)
                    blocks[i] = 0;
                blocks[blockCount - 2] = bytes << 3; // bytes * 8
                return blocks;
            };

            return jsmd5;
        })()
    );
})(appEngine);


/**
 * Decorate AppEngine with 'app.utils.factoryJQueryRunnableContainerSet'
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.factoryJQueryRunnableContainerSet',
        (function (appEngine, $, undefined) {
            return function () {
                var stack = [];
                function addCallback(fn) {
                    if ( ! typeof fn === 'function') {
                        throw new Error('Invalid param - expecting function');
                    }
                    stack.push(fn);
                }
                function runOver($jqueryCollection) {
                    if ( ! $jqueryCollection instanceof $) {
                        throw new Error('Invalid param - expecting jquery collection');
                    }
                    for (var i = 0, n = stack.length; i < n; i++) {
                        try {
                            stack[i]($jqueryCollection);
                        } catch (e) {
                            // console.log(stack[i]);
                            console.error(e);
                        }
                    }
                }
                return {
                    addCallback: addCallback,
                    runOver: runOver
                };
            };
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Decorate AppEngine with 'app.utils.urlThumbToVideoUrl'
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.urlThumbToVideoUrl',
        (function (appEngine, $, undefined) {
            return function (src) {
                // console.log('POSTER IN', src);
                var newSrc = src; // src.replace(/%2F/g, '/').replace(/%3A/g, ':');
                // console.log('POSTER OUT', newSrc);
                return newSrc;
            };
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Decorate AppEngine with 'app.utils.extractVideoEmbedHtml'
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.extractVideoEmbedHtml',
        (function (appEngine, $, undefined) {
            return function ($video, articleCanonicalUrl, index) {
                var id = 'embed-' + appEngine.definitionGet('app.utils.uniqid')();
                var inp = $(
                    [
                        '<input type="text" value="" onclick="this.focus();this.select();" style="cursor: copy; background: #fff;" class="form-control" >',
                    ].join('')
                ).attr({
                    id: id,
                    value: [
                        '<iframe src="' + articleCanonicalUrl + '?video=' + index + '&width=570&height=320" allowfullscreen marginwidth="0" marginheight="0" align="top" scrolling="No" frameborder="0" hspace="0" vspace="0" width="570" height="320" >',
                        '</iframe>'
                    ].join(''),
                    readonly: 'readonly'
                }).wrap('<div></div>').parent().html();
                return [
                    '<div class="video-player-embed">',
                    '<label for="' + id + '">Embed</label>',
                    inp,
                    '</div>'
                ].join('');
            };
        })(appEngine, $)
    );
})(appEngine, $);


(function (appEngine, window, $, undefined) {
    // 'use strict';

    var videoLists = [];
    // window.videoLists = videoLists;

    var videoStopNotMe = function  (videoInstance) {
        var meId = videoInstance.getConfig().id;
        for (var i = 0, n = videoLists.length; i < n; i++) {
            var vidId = videoLists[i].getConfig().id;
            if (meId !== vidId) {
                var state = videoLists[i].getState();
                switch (state) {
                    case 'playing' :
                        // case 'buffering' :
                        videoLists[i].pause();
                        break;
                    default :
                        // no op
                        break;
                }
                // if (state !== 'paused') {
                //     try {
                //         videoLists[i].pause();
                //     } catch (e) {
                //         console.warn('Error while pausing video:', e);
                //     }
                // }
            }
        }
    };

    var videoStopAll = function () {
        for (var i = 0, n = videoLists.length; i < n; i++) {
            var vidId = videoLists[i].getConfig().id;
            var state = videoLists[i].getState();
            switch (state) {
                case 'playing' :
                    // case 'buffering' :
                    videoLists[i].pause();
                    break;
                default :
                    // no op
                    break;
            }
            // if (state !== 'paused') {
            //     try {
            //         videoLists[i].pause();
            //     } catch (e) {
            //         console.warn('Error while pausing video:', e);
            //     }
            // }
        }
    };

    appEngine.definitionSet(
        'app.utils.pauseAllVideos',
        (function (appEngine, $, window, undefined) {

            return function () {
                videoStopAll();
            };

        })(appEngine, $)
    );

    appEngine.definitionSet(

        'app.utils.addVideoToStash',
        (function (appEngine, $, window, undefined) {

            return function (videoInstance, gtmArticle) {

                videoInstance.__appGtmArticle = gtmArticle;

                videoLists.push(videoInstance);

                // console.log(videoLists);

                // console.log('adding video', videoInstance.getConfig().id);

                videoInstance.on('play', function (e) {
                    console.log('playing video', this.getConfig().id);
                    videoStopNotMe(this);
                });

                // videoInstance.onPause( function () {
                //     // console.log('pausing video', this.getConfig().id);
                // });

                var eventOnPlay = true;

                videoInstance.on('play',
                    function(e){

                        console.log('GTM-Video onPlay ...', this.__appGtmArticle);

                        var parentId = $('#' + this.id).parent().prop('id');

                        console.log(eventOnPlay);

                        if (parentId === 'videoLiveTrakingHp') {
                            var interaction = 'Click Play_videoHomepage';
                            //console.log('GTM-Video Interview Homepage onPlay...', interaction);

                        } else if (parentId === 'videoLiveTrakingArticle') {
                            var interaction = 'Click Play_videoArticol';
                            //console.log('GTM-Video Interview Article onPlay ...', interaction);
                        } else {
                            if (eventOnPlay) {
                                var interaction = 'Video started';
                                eventOnPlay = false;
                            } else {
                                var interaction = 'Play';
                            }
                        }

                        //console.log("Interaction:"+ interaction);

                        dataLayer.push({
                            "event": "video",
                            "player_id": this.id,
                            "interaction": interaction,
                            "video_url": this.getPlaylistItem().file,
                            "duration": this.getDuration(),
                            "width": this.getWidth(),
                            "height": this.getHeight(),
                            "position": this.getPosition(),
                            "resolutions": [].map.call(this.getQualityLevels(), function(obj) {  return obj.label;}),
                            "volume": this.getVolume(),
                            "player_type": this.renderingMode,

                            "window_url": document.location.href,
                            "gtm_container": null // this.__appGtmArticle || {}
                        });
                    }
                );

                videoInstance.on('complete',
                    function(e){
                        console.log('GTM-Video onComplete ...', this.__appGtmArticle);
                        dataLayer.push({
                            "event": "video",
                            "player_id": this.id,
                            "interaction": "Video ended",
                            "video_url": this.getPlaylistItem().file,
                            "duration": this.getDuration(),
                            "width": this.getWidth(),
                            "height": this.getHeight(),
                            "position": this.getPosition(),
                            "resolutions": [].map.call(this.getQualityLevels(), function(obj) {  return obj.label;}),
                            "volume": this.getVolume(),
                            "player_type": this.renderingMode,

                            "window_url": document.location.href,
                            "gtm_container": null // this.__appGtmArticle || {}
                        });
                    }
                );

                videoInstance.on('pause',
                    function(e){

                        var percentPlayed = Math.floor(this.getPosition()*100/this.getDuration());

                        if (percentPlayed < 50) {
                            var interaction = 'Video stopped before half';
                        } else {
                            var interaction = 'Video stopped after half';
                        }

                        console.log('GTM-Video onPause ...', this.__appGtmArticle);

                        // Only for static
                        if (this.getDuration() !== Infinity) {

                            var percentPlayed = Math.floor(this.getPosition()*100/this.getDuration());

                            if (percentPlayed < 50) {
                                var interaction = 'Video stopped before half';
                            } else {
                                var interaction = 'Video stopped after half';
                            }

                            dataLayer.push({
                                "event": "video",
                                "player_id": this.id,
                                "interaction": interaction,
                                "video_url": this.getPlaylistItem().file,
                                "duration": this.getDuration(),
                                "width": this.getWidth(),
                                "height": this.getHeight(),
                                "position": this.getPosition(),
                                "resolutions": [].map.call(this.getQualityLevels(), function(obj) {  return obj.label;}),
                                "volume": this.getVolume(),
                                "player_type": this.renderingMode,

                                "window_url": document.location.href,
                                "gtm_container": null // this.__appGtmArticle || {}
                            });
                        }
                        
                        dataLayer.push({
                            "event": "video",
                            "player_id": this.id,
                            "interaction": "Pause",
                            "video_url": this.getPlaylistItem().file,
                            "duration": this.getDuration(),
                            "width": this.getWidth(),
                            "height": this.getHeight(),
                            "position": this.getPosition(),
                            "resolutions": [].map.call(this.getQualityLevels(), function(obj) {  return obj.label;}),
                            "volume": this.getVolume(),
                            "player_type": this.renderingMode,

                            "window_url": document.location.href,
                            "gtm_container": null // this.__appGtmArticle || {}
                        });
                    }
                );

                videoInstance.on('error',
                    function(e){
                        console.log('GTM-Video onError ...', this.__appGtmArticle);
                        dataLayer.push({
                            "event": "videoError",
                            "player_id": this.id,
                            "interaction": e.message,
                            "video_url": this.getPlaylistItem().file,
                            "duration": this.getDuration(),
                            "width": this.getWidth(),
                            "height": this.getHeight(),
                            "position": this.getPosition(),
                            "resolutions": [].map.call(this.getQualityLevels(), function(obj) {  return obj.label;}),
                            "volume": this.getVolume(),
                            "player_type": this.renderingMode,

                            "window_url": document.location.href,
                            "gtm_container": null // this.__appGtmArticle || {}
                        });
                    }
                );

                videoInstance.on('fullscreen',
                    function(e){
                        console.log('GTM-Video onFullscreen ...', this.__appGtmArticle);
                        dataLayer.push({
                            "event": "video",
                            "player_id": this.id,
                            "interaction": "FullScreen " + (e.fullscreen ? "On" : "Off"),
                            "video_url": this.getPlaylistItem().file,
                            "duration": this.getDuration(),
                            "width": this.getWidth(),
                            "height": this.getHeight(),
                            "position": this.getPosition(),
                            "resolutions": [].map.call(this.getQualityLevels(), function(obj) {  return obj.label;}),
                            "volume": this.getVolume(),
                            "player_type": this.renderingMode,

                            "window_url": document.location.href,
                            "gtm_container": null // this.__appGtmArticle || {}
                        });
                    }
                );

                videoInstance.on('mute',
                    function(e){
                        console.log('GTM-Video onMute ...', this.__appGtmArticle);
                        dataLayer.push({
                            "event": "video",
                            "player_id": this.id,
                            "interaction": "Mute " + (e.mute ? "On" : "Off"),
                            "video_url": this.getPlaylistItem().file,
                            "duration": this.getDuration(),
                            "width": this.getWidth(),
                            "height": this.getHeight(),
                            "position": this.getPosition(),
                            "resolutions": [].map.call(this.getQualityLevels(), function(obj) {  return obj.label;}),
                            "volume": this.getVolume(),
                            "player_type": this.renderingMode,

                            "window_url": document.location.href,
                            "gtm_container": null // this.__appGtmArticle || {}
                        });
                    });

            };

        })(appEngine, $, window)
    );
})(appEngine, window, $);

/**
 * Decorate AppEngine with 'app.utils.videoGetAdvertising'
 *
 * Demo setup:
 * <code>
 <div id="my-video"></div>
 <script type="text/javascript">
 jwplayer("my-video").setup({
        file: "http://content.jwplatform.com/videos/Wf8BfcSt-kNspJqnJ.mp4",
        image: "http://content.jwplatform.com/thumbs/Wf8BfcSt-640.jpg",
        width: "580",
        height: "370",
        primary: "flash",
        advertising: {
            client: "vast",
            schedule: {"myAds":{"offset":"pre","tag":"https://pubads.g.doubleclick.net/gampad/ads?sz=300x168|570x320|466x262&iu=/124748474/Test_Preroll&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=http%3A%2F%2Fdevtb.digi24.ro%2Flive%2Fdigi24&description_url=%5Bdescription%5D&correlator=1468867197898"}}
        }
    });
 * </code>
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.videoGetAdvertising',
        (function (appEngine, $, undefined) {
            return function ($article) {

                var $videoPreRoll = $("#videoPreRoll");

                if ($videoPreRoll && $videoPreRoll.length) {

                    console.info("Video preroll code founded in page", $videoPreRoll.html());

                    var videoPreRollJSON = $.parseJSON($videoPreRoll.html());

                    console.log('videoPreRollJSON', videoPreRollJSON);

                    var videoPreRollParams = [];

                    for (preRollParam in videoPreRollJSON.params) {
                        videoPreRollParams.push(preRollParam + "=" + videoPreRollJSON.params[preRollParam]);
                    }

                    if (videoPreRollParams.length > 0) {
                        videoPreRollParams.push("url=" + window.encodeURIComponent(window.location.href));
                        videoPreRollParams.push("description_url=" + window.encodeURIComponent("[description]"));
                        videoPreRollParams.push("correlator="+ (new Date()).getTime());
                    }

                    var videoPreRollCode = videoPreRollJSON.url.toString() +"?"+ videoPreRollParams.join("&");

                    cxUserIds = String(cX.getUserSegmentIds({ persistedQueryId: "2034d4bf8de8663be6b414ecf7e79bd37f5b1066"}));
                    cxUserIds = '[' + cxUserIds.replace(new RegExp(",", 'g'), '%2C') + ']';

                    videoPreRollCode = videoPreRollCode.replace("##cxUserIds##", cxUserIds);

                    if ($('script.app-entity-meta-cfg[type="text/template"]').length) {

                        articleCfg = $.parseJSON($('script.app-entity-meta-cfg[type="text/template"]').html());

                        if (articleCfg) {
                            videoPreRollCode = videoPreRollCode.replace("##fullCatPath##", articleCfg.fullCatPath);
                        }
                    } else {
                        videoPreRollCode = videoPreRollCode.replace("##fullCatPath##", "");
                    }

                    //console.log(videoPreRollCode);
                    return {
                        client : "googima",
                        schedule: {
                            "myAdds" : {
                                "offset": "pre",
                                "tag": videoPreRollCode
                            }
                        }
                    };

                } else {
                    console.error("Cannot find #videoPreroll container in page!");
                    return {};
                }

            };
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Add registry "appArticleWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appArticleWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Add registry "appLiveWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appLiveWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Add registry ""
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appLiveHomepageWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Add registry "appInterviewHomepageWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appInterviewHomepageWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Add registry "appArticleEmbedWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appArticleEmbedWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Add registry "appArticleAnalytics"
 *
 * @NOTE This wrapper of callbacks is deprecated and all callbacks were migrated to another stash
 *
 * @IMPORTANT We keep it only for back-compatibility purposes (for integration with 1616 repositories)
 *
 * @INFO It does nothing since 20.09.2016  (@author Traian.B)
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appArticleAnalytics',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Add registry "appLiveFormWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appLiveFormWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Add registry "appForecastWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appForecastWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Add registry "appShowsFormWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appShowsFormWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

/*
* Add registry "appTvStarsFormWidgets"
* */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appTvStarsFormWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

var trackingLivestream = {
    cfg : {
        is: null,  // is|idstream (string) digi24 = 4
        ns: null,   // ns|namestream (string)
        t: null,    // @TODO
        t2: null,   // @TODO
        pe: 'site', // default 'site'
        s: 'site',  // s|src = app|site
        sn: null,   // sn|srcname = ro.rcs-rds.ro.digionline | digi24.ro | digionline.ro
        p: null,    // p|platform = android|ios|winwdos|browser
        pd: null,   // browser.windows | browser.linux | browser.android | browser.ios | browser.mac
        q: null     // q|quality
    },

    setConfigItem: function (property, value) {
        if (property in this.cfg) {
            this.cfg[property] = value;
        } else {
            console.error("Trying to set a property that doesnt exists <" + property + ">");
        }
        return this;
    },

    setConfigItems: function (cfg) {
        for (key in cfg) {
            this.setConfigItem(key, cfg[key]);
        }
        return this;

    },

    getPlatformDetails: function()
    {
        var platform = null;
        if (navigator.appVersion.indexOf("Win") != -1) {
            platform = "windows";
        } else if (navigator.appVersion.indexOf("X11") != -1) {
            platform = "linux";
        } else if (navigator.appVersion.indexOf("Linux") != -1) {
            platform = "linux";
        } else if (navigator.userAgent.indexOf("Android") != -1) {
            platform = "android";
        } else if (navigator.userAgent.indexOf("like Mac") != -1) {
            platform = "ios";
        } else if (navigator.appVersion.indexOf("Mac") != -1) {
            platform = "mac";
        }

        if (platform) {
            this.setConfigItem('pd', platform);
        }
    },

    getQueryString: function()
    {
        var out = new Array();

        for (key in this.cfg) {
            if (this.cfg[key]) {
                out.push(key + '=' + encodeURIComponent(this.cfg[key]));
            }
        }

        var qs = out.join('&');
        console.info("qs: "+ qs);
        return qs;
    },

    init: function(cfg) {
        if (cfg) {
            this.setConfigItems(cfg)
        }

        this.getPlatformDetails();

        return this;
    },
}
trackingLivestream.init({
    'is': 4,
    'ns':'digi24',
    'p':'browser',
    'sn': 'digi24.ro',
});


/**
 * Decorate AppEngine with 'app.utils.initVideoInContainer'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initVideoInContainer',
        (function (appEngine, $, undefined) {
            return function ($articleJqColl) {

                appEngine.definitionGet('app.utils.pauseAllVideos')();

                if ( ! $articleJqColl instanceof $) { console.error("ce plm");
                    throw new Error('Invalid param - expecting jquery collection');
                }
                var videoIndexInArticle = -1;

                $articleJqColl.find('.video').each( function (index, elem) {

                    var $video = $(this);
                    if ($video.attr('video-init')) {
                        return;
                    }

                    $video.attr('video-init', true);

                    var gtmVideoArticle = null;
                    try {
                        // @NOTE We can have ".data-app-meta-article" OR ".data-app-meta-video-article" container !!
                        gtmVideoArticle = $.parseJSON($.trim(
                            $video.closest('.data-app-meta')
                                .find('script.app-entity-gtm-cfg[type="text/template"]')
                                .html()
                        ));
                    } catch (e) {
                        console.warn('Video article gtm warn', e);
                    }
                    // console.log('Gtm Video Parent Article', gtmVideoArticle);

                    try {
                        var jsonCfg = $.parseJSON($.trim($video.find('script[type="text/template"]').first().html()));

                        if (typeof jsonCfg !== 'object') {
                            throw new Error('Invalid video cfg');
                        }
                        if ( ! jsonCfg["shortcode"]) {
                            throw new Error('Invalid shortcode cfg new-info');
                        }

                        switch (jsonCfg["shortcode"]) {

                            case 'livestream':

                                if (! jsonCfg["new-info"]) {
                                    throw new Error('Invalid livestream cfg new-info');
                                }
                                if (! jsonCfg["new-info"]["meta"]) {
                                    throw new Error('Invalid livestream cfg new-info meta');
                                }
                                if (! jsonCfg["new-info"]["meta"]["scope"]) {
                                    throw new Error('Invalid livestream cfg new-info meta message or scope or start or stop');
                                }

                                var buffering    = jsonCfg["new-info"]["meta"]["buffering"];
                                var featureImage = jsonCfg["new-info"]["meta"]["featureImage"];
                                var scope        = jsonCfg["new-info"]["meta"]["scope"];
                                var start        = (jsonCfg["new-info"]["meta"]["start"] || 0) * 1000;
                                var stop         = (jsonCfg["new-info"]["meta"]["stop"]  || 0) * 1000;
                                var message      = jsonCfg["new-info"]["meta"]["message"] || 'No info';
                                var displayLive  = true;

                                if (start > 0 && stop > 0) {
                                    displayLive = false;
                                    var dtStartClient = (new Date()).getTime();
                                    if (start < dtStartClient && stop > dtStartClient) {
                                        displayLive = true;
                                    }
                                }
                                if (! displayLive) {
                                    // $video.html(message);
                                    return;
                                }

                                var trackingParam = '';
                                if (trackingLivestream) {
                                    trackingParam = trackingLivestream.getQueryString().toString();
                                }

                                // var loadNewType = Math.round(Math.random() * 1);
                                //
                                // if (loadNewType === 1) {
                                //     console.log("%c Load NEW streams", 'background: #222; color: #bada55');
                                // } else {
                                //     console.log("%c Load OLD streams", 'background: #222; color: #bada55');
                                // }

                                var jqXhr = $.get('//balancer2.digi24.ro/streamer/make_key.php');
                                (function (jqXhr, scope, start, stop, message, $video) {
                                        jqXhr.done(function (rsp) {
                                            $.when(
                                                $.get([
                                                    '//balancer2.digi24.ro/streamer.php?',
                                                    '&scope=', window.encodeURIComponent(scope),
                                                    '&key=', window.encodeURIComponent(rsp),
                                                    '&outputFormat=', window.encodeURIComponent('json'),
                                                    '&type=', window.encodeURIComponent('abr'),
                                                    '&quality=', window.encodeURIComponent('hq'),
                                                    '&'+ trackingParam
                                                ].join(''))
                                            ).always(function(response) {

                                                if (! response || ! response.file || ! response.type) {
                                                    console.error("Invalid balancer response");
                                                    return;
                                                }

                                                var hqCfg = response;

                                                if (hqCfg.type === 'new') {
                                                    console.log("%c Load NEW streams", 'background: #222; color: #bada55');
                                                } else {
                                                    console.log("%c Load OLD streams", 'background: #222; color: #bada55');
                                                }

                                                var sources = [];

                                                if (hqCfg.file) {
                                                    sources.push({
                                                        file: hqCfg.file,
                                                        "default": "true",
                                                        label: "HQ"
                                                    });
                                                }

                                                if (sources.length == 0) {
                                                    return;
                                                }

                                                var newSource = sources[0]['file'];
                                                var id = null;

                                                if (! $video.attr('id')) {
                                                    id = 'video-' + appEngine.definitionGet('app.utils.uniqid')();
                                                    $video.attr('id', id);
                                                } else {
                                                    id = $video.attr('id');
                                                }

                                                var player = jwplayer(id);

                                                var videoCfg = {
                                                    file: newSource,
                                                    width: "100%",
                                                    aspectratio: "16:9",
                                                    autostart: 'viewable',
                                                    mute: 'true',
                                                    stretching: 'uniform',
                                                    preload: 'auto',
                                                    controls: 'true',
                                                    primary: 'html5',
                                                    cast: {},
                                                    title: 'Digi24 Live',
                                                    androidhls: 'true',
                                                    bufferlength: '5',
                                                    skin: {name: 'seven'},
                                                    //  description: 'test only stream',
                                                    //  aboutlink: 'www.digi24.ro',
                                                    smoothing: 'true',
                                                    deblocking: 'true',
                                                    flashplayer: '/static/js/vendor/jwplayer-8.9.3/jwplayer.flash.swf'
                                                }

                                                var advertising = appEngine.definitionGet('app.utils.videoGetAdvertising')();
                                                if (advertising) {
                                                    videoCfg.advertising = advertising;
                                                }

                                                console.log("config player", videoCfg, "");

                                                player.setup(videoCfg);

                                                // player.onReady(function(){
                                                //     var myLogo = document.createElement("div");
                                                //     myLogo.id = "myTestLogo";
                                                //     myLogo.setAttribute('style',"color: red; padding-left: 5px; margin-right: 5px; margin-top: 10px; background-image: url('/icon_dir.png');background-repeat: no-repeat;");
                                                //     myLogo.setAttribute('class','jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-logo');
                                                //     myLogo.setAttribute('onclick','window.location="http://jwplayer.com"');
                                                //     document.getElementsByClassName('jw-controlbar-right-group')[0].appendChild(myLogo);
                                                // });
                                                appEngine.definitionGet('app.utils.addVideoToStash')(player, gtmVideoArticle);
                                            });
                                        });
                                    })(jqXhr, scope, start, stop, message, $video);

                                break;

                            case 'video' :

                                // @IMPORTANT Only local videos are embeded (not galleries, livestreams, embeded-urls etc.)
                                videoIndexInArticle++;

                                if ( ! jsonCfg["new-info"]) {
                                    throw new Error('Invalid video cfg new-info');
                                }
                                if ( ! jsonCfg["new-info"]["meta"]) {
                                    throw new Error('Invalid video cfg new-info meta');
                                }
                                if ( ! jsonCfg["new-info"]["meta"]["source"]) {
                                    throw new Error('Invalid video cfg new-info meta source');
                                }
                                var buffering = jsonCfg["new-info"]["meta"]["buffering"];
                                var source = jsonCfg["new-info"]["meta"]["source"];
                                var versions = jsonCfg["new-info"]["meta"]["versions"] || {};
                                var snapshots =  jsonCfg["new-info"]["meta"]["snapshots"] || [];
                                var sources = [];
                                var hdFound = false;
                                var hdVersionFound = null;
                                var defaultFound = false;
                                var defaultVersionFound = false;
                                $.each([
                                    "720p.mp4",
                                    "480p.mp4",
                                    "360p.mp4",
                                    "240p.mp4"
                                    // "android.mp4",
                                    // "iphone.mp4",
                                    // "bblackberry.mp4",
                                    // "ogv",
                                    // "webm"
                                ], function (i, kk) {
                                    if ( ! versions[kk]) {
                                        return;
                                    } else {
                                    }
                                    var e = kk;
                                    var file = versions[kk];
                                    var cfgs = e.split(".");
                                    var type = null;
                                    var lbl = null;
                                    if (cfgs.length > 1) {
                                        type = cfgs[cfgs.length - 1];
                                        lbl = cfgs.slice(0, cfgs.length - 1).join(".");
                                    } else {
                                        type = cfgs[0];
                                        lbl = cfgs[0];
                                    }
                                    if (
                                        ( ! hdFound && lbl == '720p')
                                        || ( ! hdFound && lbl == '480p')
                                        || ( ! hdFound && lbl == '240p')
                                    ) {
                                        hdFound = true;
                                        hdVersionFound = lbl;
                                    }
                                    var sourceDefaultItem = false;
                                    if (
                                        ( ! defaultFound && lbl == '480p')
                                        || ( ! defaultFound && lbl == '240p')
                                    ) {
                                        defaultFound = true;
                                        defaultVersionFound = lbl;
                                        sourceDefaultItem = true;
                                    }
                                    var source = {
                                        file: file,
                                        // type: type,
                                        label: lbl
                                    };
                                    if ( !! sourceDefaultItem) {
                                        source =  {
                                            file: file,
                                            // type: type,
                                            label: lbl,
                                            "default" : "true"
                                        };
                                    }
                                    sources.push(source);
                                });
                                if ( ! hdFound && sources.length) {
                                    // sources[0]["default"] = true;
                                    sources.unshift({
                                        file: source,
                                        label: "HD"
                                    });
                                } else if ( ! sources.length) {
                                    sources.unshift({
                                        file: source,
                                        label: "HD"
                                    });
                                } else {

                                }

                                // console.log(sources);

                                var image = snapshots[5] || snapshots[4] || snapshots[0] || null;

                                // @INFO Show embed-widget only in not inside iframe (videos in iframe are already embeded)
                                if (window.self === window.top) {
                                    var videoUrlArticle = $video.closest('.data-app-meta-article').attr('data-embed-base-url-canonical');
                                    if (videoUrlArticle) {
                                        var embedCode = appEngine.definitionGet('app.utils.extractVideoEmbedHtml')($video, videoUrlArticle, videoIndexInArticle);

                                        if (embedCode) {
                                            $video.parent().append($(embedCode));
                                        }
                                    }
                                }

                                var articleCfg = {};
                                try {
                                    articleCfg = $.parseJSON($.trim($video.closest('.data-app-meta')
                                        .find('script.app-entity-meta-cfg[type="text/template"]')
                                        .html()));
                                } catch (e) {
                                    console.warn(e);
                                    articleCfg = {};
                                }

                                // console.log(articleCfg);

                                var id = null;
                                if ( ! $video.attr('id')) {
                                    id = 'video-' + appEngine.definitionGet('app.utils.uniqid')();
                                    $video.attr('id', id);
                                } else {
                                    id = $video.attr('id');
                                }
                                var player = jwplayer(id);
                                var videoCfg = {
                                    image: image,
                                    sources: sources,
                                    width: "100%",
                                    aspectratio: "16:9",
                                    stretching: 'uniform', // exactfit
                                    primary: "html5",
                                    cast : {},
                                    flashplayer: '/static/js/vendor/jwplayer-8.9.3/jwplayer.flash.swf',
                                    androidhls: 'true',
                                    bufferlength: '5',
                                    smoothing: 'true',
                                    deblocking: 'true',
                                    cast: {},
                                    skin: {name: 'seven'},
                                    preload: buffering ? 'none' : 'auto',
                                    autostart: 'false',
                                    mute: 'false'
                                };

                                // if (index == 0) {
                                //     videoCfg.autostart = 'viewable';
                                //     videoCfg.mute = 'true';
                                // }

                                var advertising = appEngine.definitionGet('app.utils.videoGetAdvertising')();
                                if (advertising) {
                                    videoCfg.advertising = advertising;
                                }

                                // console.log(videoCfg, JSON.stringify(videoCfg));

                                player.setup(videoCfg);
                                appEngine.definitionGet('app.utils.addVideoToStash')(player, gtmVideoArticle);
                                break;

                            case 'webcam':
                                console.log(jsonCfg);

                                var id = null;
                                if ( ! $video.attr('id')) {
                                    id = 'video-' + appEngine.definitionGet('app.utils.uniqid')();
                                    $video.attr('id', id);
                                } else {
                                    id = $video.attr('id');
                                }

                                if (jsonCfg !== null && typeof jsonCfg === 'object') {
                                    var player = jwplayer(id);

                                    console.log(player);

                                    var videoCfg = {
                                        // file: 'http://81.196.0.126:80/digi24edge/smil:digi24.smil/playlist.m3u8',
                                        // file: cfg.stream,
                                        file: jsonCfg['stream'],
                                        width: "100%",
                                        aspectratio: "16:9",
                                        autostart: 'true',
                                        stretching: 'uniform',
                                        preload: 'auto',
                                        controls: 'true',
                                        primary: 'html5',
                                        cast: {},
                                        title: 'Digi Webcams',
                                        androidhls: 'true',
                                        bufferlength: '5',
                                        skin: {name: 'seven'},
                                        //  description: 'test only stream',
                                        //  aboutlink: 'www.rcs-rds.ro',
                                        smoothing: 'true',
                                        deblocking: 'true',
                                        flashplayer: '/static/js/vendor/jwplayer-8.9.3/jwplayer.flash.swf',
                                    }

                                    var advertising = appEngine.definitionGet('app.utils.videoGetAdvertising')();
                                    if (advertising) {
                                        videoCfg.advertising = advertising;
                                    }

                                    player.setup(videoCfg);
                                }
                                else {
                                    throw new Error("Video cfg is not a valid object!");
                                }

                                break;

                            default :
                                throw new Error('Invalid video shortcode ' + jsonCfg["shortcode"]);
                                break;
                        }
                    } catch (e) {
                        console.warn('Video parse err', e);
                    }
                });
            }
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Populate "appArticleWidgets" with initVideoInContainer callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appArticleWidgets').addCallback(
        appEngine.definitionGet('app.utils.initVideoInContainer')
    );
})(appEngine, $);



(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initAnalyticsInternalPingInContainer',
        (function (appEngine, $, undefined) {
            return function ($articleJqColl) {
                if ( ! $articleJqColl instanceof $) {
                    throw new Error('Invalid param - expecting jquery collection');
                }

                $articleJqColl.each( function (i, elem) {
                    var $this = $(elem);

                    var cfg = $.parseJSON($.trim($this.find('script.app-entity-meta-cfg[type="text/template"]').html()));

                    if (cfg) {
                        appEngine.definitionGet('app.utils.appAnalyticsPageMetaPingV2').handleByMetaCfg(cfg);
                    }
                });
            };
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Populate "appArticleWidgets" with initAnalyticsInternalPingInContainer callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appArticleWidgets').addCallback(
        appEngine.definitionGet('app.utils.initAnalyticsInternalPingInContainer')
    );
})(appEngine, $);


(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initAnalyticsGtmContainer',
        (function (appEngine, $, undefined) {
            return function ($articleJqColl) {
                if ( ! $articleJqColl instanceof $) {
                    throw new Error('Invalid param - expecting jquery collection');
                }
                $articleJqColl.each( function (i, elem) {
                    var $this = $(elem);
                    var cfg = $.parseJSON($.trim($this.find('script.app-entity-gtm-cfg[type="text/template"]').html()));
                    if (cfg) {
                        appEngine.definitionGet('app.utils.appAnalyticsGtmPing').handleByGtmCfg(cfg);
                    }
                });
            };
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Populate "appArticleWidgets" with initAnalyticsInternalPingInContainer callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appArticleWidgets').addCallback(
        appEngine.definitionGet('app.utils.initAnalyticsGtmContainer')
    );
})(appEngine, $);

/**
 * Populate "appLiveWidgets" with initVideoInContainer callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appLiveWidgets').addCallback(
        appEngine.definitionGet('app.utils.initVideoInContainer')
    );
})(appEngine, $);


/**
 * Populate "appLiveHomepageWidgets" with initVideoInContainer callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appLiveHomepageWidgets').addCallback(
        appEngine.definitionGet('app.utils.initVideoInContainer')
    );
})(appEngine, $);

/**
 * Populate "appInterviewHomepageWidgets" with initVideoInContainer callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appInterviewHomepageWidgets').addCallback(
        appEngine.definitionGet('app.utils.initVideoInContainer')
    );
})(appEngine, $);


/**
 * Populate "appArticleEmbedWidgets" with initVideoInContainer callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appArticleEmbedWidgets').addCallback(
        appEngine.definitionGet('app.utils.initVideoInContainer')
    );
})(appEngine, $);


/**
 * Populate "appArticleEmbedWidgets" with initAnalyticsInternalPingInContainer callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appArticleEmbedWidgets').addCallback(
        appEngine.definitionGet('app.utils.initAnalyticsInternalPingInContainer')
    );
})(appEngine, $);


/**
 * Decorate AppEngine with 'app.utils.initIframeInContainer'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initIframeInContainer',
        (function (appEngine, $, undefined) {
            return function ($articleJqColl) {
                if ( ! $articleJqColl instanceof $) {
                    throw new Error('Invalid param - expecting jquery collection');
                }
                var videoIndexInArticle = -1;
                $articleJqColl.find('.app-embed-from-url').each( function (elem) {

                    var $embed = $(this);
                    if ($embed.attr('iframe-init')) {
                        return;
                    }
                    $embed.attr('iframe-init', 1);

                    var w = 585;
                    var h = 329;
                    if (appEngine.definitionGet('app.utils.isMobileEnv')()) {
                        w = Math.min(320, parseInt($embed.parent().width()) - 4);
                        h = parseInt((329 / 585) * w);
                    }

                    $embed.html([
                        '<iframe marginwidth="0" marginheight="0" align="top" scrolling="No" frameborder="0" hspace="0" vspace="0" width="' + w + '" height="' + h + '" src="' + $embed.attr('data-src') + '" allowfullscreen>',
                        '</iframe>'
                    ].join(''));

                });
            }
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Populate "appArticleWidgets" with initIframeInContainer callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appArticleWidgets').addCallback(
        appEngine.definitionGet('app.utils.initIframeInContainer')
    );
})(appEngine, $);





/**
 * Decorate AppEngine with 'app.utils.initLiveFormEngine'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initLiveFormEngine',
        (function (appEngine, $, undefined) {

            return function ($jqCollection) {

                if ($jqCollection.length) {
                    $jqCollection.each (function (el) {
                        var $this = $(this);
                        var cfg = $.parseJSON($.trim($this.find('#form-live-cfg').html()));
                        $this.find('select[name="station"]').on('change', function (e) {
                            var val = $(this).val();
                            var url = cfg[val] || null;
                            if (url) {
                                window.location.href = url;
                            }
                        });
                    });
                }

            };

        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Populate "appLiveFormWidgets" with video init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appLiveFormWidgets').addCallback(
        appEngine.definitionGet('app.utils.initLiveFormEngine')
    );
})(appEngine, $);

/**
 * Decorate AppEngine with 'app.utils.initForecastEngine'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initForecastEngine',
        (function (appEngine, $, undefined) {

            return function ($jqCollection) {

                if ($jqCollection.length) {

                    $jqCollection.each (function (el) {
                        var $this = $(this);

                        // links
                        var $regions = $('.change-regions');

                        $regions.on('change', function(e) {
                            window.location.href = $(this).val();
                        });

                        var cfg = $.parseJSON($.trim($('#forecast-cfg').html()));
                        var $boxForecast = $('.box-forecast');

                        var $map = $('.map a, .change-forecast a').on('click', function(e) {
                            e.preventDefault();

                            var $this = $(this);
                            var city = $.grep(cfg, function(e){ return e.value == $this.data('value'); });
                            city = city[0];

                            var currForecast = $.grep(cfg, function(e){ return e.value == $this.data('date'); }); // CHECK!!!!!!!

                            if (currForecast[0].date.hasOwnProperty('today')) {
                                var today = currForecast[0].date.today; //201611110000

                                var todayObj = $.grep(city._ossTmp.forecastDayValuesArr.forecasts, function(e){ return e.datetime == today; });

                                if (todayObj.length > 0) {
                                    var todayTemp = todayObj[0].temperature;
                                    $boxForecast.find('.next-today').text(todayTemp);
                                    var todaySymbol = todayObj[0].symbol;
                                    $boxForecast.find('.next-today-symbol').html('<span class="icon icon-meteo-' + todaySymbol + '" role="img"><svg><title>meteo-' + todaySymbol + ' icon</title><use xmlns:xlink="https://www.w3.org/1999/xlink" xlink:href="/static/theme-repo/dist/assets/svg/icons-meteo.svg#icon-meteo-' + todaySymbol + '"></use><use xmlns:xlink="https://www.w3.org/1999/xlink" xlink:href="#icon-meteo-' + todaySymbol + '"></use></svg></span>');
                                }

                            }

                            /** Tonight */
                            var tonight = currForecast[0].date.tonight; //201611110000
                            var tonightObj = $.grep(city._ossTmp.forecastDayValuesArr.forecasts, function(e){ return e.datetime == tonight; });

                            if (tonightObj.length > 0) {
                                var tonightTemp = tonightObj[0].temperature;
                                $boxForecast.find('.next-tonight').text(tonightTemp);
                                var tonightSymbol = tonightObj[0].symbol;
                                $boxForecast.find('.next-tonight-symbol').html('<span class="icon icon-meteo-' + tonightSymbol + '" role="img"><svg><title>meteo-' + tonightSymbol + ' icon</title><use xmlns:xlink="https://www.w3.org/1999/xlink" xlink:href="/static/theme-repo/dist/assets/svg/icons-meteo.svg#icon-meteo-' + tonightSymbol + '"></use><use xmlns:xlink="https://www.w3.org/1999/xlink" xlink:href="#icon-meteo-' + tonightSymbol + '"></use></svg></span>');
                            }

                            /** Tomorrow day */
                            var tomorrowDay = currForecast[0].date.tomorrowDay; //201611110000
                            var tomorrowDayObj = $.grep(city._ossTmp.forecastDayValuesArr.forecasts, function(e){ return e.datetime == tomorrowDay; });
                            var tomorrowDayTemp = tomorrowDayObj[0].temperature;
                            var tomorrowDaySymbol = tomorrowDayObj[0].symbol;

                            /** Tomorrow night */
                            var tomorrowNight = currForecast[0].date.tomorrowNight; //201611110000
                            var tomorrowNightObj = $.grep(city._ossTmp.forecastDayValuesArr.forecasts, function(e){ return e.datetime == tomorrowNight; });
                            var tomorrowNightTemp = tomorrowNightObj[0].temperature;


                            /** Now */
                            var nowSymbol = city._ossTmp.dayValueArr.forecasts[0].symbol;
                            $boxForecast.find('.now-city').text(city.label);
                            $boxForecast.find('.now-temp').text(city._ossTmp.dayValueArr.forecasts[0].temperature);
                            $boxForecast.find('.now-pressure').text(city._ossTmp.dayValueArr.forecasts[0].airpressure);
                            $boxForecast.find('.now-wind').text(city._ossTmp.dayValueArr.forecasts[0].windspeed);
                            $boxForecast.find('.now-wind').text(city._ossTmp.dayValueArr.forecasts[0].windspeed);
                            $boxForecast.find('.now-icon-weather-symbol').html('<span class="icon icon-meteo-' + nowSymbol + '" role="img"><svg><title>meteo-' + nowSymbol + ' icon</title><use xmlns:xlink="https://www.w3.org/1999/xlink" xlink:href="/static/theme-repo/dist/assets/svg/icons-meteo.svg#icon-meteo-' + nowSymbol + '"></use><use xmlns:xlink="https://www.w3.org/1999/xlink" xlink:href="#icon-meteo-' + nowSymbol + '"></use></svg></span>');

                            $boxForecast.find('.next-tomorrow-day').text(tomorrowDayTemp);
                            $boxForecast.find('.next-tomorrow-night').text(tomorrowNightTemp);

                            $boxForecast.find('.next-tomorrow-day-symbol').html('<span class="icon icon-meteo-' + tomorrowDaySymbol + '" role="img"><svg><title>meteo-' + tomorrowDaySymbol + ' icon</title><use xmlns:xlink="https://www.w3.org/1999/xlink" xlink:href="/static/theme-repo/dist/assets/svg/icons-meteo.svg#icon-meteo-' + tomorrowDaySymbol + '"></use><use xmlns:xlink="https://www.w3.org/1999/xlink" xlink:href="#icon-meteo-' + tomorrowDaySymbol + '"></use></svg></span>');

                            if ($boxForecast.length) {
                                var top = $boxForecast.offset().top - $('header').height();
                                $('html,body').animate({scrollTop: top}, 500);
                                return false;
                            }

                        });

                    });
                }
            };

        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Populate "appForecastWidgets" with video init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appForecastWidgets').addCallback(
        appEngine.definitionGet('app.utils.initForecastEngine')
    );
})(appEngine, $);



/**
 * Decorate AppEngine with 'app.utils.initShowsFormEngine'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initShowsFormEngine',
        (function (appEngine, $, undefined) {
            return function ($jqCollection) {
                if ($jqCollection.length) {
                    $jqCollection.each (function (el) {
                        var $this = $(this);
                        $this.find('select[name="showCat"]').on('change', function (e) {
                            var url = $(this).val();
                            if (url) {
                                window.location.href = url;
                            }
                        });
                    });
                }
            };

        })(appEngine, $)
    );
})(appEngine, $);

/*
*  Decorate AppEngine with 'app.utils.initTvStarsFormEngine'
*
* */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initTvStarsFormEngine',
        (function ( appEngine, $, undefined) {
            return function ($jqCollection) {
                if($jqCollection.length) {
                    var starsContainer = $(".tv-stars-container");

                    $jqCollection.each (function (el) {
                        var $this = $(this);
                        $this.find('select[name="showCat"]').on('change', function (e) {
                            e.preventDefault();

                            var section = $("select[name='showCat'] option:selected").data("section").toString();

                            if (section == "") {
                                starsContainer.find("article.tv-star").show();
                            } else {
                                starsContainer.find("article.tv-star").hide();
                                starsContainer.find("article." + section).show();
                            }
                        });
                    });
                }
            }
        })(appEngine, $)
    )
})(appEngine, $);


/**
 * Populate "appShowsFormWidgets" with shows form init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appShowsFormWidgets').addCallback(
        appEngine.definitionGet('app.utils.initShowsFormEngine')
    );
})(appEngine, $);

/**
 * Populate "appTvStarsFormWidgets with tv stars filtering callback"
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appTvStarsFormWidgets').addCallback(
        appEngine.definitionGet('app.utils.initTvStarsFormEngine')
    );
})(appEngine, $);


/**
 * Add registry "appDigiVoxFormWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appDigiVoxFormWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Decorate AppEngine with 'app.utils.initDigiVoxFormEngine'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initDigiVoxFormEngine',
        (function (appEngine, $, undefined) {
            return function ($jqCollection) {
                if ($jqCollection.length) {
                    $jqCollection.each (function (el) {
                        var $this = $(this);
                        (function ($this) {
                            var $upload = $this.find('#upload-file');
                            if ( ! $upload.length) {
                                return;
                            }
                            var cfg = $.parseJSON($.trim($upload.find('#upload-cfg').html()));
                            var w = $upload.width() - 4;
                            var ls = [];
                            var addToFileList = (function ($this) {
                                return function (url, file) {
                                    ls.push(url);
                                    $this.find('#input4').val(ls.join(','));
                                }
                            })($this);
                            var widget = $this.find('#upload-file').uploadFile({
                                url : cfg.fileUploadUrl,
                                fileName : cfg.fileName,
                                statusBarWidth : w,
                                dragdropWidth : w,
                                customErrorKeyStr : 'jquery-upload-file-error',
                                fileCounterStyle : ') ',
                                returnType : "json",
                                onSuccess : function (files, data, xhr, pd) {
                                    addToFileList(data['data'], files[0]);
                                    // console.log('ON-SUCCESS', data['data']);
                                },
                                dragDrop: false,
                                multiple : false,
                                showDelete: false // if is true, refactory the code to eliminate the uploaded file
                            });
                            $this.on('submit', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                var data = $(this).serialize();
                                var url = $(this).attr('action');
                                var xhr = $.ajax({
                                    url: url,
                                    method: 'POST',
                                    data: data,
                                });
                                xhr.done( function (rsp) {
                                    if ( ! rsp.success) {
                                        var msg = "Unul sau mai multe campuri nu au fost completate corect!";
                                        //var msg = 'Error sending data! ';
                                        //msg += (rsp['ajax-submit-error'] || 'Unknown error!');
                                        window.alert(msg);
                                    } else {
                                        window.alert('Success sending data!');
                                        window.location.href = window.location.href;
                                    }
                                });
                                xhr.fail( function (jqXHR, textStatus, errorThrown) {
                                    window.alert('Error sending contact data! Invalid response!');
                                });
                            });

                        })($this);
                    });
                }

            };

        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Add registry "appStickyWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appStickyWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Decorate AppEngine with 'app.utils.initStickyWidgets'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initStickyWidgets',
        (function (appEngine, $, undefined) {
            return function ($jqCollection) {
                if ($jqCollection.length) {
                    $jqCollection.each (function (el) {

                        console.error("Please remove me!");
                        var $this = $(this);
                        (function ($this) {

                            var arraySticky   = $('#sticky').attr('class');

                            if(typeof arraySticky !== "undefined") {
                                arraySticky = arraySticky.split(" ");
                                var classSticky = "." + arraySticky[arraySticky.length - 2] + "." + arraySticky[arraySticky.length - 1];
                            }

                            if(Cookies.get('stickyCookie') != classSticky) {
                                Cookies.set('stickyCookie', classSticky, {expires: 0, path: '/'});
                                $(classSticky).show();
                            }
                            
                            $document.find(classSticky).on('click', '#sticky-close', function(e) {
                                $(classSticky).hide();
                                Cookies.set('stickyCookie',classSticky, { expires: 365, path: '/' });
                                e.preventDefault();
                            });

                        })($this);
                    });
                }

            };

        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Populate "appStickyWidgets" with multi-file-plugin init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appStickyWidgets').addCallback(
        appEngine.definitionGet('app.utils.initStickyWidgets')
    );
})(appEngine, $);



/**
 * Populate "appDigiVoxFormWidgets" with multi-file-plugin init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appDigiVoxFormWidgets').addCallback(
        appEngine.definitionGet('app.utils.initDigiVoxFormEngine')
    );
})(appEngine, $);


/**
 * Decorate AppEngine with 'app.utils.initDigiVoxFormEngine'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initContactInContainer',
        (function (appEngine, $, undefined) {
            return function ($jqCollection) {
                if ($jqCollection.length) {
                    $jqCollection.each (function (el) {
                        var $this = $(this);
                        (function ($this) {
                            $this.on('click', '.nav-link', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                var $that = $(this);
                                var $nav = $that.closest('.nav-pills');
                                $nav.find('.nav-link').removeClass('active');
                                $that.addClass('active');
                                var $tgMap = $this.find('#' + $that.attr('data-target-map'));
                                var $tgInfo = $this.find('#' + $that.attr('data-target-info'));
                                $tgInfo.parent().children().hide();
                                $tgInfo.show();
                                $tgMap.show();
                            })
                        })($this);
                    });
                }
            };
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Decorate AppEngine with 'app.utils.initContactInContainerMob'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initContactInContainerMob',
        (function (appEngine, $, undefined) {
            return function ($jqCollection) {
                if ($jqCollection.length) {
                    $jqCollection.each (function (el) {
                        var $this = $(this);

                        (function ($this) {
                            $this.on('change', '.form-control', function (e) {
                                var $that = $(this);
                                var $current = $that.find('option:selected');
                                var $tgMap = $current.attr("data-target-map");
                                var $tgInfo = $current.attr("data-target-info");

                                $('.app-item-info, .app-item-map ').removeClass('active');

                                $('#' + $tgMap).addClass('active');
                                $('#' + $tgInfo).addClass('active');
                            })
                        })($this);
                    });
                }
            };
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Add registry "appContactWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appContactWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Populate "appContactWidgets" with contact info init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appContactWidgets').addCallback(
        appEngine.definitionGet('app.utils.initContactInContainer')
    );
})(appEngine, $);

/**
 * Add registry "appContactWidgetsMob"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appContactWidgetsMob',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Populate "appContactWidgetsMob" with contact info init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appContactWidgetsMob').addCallback(
        appEngine.definitionGet('app.utils.initContactInContainerMob')
    );
})(appEngine, $);



/**
 * Add registry "appContactFormWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appContactFormWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);




/**
 * Add registry "appTvChannelsWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appTvChannelsWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Add registry "appTvStarsWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appTvStarsWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Decorate AppEngine with 'app.utils.initDigiVoxFormEngine'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initNavigationDigi24CodeContainer',
        (function (appEngine, $, undefined) {
            return function ($jqCollection) {
                if ($jqCollection.length) {
                    $jqCollection.each (function (el) {
                        var $this = $(this);
                        $this.find('select[name="station"]').on('change', function (e) {
                            var v = $(this).val();
                            if (v.indexOf('http') === 0) {
                                var win = window.open(v, '_blank');
                                win.focus();
                            } else {
                                document.location.href = v;
                            }
                        });
                    });
                }
            };
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Decorate AppEngine with 'app.utils.filterTvStars'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.filterTvStars',
        (function (appEngine, $, undefined) {
            return function ($jqCollection)
            {
                var starsContainer = $(".tv-stars-container");

                $jqCollection.on("click", ".filter-star", function(e)
                {
                    //console.log("click", $(this).html(), $(this).data("section"));
                    e.preventDefault();
                    var section = $(this).data("section").toString();

                    if (section == "") {
                        starsContainer.find("article.tv-star").show();
                    } else {
                        starsContainer.find("article.tv-star").hide();
                        starsContainer.find("article." + section).show();
                    }

                    $jqCollection.find("a.active").removeClass('active');
                    $(this).addClass('active');

                });

            };
        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Populate "appTvChannelsWidgets" with contact info init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appTvChannelsWidgets').addCallback(
        appEngine.definitionGet('app.utils.initNavigationDigi24CodeContainer')
    );
})(appEngine, $);

/**
 * Populate "appTvStarsWidgets" with contact info init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appTvStarsWidgets').addCallback(
        appEngine.definitionGet('app.utils.filterTvStars')
    );
})(appEngine, $);



/**
 * Decorate AppEngine with 'app.utils.initDigiVoxFormEngine'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initFormContactInContainer',
        (function (appEngine, $, undefined) {
            return function ($jqCollection) {
                if ($jqCollection.length) {
                    $jqCollection.each (function (el) {
                        var $this = $(this);
                        (function ($this) {
                            $this.on('submit', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                var data = $(this).serialize();
                                var url = $(this).attr('action');
                                var xhr = $.ajax({
                                    url: url,
                                    method: 'POST',
                                    data: data,
                                });
                                xhr.done( function (rsp) {
                                    if ( ! rsp.success) {
                                        //var msg = 'Error sending data! ';
                                        //msg += (rsp['ajax-submit-error'] || 'Unknown error!');
                                        var msg = "Unul sau mai multe campuri nu au fost completate corect!";
                                        window.alert(msg);
                                    } else {
                                        window.alert('Success sending data!');
                                        window.location.href = window.location.href;
                                    }
                                });
                                xhr.fail( function (jqXHR, textStatus, errorThrown) {
                                    window.alert('Error sending contact data! Invalid response!');
                                });
                            });
                        })($this);
                    });
                }
            };
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Populate "appContactFormWidgets" with contact info init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appContactFormWidgets').addCallback(
        appEngine.definitionGet('app.utils.initFormContactInContainer')
    );
})(appEngine, $);







/**
 * Add registry "appNewsletterFormWidgets"
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.registrySet(
        'appNewsletterFormWidgets',
        (function (appEngine, $, undefined) {
            return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
        })(appEngine, $)
    );
})(appEngine, $);

/**
 * Decorate AppEngine with 'app.utils.initDigiVoxFormEngine'
 *
 */
(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.initNewsletterFormEngine',
        (function (appEngine, $, undefined) {
            return function ($jqCollection) {
                if ($jqCollection.length) {
                    $jqCollection.each (function (el) {
                        var $this = $(this);
                        (function ($this) {
                            $this.on('submit', function (e) {
                                e.preventDefault();
                                e.stopPropagation();

                                //disable submit button before getting a response
                                $this.find('input[name=sbm]').prop("disabled", true);

                                var data = $(this).serialize();
                                var url = $(this).attr('action');
                                var xhr = $.ajax({
                                    url: url,
                                    method: 'POST',
                                    data: data,
                                });
                                xhr.done( function (rsp) {
                                    if ( ! rsp.success) {
                                        var msg = 'A aparut o eroare! Incercati din nou!';

                                        if (rsp["ajax-submit-error"] && rsp["ajax-submit-error"]["email"]) {
                                            if (rsp["ajax-submit-error"]["email"]["isEmpty"]) {
                                                msg = "Adresa de mail este obligatorie!";
                                            } else {
                                                msg = rsp["ajax-submit-error"]["email"]["callbackValue"] || msg;
                                            }
                                        }

                                        window.alert(msg);

                                    } else {
                                        window.alert('Multumim pentru abonare la newsletterul Digi24!');
                                        $this.get(0).reset();
                                    }
                                });
                                xhr.fail( function (jqXHR, textStatus, errorThrown) {
                                    window.alert('A aparut o eroare! Incercati din nou!');
                                });
                                xhr.always( function (jqXHR, textStatus, errorThrown) {
                                    //enable submit button once the response is handled
                                    $this.find('input[name=sbm]').prop("disabled", false);
                                })
                            });

                        })($this);
                    });
                }

            };

        })(appEngine, $)
    );
})(appEngine, $);


/**
 * Populate "appNewsletterFormWidgets" with multi-file-plugin init callback
 *
 */
(function (appEngine, undefined) {
    // 'use strict';
    appEngine.registryGet('appNewsletterFormWidgets').addCallback(
        appEngine.definitionGet('app.utils.initNewsletterFormEngine')
    );
})(appEngine, $);


(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.appAnalyticsV2',

        (function (appEngine, $, undefined) {
            return function ($articleJqColl) {

                console.error('This callback is not allowed anymore');
                return;

                // console.log('APP-ANALYTICS: start');

                var articleMetadata = $articleJqColl.find("#article-meta-data").html();

                if ( ! articleMetadata) {
                    // console.log('APP-ANALYTICS: stop, warn');
                    return;
                }

                articleMetadata = $.parseJSON(articleMetadata);

                console.log('APP-ANALYTICS-OLD: article-metadata', articleMetadata);

                if (! articleMetadata) {
                    console.error("Invalid json article metadata", articleMetadata);
                    return;
                }

                if ( typeof window.i == 'undefined') {
                    window.i = 1;
                }
                // console.log('APP-ANALYTICS: index IAS', window.i);

                if (window.i > 1) {
                    //google tag manager
                    dataLayer.push(articleMetadata.gtm);

                    // console.log('APP-ANALYTICS: data-layer', dataLayer[0]);
                }
                window.i++;

                // console.log('APP-ANALYTICS: stop, ok');
            }
        })(appEngine, $)

    );
})(appEngine, $);

(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.appAnalyticsGtmPing',
        (function (appEngine, $, undefined) {
            var contentHasLoaded = false;
            return {
                handleByGtmCfg: function (cfg) {
                    console.log('--CALL--', 'handleByGtmCfg', cfg);
                    if (this.canPing()) {
                        console.log('GTM-ANALYTICS: (re)ping views - on the road');
                        dataLayer.push(cfg);
                        dataLayer.push({'event':'content loaded'});
                    } else {
                        console.log('GTM-ANALYTICS: (re)ping views - not allowed for first entity');
                    }
                },
                canPing: function () {
                    if ( ! contentHasLoaded) {
                        contentHasLoaded = true;
                        return false;
                    }
                    return true;
                }

            };
        })(appEngine, $)
    );
})(appEngine, $);


(function (appEngine, $, undefined) {
    // 'use strict';
    appEngine.definitionSet(
        'app.utils.appAnalyticsPageMetaPingV2',
        (function (appEngine, $, undefined) {
            return {
                randomNumber: 1,
                handleByMetaCfg: function (cfg) {
                    console.log('--CALL--', 'handleByMetaCfg', cfg);
                    if (cfg
                        && cfg.section
                        && (
                            "article" == cfg.section
                            || "article/video" == cfg.section
                            || "article/embed" == cfg.section
                        )
                    ) {
                        if (this.canPing()) {
                            console.log('APP-ANALYTICS: ping views - on the road');

                            if (this.randomNumber) {
                                cfg.random = this.randomNumber;
                            }

                            if (document.referrer) {
                                cfg.referrer = document.referrer;
                            }

                            $.ajax({
                                url: '//wzg.digi24.ro/index.php?postID=' + parseInt(cfg.identity),
                                data: cfg,
                                method: 'get'
                            });

                        } else {
                            console.log('APP-ANALYTICS: ping views - not allowed by throttle');
                        }
                    } else {
                        console.log('APP-ANALYTICS: ping views - not allowed for non-article');
                    }
                },
                canPing: function () {
                    var a = Math.floor((Math.random() * parseInt(this.randomNumber)) + 1);
                    if (a == this.randomNumber) {
                        return true;
                    }
                    return false;
                }

            };
        })(appEngine, $)
    );
})(appEngine, $);





/* ------------------------------------------------------------------------------------------------------------------ */
/* -- STOP -- IAD contributors -------------------------------------------------------------------------------------- */
/* -- STOP -- WEBADMIN addons :) ------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------ */

/**
 * @INFO Added JS redirect for google shield
 */
(function () {

    if ( ! appEngine) {
        return;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");
        if( value === undefined ) {
            if (uri.match(re)) {
                return uri.replace(re, '$1$2');
            } else {
                return uri;
            }
        } else {
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            } else {
                var hash =  '';
                if( uri.indexOf('#') !== -1 ){
                    hash = uri.replace(/.*#/, '#');
                    uri = uri.replace(/#.*/, '');
                }
                var separator = uri.indexOf('?') !== -1 ? "&" : "?";
                return uri + separator + key + "=" + value + hash;
            }
        }
    }


    if (appEngine.definitionGet('app.utils.isEnvWithRedirActive')()) {

        console.log('APP ENGINE redir active');

        var pSc = '__grsc';
        var pTs = '__grts';
        var pUa = '__grua';
        var pRn = '__grrn';

        if (window.location.search.indexOf(pSc) < 0) {

            var gotomCookie = getCookie('m2digi24ro');

            var oldUrl = window.location.href;
            var newUrl;

            var valUserAgent    = '1';                                                          // default User Agent
            var valUniqueStr    = '1'; // appEngine.definitionGet('app.utils.randomstr')(10);   // default unique str
            var valTime         = parseInt(parseInt((new Date()).getTime()) / (30 * 1000));     // default timestamp / 30 (cache for 30 secs = 30.000 milisecs)

            try {
                valUserAgent = appEngine.definitionGet('app.utils.md5')(window.navigator.userAgent);
            } catch (e) {
                valUserAgent = '0';
            }

            var uqsp = function (str, param, val) {
                return updateQueryStringParameter(str, param, val);
            };

            switch (gotomCookie) {

                case '1' :
                    console.log('APP ENGINE redir cookie 1');
                    if ( ! appEngine.definitionGet('app.utils.isMobileEnv')()) {
                        newUrl = uqsp(uqsp(uqsp(uqsp(oldUrl, pSc, 'cookieIsMobile'), pTs, valTime), pUa, valUserAgent), pRn, valUniqueStr);
                    }
                    break;

                case '0' :
                    console.log('APP ENGINE redir cookie 0');
                    if (appEngine.definitionGet('app.utils.isMobileEnv')()) {
                        newUrl = uqsp(uqsp(uqsp(uqsp(oldUrl, pSc, 'cookieIsDesktop'), pTs, valTime), pUa, valUserAgent), pRn, valUniqueStr);
                    }
                    break;

                default:
                    console.log('APP ENGINE redir cookie none');
                    if (appEngine.definitionGet('app.utils.isMobileEnv')()) {
                        newUrl = uqsp(uqsp(uqsp(uqsp(oldUrl, pSc, 'cookieIsUndef1'), pTs, valTime), pUa, valUserAgent), pRn, valUniqueStr);
                    } else {
                        newUrl = uqsp(uqsp(uqsp(uqsp(oldUrl, pSc, 'cookieIsUndef0'), pTs, valTime), pUa, valUserAgent), pRn, valUniqueStr);
                    }
                    break;
            }

            if (newUrl) {
                window.location.href = newUrl;
            }
        }
    }

})();

$(function () {
    if (! appEngine) {
        return;
    }

    //
    // @INFO article init ("#article-content article" container)
    //
    // @IMPORTANT It runs over the article container (it runs first at page load, an after this it runs at infinite scroll at custom IAS event "rendered")
    //
    // @date 2016-09-20 Callbacks contained:
    // - initVideoInContainer (init video)
    // - initIframeInContainer (init iframe)
    // - initAnalyticsInternalPingInContainer (init view counter)
    // - initAnalyticsGtmContainer (init gtm)
    //
    // - initNavigationDigi24CodeContainer
    appEngine.registryGet('appArticleWidgets').runOver($('#article-content').find('article:first'));

    appEngine.registryGet('appArticleWidgets').runOver($('#article-content').find('.video-show'));

    // @INFO embed article init ("#articles-embed .app-video-embed" container)
    //
    // @IMPORTANT It runs over the embed article container (it runs only at page load)
    //
    // - initVideoInContainer (init video)
    //
    appEngine.registryGet('appArticleEmbedWidgets').runOver($('#articles-embed').find('.app-video-embed'));

    //
    // @INFO live init (".live-page" container) AND video article
    // @IMPORTANT It runs over the live container (it runs only at page load)
    //
    // - initVideoInContainer (init video)
    //
    appEngine.registryGet('appLiveWidgets').runOver($('.live-page'));

    appEngine.registryGet('appLiveHomepageWidgets').runOver($('#video-section-live-news'));

    appEngine.registryGet('appInterviewHomepageWidgets').runOver($('#video-section-interview-news'));

    // @IMPORTANT It runs over the live container (it runs only at page load)
    //
    // @date 2016-09-20 It contained:
    // - initVideoInContainer (init video)
    //
    // @INFO live section form submit (window redirect with seo-url for tv stations)
    //
    appEngine.registryGet('appStickyWidgets').runOver($('#sticky'));

    // @INFO live section form submit (window redirect with seo-url for tv stations)
    appEngine.registryGet('appLiveFormWidgets').runOver($('form#form-live'));

    appEngine.registryGet('appForecastWidgets').runOver($('#forecast-cfg'));

    // @INFO shows section form submit (window redirect with seo-url for shows categories)
    appEngine.registryGet('appShowsFormWidgets').runOver($('form#form-shows'));

    // @INFO tv stars section filtering by shows categories
    appEngine.registryGet('appTvStarsFormWidgets').runOver($('form#form-tv-stars'));

    // @INFO digi-vox form (multi upload + ajax submit)
    appEngine.registryGet('appDigiVoxFormWidgets').runOver($('form#form-digivox'));

    // @INFO map widget (fake tabs)
    appEngine.registryGet('appContactWidgets').runOver($('#app-widget-contact'));

    // @INFO contact form (ajax submit)
    appEngine.registryGet('appContactFormWidgets').runOver($('form#form-contact'));

    // @INFO map widget (select option)
    appEngine.registryGet('appContactWidgetsMob').runOver($('#app-widget-contact-mob'));

    // @INFO newsletter form (ajax submit)
    appEngine.registryGet('appNewsletterFormWidgets').runOver($('form#form-newsletter-footer'));

    // @INFO Digi24CodeSection section form submit (window redirect with seo-url for Tv Channels )
    appEngine.registryGet('appTvChannelsWidgets').runOver($('form#form-tv-channels'));


    appEngine.registryGet('appTvStarsWidgets').runOver($('div.tv-stars-handler'));

    // @INFO        Trigger article view (article analytics)
    // @IMPORTANT   Not required here because is triggered inside article (and on IAS render infinite scroll also)
    // @INFO        Not in use since 20.09.2016  (@author Traian.B)
    // appEngine.definitionGet('app.utils.appAnalyticsPageMetaPingV2').handleByMetaCfg(window.appPageMeta || {});


    //
    // (function (appEngine, $, undefined) {
    //     // 'use strict';
    //     appEngine.registrySet(
    //         'appArticleWidgets',
    //         (function (appEngine, $, undefined) {
    //             return (appEngine.definitionGet('app.utils.factoryJQueryRunnableContainerSet'))();
    //         })(appEngine, $)
    //     );
    // })(appEngine, $);

});