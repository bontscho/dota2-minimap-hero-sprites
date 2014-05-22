.d2mh {
    background-image: url("../images/minimap_hero_sheet.png");
    background-repeat: no-repeat;
    display: inline-block;
    width: 32px;
    height: 32px;
}
{% for hero in heroes %}
.d2mh.{{ hero.name }}, .d2mh.{{ hero.name_full }}{% if hero.id %}, .d2mh.hero-{{ hero.id }}{% endif %} { {% if (hero.width != 32) %}}
    width: {{ hero.width }}px;{% endif %}{% if (hero.height != 32) %}}
    height: {{ hero.height }}px;{% endif %}
    background-position: -{{ hero.x }}px -{{ hero.y }}px;
}
{% endfor %}