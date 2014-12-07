---
layout: page
title: Process Model Analysis Week 3
date: 01-Dec-2014
vocabulary:
  - term: True Positive (TP)
    definition: Traces possible in the model are also possible in the real process
  - term: False Positive (FP)
    definition: Traces possible in the model are also not possible in the real process
  - term: True Negative (TN)
    definition: Traces not possible in the model are also not possible in the real process
  - term: False Negative (FN)
    definition: Traces not possible in the model are possible in the real process
  - term: Recall
    definition: \(TP/(TP+FN)\) 
  - term: Precision
    definition: \(TP/(TP+FP)\) 
  - term: Replay Fitness
    definition: \(TP'/(TP'+FP')\) where the 's are the events in the event long
  - term: Representational Bias
    definition: The language used to explain the model also biases the model.
---
<h1>Advanced</h1>

<h2>Quality Criteria</h2>
<p>
Is the process model correct?<br />
Naive approach based on classification - Using confusion matrix, maximize number of True Positives and True Negatives while minimizing 
number of False positives and negatives.  This can also be a Venn-Diagram. <br />
The idea is to have high recall and precision.  The problem is that the model and even the event log is more than likely a very small subset
of all the possible traces.<br />
There are also no negative examples, since the log only contains what did happen.<br />
A loop will also make an infinite number of traces.<br />
The idea is to try to find a model that deals with what can probably happen.
</p>
<p>
The goal is to get a model that has fitness, precision, simplicity, and generalization.  Fitness means it should be able to explain the observed behavior without being too complex or general (the paperwork goes into accounting and comes out) for example.<br />
If a model is not fit, there is a good chance that the next trace will not fit the model.<br />
If the model is not precise, there is a good change that behaviors that are not viewed in the log will be possible.<br />
If a model is over-fitting, there is a good chance that the next trace will not fit the model.<br />
Note that there is also a concept of not being general enough because there is not enough information in the first place.  In other
words, there weren't enough event logs to make a good model.  The question is what is enough information to make a decision.  In the 
lecture, he went from 1 or two traces to 50-100 traces as an indication that the generalization is good.<br />
</p>
<p>
The question is to be able to write a model that can explain most(all?) of the current traces and predict the future while not being 
overly complicated from outlying traces.
</p>
<h2>Business Process Model and Notation (BPMN)</h2>
<p>
This is a widespread notation and one of the goals is to map the final business process into a BPMN.  It has advanced elements like an or-split and timer/event based XOR gateways.
</p>
<h2>Dependency Graphs and Causal Nets</h2>
<p>
A dependency graph has nodes and arcs where the arc is a relationship between two activities.  The arcs can be annotated with frequency or confidence/certainty.  The dependency graph loses a lot of the semantics of a Petri-net, specifically, the and and or joins.<br />
Causal Nets (C-Net) have more semantics, where there is a representation of the joins.<br />
Converting between a C-Net and a WF-Net requires silent bindings.
</p>
<h2>Learning a Dependency Graph</h2>
<p>
One of the differences between this and the alpha algorithm is that frequency matters.<br />
Causality also matters.  Count the number of times that A is followed by B, minus the number of times that B is followed by A, divided by the sum of these two number + 1.  There is also a case where A=B. If the number is closed to 1, then there is a strong causality<br />
There must be a threshold to indicate that this should be included. <br />
$$ \lvert a \gt _Lb \rvert = \sum_{\sigma \in L} L(\sigma) \times \lvert\{1 \le i \lt \lvert \sigma \rvert \; \lvert \sigma(i) = a  \wedge \sigma(i + 1) = b \} \rvert $$

$$   \lvert a \Rightarrow _Lb \rvert = 
\begin{cases}
\frac {\lvert a \gt _Lb \rvert -\lvert b \gt _La \rvert} {\lvert a \gt _Lb \rvert -\lvert b \gt _La \rvert + 1} ,  & \text{if $a$ } \neq \text {$b$} \\
\frac {\lvert a \gt _Lb \rvert} {\lvert a \gt _Lb \rvert + 1}, & \text{if $a$ = $b$}
\end{cases}$$
</p>

<p>
Work on finding the split join behavior.  
</p>

<p>
Learning Transition System.  An event log consists of traces.  A state can be define as what happened in the past and what is going to happen in the future. <br />
There are various ways to look at a trace.  One is just {a,b,c,d,e} where the order and frequency don't matter.  A multiset extraction captures the number of times something has been executed in the past, but not the order \( [a,b,c^3,d^3,e] \)<br />
A k-tail looks at the k past events.  k-Tail can be combined with the other 3 extractions.
</p>
