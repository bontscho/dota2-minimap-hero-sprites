.d2mh {
    background-image: url("../images/minimap_hero_sheet.png");
    background-repeat: no-repeat;
    display: inline-block;
}

{% for hero in heroes %}
.d2mh.{{ hero.name }}, .d2mh.{{ hero.name_full }}{% if hero.id %}, .d2mh.hero-{{ hero.id }}{% endif %} {
    width: {{ hero.width }}px;
    height: {{ hero.height }}px;
    background-position: -{{ hero.x }}px -{{ hero.y }}px;
}
{% endfor %}