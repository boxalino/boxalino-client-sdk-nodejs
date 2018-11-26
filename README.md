# boxalino

## Description

The Boxalino Client SDK provides a simple and efficient usage of Boxalino Search & Recommendations services (based on the p13n Thrift client libraries as separately provided in respective git-hub repositories) and to Boxalino Data Intelligence especially for Data Synchronization (define the structure of your data, push and publish your data structure configuration, push data in dev/prod and full/delta to Boxalino).

The Boxalino Client SDK are particularly interesting for integrators of Boxalino technologies and provides the following advantages compare to using the underlying API directly.

## Install
Install it manually
``` 
npm install boxalino
```
or define this package as a dependency in your setup.

## Usage
Example snippets on how the library can be used are to be found in examples folder
In your code, add the boxalino library by:

```
var boxalino = require('boxalino').Boxalino;
var bxClient = boxalino.BxClient(account, password, isDev, host);
```

## Thrift
This package contains server-generated files for Apache Thrift 0.10.0 version which are located under bxthrift folder