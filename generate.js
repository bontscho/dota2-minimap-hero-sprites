var vdf     = require('vdf'),
    fs      = require('fs'),
    swig    = require('swig');

// read mod textfile
var mod_textures    = vdf.parse(fs.readFileSync(__dirname + "/src/mod_textures.txt", "utf-8"));
var heroes_file     = JSON.parse(fs.readFileSync(__dirname + "/src/heroes.json"))["result"]["heroes"];

// make heroes a hash
var heroes = {};
heroes_file.forEach(function(obj) {
   heroes[obj["name"]] = obj;
});

// icons object from hash, keys might change on future updates
var icons = mod_textures["sprites/640_hud"]["TextureData"];

var heroIcons = [];

for(key in icons) {
    // pick only icons from hero sheet file, this could be extended in the future
    if(icons[key]["file"] != "vgui/hud/minimap_hero_sheet")  {
        continue;
    }
    var hero_name = key.substring(17)

    // this considers brewmaster spirits and arcana items
    if(typeof(heroes[hero_name]) == "undefined") {
        heroes[hero_name] = { id: null, name: hero_name }
    }

    var data = {
        id:         heroes[hero_name]["id"],
        name:       hero_name.substring(14),
        name_full:  heroes[hero_name]["name"],
        width:      icons[key]["width"],
        height:     icons[key]["height"],
        x:          icons[key]["x"],
        y:          icons[key]["y"]
    }

    heroIcons.push(data);
};

var template = swig.compileFile(__dirname + "/src/dota2minimapheroes.css.swig");
var output = template({
    heroes: heroIcons
});

fs.writeFileSync("assets/stylesheets/dota2minimapheroes.css", output);

console.log("CSS file generated");