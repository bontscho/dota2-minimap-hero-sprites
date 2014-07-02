# Dota2 Minimap Hero Sprites

This is a CSS spritesheet for Dota 2 Minimap Hero Icons.

## Demo & Usage

Add class `d2mh` to `<i>` tag and reference the wanted hero by adding an additional class in the format of `<heroname>`, `npc_dota_hero_<heroname>` or `hero-<hero_id>`:

``` html
<i class="d2mh axe"></i>
<i class="d2mh npc_dota_hero_gyrocopter"></i>
<i class="d2mh hero-5"></i>
```

### Output:

![Output example](example.png)

## Installation

Just copy the assets folder and link to the stylesheet in your HTML.

## Update Workflow

1. Update `src/heroes.json` with latest json output from `http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1?language=en_us&key=<your steam web api key>`
2. Extract `materials/vgui/hud/minimap_hero_sheet.vtf` from Dota 2 pak files and export to `assets/images/minimap_hero_sheet.png`
3. Extract `scripts/mod_textures.txt` from Dota 2 pak files to `src/mod_textures.txt`
4. Run `npm install` to get the required packages for the generator script
5. Run `node generate.js`

### Tools

Tools I used: [Gibbeds VPK Extractor](https://developer.valvesoftware.com/wiki/Gibbeds_VPK_Extractor), [VTFEdit](https://developer.valvesoftware.com/wiki/VTFEdit)

Get Steam WebAPI Key from: http://steamcommunity.com/dev

Full List of Third Party Tools: https://developer.valvesoftware.com/wiki/Category:Third_Party_Tools

All game images and names are property of Valve Corporation.
