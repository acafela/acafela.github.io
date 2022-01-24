// // long press에 의한 UI Select 및 context 노출을 막는다.
var preventSelection = $('html')
preventSelection.css('pointer-events', 'none');
preventSelection.css('-webkit-touch-callout', 'none');
preventSelection.css('-webkit-user-select', 'none');
preventSelection.css('-khtml-user-select', 'none');
preventSelection.css('-moz-user-select', 'none');
preventSelection.css('-ms-user-select', 'none');
preventSelection.css('user-select', 'none');
preventSelection[0] && preventSelection[0].addEventListener('contextmenu', function (e) {
    e && e.preventDefault && e.preventDefault();
});

//game balance
var GRAVITY = 0;
var JUMP = 3;
var speed = 5;
var back_rate = 4;
var back_speed = [8, 16, 24, 32];
var back_scale = [1];
var box_rate = 45;
var box_weight = 0.4;
var box_speed = [1, 2, 3];
var shoot_rate = 20;
var rotate_angle = [180];
var position_y = [40, 60, 80, 100, 120, 140, 160, 180];
var up = false;
var v_speed = 5;
var score = 0;
var move_factor = [8, 16, 24];

//usage
var player;
var block;
var box_0, box_1, box_2, box_3;
var bg1, bg2, bg3;
var heart;
var score;
var sample;

var canvas_w;
var camera;

//Data URI image
var image_block_0 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAADFBMVEVHcEzkO0T3diL+rjTe23LhAAAAAXRSTlMAQObYZgAAAFJJREFUeNq90TEOACAMQlGl97+zhoUS44b+iTRv6+hNb6ggkgBQDIwujyQ8uSSSADtdDlF45T1D6jPqn86i3c29RDyd5ZG5b6g7bokwkvMoomgBu1cH6gT3g9gAAAAASUVORK5CYII=";
var image_block_1 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAADFBMVEVHcEwSTokAleks6PVwr68cAAAAAXRSTlMAQObYZgAAAFBJREFUeNq11DEOACEQw0DY/f+fDwlxTkGJXaSaOiObp0H0CCGqqrvX4hSEWOEEhCDcS4SgRDgNpRPQ3akI56N0P91CRVsch5BQOoSJ/B/7AAzFBeAKeXIXAAAAAElFTkSuQmCC";
var image_block_2 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAADFBMVEVHcExoOGy1UIj2dXr/G1j7AAAAAXRSTlMAQObYZgAAAFBJREFUeNq9zjEOACEMxEBI/v9nkJBPq6M2LrbJFBm/Jo3IQEdUVXfvxbmoCWchHiKcgVIkNdAt3qC9z1DmodvlfwLCERKhoe8WwkA4OkJAC9fEBg1vZYSaAAAAAElFTkSuQmCC";
var image_block_3 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAADFBMVEVHcEwmXEI+iUhjx00xIWj1AAAAAXRSTlMAQObYZgAAAEZJREFUeNrl0zEKACAMBEE9//9nhSNwIJarhVslZNq0V/UIRT5IGpUdgXwOEQ5DJ8eh7Bpaq4UkAqXzkIJAu7MAEP53PzUBQdUEgcG0Zx0AAAAASUVORK5CYII=";
var image_effect_0 = 
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAGCAYAAAAPDoR2AAAAMElEQVR4AWO4HRICwv9BGJ0N5vyfOgWMgWwUDJcE0hgY3dj/6MZiU8AAk0RTgOADAGHXXFPSpAdaAAAAAElFTkSuQmCC";
// var image_bg_0 =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABM0lEQVR4nO3ZvWoCQRSGYdfKRDuTxhAQwc5GS2uvxYvyDqwCqa29kWCaaOdfZ7phlD0w48z6Lfg+1SAquxzmZVYbDQAAAAAAAAAAAAAAUIlCfQG3prO5W7922m593B8uMd/z8dlz97b5+XWvr1eLpOvLram+gGfHAMRqkaCQ7PSHg9LPjiej0te/lt9u/fbedfe5/duVvl+VJnaAGAMQkyUoJTuWkBz56pAmdoAYAxB7aIKqOO2kSEmTLyVT7AAxBiBWSYL81PhaLy23Pp/Od592LLkyZaXJl+sExQ4QYwBiSQmKTY0v10OWipWp2J/B2QFiDEDsKkFWUizPkJpYfppCcsQOEGMAYoWfnZCkWHI9TMWqc7JC/pVjB4gxALFiOptnOb08Up2zY7Ee3NgBYgxA7B9sG2f1QPZHWAAAAABJRU5ErkJggg==";
// var image_bg_1 =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABVUlEQVR4nO3ZvU4CQRSG4cEKlA5oNCbGxM4GS2pqgxV3QO/teAdWJtbW3ojBBugQ6bSbDGQnzMn+fCO+T7Uhy0I8OW920TkAAAAAAAAAAADgmLXKvHk0nhW+3h/0/PFysfqxXLM/6PnvtFysDp7//vZkuXx2TtRf4L9jAGLmBIXZOe2e+ePN+qswNQ/Te9P1X55fD55zTJliA8QYgFhSglKyc3Vzbfrg4d2t6fxQHZkKNZksNkCMAYiZE+Sck2THKiVToYvLc/+3mH98+tfrzhEbIMYAxBpNkJUqWU3miA0QYwBi0QTFfmp2FSWoybxYhTlKeaArkyY2QIwBiKUmqPCn5rrvgmJyeKCrKk1sgBgDENtJUJiddqftj7ff21ofvnK+I4qpKk1sgBgDENtJ0Hjy6I/L/LcrB6qsWdPEBogxALH9u6CssvMX745iYmliA8QYgNgvl4Jo+nvIJTYAAAAASUVORK5CYII=";
// var image_bg_2 =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAAA5UlEQVR4nO3WvWoCQRSAUTeV1olNRAhCujSxtLYOpPINfCjfwCpgbe3LqHXstFskMOzfbG4C51Rb7AzDXuZjBwMAAAAAAAAAAAAAAAA6KaIP8NNiuc6yz9P4sXw+Hc/XDvuU3+h0PFe+f9hvGu3/0PxI5GQAwXpPUNOkDEfD8vnyfWmdjnufq4/Wa7+2u8p36mQqlSY3IJgBBEsmKNffSJekvLzOspyhjvf5W+u1qUzVSZMbEMwAghWp1PTxN/JfkpJLKk2T6XOZJjcgmAEEKxbLdWVefjMdf00fKbtPkxsQzACC3QBNtS8X6UNGbwAAAABJRU5ErkJggg==";
var image_player_neutral_0 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAGFBMVEUAAAD////Ay9z3diL+rjT+52EAleks6PVTPJIGAAAAAXRSTlMAQObYZgAAAFxJREFUeNrt0TkOgDAMRFG8cv8bA0GZSBjKAYr8wo1fYcnL7FeJyLdUVaHfpGbm7ieFptLqImKf2pNWZq4tKj1cDwgUmkTrrfIch16+NaiWeBSBYlGiU5zFoLO7NnuPBh9oRzIfAAAAAElFTkSuQmCC";
var image_player_neutral_1 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAGFBMVEUAAAD////Ay9z3diL+rjQAleks6PX+52HNkBuuAAAAAXRSTlMAQObYZgAAAFNJREFUeNrtzrsOgDAMQ1Hygv//YySr8kDomLRD7+oz+DptlYispaoKvZJSd1Izc3fQkaCIuFEdpXsQESl1Ec1fZV4RZR+qqU6KIdVCeauCnv56AR3HBNJj7cMRAAAAAElFTkSuQmCC";
var image_player_neutral_2 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAGFBMVEUAAAD////Ay9z+rjQAleks6PX3diL+52Fqm03VAAAAAXRSTlMAQObYZgAAAFJJREFUeNrtzjsSwCAMA9H4g33/G4ehUIFDKUjBtnqFntuvEpGzVFWhT1HozdTMQHsycvc2YtOI6DQzgUChSbR+lXUkiiaqpZ0UQ4lOcYtBb1+9vf8EHqGypc0AAAAASUVORK5CYII=";
var image_player_act_0 = image_player_neutral_0;
var image_player_act_1 = image_player_neutral_1;
var image_player_act_2 = image_player_neutral_2;

var image_powerup_1 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqAQMAAAD/DVsYAAAABlBMVEUAAAD+52Ext9PwAAAAAXRSTlMAQObYZgAAAENJREFUeAGcxUENgEAMBdEhK6RO2UpDChKqoJ9y/SfCJJMHh25wtpTOklRODP0JvV3/SdhODCdOsdqZo5xn2LyJNUAA4GeNHxj1xREAAAAASUVORK5CYII=";
var image_powerup_2 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqAQMAAAD/DVsYAAAABlBMVEUAAACLm7QWvmnqAAAAAXRSTlMAQObYZgAAAENJREFUeAGcxUENgEAMBdEhK6RO2UpDChKqoJ9y/SfCJJMHh25wtpTOklRODP0JvV3/SdhODCdOsdqZo5xn2LyJNUAA4GeNHxj1xREAAAAASUVORK5CYII=";
var image_powerup_3 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqAQMAAAD/DVsYAAAABlBMVEUAAAD+rjQLDYLHAAAAAXRSTlMAQObYZgAAAENJREFUeAGcxUENgEAMBdEhK6RO2UpDChKqoJ9y/SfCJJMHh25wtpTOklRODP0JvV3/SdhODCdOsdqZo5xn2LyJNUAA4GeNHxj1xREAAAAASUVORK5CYII=";
var image_powerup_4 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqAQAAAADtuPT2AAAAAnRSTlMAAHaTzTgAAABDSURBVHgBnMVBDYBADAXRISukTtlKQwoSqqCfcv0nwiSTB4ducLaUzpJUTgz9Cb1d/0nYTgwnTrHamaOcZ9i8iTVAAOBnjR8Y9cURAAAAAElFTkSuQmCC";
var image_powerup_5 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqAQMAAAD/DVsYAAAABlBMVEUAAAD/8ei4iTeUAAAAAXRSTlMAQObYZgAAAENJREFUeAGcxUENgEAMBdEhK6RO2UpDChKqoJ9y/SfCJJMHh25wtpTOklRODP0JvV3/SdhODCdOsdqZo5xn2LyJNUAA4GeNHxj1xREAAAAASUVORK5CYII=";
var image_bullet =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAJCAIAAACnn3uRAAAABnRSTlMAcgDvAPj8bFmNAAAAJElEQVR4AWMoev8DgnRefCUDwbUPQoPgQv/JAnDtg8+gYRxrAEQv9mCPQW8iAAAAAElFTkSuQmCC";

var image_bg_star_0 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAABCAYAAAAhMKvHAAAALUlEQVQYlWNMPu77nwELuH3oNzZhnODF5V8kqacW+Pzgz4DYSyp4fuQQIzZxAO2eDQJH3FmLAAAAAElFTkSuQmCC";
var image_bg_star_1 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAABCAYAAAAhMKvHAAAALUlEQVQYlWP89zzxPwMW8LP/IDZhnGD5JmGS1FMLLGT4OyD2kgoO3jjHiE0cAEGvCwIc4oF/AAAAAElFTkSuQmCC";
var image_bg_star_2 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAABCAYAAAAhMKvHAAAALElEQVQYlWN8sX3afwYsgG/fE2zCOMH+23wkqacW2PyCNHcOFJhxYgojNnEANx8LAlYbyzkAAAAASUVORK5CYII=";
var image_bg_star_3 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAABCAYAAAAhMKvHAAAALUlEQVQYlWP8////fwYsQPflN2zCOMGVtV9IUk8tILRzwYDYSyp4t6mcEZs4ABC9DAJSWKzyAAAAAElFTkSuQmCC";

// var image_bg =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAADQAgMAAADqsjhuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDg3MTRCODc0MEVFMTFFQTk3QzlBOTQwMDgwMjNCQjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDg3MTRCODg0MEVFMTFFQTk3QzlBOTQwMDgwMjNCQjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0ODcxNEI4NTQwRUUxMUVBOTdDOUE5NDAwODAyM0JCMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0ODcxNEI4NjQwRUUxMUVBOTdDOUE5NDAwODAyM0JCMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PstHD5AAAAAMUExURSwTWEILflcAn2cAvN+7socAAATfSURBVHja7V1NjtpKEG5LPgCzmPt4AQdAco/EAZ4X3IeFcwBL2FIOwFvkPlk8DhBpHHf99I8BMxN4pMzUF9P191V1UZpVoBtjFAqFQqFQKBQKxXNjQf8GbTFI96A0sKCLmQtwLTgPA2zTi91Y0K+s+QJUj/b03fiK3icbGWIsxwBiFEx4JjO0Go4YXs4WTGnZSVkT7SseLxewmDQvkRcf46eZi6noDCaYJT1nZGf0CuEJ5RyyC64se/kMhj/C3Peam8jK44gPs8hjRz7x/vORkX+IGDtfhMMURWEKMwhDgh4XgBhEioIJbiEC2sFyFGOQjcUK5sfV/ENO2t0nFqEZly1+gktEDk+k56S5NecFZR678sDNwUM5PkpUCOWczem8C8bD/iE8mwl+HMXyoXjCCT4Y5lU45E9wvbYOayfXFlYH0EGCbiFig59C5LBk4RJzOLy2gYam9RmUQG7qh6TFCZYTb6Gc8pbTb7+8wwStcMj/GxQ/QbeUqJfwKgdRosqeIMskeWSmdRJneeKJjLL0KWVUtwT/PCaoDT51g/8Ih/wJvgmH/AlWwqETvHmCm029qQcMclBwxRd5N7RuADU6iOqcNdKB4Mm+CLmQhuU3XBxLRkWwBm2OO9byJ1gLx6Mm2DzvBNt2217C9qqDfMG/3QYiq9tRquNsA3cac5igbJi9cMif4DfhkD9BbfArNNi1Xdc5o3MSVLQxBivTOhIduZkMDiJzlLJaDnW4kS9I+cQNRrRzN4MJ/iscOsGbJ/hdOORP8KdwyJ/gf8JhfgiH/An+Eg75E+yFQyd48wTf3/v3GH2QaeA8+knzQvB80nhHNORP8Aji6NA7/QgPu45OkPdILmAcI/SUjAVQARYX9XU9Fx8qPq4fNh5e8ieoDWqD2qA2qA1qg9qgNqgNaoPaoDaoDWqD2qA2qA1qg/Nt8Cgcc/g/atnQz0nu8Vld7z8Y66M1Qo+u/lzs15Xkvo+i/Zjfn+b2/GCyfl78/J8X63cWnn6C+r2Z27+71cLj0LLyPShst+5BSuuZ7YjbprJtE2frl9PN2pMd0a3fH7z9+4OdcMif4AEErIcDq5GzbSPn4UKVlH8Yp6XUA9PjqDdGuxz0i97aoJ4nmf15ksvnsfaT7v3V81z7C3X2uFwvAKQ5T1DIubqmqpqmwcOXKJzZ0FlMpzoHH81sGiI3mICRhmh8ihOKeEG0NJE2bEKUzn/6XMqY7enY7YlyBdv/7XzxbueeGhcUqNUusMN1hyw02eFljRaGayJH1DqEd7gHJWDAx0Nh3P6R54tvOeMuG3rPwh3u+qje3KuqQAvGW1jBGfveiEsJfoUiVShSMbPiEuCsPB99oTw1UIUN9L6Z579vRhv8Cg2uQFutVk4lw7K+ohBHyescPmGFyYQVP2SdhMKOgWaDO+XKn2ApHHr/oN7g+PfvYbXWXXc6rKgMYlBJAc0ZIMiyQEyi4MKItcREheoS12J5TnoNtXj3V8sXsGIXM5gg37m7Tm7gXae+NDg2J7D+AncBz+I25eSK6aIoYPV+5yhwBeEsZKHhqcWSEtkDOvuTmk4WkR5SlnGxwS1/gvlVLD8bXOZ/iHOJ8icI9+GPflCgePTvP0w1MIsJzvL3SXSCn/yNHLGYwa803RF3LUYlFQqFQqFQKBQKheJv4jdCzAqBnoC4aAAAAABJRU5ErkJggg==";

var image_explode_0 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAABgAQMAAAD/3TO6AAAABlBMVEX///////9VfPVsAAAAAXRSTlMAQObYZgAAAOhJREFUeF7V2DEOhCAQBVAMhaVH4CjeTDwaR/EIlBbG2WWQNb/d6v8pbMgjmQAOTPgnFrPqgBwjSPaNUwLHBkoHVttcvHgy2x9sHg7Wq38pMeY5d3z4jB3YzohxJ60dtzyX8xmtlBjz9PCVy6WDeDNizHPgGsI2wEaB8TAgzgPfIdYBlkKAsRrA8gBOLz6JcG7TB1yeaL8oaR9gIsBYGXQwlk/EyVn0oesFKwPGmoS7yr8h62G/DbDh+WDE+lh5k+gfSdEfoGa5US3uolcp0Yur5jNB9FEm+gQWbThotnc0m2m6rUvRRvEHbkHCZWgFWEUAAAAASUVORK5CYII=";
var image_explode_1 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAABgBAMAAAA3PbzKAAAAD1BMVEX///8/KDKeKDX3diL+52FVrqTsAAAAAXRSTlMAQObYZgAAATxJREFUeAHt3AGmhFAUgOE781rAzA7SCqINDNr/mh6ES53OFO/q5fsBDHxxnF6vbrlf76pyvYCBh6qy3+O90QsY+Jra3Lye2xaTDAz8My2NmTYo17YyAwNPq0rUcwjrtxfS3my/gIH/cnrrxniA41LS+nIAA7fQRubnkNQHnlZjDAw87RYOcFwNzjEPYOCv6+alz3lwPsDxGGcDfOxnwMBzVbaT4saz4HwnxZsJGDgc4GSMpy8Kd1LcsX3zAAbOm1f9YzAwcDdv9DkLjndSeCH6Q/dPyY+Bgeeg6DYraQzAfVl63gEMDFyqToKBgbvVdgEGBgYGtpaAgf3xAAzsEQ8wsAfx7cHA/l0KDOylFmBgrx5eGgzsBXFg4Pt8xgMM7GNLYGBnALQFAzu4BBjY8VLAwA4BBAY+nbNpgX8BVdR+ISIXqSUAAAAASUVORK5CYII=";
var image_explode_2 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAABgBAMAAAA3PbzKAAAAD1BMVEX///9oOGy1UIj2dXrot5YpWbZ1AAAAAXRSTlMAQObYZgAAATxJREFUeAHt3AGmhFAUgOE781rAzA7SCqINDNr/mh6ES53OFO/q5fsBDHxxnF6vbrlf76pyvYCBh6qy3+O90QsY+Jra3Lye2xaTDAz8My2NmTYo17YyAwNPq0rUcwjrtxfS3my/gIH/cnrrxniA41LS+nIAA7fQRubnkNQHnlZjDAw87RYOcFwNzjEPYOCv6+alz3lwPsDxGGcDfOxnwMBzVbaT4saz4HwnxZsJGDgc4GSMpy8Kd1LcsX3zAAbOm1f9YzAwcDdv9DkLjndSeCH6Q/dPyY+Bgeeg6DYraQzAfVl63gEMDFyqToKBgbvVdgEGBgYGtpaAgf3xAAzsEQ8wsAfx7cHA/l0KDOylFmBgrx5eGgzsBXFg4Pt8xgMM7GNLYGBnALQFAzu4BBjY8VLAwA4BBAY+nbNpgX8BVdR+ISIXqSUAAAAASUVORK5CYII=";
var image_explode_3 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAABgBAMAAAA3PbzKAAAAD1BMVEX///8STokAleks6PX///8Hotk0AAAAAXRSTlMAQObYZgAAATxJREFUeAHt3AGmhFAUgOE781rAzA7SCqINDNr/mh6ES53OFO/q5fsBDHxxnF6vbrlf76pyvYCBh6qy3+O90QsY+Jra3Lye2xaTDAz8My2NmTYo17YyAwNPq0rUcwjrtxfS3my/gIH/cnrrxniA41LS+nIAA7fQRubnkNQHnlZjDAw87RYOcFwNzjEPYOCv6+alz3lwPsDxGGcDfOxnwMBzVbaT4saz4HwnxZsJGDgc4GSMpy8Kd1LcsX3zAAbOm1f9YzAwcDdv9DkLjndSeCH6Q/dPyY+Bgeeg6DYraQzAfVl63gEMDFyqToKBgbvVdgEGBgYGtpaAgf3xAAzsEQ8wsAfx7cHA/l0KDOylFmBgrx5eGgzsBXFg4Pt8xgMM7GNLYGBnALQFAzu4BBjY8VLAwA4BBAY+nbNpgX8BVdR+ISIXqSUAAAAASUVORK5CYII=";
var image_explode_4 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAABgBAMAAAA3PbzKAAAAElBMVEX///8ZPD4mXEI+iUhjx03///9UIcu4AAAAAXRSTlMAQObYZgAAAUFJREFUeAHt3DFug0AQQNG14/T2DZBPgMQFXHCANL7/VdJQrATDGKSsCHq/dvOQRkMCbDlfj6pyvICBn1VlvctjoTsw8DG1uXk+ty0mGRj4a5jqM21Qrm1lBgYeZpWo6zOsW15Ia7N9Bwb+y+mt6+MBjlslBZcDGLiBNjJfn0ld4Gk1xsDAw2rxAIfV4BxzAQb+uNs49doPjgc4H+N0gDf9DBh4rMp3UlS/ExzvpHgzAQPnA5yM8fBB8U4K27ZvLsDAeeMsYOB/DL6NC732g6OdFF6IbtP9U/JjYOAxKLvNCuoDcFemrsDAZwCXKmDgneDv9/sHGBgYGDjOWgIG9scDMLB/8QADe/IA7HEpMHB7sJdagIG9awl8WLAXxIGBfcYDDOzrUuDzgZ0BANwE7OASYGDHSwEDOwQQGHh7zqYF/gXOl39TYtX+SwAAAABJRU5ErkJggg==";
var sprite_explode_0;
var sprite_explode_1;
var sprite_explode_2;
var sprite_explode_3;
var sprite_explode_4;
var explode_ani;
var explode_ani_b;
var explode_ani_c;
var explode_ani_d;
var explode_ani_e;

var cam_x;
var cam_y;
var random_shake;

function preload() {
    // sprite boxes
    box_0 = loadImage(image_block_0);
    box_1 = loadImage(image_block_1);
    box_2 = loadImage(image_block_2);
    box_3 = loadImage(image_block_3);

    // sprite heart
    heart = loadImage(image_effect_0);

    // sprite platform
    // bg1 = loadImage(image_bg_0);
    // bg2 = loadImage(image_bg_1);
    // bg3 = loadImage(image_bg_2);

    // bg_sphere = loadImage(image_bg);

    // sprite powerup
    powerup = loadAnimation(
        image_powerup_1,
        image_powerup_2,
        image_powerup_3,
        image_powerup_4,
        image_powerup_5
    );

    // laser to shoot
    laser = loadImage(image_bullet);

    // background effect
    meteor_1 = loadImage(image_bg_star_0);
    meteor_2 = loadImage(image_bg_star_1);
    meteor_3 = loadImage(image_bg_star_2);
    meteor_4 = loadImage(image_bg_star_3);

    // explode effect
    sprite_explode_0 = loadSpriteSheet(image_explode_0, 96, 96, 5);
    sprite_explode_1 = loadSpriteSheet(image_explode_1, 96, 96, 5);
    sprite_explode_2 = loadSpriteSheet(image_explode_2, 96, 96, 5);
    sprite_explode_3 = loadSpriteSheet(image_explode_3, 96, 96, 5);
    sprite_explode_4 = loadSpriteSheet(image_explode_4, 96, 96, 5);

    explode_ani = loadAnimation(sprite_explode_0);
    explode_ani_b = loadAnimation(sprite_explode_1);
    explode_ani_c = loadAnimation(sprite_explode_2);
    explode_ani_d = loadAnimation(sprite_explode_3);
    explode_ani_e = loadAnimation(sprite_explode_4);
}

function setup() {
    //canvas draw at dom
    //canvas width : min 320, max 640
    canvas_w = Math.min(Math.max(320, windowWidth), 640);
    var canvas = createCanvas(canvas_w, 208);
    canvas.parent("gameframe");

    cam_x = canvas_w / 2;
    cam_y = 104;

    camera.position.x = cam_x;
    camera.position.y = cam_y;

    // grouping
    blocks = new Group();
    boxes = new Group();
    platforms = new Group();
    hearts = new Group();
    bullets = new Group();

    // platform draw first
    ground = createSprite(0, 208, 1280, 1);
    ground.shapeColor = "transparent";
    ground.immovable = true;

    ground2 = createSprite(0, 0, 1280, 1);
    ground2.shapeColor = "transparent";
    ground2.immovable = true;

    //ground texture
    // var platform_count = width / 96 + 2;
    // for (var i = 0; i < platform_count; i++) {
    //   platform = createSprite(i * 96, 208 - 24);
    //   var rand_land = random([0, 1, 2]);
    //   if (rand_land == 0) {
    //     platform.addImage("normal", bg1);
    //   } else if (rand_land == 1) {
    //     platform.addImage("normal", bg2);
    //   } else {
    //     platform.addImage("normal", bg3);
    //   }
    //   platform.immovable = true;
    //   platforms.add(platform);
    // }

    //   for (var i = 0; i < platform_count; i++) {
    //     platform = createSprite(i * 96, 24 );
    //     var rand_land = random([0, 1, 2]);
    //     if (rand_land == 0) {
    //       platform.addImage("normal", bg1);
    //     } else if (rand_land == 1) {
    //       platform.addImage("normal", bg2);
    //     } else {
    //       platform.addImage("normal", bg3);
    //     }
    //     platform.mirrorY(-1);
    //     platform.immovable = true;
    //     platforms.add(platform);
    //   }

    // player
    player = createSprite(40, 72);
    player.addAnimation(
        "walk",
        image_player_neutral_0,
        image_player_neutral_1,
        image_player_neutral_2
    );
    // player.addAnimation(
    //   "jump",
    //   image_player_act_0,
    //   image_player_act_1,
    //   image_player_act_2
    // );
}

function draw() {
    // background
    background("#201747");

    var random_add = 0;

    //timeloop
    if (frameCount % box_rate == 0) {
        random_add = random([0, 1, 2, 3]);

        createBlock(120, 120);
    }

    if (frameCount % back_rate == 0) {
        createMeteor();
    }

    if (frameCount % shoot_rate == 0) {
        createLaser(player.position.x, player.position.y);
    }
    // for (var i = 0; i < blocks.length; i++) {
    //   //touch to eat
    //   if (blocks[i].chase == true) {
    //     blocks[i].velocity.x =
    //       (player.position.x - (blocks[i].position.x - 5)) * 0.03;
    //     blocks[i].velocity.y =
    //       (player.position.y - (blocks[i].position.y - 4)) * 0.03;
    //     // blocks[i].rotateToDirection = true;
    //     blocks[i].scale += -0.05;
    //   } else {
    //     blocks[i].velocity.y += GRAVITY * box_weight;
    //   }
    // }

    // platforms reset
    for (var i = 0; i < platforms.length; i++) {
        platforms[i].velocity.x = -speed;

        if (platforms[i].position.x < -102) {
            platforms[i].position.x = width + 102;
        }
    }

    // player landing
    if (player.collide(ground)) {
        player.velocity.y = 0;
        // player.changeAnimation("walk");
    }

    if (player.collide(ground2)) {
        player.velocity.y = 0;
        // player.changeAnimation("walk");
    }

    //heart die
    for (var i = 0; i < hearts.length; i++) {
        var move_factor = [-3, -2, -1, 1, 2, 3];
        hearts[i].velocity.x += random(move_factor) * 0.5;
        hearts[i].velocity.y += random(move_factor) * 0.5;
        hearts[i].scale += 0.03;
    }

    for (var i = 0; i < blocks.length; i++) {
        blocks[i].rotation += 4;
    }

    // gravity to player
    // player.velocity.y += GRAVITY;
    if (up == true) {
        player.position.y -= v_speed;
    } else {
        player.position.y += v_speed;
    }

    // if (mousePressed == true) {
    //   up = true;
    //   // player.position.y += -v_speed;
    // } else {
    //   up = false;
    //   // player.position.y += v_speed;
    // }

    blocks.overlap(bullets, checkHit);

    // score
    textSize(14);
    textStyle(BOLD);
    fill(130, 130, 200);
    // textFont("VT323");
    // textAlign(RIGHT);
    // text(score + " POINT", width - 20, 32);
    text("SCORE " + score, 20, 28);
    drawSprites();
}

// player jump
function mousePressed() {
    // var player_state = player.getAnimationLabel();
    // player.changeAnimation("jump");
    // player.animation.looping = true;
    if (up == true) {
        up = false;
    } else {
        up = true;
    }
    // player.position.x += -v_speed;
}

function createBlock(x, y) {
    var a = createSprite(canvas_w + 40, random(position_y));
    var img = loadImage(
        random([image_block_0, image_block_1, image_block_2, image_block_3])
    );
    a.addImage(img);
    a.life = 800;
    a.addSpeed(random(box_speed), random(rotate_angle));
    blocks.add(a);
    return a;
}

function checkHit(block, bullet) {
    score += 100;
    bullet.life = 1;
    block.life = 1;
    bullet.remove();
    block.remove();
    return createExplosion(block, bullet);
}

function createExplosion(block, bullet) {
    // var select_ani = random(explodes);
    var heart_count = random([8, 12, 16]);
    for (var i = 0; i < heart_count; i++) {
        heart_shape = createSprite(
            bullet.position.x + round(random(-32, 32)),
            bullet.position.y + round(random(-32, 32))
        );
        heart_shape.addAnimation(
            "normal",
            random([
                explode_ani,
                explode_ani_b,
                explode_ani_c,
                explode_ani_d,
                explode_ani_e
            ])
        );
        heart_shape.scale = random([0.1, 0.2, 0.3]);
        heart_shape.life = heart_shape.scale * 70;
        hearts.add(heart_shape);
        makeShaking();
    }
}

function makeShaking() {
    if (camera.position.x != cam_x) {
        camera.position.x = cam_x;
    } else {
        random_shake = random([10, 20, 30]);
        camera.position.x += random_shake;
    }
}

function createLaser(x, y) {
    //bullet spawn
    bullet = createSprite(x + 40, y + 5);
    bullet.addImage("normal", laser);
    bullet.life = 50;
    bullet.addSpeed(20, 0);
    bullets.add(bullet);
    return bullet;
}

function createMeteor() {
    var a = createSprite(640 + 102, random(0, 208));
    var img = loadImage(
        random([image_bg_star_0, image_bg_star_1, image_bg_star_2, image_bg_star_3])
    );
    var a_speed = random(back_speed);
    a.addImage(img);
    // a.chase = false;
    a.scale = random(back_scale);
    a.addSpeed(a_speed, rotate_angle);
    a.life = 60 * a_speed;
    return a;
}
