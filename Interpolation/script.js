function compute(e) {
  let newtonFormula = document.getElementById("newton_select");
  let xTxt = document.getElementById("x_txt");
  let yTxt = document.getElementById("y_txt");
  let valueTxt = document.getElementById("value_txt");
  if (!(xTxt.value && yTxt.value && valueTxt.value)) {
    if (!xTxt.value) {
      xTxt.classList.add("emptyField");
      setTimeout(() => xTxt.classList.remove("emptyField"), 300);
    }
    if (!yTxt.value) {
      yTxt.classList.add("emptyField");
      setTimeout(() => yTxt.classList.remove("emptyField"), 300);
    }
    if (!valueTxt.value) {
      valueTxt.classList.add("emptyField");
      setTimeout(() => valueTxt.classList.remove("emptyField"), 300);
    }
    return;
  }

  let x = parseArguments(xTxt.value);
  let y = getFunctionValues(yTxt.value, x);
  let value = parseFloat(valueTxt.value);
  newtonFormula = newtonFormula.options[newtonFormula.selectedIndex].value;
  let result = 0;
  switch (newtonFormula) {
    case "lagrange":
      result = Interpolation.lagrange(x, y, value);
      break;
    case "newtonFDD":
      result = Interpolation.newtonForwardDividedDifference(x, y, value);
      break;
    case "newtonFFD":
      result = Interpolation.newtonForwardFiniteDifference(x, y, value);
      break;
    case "newtonBDD":
      result = Interpolation.newtonBackwardDividedDifference(x, y, value);
      break;
    case "newtonBFD":
      result = Interpolation.newtonBackwardFiniteDifference(x, y, value);
      break;
    default:
      throw alert("unexpected exception");
  }
  
  alert("Result: " + result);
}

function parseArguments(args) {
  args = args.replace(/\s/g, "");
  if (args.substring(0, 1) == "h") {
    args = args.split(",");
    let h = parseFloat(args[0].split("=")[1]);
    let n = parseInt(args[1].split("=")[1]);
    let x0 = parseFloat(args[2].split("=")[1]);
    return getFunctionArguments(h, n, x0);
  } else {
    return args.split(",")
              .map(item => parseFloat(item));
  }
}

function getFunctionArguments(h, n, x0) {
  let result = new Array(n);
  for (let i = 0; i < n; ++i) {
    result[i] = x0 + h*i;
  }

  return result;
}

function getFunctionValues(funcOrValues, x) {
  if (funcOrValues.trim().substring(0, 4) == "f(x)") {
    let fx = math.compile(funcOrValues.split("=")[1]);
    return fxToY(fx, x);
  } else {
    return funcOrValues.replace(/\s/g, "")
                       .split(",")
                       .map(item => parseFloat(item));
  }
}

function fxToY(fx, x) {
  let y = new Array(x.length);
  for (let i = 0; i < x.length; ++i) {
    y[i] = fx.eval({x: x[i]});
  }
  return y;
}

class Interpolation {
  static lagrange(x, y, value) {
    let result = 0;
    for (let i = 0; i < x.length; ++i) {
      let term = 1;
      let coef = y[i];
      for (let k = 0; k < i; ++k) {
        let q = (value - x[k]) / (x[i] - x[k])
        term *= q;
      }    
      for (let k = i + 1; k < x.length; ++k) {
        let q = (value - x[k]) / (x[i] - x[k])
        term *= q;
      }
      result += coef * term;
    }
    return result;
  }

  static newtonForwardDividedDifference(x, y, value) {
    let coef = this.coeficientsForwardDividedDifference(x, y);
    let result = 0;
    let part = 1;
    for (let i = 0; i < x.length; ++i) {
      result += coef[i]*part;
      part *= value - x[i];      
    }
    return result;
  }

  static newtonBackwardDividedDifference(x, y, value) {
    let coef = this.coeficientsBackwardDividedDifference(x, y);
    let result = 0;
    let part = 1;
    for (let i = 0; i < x.length; ++i) {
      result += coef[i]*part;
      part *= value - x[x.length-1-i];      
    }
    return result;
  }

  static coeficientsForwardDividedDifference(x, y) {
    let coef = y.slice();
    let n = coef.length;
    for (let j = 1; j < n; ++j) { // j stands for rank of divided difference
      for (let i = n - 1; i > j - 1; --i) {
        coef[i] = (coef[i] - coef[i-1]) / (x[i] - x[i-j]);
      }
    }
    return coef;
  }

  static coeficientsBackwardDividedDifference(x, y) {
    let coef = y.slice().reverse();
    let n = coef.length;
    for (let j = 1; j < n; ++j) { // j stands for rank of divided difference
      for (let i = n - 1; i > j - 1; --i) {
        coef[i] = (coef[i] - coef[i-1]) / (x[n-1-i] - x[n-1-(i-j)]);
      }
    }
    return coef;
  }

  static newtonForwardFiniteDifference(x, y, value) {
    let coef = this.coeficientsForwardFiniteDifference(x, y);
    let h = x[1] - x[0];
    let result = 0;
    let part = 1;
    for (let i = 0; i < x.length; ++i) {
      result += coef[i]*part;
      part *= (value - x[i]) / ((i + 1) * h);      
    }
    return result;    
  }

  static newtonBackwardFiniteDifference(x, y, value) {
    let coef = this.coeficientsBackwardFiniteDifference(x, y);
    let h = x[1] - x[0];
    let result = 0;
    let part = 1;
    for (let i = 0; i < x.length; ++i) {
      result += coef[i]*part;
      part *= (value - x[x.length-1-i]) / ((i + 1) * h);      
    }
    return result;    
  }

  static coeficientsForwardFiniteDifference(x, y) {
    let coef = y.slice();
    let n = coef.length;
    for (let j = 1; j < n; ++j) { // j stands for rank of divided difference
      for (let i = n - 1; i > j - 1; --i) {
        coef[i] = coef[i] - coef[i-1];
      }
    }
    return coef;
  }

  static coeficientsBackwardFiniteDifference(x, y) {
    let coef = y.slice().reverse();
    let n = coef.length;
    for (let j = 1; j < n; ++j) { // j stands for rank of divided difference
      for (let i = n - 1; i > j - 1; --i) {
        coef[i] = coef[i-1] - coef[i];
      }
    }
    return coef;
  }
}
