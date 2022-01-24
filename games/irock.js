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
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_block_1 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_block_2 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_block_3 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_effect_0 = 
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
// var image_bg_0 =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABM0lEQVR4nO3ZvWoCQRSGYdfKRDuTxhAQwc5GS2uvxYvyDqwCqa29kWCaaOdfZ7phlD0w48z6Lfg+1SAquxzmZVYbDQAAAAAAAAAAAAAAUIlCfQG3prO5W7922m593B8uMd/z8dlz97b5+XWvr1eLpOvLram+gGfHAMRqkaCQ7PSHg9LPjiej0te/lt9u/fbedfe5/duVvl+VJnaAGAMQkyUoJTuWkBz56pAmdoAYAxB7aIKqOO2kSEmTLyVT7AAxBiBWSYL81PhaLy23Pp/Od592LLkyZaXJl+sExQ4QYwBiSQmKTY0v10OWipWp2J/B2QFiDEDsKkFWUizPkJpYfppCcsQOEGMAYoWfnZCkWHI9TMWqc7JC/pVjB4gxALFiOptnOb08Up2zY7Ee3NgBYgxA7B9sG2f1QPZHWAAAAABJRU5ErkJggg==";
// var image_bg_1 =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABVUlEQVR4nO3ZvU4CQRSG4cEKlA5oNCbGxM4GS2pqgxV3QO/teAdWJtbW3ojBBugQ6bSbDGQnzMn+fCO+T7Uhy0I8OW920TkAAAAAAAAAAADgmLXKvHk0nhW+3h/0/PFysfqxXLM/6PnvtFysDp7//vZkuXx2TtRf4L9jAGLmBIXZOe2e+ePN+qswNQ/Te9P1X55fD55zTJliA8QYgFhSglKyc3Vzbfrg4d2t6fxQHZkKNZksNkCMAYiZE+Sck2THKiVToYvLc/+3mH98+tfrzhEbIMYAxBpNkJUqWU3miA0QYwBi0QTFfmp2FSWoybxYhTlKeaArkyY2QIwBiKUmqPCn5rrvgmJyeKCrKk1sgBgDENtJUJiddqftj7ff21ofvnK+I4qpKk1sgBgDENtJ0Hjy6I/L/LcrB6qsWdPEBogxALH9u6CssvMX745iYmliA8QYgNgvl4Jo+nvIJTYAAAAASUVORK5CYII=";
// var image_bg_2 =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAAA5UlEQVR4nO3WvWoCQRSAUTeV1olNRAhCujSxtLYOpPINfCjfwCpgbe3LqHXstFskMOzfbG4C51Rb7AzDXuZjBwMAAAAAAAAAAAAAAAA6KaIP8NNiuc6yz9P4sXw+Hc/XDvuU3+h0PFe+f9hvGu3/0PxI5GQAwXpPUNOkDEfD8vnyfWmdjnufq4/Wa7+2u8p36mQqlSY3IJgBBEsmKNffSJekvLzOspyhjvf5W+u1qUzVSZMbEMwAghWp1PTxN/JfkpJLKk2T6XOZJjcgmAEEKxbLdWVefjMdf00fKbtPkxsQzACC3QBNtS8X6UNGbwAAAABJRU5ErkJggg==";
var image_player_neutral_0 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_player_neutral_1 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_player_neutral_2 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_player_act_0 = image_player_neutral_0;
var image_player_act_1 = image_player_neutral_1;
var image_player_act_2 = image_player_neutral_2;

var image_powerup_1 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_powerup_2 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_powerup_3 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_powerup_4 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_powerup_5 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_bullet =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";

var image_bullet = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAQklEQVQ4y2NgGAV0Aj4M+xg+A+E+IIsI0MrwHwm2Ejb9PxokYMs+DA378Gv4hKHhE5U1kOwkkj1NcrCSEXGjgAoAAHP4Tb1bvWROAAAAAElFTkSuQmCC";

var image_bg_star_0 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_bg_star_1 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_bg_star_2 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_bg_star_3 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";

// var image_bg =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAADQAgMAAADqsjhuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDg3MTRCODc0MEVFMTFFQTk3QzlBOTQwMDgwMjNCQjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDg3MTRCODg0MEVFMTFFQTk3QzlBOTQwMDgwMjNCQjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0ODcxNEI4NTQwRUUxMUVBOTdDOUE5NDAwODAyM0JCMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0ODcxNEI4NjQwRUUxMUVBOTdDOUE5NDAwODAyM0JCMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PstHD5AAAAAMUExURSwTWEILflcAn2cAvN+7socAAATfSURBVHja7V1NjtpKEG5LPgCzmPt4AQdAco/EAZ4X3IeFcwBL2FIOwFvkPlk8DhBpHHf99I8BMxN4pMzUF9P191V1UZpVoBtjFAqFQqFQKBQKxXNjQf8GbTFI96A0sKCLmQtwLTgPA2zTi91Y0K+s+QJUj/b03fiK3icbGWIsxwBiFEx4JjO0Go4YXs4WTGnZSVkT7SseLxewmDQvkRcf46eZi6noDCaYJT1nZGf0CuEJ5RyyC64se/kMhj/C3Peam8jK44gPs8hjRz7x/vORkX+IGDtfhMMURWEKMwhDgh4XgBhEioIJbiEC2sFyFGOQjcUK5sfV/ENO2t0nFqEZly1+gktEDk+k56S5NecFZR678sDNwUM5PkpUCOWczem8C8bD/iE8mwl+HMXyoXjCCT4Y5lU45E9wvbYOayfXFlYH0EGCbiFig59C5LBk4RJzOLy2gYam9RmUQG7qh6TFCZYTb6Gc8pbTb7+8wwStcMj/GxQ/QbeUqJfwKgdRosqeIMskeWSmdRJneeKJjLL0KWVUtwT/PCaoDT51g/8Ih/wJvgmH/AlWwqETvHmCm029qQcMclBwxRd5N7RuADU6iOqcNdKB4Mm+CLmQhuU3XBxLRkWwBm2OO9byJ1gLx6Mm2DzvBNt2217C9qqDfMG/3QYiq9tRquNsA3cac5igbJi9cMif4DfhkD9BbfArNNi1Xdc5o3MSVLQxBivTOhIduZkMDiJzlLJaDnW4kS9I+cQNRrRzN4MJ/iscOsGbJ/hdOORP8KdwyJ/gf8JhfgiH/An+Eg75E+yFQyd48wTf3/v3GH2QaeA8+knzQvB80nhHNORP8Aji6NA7/QgPu45OkPdILmAcI/SUjAVQARYX9XU9Fx8qPq4fNh5e8ieoDWqD2qA2qA1qg9qgNqgNaoPaoDaoDWqD2qA2qA1qg/Nt8Cgcc/g/atnQz0nu8Vld7z8Y66M1Qo+u/lzs15Xkvo+i/Zjfn+b2/GCyfl78/J8X63cWnn6C+r2Z27+71cLj0LLyPShst+5BSuuZ7YjbprJtE2frl9PN2pMd0a3fH7z9+4OdcMif4AEErIcDq5GzbSPn4UKVlH8Yp6XUA9PjqDdGuxz0i97aoJ4nmf15ksvnsfaT7v3V81z7C3X2uFwvAKQ5T1DIubqmqpqmwcOXKJzZ0FlMpzoHH81sGiI3mICRhmh8ihOKeEG0NJE2bEKUzn/6XMqY7enY7YlyBdv/7XzxbueeGhcUqNUusMN1hyw02eFljRaGayJH1DqEd7gHJWDAx0Nh3P6R54tvOeMuG3rPwh3u+qje3KuqQAvGW1jBGfveiEsJfoUiVShSMbPiEuCsPB99oTw1UIUN9L6Z579vRhv8Cg2uQFutVk4lw7K+ohBHyescPmGFyYQVP2SdhMKOgWaDO+XKn2ApHHr/oN7g+PfvYbXWXXc6rKgMYlBJAc0ZIMiyQEyi4MKItcREheoS12J5TnoNtXj3V8sXsGIXM5gg37m7Tm7gXae+NDg2J7D+AncBz+I25eSK6aIoYPV+5yhwBeEsZKHhqcWSEtkDOvuTmk4WkR5SlnGxwS1/gvlVLD8bXOZ/iHOJ8icI9+GPflCgePTvP0w1MIsJzvL3SXSCn/yNHLGYwa803RF3LUYlFQqFQqFQKBQKheJv4jdCzAqBnoC4aAAAAABJRU5ErkJggg==";

var image_explode_0 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_explode_1 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_explode_2 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_explode_3 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var image_explode_4 =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";

var bomb = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAB60lEQVRYw+2XvU4CQRDHf8klYqOFGDXxDazEFl7AxFYKX0G8hlATxULiW0DQs8DXkA5qtcPE2CqEBBLWZu7wwsJxe7cFiXPVZf7zn/2Yr4V/WQ/JUaZJN/jv0qRMLg3qPW54R8nni///zg175uRZ6gwDMp0DhWJInawJ/SmfIaJFDhSKT07j0p+HCEa0cckH2jwubUYhzHk8Bw4PYtinxJYWs0WJvqAecOLuwcFjTJXMUlSGKmO8OPTFAOxwtJLF0R+LYvTVTnmMv12hf2S6/LqzEjmegQsHTyJqSdDW5crGKx5O+KDGYl1fBNlnIJCq0RFVxXrAvh5QCwIzY+QgEwRtTQ94FfWlcXG5FIZXfcX0s1afVhu4vPDDDy+4bCxIPT+7NZW2IqpnrekhvVBh6HGoxT2LvjKvaojK1a6+N1fgetpduKJtzKu6oipozK7m6BWKKw2yILpuvMvraB100muZ31oH32vkIJUjSueS80GMWQpTfylNW4nWXpxos1KxnUKpOFlW7EqJi91bVLneTFiub6MaznWihjPkIKplThK1zPvopt8yavpPKBRf7EaNLS3jseWJKWd2B6+L9EfHayYme151+P0QVGwX1sd36w8QgB3ugtSz8ISaPQLfbD0CZ3JMmYadZ+y/2Jdfoe2xnmQrwPAAAAAASUVORK5CYII=";
var ufo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAD0UlEQVRYw+3XXWiWZRzH8Y+uTVnzjZZT84XURMEDe0MmSmkHoYgZghnlUUqGQYKtkkoJXQyUOggEIfHAlzQnhoVJJLqQsIJF0wiZY03UORTNtuby7d+Bj4/34/O4Tfd0EPS/ju7/y/d3Xff1v7ivm/8tzzbGNmf/PfxYLUJY7owzludfYItIj30eyh/4fjOttt+VhMAShfmBD1bpfAJ8a5zziWE9g/e20iUh1FplhrFKlBhrhlVqhdDqPUX3ih9ivxB2Gp8zPt5OIXyv7F7wY5wWGpV3mlWuUThhQnexxSo1q1aqXqhR2mVFqRrhd0Ps1qxScWfJAx0WQpvDQo0io1Q5olWbOlVGgBGq1GnT6ogqoxSpEX5wWQiHDbwTvrd9iR5pVKpCR0bfdFhmWZavQqnGjBPSO7fAokTSdeXWCldtMlWJYtMSx2yLaYqVmGqTq8Ja5a4nqhflwhdpTqRUmyt0mJ2RM0+7dvMyfLN1CM+pTlQ352rdBRnzn+CYsBRUaNKkAkwxJcu3VPjNhIw1LMgW2JwI13pSOKEAi4UwyecWp3MzfQVOCI+ljt6NsTlboD4RXuk1YSOoE8JWTerSubf7NgqLrUwQ6rMFWhPh6d4XqkBb2tuWzr3d96GwwvQEoTVbINl847wq7ErMNkTWCm75NgqvGJfRvFnWkgj387hwSp/0+w6RtQc3fTf2YJJ+CUJLtsChRLiPXi4I79zWMYMstVBhji46iz4JwqFsgTWJcJl5qYW+nMgY6pgQNuQ4B2GOwQnCmmyBkdrT4Yl+Eak1bfcMKHU0YwNLEif5O6HWxHR9u5Fy2CwNGhwXKoWTCi1zSViC/n5Kl/+IoYk+el2hk8IHQoMGDWbpxNYJrcLHYJj56OtAom/G4EV/uOio1am5fiRcFNbp0uanQLdmUeCLlO+CN9yXs2pWKmN+1wL9U5s2Iu3ZIIRrPvXgHauGp5piUNcC7BJC39TTCiEc8GinNX2FsLs7eCYLYTh43jW/mtNlTZkQpnVPgGrhgAJlDnrpTt+nhPWyR/iyu3gGaxG2Kehm/nqh5e6ukk9oFQ52o+gBe4S/PH03eJjslNBmdSfXw1JvOy+cN/Vu8TDUdiFc8a13zTQu1YQDPOJZb9nrbyF81ZN7drkdqftOrnHZnu53zp3tnLDeXsedFq5rVK9DeFP/nsPhTMa5vmE7hG/y9QvymfB16uDdtNHpf4ZjBvRU4OH05zQJG21napPX9ICdltiWE9aU6rK5+XhRuWDt6W56qucCuWA/pxt2Yc8FcsFe8Kd6W03PxyvKK+y/ZP8A36JZXvbNt2QAAAAASUVORK5CYII=";
var airplane = "data:image/png;base64,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";

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
        // image_player_neutral_0,
        // image_player_neutral_1,
        // image_player_neutral_2
        airplane
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
    // background("#201747");
    background("#ddd");

    var random_add = 0;

    //timeloop
    if (frameCount % box_rate == 0) {
        random_add = random([0, 1, 2, 3]);

        createBlock(120, 120);
    }

    if (frameCount % back_rate == 0) {
        // createMeteor();
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
        // random([image_block_0, image_block_1, image_block_2, image_block_3])
        ufo
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
    // var heart_count = random([8, 12, 16]);
    // for (var i = 0; i < heart_count; i++) {
    //     heart_shape = createSprite(
    //         bullet.position.x + round(random(-32, 32)),
    //         bullet.position.y + round(random(-32, 32))
    //     );
    //     heart_shape.addAnimation(
    //         "normal",
    //         random([
    //             explode_ani,
    //             explode_ani_b,
    //             explode_ani_c,
    //             explode_ani_d,
    //             explode_ani_e
    //         ])
    //     );
    //     heart_shape.scale = random([0.1, 0.2, 0.3]);
    //     heart_shape.life = heart_shape.scale * 70;
    //     hearts.add(heart_shape);
    //     makeShaking();
    // }
    var heart_shape = createSprite(
                // bullet.position.x + round(random(-32, 32)),
                // bullet.position.y + round(random(-32, 32))
                bullet.position.x,
                bullet.position.y
            );
    heart_shape.addAnimation("normal", bomb);
    // heart_shape.scale = random([0.1, 0.2, 0.3]);
    heart_shape.scale = 0.3;
    heart_shape.life = heart_shape.scale * 70;
    hearts.add(heart_shape);
}

function makeShaking() {
    // if (camera.position.x != cam_x) {
    //     camera.position.x = cam_x;
    // } else {
    //     random_shake = random([10, 20, 30]);
    //     camera.position.x += random_shake;
    // }
}

function createLaser(x, y) {
    //bullet spawn
    bullet = createSprite(x + 40, y + 5);
    bullet.addImage("normal", laser);
    bullet.life = 50;
    bullet.addSpeed(20, 0);
    // bullet.life = 80;
    // bullet.addSpeed(10, 0);
    bullets.add(bullet);
    return bullet;
}

// function createMeteor() {
//     var a = createSprite(640 + 102, random(0, 208));
//     var img = loadImage(
//         random([image_bg_star_0, image_bg_star_1, image_bg_star_2, image_bg_star_3])
//     );
//     var a_speed = random(back_speed);
//     a.addImage(img);
//     // a.chase = false;
//     a.scale = random(back_scale);
//     a.addSpeed(a_speed, rotate_angle);
//     a.life = 60 * a_speed;
//     return a;
// }
