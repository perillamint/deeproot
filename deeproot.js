var util = require('util');
var net = require('net');
var sockets = [];
var jailmanager = require('./jailmanager.js');


jailmanager.jailDir = '/tmp/'

jailmanager.registerMountPoint('/sdcard/mountdir/foo1/', 'foo1');
jailmanager.registerMountPoint('/sdcard/mountdir/foo2/', 'foo2');

jailmanager.createJail('/sdcard/jail/');
jailmanager.createJail('/sdcard/jail/');

jailmanager.destroyAll();