---
title: "Tags"
layout: page
permalink: /category
---

<div class="category-container">
  <h1 id="posts-label">{{ page.title }}</h1>
  {% for tag in site.tags %}
  <h3 id="{{category | first}}">{{tag | first}}</h3>
  <ul>
    {% for posts in tag %}
      {% for post in posts %}
        {% if post.url %}
          <li class="category-post-title">
            <a href="{{ post.url | prepend: site.url }}">{{ post.title }}</a>
            <time>
              {{ post.date | date:"%F" }}
            </time>
          </li>
        {% endif %}
      {% endfor %}
    {% endfor %}
  </ul>
  {% endfor %}
</div>