var vdf     = require('vdf'),
    _       = require('lodash'),
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
    if(icons[key]["file"] != "materials/vgui/hud/minimap_hero_sheet.vmat")  {
        continue;
    }
    var hero_name = key.substring(17)

    // this considers brewmaster spirits and arcana items
    if(typeof(heroes[hero_name]) == "undefined") {
        heroes[hero_name] = { id: null, name: hero_name, localizedSlug: null }
    } else {
        heroes[hero_name].localizedSlug = _.snakeCase(heroes[hero_name]["localized_name"].replace(/'/,"")); // remove ' from Nature's Prophet to avoid nature_s_prophet slug
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

    if(heroes[hero_name].localizedSlug != data.name) {
        data.localizedSlug = heroes[hero_name].localizedSlug;
    }

    heroIcons.push(data);
};

var template = swig.compileFile(__dirname + "/src/dota2minimapheroes.css.swig");
var output = template({
    heroes: heroIcons
});

fs.writeFileSync("assets/stylesheets/dota2minimapheroes.css", output);

var demoTemplate = swig.compileFile(__dirname + "/src/demo.html.swig");
var demoOutput = demoTemplate({
    heroes: heroIcons
});

fs.writeFileSync("demo.html", demoOutput);

console.log("CSS and Demo files generated");