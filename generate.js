const vdf       = require('vdf'),
    snakeCase   = require('lodash.snakecase'),
    fs          = require('fs'),
    path        = require('path'),
    hbs         = require('handlebars');

// read mod textfile
const mod_textures    = vdf.parse(fs.readFileSync(path.resolve(__dirname, "src/mod_textures.txt"), "utf-8"));
const heroes_file     = JSON.parse(fs.readFileSync(path.resolve(__dirname,  "src/heroes.json")))["result"]["heroes"];

// make heroes a hash
const heroes = {};
heroes_file.forEach(obj => {
   heroes[obj["name"]] = obj;
});

// icons object from hash, keys might change on future updates
const icons = mod_textures["sprites/640_hud"]["TextureData"];

const heroIcons = [];

for(key in icons) {
    // pick only icons from hero sheet file, this could be extended in the future
    if(icons[key]["file"] != "materials/vgui/hud/minimap_hero_sheet.vmat")  {
        continue;
    }
    const hero_name = key.substring(17)

    // this considers brewmaster spirits and arcana items
    if(typeof(heroes[hero_name]) == "undefined") {
        heroes[hero_name] = { id: null, name: hero_name, localizedSlug: null }
    } else {
        heroes[hero_name].localizedSlug = snakeCase(heroes[hero_name]["localized_name"].replace(/'/,"")); // remove ' from Nature's Prophet to avoid nature_s_prophet slug
    }

    const data = {
        id:         heroes[hero_name]["id"],
        name:       hero_name.substring(14),
        name_full:  heroes[hero_name]["name"],
        width:      icons[key]["width"] !== "32" ? icons[key]["width"] : undefined,
        height:     icons[key]["height"] !== "32" ? icons[key]["height"] : undefined,
        x:          icons[key]["x"],
        y:          icons[key]["y"]
    };

    if(heroes[hero_name].localizedSlug != data.name) {
        data.localizedSlug = heroes[hero_name].localizedSlug;
    }

    heroIcons.push(data);
};

const template = hbs.compile(
    fs.readFileSync(path.resolve(__dirname, "src/dota2minimapheroes.css.hbs"), "utf-8")
);

const output = template({
    heroes: heroIcons
});

fs.writeFileSync("assets/stylesheets/dota2minimapheroes.css", output);

// var demoTemplate = swig.compileFile(__dirname + "/src/demo.html.swig");
// var demoOutput = demoTemplate({
//     heroes: heroIcons
// });

const demoTemplate = hbs.compile(
    fs.readFileSync(path.resolve(__dirname, "src/demo.html.hbs"), "utf-8")
);
const demoOutput = demoTemplate({
    heroes: heroIcons
});

fs.writeFileSync("demo.html", demoOutput);

console.log("CSS and Demo files generated");