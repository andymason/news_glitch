<!DOCTYPE html> 
<html>
    <head>
        <meta charset="utf-8" />
        <link type="text/css" rel="stylesheet" href="/static/css/vision.css" />
        <title>News Glitch. An experiment exploring image degradation.</title>
        <script type="text/javascript" src="/static/js/jpeg_encoder_basic.js"></script>
        <script type="text/javascript" src="/static/js/jquery.min.js"></script>
        <script type="text/javascript" src="/static/js/strands.js"></script>
        <script type="text/javascript" src="/static/js/news.js"></script>
    </head>
    <body>
        <div class="wall">
            <div class="intro">
                <h1>News Glitch</h1>
                <p>An experiment visualising news image degradation based on
                popularity. The more articles written on a subject the more
                glitched the image becomes, to the point of losing all resemblance
                of the original image.
                </p>
            </div>

            <div class="loading">Loading stories...</div>

            %for story in storyList:
                <div class="screen">
                    <h2 class="title">
                        <a class="storyLink" href="{{story['link']}}">{{story['title']}}</a>
                        <span class="storyCount">{{story['count']}} articles</span>
                    </h2>
                    <img src="/proxy?url=http:{{story['imgSrc']}}" class="originalImage"
                    data-linkCount="{{story['count']}}"
                    data-noise="{{story['glitchAmount']}}" width="400" height="400" onload="checkFinishedLoading()" />
                </div>
            %end
       <footer>
        An experiment by <a href="http://coderonfire.com/">Andrew Mason</a>
       </footer>
       </div>

       <audio preload="auto" autobuffer autoplay="autoplay" loop="loop"> 
          <source src="/static/audio/talking-clock-1878.mp3" />
          <source src="/static/audio/talking-clock-1878.ogg" />
        </audio>
    </body>
</html>

