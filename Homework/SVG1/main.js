/* Sjors Witteveen	10808493 */

/* use this to test out your function */
window.onload = function() {
 	changeColor("is", "gray");
 	changeColor("ua", "sienna");
 	changeColor("hr", "tomato");
 	changeColor("by", "lightsteelblue")
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
	var country = document.getElementById(id);
	country.style.fill = color;
}