$(function(){
	console.log("custom js loaded.")
})
var toggleNavbar=function(){
	$("body").toggleClass('sidebar-mini')
}
var toggleNavbarOnDevice=function(){
	$("html").toggleClass('nav-open')
}