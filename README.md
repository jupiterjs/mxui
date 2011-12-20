@page Mxui Mxui
@parent index 6
@tag beta

Mxui is a __BETA__ UI library for 
jQueryMX.  It's designed to be lightweight, 
with limited options, but flexible enough
to be extended and mixed for richness.  

Here's what's inside:

  - [Mxui.Nav.Accordion Accordion] - an accordion widget.
  - [Mxui.Layout.Bgiframe Bgiframe] - adds a background iframe to stop IE's input element 'bleed' problem.
  - [Mxui.Layout.Block Block] - makes an element fill up another element or window.
  - [jQuery.fn.mxui\_layout\_fill Fill] - makes complex layouts easy.
  - [Mxui.Layout.Modal Modal] - creates a modal
  - [Mxui.Layout.Resize Resize] - allows resizing of widgets
  - [Mxui.Nav.Selectable Selectable] - keyboard and mouse navigation.
  - [Mxui.Nav.Slider Slider] - a slider
  - [Mxui.Layout.Sortable Split] - sort elements.
  - [Mxui.Layout.Split Split] - a splitter widget
  - [Mxui.Layout.TableScroll TableScroll] - makes a tbody scroll.

## Demo

The following shows almost all of the above controls in action:
   
@demo mxui/demo.html

## Installing

If you are using github, you can simply add `mxui` as a submodule
the same way you added `steal`, `jquerymx`, etc.  Simply
fork and clone 
[https://github.com/jupiterjs/mxui https://github.com/jupiterjs/mxui].

You can also install Mxui from the command line.  Run:

    ./js steal/getjs mxui
    
If you only want part of MXUI, you can install that like:

    ./js steal/getjs mxui/layout/fill
    


## In Progress

We also have the following widgets which we are working on:

  - Grid - a basic grid
  - Tree - a basic tree
  - Combobox - a rich combobox 

