var fs = require('fs');
var spawn = require('child_process').spawn;
var jails = [];
var mountList = [];
var jailDir = '/tmp/';

exports.registerMountPoint = registerMountPoint;
exports.createJail = createJail;
exports.destroyJail = destroyJail;
exports.destroyAll = destroyAll;
exports.jailDir = jailDir;

function registerMountPoint(source, mount)
{
  var mntpt = [];
  mntpt.push(source);
  mntpt.push(mount);
  mountList.push(mntpt);
}

function createJail(sourceJail)
{
  //TODO: write regexp to filter all special character in sourceJail variable.
  //TODO: add random string generator.
  var i;
  var destJail = Math.random() + '/'; //TODO: Write jail name generator;
  
  var cp = spawn('cp', ['-r', sourceJail, jailDir + destJail]);
  
  for(i=0; i<mountList.length; i++)
  {
    fs.mkdirSync(jailDir + destJail + mountList[i][1])
    var mount = spawn('mount', ['-o', 'bind', mountList[i][0], jailDir + destJail + mountList[i][1]]);
  }
  jails.push(destJail);
  
  return destJail;
}

function destroyJail(jail)
{
  //TODO: add jail deleter.
  var i;
  for(i=0; i<mountList.length; i++)
  {
    var umount = spawn('umount', [jailDir + jail + mountList[i][1]]);
  }
  
  var rm = spawn('rm', ['-rf', jailDir + jail]);
}

function destroyAll()
{
  var i;
  for(i=0; i<jails.length; i++)
  {
    destroyJail(jails[i]);
  }
}
