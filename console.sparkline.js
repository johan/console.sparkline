'use strict';

console.sparkline = ((console) => {

const defaultLogger = console.log.bind(console);

const sparkline = (d, maxWidth, height, stroke, fill) => {
  const segs = d.length - 1;
  const width = Math.min(maxWidth, 3 * segs);
  const dx = width / segs;
  d = d.filter(Number.isFinite);
  const min = Math.min(...d);
  const max = Math.max(...d);
  const dy = max - min;

  const yscale = (d = min) => {
    d -= min;
    return (height * (1 - d / dy)).toFixed(1).replace(/\.0$/, '');
  };

  const viewBox = `-0.5 -0.5 ${1 + width} ${1 + height}`;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">`;

  let path = 'M' + d.map((d, i) => `${i * dx} ${yscale(d)}`).join(' ');
  svg += `<path d="${path}" fill="none" stroke="${stroke}"/>`;
  if (fill) {
    svg += `<path d="${path}V${height}H0" fill="${fill}" stroke="none"/>`;
  }
  svg += '</svg>';

  return { svg, width, height };
};

const backgroundImage = (svg, w, h) => {
  const x = w >> 1, y = h >> 1;
  const url = 'data:image/svg+xml;base64,' + btoa(svg);
  const css = `color: transparent; font-size: 1px; line-height: ${h}px; ` +
    `padding: ${y+3}px ${x}px ${y-3}px; background: url("${url}") no-repeat;`;
  return css;
};

const log = (...msg) => {
  let {stroke, fill, maxWidth, fontHeight, tailNumber} = log;
  if (stroke === true) stroke = 'mediumseagreen';
  if (fill === true) fill = 'rgba(60,179,113,0.25)';
  let args = [];
  let format = '';

  // chrome's console.log only supports %c<styled stuff>%c in its first argument
  let pastFirstString = false;
  msg.forEach((arg) => {
    // pass them through
    if (pastFirstString) {
      args.push(arg);
      return;
    }

    if (typeof arg === 'string') {
      format += `%c${arg}`;
      args.push('');
      return;
    }

    // Array<Number> => sparkline
    if (Array.isArray(arg) && arg.length > 1 && arg.every(Number.isFinite)) {
      format += '%c.';
      let {svg, width} = sparkline(arg, maxWidth, fontHeight, stroke, fill);
      args.push(backgroundImage(svg, width, fontHeight));
      if (tailNumber) {
        format += '%c' + arg[arg.length - 1];
        args.push('color: blue;');
      }
      format += ' ';
    }
    else {
      pastFirstString = true;
      args.push(arg);
    }
  });

  defaultLogger(format, ...args);
};

log.fontHeight = 14;
log.maxWidth = 300;
log.stroke = 'mediumseagreen';
log.fill = false;
log.tailNumber = false;

return log;

})(console);
