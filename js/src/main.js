$(window).on('gesturechange', function(e){ 
    MKON.LAYOUT.resize();
});

$(window).resize(function() {
    MKON.LAYOUT.resize();
});

var isMobile = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    isMobile = true;
    document.body.className = document.body.className + ' isMobile';
}

$(document).ready(function() {

    MKON.init();
    alertify.set({ buttonReverse: true });
    

    // Add Modules Open Button
    $('#openList').fastClick(function() {

        if (MKON.LAYOUT.locked) {
            MKON.LAYOUT.unlock();

        }
        MKON.LAYOUT.closeMenu();
        MKON.LAYOUT.openList();

        return false;

    });

    // Add Modules Close Button
    $('#closeButton').fastClick(function() {
        MKON.LAYOUT.closeList();
        return false;
    });

    // Import/Export Button
    $('#exportModules').fastClick(function() {

        MKON.LAYOUT.serialize();
        MKON.LAYOUT.openOverlay();

        alertify.set({ labels: {
            ok     : "IMPORT",
            cancel : "CANCEL"
        } });

        alertify.prompt("<i class=\"fa fa-import-export\"></i> &nbsp; IMPORT / EXPORT", function (e,str) {
            if (e) {
                MKON.LAYOUT.closeOverlay();   

                console.log(str);
                // Check if a valid input
                if (str != '' && typeof str !== 'undefined' && str != '[]') {                     
                    MKON.LAYOUT.generate(JSON.parse(str), true);  
                }        


            } else {
                MKON.LAYOUT.closeOverlay();
            }
        }, JSON.stringify(MKON.LAYOUT.currentLayout) );

        alertify.set({ labels: {
            ok     : "OK",
            cancel : "CANCEL"
        } });

        return false;
    });



    // Clear button
    $('#clearModules').fastClick(function() {

        MKON.LAYOUT.initGridster();

        if (MKON.CONTENT.activeModules.length > 0) {          

            // confirm dialog
            MKON.LAYOUT.openOverlay();

            alertify.confirm("<i class=\"fa-clear fa\"></i> &nbsp; Clear ALL modules?", function (e) {

                if (e) {
                    MKON.LAYOUT.clear();
                    MKON.LAYOUT.save();
                    
                } else {}
                MKON.LAYOUT.closeOverlay();

            });
        

        } else {
            alertify.alert('No modules!');
        }

        return false;

    });

    // Mobile Menu Toggle
    $('#mobileMenu').fastClick(function() {
        MKON.LAYOUT.toggleMenu();     
    });

    // Lock/Unlock Button Toggle
    $('#lockUnlock').fastClick(function() {

        if (MKON.LAYOUT.locked) { 
            MKON.LAYOUT.unlock();   


        } else {
            MKON.LAYOUT.lock();
        }

        return false;

    });

    // Add buttons for modules in gui
    $('#moduleContainer .addButton').fastClick(function(e) {
      
        var button = $(this).parent();
        var moduleLink = button.data('link');
        var config = {'u':moduleLink};
        MKON.allowSave = true;        

        MKON.CONTENT.getModule(moduleLink, config);
        return false;

    });
     
    // Search Filter list for AddModule Overlay
    $("#filterButton").on("change", function() {  
        var moduleContainer = $('#moduleContainer');
        var val = this.value;      
        moduleContainer.removeClass();
        switch(val)
        {
            case "all":            
            break;

            case "buttons":
            moduleContainer.addClass('show-button');           
            break;

            case "screens":
            moduleContainer.addClass('show-screen');
            break;

            case "resources":
            moduleContainer.addClass('show-resource');
            break;

            case "dials":
            moduleContainer.addClass('show-dial');
            break;

            case "scales":
            moduleContainer.addClass('show-scale');
            break;

            case "utility":
            moduleContainer.addClass('show-utility');
            break;

            default:
            
        }
    });

    // Remove buttons on active modules
    $('#gridster').on('fastClick', '.remove', function (e) {       
        var parent = $(e.target).closest('li');
        MKON.CONTENT.removeModule(parent);
        MKON.LAYOUT.save();

        return false;
    }); 

    // Buttons that have commands that require it to be held down
    $('#gridster').on('touchstart mousedown', '.command-hold', function(e){

        if (MKON.LAYOUT.locked) {

            var el = $(this);
            var com = el[0].getAttribute('data-com') || false;

            if (!com) {} else {
                MKON.COMMS.repeatCommand(true, com);
            } 
        }
        
    });

    $('#gridster').on('touchend mouseup', '.command-hold', function(e){

        if (vMKON.LAYOUT.locked) {

            MKON.COMMS.repeatCommand(false);  

        }  

    });

    // Buttons that have commands attached
    $('#gridster').on('fastClick', '.command', function(e) {

        if (MKON.LAYOUT.locked) {

            var el = $(this);
            var button = $(this).find('a.button') || false;
            var com = el[0].getAttribute('data-com') || false;

            if (!com) {} else {
                MKON.COMMS.command(com);
            } 

            if (!button) {} else {

                // Ignore for non toggle buttons 
                if (!(button.hasClass('no-toggle')) || !(button.hasClass('action') || !(button.hasClass('abort'))) )  {
                    button.toggleClass('gray');  
                }   
            } 
        }       

    })


});

// Localstorage utility functions
Storage.prototype.setObj = function(key, obj) {
    var o = obj || 'Null';
    return this.setItem(key, JSON.stringify(o))
}

Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var MKON = new Object();

MKON = { 

    // Config
    debug: true, // only if you like seeing console spam
    controls: true, // set to false to disable remote control
    rate: 75, // set the starting recieve rate for data   
    cacheString: 'MKON', // change to a new string to start a new cache
    datalink:  "ws://" + window.location.host + "/datalink",  // default web socket address (using ip used to access ui)  
    defaults: { // any default key/values you want to send when the ui is started
        "+": ['v.name', 'p.paused', 'a.version'],
        "rate": this.rate
    },
    // Dont touch these...
    localStorageSupport: false,
    versionCheck: false, 
    requiredVersion: '1.4.21.0',
    allowSave: true, 

    init: function() {      

        this.COMMS.init(this.datalink, this.defaults);
        this.LAYOUT.init();
    },

    // Structure for a standard module
    module: function(name, type, id, req, handle, command) {    
            this.name = name;
            this.type = type;
            this.id = id;
            this.req = req || [''];
            this.handleData = handle;    
            this.url = '';
            this.col = "100"; // defaults to a high value to force it to 'stack' and gap fill
            this.row = "100";
    },

     // Websocket Server Interactions 
    COMMS: {

        ws: '',
        active: false,
        paused: false,
        received: false,   
        overflowList: [],   
        overflowActive: false, 
        overflowAttempts: 0,                  
        maxOverflowAttempts: 100,     
        repeater: false,  
        repeaterCommand: '', 

        init: function(datalink, defaults) {        

            // Check if we can use web sockets
            if ("WebSocket" in window) {
                
                try {

                    ws = $.gracefulWebSocket(datalink);
        
                    if (MKON.debug) { console.log('Websockets supported!'); };

                    ws.onopen = function(evt) {

                        if (MKON.debug) { console.log('Connection established!'); };

                        ws.send(JSON.stringify(defaults));  
                    };

                    ws.onmessage = function(evt) {

                        if (MKON.debug) { 
                            // only enable if you like spam
                            console.log("Received Data" + evt.data); 
                        };

                        MKON.CONTENT.filterData(evt.data);

                        // Version Check 
                        if (!MKON.versionCheck && MKON.COMMS.active) { // if version hasnt been checked and connection is active
                           
                            var v = MKON.CONTENT.getVariable('a.version');

                            if (typeof v !== 'undefined') {

                                if (MKON.debug) {
                                    console.log('Telemachus version: ' + MKON.CONTENT.getVariable('a.version'));  
                                }
                                
                                if (v == MKON.requiredVersion) {
                                    
                                    if (MKON.debug) { console.log('Version is ok.');  }  
                                    MKON.COMMS.unsubscribe(['a.version']);                             

                                } else {
                             
                                    alertify.log("<i class='fa fa-warning'></i> &nbsp; VERSION MISMATCH", "", 1200);

                                    MKON.COMMS.unsubscribe(['a.version']);                               
                                }

                                MKON.versionCheck = true;                               

                            }                           
                        }

                        MKON.COMMS.active = true;
                    };  

                    ws.onerror = function(err) {

                        console.log("Error: " + err.data);

                        MKON.COMMS.active = false;

                    };

                    ws.onclose = function(evt) { if (MKON.debug) { console.log("Connection closed."); };  MKON.COMMS.active = false; };

                    
                } 
                catch (error) {
                    console.log(error);
                    return false;
                }


            } else {
                if (MKON.debug) { console.log('Websockets not supported'); }
            }        

        },

        // gets a value (one time use)
        get: function(v) {

            if (this.active) {
                
                if (MKON.debug) { console.log('Getting: ' + v); };

                ws.send(JSON.stringify({
                        "run": [ v ]
                }));    
            } 
        },

        // sets the data rate
        rate: function(v) {

            if (this.active) {
                
                if (MKON.debug) { console.log('Changing rate to: ' + v); };

                ws.send(JSON.stringify({
                        "rate": v
                }));

                MKON.currentRate = v;

            } else {
                this.overflow(v,'rate');
            }

        },

        subscribe: function (v) {

            if (this.active) {                

                if (MKON.debug) {  console.log('Subscribing: ' + v); };

                ws.send(JSON.stringify({
                        "+": v
                }));

            } else {

                this.overflow(v,'+');
            }
        },

        unsubscribe: function (v) {

            if (this.active) {

                if (MKON.debug) {  console.log('Unsubscribing: ' + v); };

                ws.send(JSON.stringify({
                        "-": v
                }));

            }  else {

                this.overflow(v,'-');
            }
        },

        // Repeats a command while a button is under a mousedown event
        repeatCommand: function(state, command) {

            this.repeater = state
            this.repeaterCommand = command || '';

            if (this.repeater) {

                if (MKON.debug) { console.log('Starting command repeater'); }

                function repeater() {

                    var com = com;

                    if (MKON.debug) { console.log('Sending command'); }

                    if (MKON.COMMS.repeater) {

                        MKON.COMMS.command(MKON.COMMS.repeaterCommand);
                        setTimeout(repeater, 75);

                    } else {

                        if (MKON.debug) { console.log('Ending repeater'); }
                    }                        
                }

                repeater(command);

            } else {}

        },

        command: function (c) { 
            
            if (MKON.controls) {

                if (MKON.LAYOUT.locked && this.active) {

                    this.active = false; // wait for at least one reply per command    

                    ws.send(JSON.stringify({
                        "run": [ c ]
                    }));

                } else if (MKON.LAYOUT.locked && !this.active) {

                    // connection is idle and layout isnt locked
                    //this.overflow( c ,'run');

                } else {

                    // layout unlocked - ignore

                }
            }
        },

        // For stacking api calls if the websocket server drops out periodically
        overflow: function(data, type) {
            

            var entry = [ type, data ];

            this.overflowList[this.overflowList.length] = entry;

            if (this.overflowList.length > 0 && !this.overflowActive) {

                if (MKON.debug) { console.log('Overflow Active'); };

                this.overflowActive = true;  

                function waitUntilActive() {

                    if (MKON.COMMS.active){
                        MKON.COMMS.clearOverflow();  
                        MKON.COMMS.overflowActive = false; 
                        MKON.COMMS.overflowAttempts = 0;       
                    } else if (MKON.COMMS.overflowAttempts < MKON.COMMS.maxOverflowAttempts) {
                        MKON.COMMS.overflowAttempts++;
                        setTimeout(waitUntilActive, MKON.rate);
                    } else {
                        console.log('Overflow timed out!');
                    }
                }

                waitUntilActive(); 
            }
        },

        // Sends all cached commands
        clearOverflow: function() {

            if (MKON.debug) { console.log('Overflow Deactivated. '); };

            for (var i = 0; i< this.overflowList.length; i++) {

                var c = this.overflowList[i][0];
                var v = this.overflowList[i][1];
                if (c == "+") {
                    this.subscribe(v);
                } else if (c == "-") {
                    this.unsubscribe(v);
                } else if (c == "run" && MKON.LAYOUT.locked) {
                    this.command(v);
                } else if (c == "rate") {
                    this.rate(v);
                }
            }

            this.overflowList = [];
        }

    },

    // Save, setup templates and ui interactions (key binding etc)
    LAYOUT: {

        locked: false,
        gridster:'',
        gridMargins: 4, // 4
        gridWidth: 112, // 112
        defaultCol: 100, // 100
        defaultRow: 100, // 100
        startCol: 100, // 100
        startRow: 100, // 100
        currentWidget: '',
        gridsterDOM: $( document.getElementById('gridster') ),
        gridsterWrapper: $( document.getElementById('gridsterWrapper') ),
        removeZone: $( document.getElementById('removeZone') ),
        lockUnlockWrapper: $( document.getElementById('lockUnlockWrapper') ),
        lockUnlockBtnIcon: $( document.getElementById('lockUnlockBtnIcon') ), 
        overlayWrapper: $( document.getElementById("overlayWrapper") ),
        moduleList: $( document.getElementById("moduleList") ),
        logo:$(document.getElementById("logo") ),
        menu:$(document.getElementById("menu") ),
        header: $( $('header') ),
        currentLayout: [],
        prevLayout: false,
        viewportWidth: 0,
        viewportHeight: 0,
        removeZoneLimit: 0,

        init: function() {

            // Resize the gridster ul according to window size   


            this.resize();        
            this.initGridster();    
            this.gridster = $("#gridster").gridster().data('gridster');           
            this.setup();
            this.unlock();          


        },

        resize: function() {

            // Recalculate page width/height and store
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            MKON.LAYOUT.viewportWidth = windowWidth;
            MKON.LAYOUT.viewportHeight = windowHeight;

            // Use new width to ascertain a limit on cols
            var cols = (Math.floor(windowWidth/this.gridWidth) ) - 1;

            // The total width with new columns/widths;
            var totalWidth = cols * this.gridWidth;

            // Total gridster width needed with margins
            var margins = (this.gridMargins*2) * cols;

            // The offset needed each side
            var offsetX = windowWidth - (margins + totalWidth);

            // Set the wrapper to the offset and the width to the combined total width
            MKON.LAYOUT.gridsterWrapper.css({'left': Math.abs(offsetX/2) + 'px', 'width': (margins + totalWidth) + 'px' });  

            // Recalculate area of page needed to trigger hover effect on remove zone
            MKON.LAYOUT.removeZoneLimit = parseInt(MKON.LAYOUT.viewportHeight - MKON.LAYOUT.removeZone.outerHeight());               

        },

        setup: function() {
        
            var urlLayout = window.location.hash.substring(1);                 

            // Check if url layout available (a # with json layout attached to url)
            if (urlLayout) {
                this.prevLayout = JSON.parse(urlLayout);
                this.generate(this.prevLayout, false);    
                if (MKON.debug) {  console.log('Found url layout.'); };            
            } else {
                this.prevLayout = false;
                if (MKON.debug) {  console.log('Couldnt find url layout.'); };   
            }

            // If localstorage available
            if(typeof(Storage)!=="undefined" && !this.prevLayout) {   

                if (MKON.debug) {  console.log('LocalStorage supported.'); };
                MKON.localStorageSupport = true; 

                try { 

                    if (!this.prevLayout) {
                        this.prevLayout = localStorage.getObj(MKON.cacheString);      
                        if (MKON.debug) { console.log('Cache found. [' + this.prevLayout + ']'); };    
                    }
                               
                    if (this.prevLayout != null) {
                        
                        MKON.LAYOUT.generate( MKON.LAYOUT.prevLayout, false);  

                        if (MKON.debug) { console.log('Generating layout.'); };
                    }  

                } catch (error) {
                    if (MKON.debug) { console.log('Error getting cache. [' + error + ']'); }
                }

            }  else if (this.prevLayout) {
                if (MKON.debug) { console.log('Using url layout method.'); }
            }

        },

        initGridster: function() {

            // Gridster Config
            $("#gridster").gridster({

                widget_selector: "li",
                widget_margins: [this.gridMargins, this.gridMargins],
                widget_base_dimensions: [this.gridWidth, 112],
                draggable: {
                        start: function(event, ui){ 

                            MKON.LAYOUT.removeZoneAnimation('show');
                            MKON.LAYOUT.currentWidget = $(event.target).parent(); 


                                 
                        },
                        drag: function(event, ui) {                            
                                                  
                            if (ui.pointer.top > MKON.LAYOUT.removeZoneLimit) {
                                MKON.LAYOUT.removeZone.addClass('hover');
                                $(window).scrollTop();
                   
                            } else {
                                MKON.LAYOUT.removeZone.removeClass('hover');                        
                            }

                        },
                        stop: function(event, ui){ 

                            if ($('#removeZone').hasClass('hover')) {

                                // remove the module as its over the remove zone 
                                var el = MKON.LAYOUT.currentWidget;
                                el.hide();
                                MKON.CONTENT.removeModule(el);


                            } else {
                                // update the position on the grid
                                var el = $(event.target).parent();  
                                MKON.CONTENT.updateModule(el);                                
                            }
                            
                            MKON.LAYOUT.removeZone.removeClass('hover');
                            MKON.LAYOUT.removeZoneAnimation('hide');                        
                        }
                },
                resize: {
                    enabled: true,
                    stop: function () {                       
                        MKON.LAYOUT.save();                         
                    }
                },
                min_cols:3,         
                serialize_params: function($w, wgd) {
                    return {
                        p: {"c": wgd.col, "r": wgd.row, "x": wgd.size_x, "y": wgd.size_y},      
                        u: $($w)[0].getAttribute('data-link'),
                        m: $($w)[0].getAttribute('data-meta')
                    }
                }

            });

        },

        remove: function(target) {

            this.gridster.remove_widget(target);
            alertify.log("<i class='fa fa-check'></i> &nbsp; REMOVED MODULE", "", 1200);
       
        },

        add: function(content) {
           
            this.gridster.add_widget(content.html, content.x, content.y, content.col, content.row);         

        },

        save: function() {
            

            if (MKON.allowSave) {

                try {
                    this.serialize();  
                    if (MKON.debug) {  console.log('Saving...'); };
                } catch (error) {
                    if (MKON.debug) {  console.log('Error serializing layout.'); };
                }            

                if (MKON.localStorageSupport) { // Use localstorage to save
                    try {
                        localStorage.setObj(MKON.cacheString, this.currentLayout);
                        if (MKON.debug) { console.log('Layout save successful.'); }
                    }
                    catch (error) {
                        if (MKON.debug) { console.log('Error saving. [' + error + ']'); };
                    }

                } else { // Use location hash to save

                    parent.location.hash =  JSON.stringify(this.currentLayout)
                }              
                
            }

        },

        clear: function() {

            this.gridster.remove_all_widgets(); 

            MKON.CONTENT.activeModules = [];

            for (var i=0; i<MKON.CONTENT.activeVariables.length; i++) {

               MKON.COMMS.unsubscribe( [ MKON.CONTENT.activeVariables[i][0] ] );               
            }

            this.checkLogo();
            
            MKON.CONTENT.activeVariables = [];

            alertify.log("<i class='fa fa-check'></i> &nbsp; LAYOUT CLEARED", "", 1200);
        },

        // Converts the current layout into serial form for saving/exporting
        serialize: function() {

            this.currentLayout = this.gridster.serialize();

            for (var item in this.currentLayout) {              
                if (typeof this.currentLayout[item] !== 'undefined') {
                    var u = this.currentLayout[item].u;
                    var c = this.currentLayout[item].c;
                    var r = this.currentLayout[item].r;                    
                }
            }
        },

        // Generates a new layout using JSON input
        generate: function(data, clear) {

            if (clear) {
                this.clear();            
            }

            MKON.allowSave = false;
            var requests = [];
            

            for (var item in data) {

                if (typeof data[item] !== 'undefined') {  
                    
                    var p = data[item].p;   
                    var u = data[item].u;   
                    var c = p.c;
                    var r = p.r;
                    var w = p.x;
                    var h = p.y;
                    var m = data[item].m;

                    var config = {'u': u, 'c': c, 'r':r, 'm':m, 'w':w, 'h':h};

                    var promise = MKON.CONTENT.getModule(u, config);

                    requests[requests.length] = promise;
                }

            }  

            function success() {
                MKON.allowSave = true;
                MKON.LAYOUT.save();
                MKON.LAYOUT.unlock();   

                alertify.log("<i class='fa fa-check'></i> &nbsp; GENERATION COMPLETE", "", 1200);

                if (MKON.debug) {
                    console.log('Cache modules successfully retrieved.')

                }
            }    

            $.when.all(requests).done(success);
        },

        checkLogo: function() {

            var len = MKON.CONTENT.activeModules.length;  

            if (len < 1 || !(this.locked) ) { 

                if( this.logo.css("display") == 'none' ) {
                    this.logoAnimation('show');
                }

            } else {  

                if( this.logo.css("display") == 'block' ) {  
                    this.logoAnimation('hide');
                }
            }
        },
        
        lockAnimation: function(mode) {

            var wrapper = this.lockUnlockWrapper;
            var icon = this.lockUnlockIcon;
            var btn = this.lockUnlockBtnIcon;

            // Icon switch
            if (mode == 'lock') {
                wrapper.addClass('locked');
                btn.removeClass('fa-unlock').addClass('fa-lock');

            } else if (mode == 'unlock') {
                wrapper.removeClass('locked');
                btn.addClass('fa-unlock').removeClass('fa-lock');
            }
            
            // Animation
            wrapper.addClass('fadeIn').removeClass('fadeOut');

            wrapper.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',   
                function(e) {                
                    wrapper.removeClass('fadeIn').addClass('fadeOut');                
                }
            );
        },

        lock: function() {

            alertify.log("<i class='fa fa-lock'></i> &nbsp; LAYOUT LOCKED", "", 1200);

            this.lockAnimation('lock');
            this.locked = true;

            this.checkLogo();

            this.lockAnimation('hide');

            $('header').addClass('locked').css('marginTop', '-60px');
            $('#menu').removeClass('expand');
            

            setTimeout(function() {
                 $('header').css('marginTop', '0px');
            }, 300);



            $('#gridsterWrapper').addClass('locked');
            this.gridster.disable();
        },

        unlock: function() {

            this.lockAnimation('unlock');
            this.locked = false;

            this.checkLogo();

            $('header').removeClass('locked');
            

            $('#gridsterWrapper').removeClass('locked');
            this.gridster.enable();

        },

        headerAnimation: function() {

            if (this.locked) {
                this.header.addClass('locked').css('marginTop', '-60px');
            }

            else {

            }

        },

        launchAnimation: function(target, classes, hide) {

            // Animation
            var hide = hide || false;
            target.addClass(classes);
            target.show();

            target.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',   
            function(e) {   

                target.removeClass(classes);    
                if (hide) {     
                    target.hide();
                }                       
            });
        },

        listAnimation: function(direction) {   

            if (direction == 'open') {
                this.header.css('marginTop', '-60px');
                this.launchAnimation(this.moduleList, 'animated-med bounceInUp', false);
            } else if (direction == 'close') {
                this.header.css('marginTop', '0px');
                this.launchAnimation(this.moduleList, 'animated bounceOutDown', true);   
       
            }
        },

        logoAnimation: function(direction) {     

            if (direction == 'show') {
                this.launchAnimation(this.logo, 'fadeInUp', false); 

            } else if (direction == 'hide') {
               this.launchAnimation(this.logo, 'fadeOutDown', true); 
            }

        },   

        removeZoneAnimation: function(direction) {     

            if (direction == 'show') {
                this.launchAnimation(this.removeZone, 'fadeInUp', false); 

            } else if (direction == 'hide') {
               this.launchAnimation(this.removeZone, 'fadeOutDown', true); 
            }

        },   

        closeList: function() {
            this.listAnimation('close');
            this.closeOverlay();
        },

        openList: function() {        
            this.listAnimation('open');
            this.openOverlay();
        },

        openOverlay: function(content) {
            this.overlayWrapper.fadeIn('fast');     
        },

        closeOverlay: function() {
            this.overlayWrapper.fadeOut('fast');   
        },

        closeMenu: function() {
            if (this.menu.hasClass('expand')) {
                this.menu.removeClass('expand');
            }
        },

        toggleMenu:function () {        
             this.menu.toggleClass('expand');       
        }
        
    },

    // Active variables and modules that make up the current layout
    CONTENT: {

        freezeData: false, 
        activeModules: [],
        activeVariables: [],
        rawData: [],
        newData: [],

        // Loops through received data and determines what has changed
        filterData: function(data) {

            this.newData = $.parseJSON(data.replace(/:nan,/g,':0,'));

            this.rawData = this.newData;

            MKON.COMMS.paused = (this.rawData['p.paused'] == 1) ? true : false;   

            MKON.CONTENT.handleData();

        },

        // Loops through active modules and triggers handleData events for each
        handleData: function() {

            if (MKON.COMMS.active && this.activeModules.length > 0) {
            
                for(var item in this.activeModules) {
                    if (typeof this.activeModules[item] !== 'undefined') {                               
                        this.activeModules[item].handleData();
                    };
                }
            }
        },

        // Adds a keyboard event to track
        addHook: function(id, key, fnc) {

            // Prevent keyboard hooks being added to mobile devices
            if (!isMobile) {

                Mousetrap.bind(key, fnc);

                var target = $('#'+id);

                target.on('remove', function() {       
                    Mousetrap.unbind(key);
                });
               
            }

        },

        removeHook: function(hook) {

        },

        getVariable: function(v) {

            if (typeof this.rawData[v] !== 'undefined') {
                return this.rawData[v];
            } else {
                return 0;
            }
        },

        // Adds a specified variable request
        addVariable: function(v) {

            var pos = -1;

            for (var i = 0; i<this.activeVariables.length; i++) {

                if (this.activeVariables[i][0] == v)
                {
                    // it already exists
                    pos = i;
                    break;
                } 
            }

            if (pos != -1) {
                if (MKON.debug) { console.log('Variable ' + v + ' already tracked'); };
                // if it is already being tracked, increase the track count
                var count = parseFloat( this.activeVariables[pos][1] );
                count++;
                this.activeVariables[pos][1] = count;

            } else {
                if (MKON.debug) { console.log(v + ' not yet tracked'); };
                // it's not being tracked, so add a new entry to the array & subscribe

                this.activeVariables[this.activeVariables.length] = [v[0], 1];
                MKON.COMMS.subscribe( v ); 

                if (!isMobile) { // Desktop only due to performance

                    // dynamically adjust data rate based off of variables
                    var len = this.activeVariables.length;
                    var cur = MKON.currentRate;

                    var ratio = Math.round( len/10 ) - 1;

                    ratio = (ratio < 0) ? 0 : ratio;
                    ratio = (ratio > MKON.rate.length) ? MKON.rate.length : ratio;                

                    // if the calculated rate is not the current one...
                    if (MKON.currentRate != MKON.rate[ratio]) {
                        // change to the new rate
                        MKON.COMMS.rate(MKON.rate[ratio]);
                    }     
                }

            }


         
        },

        removeVariable: function(v) {

            for (var i = 0; i<this.activeVariables.length; i++) {

                if (this.activeVariables[i][0] == v)
                {
                    
                    var count = parseFloat( this.activeVariables[i][1] );  

                    if (count == 1) {

                        if (MKON.debug) { console.log(v + ' last tracked variable'); };
                        this.activeVariables.splice(i,1);
                        MKON.COMMS.unsubscribe(v);

                    } else {
                        count--;    
                        if (MKON.debug) { console.log(count + ' more to go! [' + v + ']');  };                                   
                        this.activeVariables[i][1] = count;
                    }

                    break;
                } 
            }

        },

        // Adds a retrieved module to the activeModules list
        addModule: function(mod, content, save) {

            if (mod != '') {

                this.activeModules[this.activeModules.length] = mod;         

                for (var i=0; i<mod.req.length; i++) {

                    if (mod.req[i] != '') {
                        this.addVariable( [ mod.req[i] ] );
                    }
                }

            }

            MKON.LAYOUT.add(content);
            MKON.LAYOUT.save();      

        },

        // Removes the specified module from the activeModules list
        removeModule: function(target) {

            var targetID = target[0].getAttribute('id');
            var r = [];

            // Remove from activeModules
            for(var item in this.activeModules) {
                 if (typeof this.activeModules[item] !== 'undefined') {                 

                    if (this.activeModules[item].id == targetID) {

                        mod = this.activeModules[item]; // get vars module needed

                        for (var i=0; i<mod.req.length; i++) {

                            this.removeVariable( [ mod.req[i] ] );

                        }

                        this.activeModules.splice(item, 1);    
                     
                        break;
                    }
                };
            }

            var ind = $(target).index();
            MKON.LAYOUT.remove( $('#gridster li').eq(ind) );
            MKON.LAYOUT.save();

        },

        // Updates grid coords for an activeModule
        updateModule: function(el) {

            // update the dom module
            var newCol = el[0].getAttribute('data-col');
            var newRow = el[0].getAttribute('data-row');
            var id = el[0].getAttribute('id');       

            for(var i = 0; i<this.activeModules.length; i++) {

                if (this.activeModules[i].id == id) {           
                    this.activeModules[i].col = newCol;
                    this.activeModules[i].row = newRow;
                    break;
                }
            }

            MKON.LAYOUT.save();
        },

        // retrieves module, returns deferred object
        getModule: function(url, config) {

            return $.ajax({
                type: "GET",
                url: url,
                dataType: "script",
                success: function(module) { 

                    try {
                        init(config);   
                        return 'test';                              
                    }
                    catch (error) {                        
                        console.log('Error Initializing Module [' + error + ']');
                    }              

                },
                error: function (request, status, error) {
                    return console.log(error);
                },
                async: true,
                cache: true
            });

        }  

    },

    // Miscellaneous Math & Utility Functions
    FNC: {

        bookmark: function(title, url) {

            if (window.sidebar) {// firefox
                window.sidebar.addPanel(title, url, "");
            }
            else if(window.opera && window.print) { // opera
                var elem = document.createElement('a');
                elem.setAttribute('href',url);
                elem.setAttribute('title',title);
                elem.setAttribute('rel','sidebar');
                elem.click();
            } 
            else if(document.all) {// ie
                window.external.AddFavorite(url, title);
            } 

        },

        zeroPad: function(num, places) {

            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        },

        toFixed: function(value, precision) {

            var precision = precision || 0,
            neg = value < 0, power = Math.pow(10, precision),
            value = Math.round(value * power),
            integral = String((neg ? Math.ceil : Math.floor)(value / power)),
            fraction = String((neg ? -value : value) % power),
            padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
            return precision ? integral + '.' +  padding + fraction : integral;
        },

        randomString: function (len, charSet) {

            charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var randomString = '';

            for (var i = 0; i < len; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz,randomPoz+1);
            }

            return randomString;
        },

        formatters: {

            velocity: function (v) {
                f = this.formatScale(v, 1000, ["Too Large", "m/s", "Km/s", "Mm/s", "Gm/s", "Tm/s"]);
                return this.fix(f.value) + " " + f.unit;
            },

            distance: function (v) {
                f = this.formatScale(v, 1000, ["Too Large", "m", "Km", "Mm", "Gm", "Tm"]);
                return this.fix(f.value) + " " + f.unit;
            },

            formatScale: function (v, s, u) {
                var i = 1;
                var isNeg = v < 0;

                v = Math.abs(v);

                while (v > s) {
                    v = v / s;
                    i = i + 1;
                }

                if (i >= u.length) {
                    i = 0;
                }

                if (isNeg) {
                    v = v * -1;
                }

                return { "value": v, "unit": u[i] };
            },

            unitless: function (v) {

                return FNC.formatters.fix(v);
            },

            time: function (v) {

                f = [86400, 3600, 60, 60];
                u = ["D", "H", "M", "S"];
                vprime = [0, 0, 0, 0]

                v = Math.floor(v);

                for (var i = 0; i < f.length; i++) {
                    vprime[i] = Math.floor(v / f[i]);
                    v %= f[i];
                }
                vprime[f.length - 1] = v;


                for (var i = 1; i < f.length; i++) {
                    if (vprime[i] < 10) {
                        vprime[i] = "0" + vprime[i];
                    }
                }

                var formatted = "";
                for (var i = 0; i < f.length; i++) {
                    formatted = formatted + vprime[i] + u[i] + " ";
                }

                if (formatted == "") {
                    formatted = 0 + u[u.length - 1];
                }

                return formatted;
            },

            date: function (v) {
              year = ((v / (365 * 24 * 3600)) | 0) + 1
              v %= (365 * 24 * 3600)
              day = ((v / (24 * 3600)) | 0) + 1
              v %= (24 * 3600)
              return "Year " + year + ", day " + day + " at " + this.hourMinSec(v)
            },

            hourMinSec: function (v) {
              hour = (v / 3600) | 0
              v %= 3600
              min = (v / 60) | 0
              if (min < 10) { min = "0" + min }
              sec = (v % 60).toFixed()
              if (sec < 10) { sec = "0" + sec }

              hour = MKON.FNC.zeroPad(hour, 2);
              return "" + hour + ":" + min + ":" + sec;
            },

            deg: function (v) {
                return FNC.formatters.fix(v) + '\xB0';
            },

            fix: function (v) {
                if (v === undefined) {
                    return 0;
                } else {
                    return v.toPrecision(6).replace(/((\.\d*?[1-9])|\.)0+($|e)/, '$2$3');
                }
            },

            pad: function (v) {
                return ("\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0" +
                    v).slice(-30)
            },

            sigFigs: function (n, sig) {

                if (n != 0) {
                    var m = false;

                    if (n < 0) {
                        m = true;
                        n = Math.abs(n);
                    }

                    var mult = Math.pow(10,
                        sig - Math.floor(Math.log(n) / Math.LN10) - 1);

                    if (m) {
                        n = n * -1;
                    }

                    return Math.round(n * mult) / mult;
                } else {
                    return 0;
                }
            }
        }

    }

};






