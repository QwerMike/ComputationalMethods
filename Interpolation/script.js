class Interpolation {
  static lagrange(x, y, value) {
    let result = 0;
    for (let i = 0; i < x.length; ++i) {
      let term = 1;
      let coef = y[i];
      for (let k = 0; k < i; ++k) {
        term *= (value - x[k]) / (x[i] - x[k]);
      }    
      for (let k = i + 1; k < x.length; ++k) {
        term *= (value - x[k]) / (x[i] - x[k]);
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

function fxToY(x, fx) {
  let y = new Array(x.length);
  for (let i = 0; i < x.length; ++i) {
    y[i] = fx.eval({x: x[i]});
  }
  return y;
}