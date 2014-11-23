---
layout: page
title: Engineering
date: 25-Oct-2014
---

<p>Back in the "good ole' days," there was such a thing as library hell. Off the cuff, I remember there only being about a 50% chance
that any program taken from a magazine or book would work without doing an awful lot of searching for 3rd party libraries, many of which
might not have been documented in the first place</p>

<p>Now days, tools like Maven and Ivy have made dependency management easier, to some extent. jQuery has simplified JavaScript so that
developers don't have to worry so much about which flavor of JavaScript is installed on the user's machine.</p>

<p>There are SO many frameworks. An engineer has to understand everything, from the database to the application servers to the 
front end frameworks. Sure, any given framework is supposed to simplify something, but any large framework is almost a separate 
language in itself. So now, a full stack engineer has to know SQL, noSQL, the base programming languages (currently, I'm using Java), 
the Java framework, which is supposed to make creating an application easier, JavaScript, probably jQuery or some other library, and then
a UI framework on top of the the JavaScript library.</p>

<p>A couple of years ago, I was talking to a company, and one of the engineers asked "what would you do if you identified a bug in the
framework." Off the cuff, I replied, "I hope it wouldn't happen." Sure, that was a flippant answer. I do that a lot, but the underlying
idea was correct. I've had it happen before.</p>

<p>I was working on an application many years ago. It was using a vanilla version of Cold Fusion, which is a fairly simple but powerful 
web application language. It's also not free, which is a whole different issue. But here's the point. The system wasn't stable 
and we couldn't figure out why not. Every once in a while, the web application would just freak out and start to take over all the
memory. We couldn't figure out why or even what triggered the issue.</p>

<p>Finally, because we were a large company, we got representatives from Sun, Oracle and Allaire (the company that created Cold Fusion) and spent 2 days in a conference room trying to get to the root cause. It turned out that Cold Fusion's implementation of one specific tag
was not stable on the operating system that we had installed it on.</p>

<p>The point is that we didn't find this, because we assumed the language and operating systems were working.</p>

<p>Software, these days, even the simplest applications, is built on millions of lines of code, all of which need to work together. And most of the time, it does. But when it doesn't, trying to figure out which layer of the software is failing is really hard.</p>

<p>Now, sure, Google has solved some of this, but an engineer still has to know where to look. A couple of days ago, I was working on a unit test that wasn't passing. It was a simple method that was calling a 3rd party library. I had mocked the library, because I knew the inputs and the outputs that I wanted. But the unit tests were still failing because the mock object wasn't being used. Now, the experience among you will say "well, that's obvious," but it's not a situation I had ever faced before.  I had to find the source code of the 3rd party library and figure out that the method I was calling was marked as final, and that the mocking library I was using isn't able to mock final methods.</p>
