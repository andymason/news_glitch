#!/usr/bin/python
# -*- coding: utf-8 -*-
from bottle import route, run, debug, template, static_file, response, request
import urllib2
import simplejson as json
import re

# "means to an end"

@route('/static/js/<filename>')
def server_static(filename):
    response.headers['Cache-Control'] = 'public, max-age=1'
    return static_file(filename, root='./static/js/')

@route('/static/images/<filename>')
def server_static(filename):
    return static_file(filename, root='./static/images/')

@route('/static/audio/<filename>')
def server_static(filename):
    return static_file(filename, root='./static/audio/')

@route('/static/css/<filename>')
def server_static(filename):
    return static_file(filename, root='./static/css/')

@route('/proxy')
def server_static():
    url = request.query.url
    req = urllib2.Request(url)
    fetched = urllib2.urlopen(req)
    response.headers['Content-Type'] = "image/jpeg"
    return fetched.read()

@route('/')
def index():
    newsFeed = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=http://news.google.com/news/feeds'
    headers = {'User-Agent': 'News glitch art project by Andrew Mason andrew@coderonfire.com'}
    req = urllib2.Request(newsFeed, None, headers)
    fetched = urllib2.urlopen(req)
    jsonData = fetched.read()
    data = json.loads(jsonData);

    # Get image URL from HTML content. Here be HTML regex'n.
    imageRegex = re.compile("img src=\"(.*?)\"",re.IGNORECASE|re.MULTILINE)
    articleCountRegex = re.compile("<b>all (.*?) ",re.IGNORECASE|re.MULTILINE)

    storyList = data['responseData']['feed']['entries']
    newStories = []

    maxCount = 0

    for story in storyList:
        if (len(newStories) >= 9):
            break

        storyHTML = story['content']

        # Extract large image src.
        imgSrc = imageRegex.findall(storyHTML)
        if not imgSrc:
            continue
        # Larger images are better but not always present
        #imgSrc = imgSrc[0].replace('6.jpg', '11.jpg')
        imgSrc = imgSrc[0]

        #Extract story count.
        count = articleCountRegex.findall(storyHTML)
        if not count:
            continue
        count = count[0].replace(',', '')

        if (int(count) > maxCount):
            maxCount = int(count)
        story['imgSrc'] = imgSrc
        story['count'] = count
        newStories.append(story)

    for index, item in enumerate(newStories):
        item['glitchAmount'] = float(item['count']) / maxCount

    # sort stories
    sortedStories = sorted(newStories, key=lambda item: item['glitchAmount'], reverse=True)
    return template(
        'googlenews',
        title=data['responseData']['feed']['title'],
        storyList=sortedStories
    )

#run(host='localhost', port=9003,  reloader=True, debug=True)
run(server='gae')
