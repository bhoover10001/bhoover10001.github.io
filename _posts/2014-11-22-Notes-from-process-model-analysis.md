---
layout: page
title: Process Model Analysis Week 2
date: 11-Nov-2014
vocabulary:
  - term: Petri-Net
    definition: One version of a way to document a process model
  - term: control-flow 
    definition: Something moving from here to there
  - term: k-bounded
    definition: A place (p) is k-bounded if there is not reachable marking with more than K tokens in p<br />
                A petri net is k-bounded if all places are k-bounded
  - term: safe
    definition: A place (p) is safe if it is 1-bounded.
                A petri net is safe if all the places are 1-bounded
  - term: Workflow Nets
    definition: 
  - term: Source Place
    definition: For a Workflow net, this is is the start or i.
  - term: Sink place
    definition: For a Workflow net, this is the end or o
  - term: marking
    definition: A state in a Petri net
    
---
<h2>
Event Logs
</h2>
<p>
Consist of a case ID, activity name, time stamp, plus other data.
</p>
<p>
  Let's take a look at an e-mail.<br />
  The e-mail has:
  <ul>
    <li>A sender</li>
    <li>A set of receivers</li>
    <li>A subject</li>
    <li>A sent date</li>
    <li>A received date</li>
    <li>A body</li>
    <li>Lots of other data</li>
  </ul>
  What would be the case ID, the activity name, the time stamp?<br />
  It would have to depend on the process that is being measured.  For example, let's say that we were trying to figure out the amount of time
  that it took a receiver to reply to an e-mail.  Then the case ID might be the receiver, the activity name might be reply and the timestamp 
  would be the time of the reply.
</p>
<p>
  According to the class, one possibility would be the sender is the resource or the activity name.  The set of receivers would be "other data", the subject would be the case ID and so on.
</p>
<p>
  Looking at a student database, the case ID could be the student, the exam date could be the time stamp, and the course could be the
  activity name.
</p>
<p>
  The mapping really depends on the context and the question that is being asked.
</p>
<p>
  XES is a <a href="http://www.xes-standard.org">www.xes-standard.org</a> - stands for eXtensible Event Stream - a standard format for event 
  Streams.
</p>
<p>
  Various representations of data - 
  <ul>
    <li>control-flow - step by step process</li>
    <li>data-flow - who needs what when</li>
    <li>time</li>
    <li>resources</li>
    <li>costs</li>
    <li>risks</li>
    <li>....</li>
  </ul>
  The representation is critical.  The model has to capture really well, and the end user will have specific needs/
</p>
<h2>
  Petri Net
</h2>
<p>
  Network is static and composed of places and transitions.  Places hold tokens.  Transitions produce or consume tokens.  A state in a Petri Net is called a marking.
</p>
<p>
  A transition is enabled if each of the inputs that support it contain a token.
</p>
<p>
  A reachability graph is a transition system with one initial state and no explicit final marking.  
</p>

<h2>
  Workflow Net
</h2>
<p>
  A workflow net should have a well-defined start and end and should be free of obvious anomalies (soundness)..  What makes up an
  anomaly?<br />
  A workflow net has one source place and one sink place.  Everything else should be a path from the source to the sink.<br />
  A Workflow net is sound:<br >
  <ul><li>If it is safe - a place cannot hold multiple tokens at the same time.  Think of it this way, the invoice can be copied, but
      the administrator shouldn't be working on two copies of the same invoice at the same time.</li>
      <li>Proper completion - if the sink place is marked, all other places are empty.  An administrator should NOT be working on the order
      after it has reached the final state</li>
      <li>It should always be possible to reach the end state.  The paperwork should not get lost.</li>
      <li>Absence of dead parts.  There should be no cases where the paperwork gets lost, blocking the process.</li>
      <li>If and only if the short-circuited Petri net is live and bounded.</li>
  </ul>
</p>
<h2>Model Based Analysis</h2>
<p>
   Verification (soundness checking) and performance analysis (simulation).  But the analysis is limited on the quality of the model.  
   In other words, are people really doing what they say they are doing.  Is the administrator really adding value?  How to re-verify that
   the model is correct.<br />
   Process mining is the direct connection between the model and the event data.
</p>
<h2>Alpha Algorithm</h2>
<p>
  This is a process discovery algorithm.<br />
  This is a control flow - just the order of activity, by case, while ignoring any of the other data.<br>
  So, we could wind up with a sequence of [(register_order, check_stock, ship_order, handle_payment),(register_order, check_stock, cancel_order),....]<br />
  So, the goal is to come up with a set like:
  $$L_1 = [\langle a, b, c, d\rangle^3, \langle a, c, b, d\rangle^2,\langle a, e, d\rangle ]$$

  where the trace <a,b,c,d> has happened 3 times, <a,c,b,d> has happened 2 times and <a,e,d> once.<br />
  The alpha algorithm is to take this event log and create a model that fits what has been observed.<br />
  For this week, we are looking at fitness, or the ability to explain desired behavior.  Later on, we will look at precision, 
  generalization and simplicity.<br />
  So the algorithm is looking for the following<br />
  <ul>
    <li>Direct succession: x&gt;y - case x is directly followed by y</li>
    <li>Causality: x \(\rightarrow \)  y - if x&gt;y but not y&gt;x</li>
    <li>Parallel: X||y iff x&gt;y and y&gt;x</li>
    <li>Choice: x#y iff not x&gt;y and not y&gt;x</li>
  </ul>
</p>
<p>
  An alpha network can discover choices, concurrency, loops.  But it cannot cover all situations.  Limitations:<br />
  <ul>
    <li>Implicit places - A place that doesn't add anything.  What does this mean</li>
    <li>Loops of length 1 and length 2</li>
    <li>\( \tau \) represents a transition that doesn't have an event. </li>
    <li>The resultant model might not be a sound WF-net.</li>
    <li>representative bias</li>
    <li>Noise can really affect the model, rare events will muck up the model, because there is no determiniation of how many times 
      an trace has happened</li>
    <li>Completeness</li>
  </ul>
</p>
<div id="pn" class="content-container">
  <h1>Petri Nets</h1>
  <div id="paper" class="paper"></div>
</div>

<p>
  A marking is dead if there is no transition enabled in it<br />
  A Petri net has a potential deadlock if there is a reachable dead marking.<br />
  A transition t is live if it is possible to reach a marking that enables t<br />
  A live petri net if all the transitions are live<br />
  Complete traces go from start state to final state
</p>

<script src="/assets/js/joint.min.js"></script>
<script src="/assets/js/joint.shapes.pn.min.js"></script>

<script>
var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 500,
    height: 500,
    gridSize: 10,
    perpendicularLinks: true,
    model: graph
});

var pn = joint.shapes.pn;

var pDarmstadt = new pn.Place({ position: { x: 250, y: 50 }, attrs: { '.label': { text: 'Darmstadt' }  }, tokens: 1 });
var pFrankfurt = new pn.Place({ position: { x: 400, y: 250 }, attrs: { '.label': { text: 'Frankfurt' } }, tokens: 0 });
var pHeidleberg = new pn.Place({ position: { x: 250, y: 400}, attrs: { '.label': { text: 'Heidleberg' }  }, tokens: 0 });
var pKoln = new pn.Place({ position: { x: 50, y: 250}, attrs: { '.label': { text: 'Koln' }  }, tokens: 0 });

var tDarmstadtFrankfurt = new pn.Transition({ position: { x: 425, y: 50 }, attrs: { '.label': { text: 'travel' }  } });
var tFranfurtHeidleberg = new pn.Transition({ position: { x: 425, y: 400 }, attrs: { '.label': { text: 'travel' }  } });
var tHeidlebergKoln = new pn.Transition({ position: { x: 75, y: 400 }, attrs: { '.label': { text: 'travel' }  } });
var tKolnDarmstadt = new pn.Transition({ position: { x: 75, y: 50 }, attrs: { '.label': { text: 'travel' }  } });

function link(a, b) {

    return new pn.Link({
        source: { id: a.id, selector: '.root' },
        target: { id: b.id, selector: '.root' }
    });
}

graph.addCell([ pDarmstadt, pFrankfurt, pHeidleberg, pKoln, tDarmstadtFrankfurt , tFranfurtHeidleberg, tHeidlebergKoln, tKolnDarmstadt]);

graph.addCell([
    link(pDarmstadt, tDarmstadtFrankfurt),
    link(tDarmstadtFrankfurt, pFrankfurt),
    link(pFrankfurt, tFranfurtHeidleberg),
    link(tFranfurtHeidleberg, pHeidleberg),
    link(pHeidleberg, tHeidlebergKoln),
    link(tHeidlebergKoln, pKoln),
    link(pKoln, tKolnDarmstadt),
    link(tKolnDarmstadt, pDarmstadt)
]);


function fireTransition(t, sec) {

    var inbound = graph.getConnectedLinks(t, { inbound: true });
    var outbound = graph.getConnectedLinks(t, { outbound: true });

    var placesBefore = _.map(inbound, function(link) { return graph.getCell(link.get('source').id); });
    var placesAfter = _.map(outbound, function(link) { return graph.getCell(link.get('target').id); });

    var isFirable = true;
    _.each(placesBefore, function(p) { if (p.get('tokens') == 0) isFirable = false; });

    if (isFirable) {

        _.each(placesBefore, function(p) {
            // Let the execution finish before adjusting the value of tokens. So that we can loop over all transitions
            // and call fireTransition() on the original number of tokens.
            _.defer(function() { p.set('tokens', p.get('tokens') - 1); });
      var link = _.find(inbound, function(l) { return l.get('source').id === p.id; });
      paper.findViewByModel(link).sendToken(V('circle', { r: 5, fill: 'red' }).node, sec * 1000);
      
        });

        _.each(placesAfter, function(p) {
      var link = _.find(outbound, function(l) { return l.get('target').id === p.id; });
      paper.findViewByModel(link).sendToken(V('circle', { r: 5, fill: 'red' }).node, sec * 1000, function() {
                p.set('tokens', p.get('tokens') + 1);
      });
      
        });
    }
}

function simulate() {
    var transitions = [tDarmstadtFrankfurt, tFranfurtHeidleberg, tHeidlebergKoln, tKolnDarmstadt];
    _.each(transitions, function(t) { if (Math.random() < 0.7) fireTransition(t, 1); });
    
    return setInterval(function() {
        _.each(transitions, function(t) { if (Math.random() < 0.7) fireTransition(t, 1); });
    }, 2000);
}

function stopSimulation(simulationId) {
    clearInterval(simulationId);
}

var simulationId = simulate();



</script>
 