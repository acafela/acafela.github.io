---
title: "Category"
layout: page
permalink: /category
---

<div class="category-container">
  <h1 id="posts-label">{{ page.title }}</h1>
  {% for category in site.categories %}
  <h2 id="{{category | first}}">{{category | first}}</h2>
  <ul>
    {% for posts in category %}
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