$( document ).ready(function() {
    var snippet;
    var artist = "kanye west"
    var getTracksUrl = "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_artist="+artist+"&s_track_rating=desc&quorum_factor=1&page_size=15&apikey=89ad81ace06e14e5ea120774c03a0555";
    var artistChoice;
    var language;
    //Call musixmatch to get track names and id's    
    $.ajax({
        url: getTracksUrl,
        method: "GET",
        dataType: "jsonp"
          
    }).then(function(response){
        console.log(response);
        var things = response.message.body.track_list;
        var trackNames = [];
        var trackIDs = [];

        for (i=0; i<things.length; i++) {
            //console.log("the track id of the first song is: "+things[i].track.track_id);
            trackIDs.push(things[i].track.track_id)
            //console.log("the track name of the second song is: "+things[i].track.track_name);
            trackNames.push(things[i].track.track_name);
        }
        // console.log(trackIDs);
        console.log(trackNames);

        var obj = {}

        //Select 3 random songs to be in the next question
        for (i=0; i<3; i++) {
        console.log(randy);
        var randy = Math.floor(Math.random()*trackNames.length);
        
        //Get track names based on what randy decided
        var track1 = trackNames[randy];
        var id1= trackIDs[randy];


        obj["trackname"+i] = trackNames[randy];
        obj["trackid"+i] = trackIDs[randy];
        
        console.log(obj)

        //remove those items from randy
        trackNames.splice(randy, 1);
        trackIDs.splice(randy,1);
        

        
        console.log(trackNames);
        

        }

        console.log(obj.trackid0);
        //Get a snippet of the song
        var getSnippetUrl = "https://api.musixmatch.com/ws/1.1/track.snippet.get?format=jsonp&callback=callback&track_id="+obj.trackid0+"&apikey=89ad81ace06e14e5ea120774c03a0555";
        

        //Second API call to Musixmatch to get snippet of correct answer
        $.ajax({
            url: getSnippetUrl,
            method: "GET",
            dataType: "jsonp"
        }).then(function(data){
            console.log(data);
            snippet = data.message.body.snippet.snippet_body;
            console.log(snippet);
            

            //First API call to FunTranslate API to translate snippet to chosen language
            var translateUrl = "http://api.funtranslations.com/translate/jive.json/?text="+snippet;

            $.ajax({
                url: translateUrl,
                headers : {
                    "X-FunTranslations-Api-Secret": "Ex0S5zXJ945RlSnwTKuS7geF"
                },
                method: "POST"
            }).then(function(translate){
                console.log(translate);
                $(".snippet").text(translate.contents.translated); 
            })

            $(".options").prepend(obj.trackname0);
            $(".options").prepend(obj.trackname1);
            $(".options").prepend(obj.trackname2);

        })

    })
    
    var clicks = $(".tabbs").click(function(){
        if (this) {
            $(".tabbs").removeClass("current")
            $(this).addClass("current")
        }
        if (this){
            var language = $(".current").attr("data-choice");
            console.log(language);
            sessionStorage.setItem("language1", language);
            $(".brand-logo").html("Do You Speak Jive");
            $("body").css("background-image","url(images/background.jpg)");
            // $("body").css("font-family", "'Special Elite', cursive;"); 

        }
        if (language === "yoda") {
            $(".brand-logo").html("Do You Speak Yoda");
            $("body").css("background-image", "url(images/yoda.jpg)");
            // $("body").css("font-family", "'VT323', monospace;");
    
        }
        

        if (language === "shakespeare") {
            $(".brand-logo").html("Do You Speak Shakespeare")
            $(".brand-logo").addClass("shakespeareClass")
            $("body").css("background-image", "url(images/shakes.jpg)");
            // $("body").css("font-family", "'MedievalSharp', cursive;");
        }
        // sessionStorage.clear();

        
     
    });


    var artistSelect = $(".card").click(function(){
        artistChoice = $(this).attr("data-artist");
        console.log(artistChoice);

        // sessionStorage.clear();
        // sessionStorage.setItem("artist-name", artistChoice);
    })



    var showLink = $(".card").click(function(){
        if (this) {
            $(".card").find("a").addClass("hidden");
            $(this).find("a").removeClass("hidden");
            $(".card").removeClass("selected")
            $(this).addClass("selected");
                        
        }
        sessionStorage.clear();
        sessionStorage.setItem("artist-name", artistChoice);
        sessionStorage.setItem("language1", language);
    })

    var startGame = $(".hidden").click(function(){
        // sessionStorage.clear();
        // sessionStorage.setItem("artist-name", artistChoice);
        // sessionStorage.setItem("language1", language);

    })





});