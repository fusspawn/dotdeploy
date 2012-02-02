var express = require("express");
var $app = express.createServer();
var $dep = require("deploy_api");

$app.get("/git/post_hook", function(req, res) {
    $dep.on_github_hook(req, res);        
});

$app.listen(8081);
