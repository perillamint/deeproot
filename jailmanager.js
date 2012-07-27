var fs = require('fs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var wrench = require('wrench');
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
  var destJail = "jail_" + (Math.floor(Math.random() * 100000));
  jails.push(destJail);
  var ret = destJail;
  destJail += '/';
  
  wrench.copyDirSyncRecursive(sourceJail, jailDir + destJail);
  
  for(i=0; i<mountList.length; i++)
  {
    fs.mkdirSync(jailDir + destJail + mountList[i][1]);
    var mount = spawn('mount', ['-o', 'bind', mountList[i][0], jailDir + destJail + mountList[i][1]]);
  }
  
  return destJail;
}

function jailRunner(app)
{
  //TODO: write regexp to filter all special character in app variable.
  //TODO: register child process to jail list.
  exec("chroot " + app);
}

function destroyJail(jail)
{
  //TODO: add jail deleter.
  var loop = true;
  var i;
  for(i=0; i<mountList.length; i++)
  {
    var umount = spawn('umount', [jailDir + jail + '/' + mountList[i][1]]);
  }
  
  while(loop)
  {
    loop = false;
    try {
      wrench.rmdirSyncRecursive(jailDir + jail);
      console.log("Deleting...");
    } catch (error) {
      console.log("error detected.");
      loop = true;
    }
  }
}

function destroyAll()
{
  var i;
  for(i=0; i<jails.length; i++)
  {
    destroyJail(jails[i]);
  }
}
