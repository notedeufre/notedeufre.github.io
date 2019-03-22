/**
* Main app js file
**/

// const

var app = new Vue({

    el: '#app_aulas_tweet_generator',
    
    data: {

        // settings
        settings : {} , 

        // aulas
        tweets      : [] , 
        aulas_tweet : "" , 
        aulas_tweet_b : "" , 

        // journalist
        journalists : [] , 
        journalist : { 'name' : '' , 'picture' : '' } , 
        p_j : '' , 
        q_j : '' , 
        tweet_a_url : ''  ,
        tweet_b_url : ''  , 

        theme : "" , 
        themes : [] , 

        target : "Aucune" , 
        targets : [] ,

        phrase : "OL is back" ,  
        phrases : [] ,

        hashtag : "#olfem" ,  
        hashtags : []
    }, 
    
    created()
    {

    },

    mounted () {

        $('.tabular.menu .item').tab();

        axios.all([

            axios.get( '/data/settings.json' ) ,
            axios.get( '/data/JM_Aulas_timeline.csv' ) ,

        ])

        .then( axios.spread( ( settings , aulas_tweets ) => {

            this.settings = settings ; 
            this.randQuestion() ; 

            this.themes = this.settings.data.themes ; 
            this.targets = this.settings.data.targets ; 
            this.phrases = this.settings.data.phrases ; 
            this.hashtags = this.settings.data.hashtags ; 

            this.tweets = parseCSV( aulas_tweets.data ) ; 
            delete this.tweets[0] ; 

            this.randTweet() ; 
            this.randTweetB() ; 
            
        }))
        .catch( error => {
            console.error(error)
            this.errored = true
        })
        .finally(() => {
            
            this.loading = false ; 

        })
    } , 

    methods: {


        randQuestion : function( ){

            this.journalists = this.settings.data.journalists ; 

            this.journalist = this.journalists.sample() ; 
            this.p_j = "assets/images/journalists/"+this.journalist.picture ; 
            // console.info( this.journalist) ; 
            this.q_j = '<i class="quote left icon"></i>'+this.journalist.questions.sample()+'<i class="quote right icon"></i>' ; 

        } , 

        randTweet : function(){

            let tweet = this.tweets.sample() ; 

            this.aulas_tweet = '<i class="quote left icon"></i>'+tweet[3]+'<i class="quote right icon"></i>' ; 
            this.tweet_a_url = 'https://twitter.com/intent/tweet?text='+encodeURIComponent(tweet[3])+'&url=&hashtags=#tweetCommeAulas' ; 
        } ,

        tweetA : function(){

            window.open( this.tweet_a_url ) ; 
        } , 

        randTweetB : function(){

            let tweet = this.tweets.sample() ;
            let tweet_ext = tweet[3] + ' '+((this.target!='Aucune')?this.target:'')+' '+this.phrase ;  

            this.aulas_tweet_b = '<i class="quote left icon"></i>'+tweet_ext+' '+this.hashtag+'<i class="quote right icon"></i>' ; 
            this.tweet_b_url = 'https://twitter.com/intent/tweet?text='+ encodeURIComponent(tweet_ext)+'&url=&hashtags='+this.hashtag ; 

        },

        tweetB : function(){

            window.open( this.tweet_b_url ) ; 
        }

    } 
}) // end appVue

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

function parseCSV(str) {
    var arr = [];
    var quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}