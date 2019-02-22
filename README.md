# Dynamic Classes

## Description

This widget will set classes to the parent element with the help of a string result of a nanoflow and/or microflow.

## Typical usage scenario

Set some classes in your styling and apply them dynamically with this widget. For example:
* Determine the class based on a status attribute of the context object;
* Determine the class based on a status attribute of an associated object;
* Determine the class based on the result of a calculation;
* Determine the class based on a user profile of the current user.

## Features and limitations

You can set a class with either nanoflow, microflow or even both.
It has not been tested for offline apps.

## Dependencies

You need at least Modeler 7.23.0.

## Configuration

Make sure the classes are available in your styling.
Configure the widget with a nanoflow, microflow or both. These flows should use the context object as parameter and return type should be a string.
