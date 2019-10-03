## Summary
Redirect to and from youtube.com, invidio.us, or hooktube.com based on your
setting. I guess rewrite would be more accurate, as how the Apache project uses
"redirect" and "rewrite". Because the url is modified before the request goes
out. It only modifies urls for the three sites that have /watch? in the url.

I also added code for hovering over any link and if you hit "c" it copies the
url of the link you are hovering over to the selection buffer. For me, on Linux,
that copies. It then appends it to your url history. If you aren't on Linux,
check out https://github.com/dhruvtv/copylinkaddress where I got the base of the
code I used for that part.

My thoughts for the two above are that sometimes even invidio.us or hooktube are
not enough to get around youtube nonsense. Check out youtube-dl, use the verison from pip.
When used with a great video player like mpv with the following plugins 
https://github.com/jonniek/mpv-playlistmanager and
https://github.com/jonniek/mpv-scripts , one can have a browser window open on
youtube.com, hover your mouse over a video link, press "c", move cursor to mpv
window, press "a", and you have appended the video to the current playlist and
the video now can be shown as visited if you use stylish or another method of
editing css to make sure a:visited and #video-title:visited are some visually
different color from whatever you set it to now. Plus no fucking ads or any
other nonsense. 


Lots of extra code. I don't write many extensions.

## License
This software is licensed under the MIT license.

## Forked from
https://github.com/amoore17/invidio-quick-redirect by Austin Moore

## Stolen from
https://github.com/dhruvtv/copylinkaddress
https://github.com/locks/mark-as-visited
