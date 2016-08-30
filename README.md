# console.sparkline
Adds console.sparkline to all web pages and Chrome Devtools

Similar to `console.log()`,
`console.sparkline()` lets you mix strings and other arguments,
and any `Array` of numbers you pass becomes a pretty sparkline:

![Example usage](console.sparkline.png)

If you have some page code that already happens to spit out arrays of
numbers via one of the console logger functions (and doesn't bind them
at load time), you can assign `console.log = console.sparkline` and
get them to show up for free as above; it is api compatible (besides
taking over the %c handling that I think mostly nobody uses anyway).
