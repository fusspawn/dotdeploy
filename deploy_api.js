var $p = require("procstreams");
var $d = module.exports = {};
var $fs = require("fs");

$d.on_github_hook = function(req, res) {
    $d.log("GitHub", "Handling github post hook");
    var hook_payload = JSON.parse(req.param("payload", "{error: \"Couldnt extract payload data from github hook\"}"));
    if(hook_payload.error)
    {
        res.write("(GitHook): " + hook_payload);
        return;
    }
    
    $d.clone_repo_from_hook(hook_payload, function() {
        var proc = $("dotcloud push --all " + hook_payload.repository.name  + "/" + hook_payload.repository.id)    
        proc.data(function(stdout, stderr) {
            $d.log("GitHub", stdout);
        });
        proc.on("exit", function() {
            console.log("deploy complete");
        });
    });
};

$d.log = function(from, message) {
    console.log("("+from+"): " + message);
};

$d.clone_repo_from_hook = function(git_data, callback) {
    $d.log("GitHub", "Running Git clone");
    var repo = git_data.repository.name;
    var id =  git_data.commits[git_data.commits.length - 1].id;
    var git_url = git_data.repository.url.replace("http://", "git://");
    var proc  = $p("git clone "+git_url+" "+repo+"/"+id);
    proc.data(function(stdout, stderr) {
        $d.log("GitHub", stdout);
    });
    proc.on("exit", function() {
        callback();
    });
};

$d.run_pre_dep = function(cb) {
    
};