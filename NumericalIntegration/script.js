function compute(e) {
  var method = document.getElementById('method_select')
    , epsTxt = document.getElementById('eps_txt')
    , yTxt = document.getElementById('y_txt')
    , valueTxt = document.getElementById('value_txt');
  if (!(epsTxt.value && yTxt.value && valueTxt.value)) {
    if (!epsTxt.value) {
      epsTxt.classList.add('emptyField');
      setTimeout(() => epsTxt.classList.remove('emptyField'), 300);
    }
    if (!yTxt.value) {
      yTxt.classList.add('emptyField');
      setTimeout(() => yTxt.classList.remove('emptyField'), 300);
    }
    if (!valueTxt.value) {
      valueTxt.classList.add('emptyField');
      setTimeout(() => valueTxt.classList.remove('emptyField'), 300);
    }
    return;
  }

  var eps = parseFloat(epsTxt.value)
    , y = math.compile(yTxt.value)
    , a = valueTxt.value.split(' ')
    , b = parseFloat(a[1]);
  a = parseFloat(a[0]);
  method = method.options[method.selectedIndex].value;
  var result = 0;

  switch (method) {
    case 'rectangularM':
      result = NumericalIntegration.rectangular('midpoint', y, a, b, eps);
      break;
    case 'rectangularL':
      result = NumericalIntegration.rectangular('left', y, a, b, eps);
      break;
    case 'rectangularR':
      result = NumericalIntegration.rectangular('right', y, a, b, eps);
      break;
    case 'trapezium':
      result = NumericalIntegration.trapezium(y, a, b, eps);
      break;
    case 'simpsons':
      result = NumericalIntegration.simpsons(y, a, b, eps);
      break;
    case 'gaussian':
      result = NumericalIntegration.gaussianQuadrature(y, a, b, eps);
      break;
    case 'chebyshev':
      result = NumericalIntegration.chebyshevQuadrature(y, a, b, eps);
      break;
    default:
      throw alert('unexpected exception');
  }
  
  alert('Result: ' + result);
}

class NumericalIntegration {
  static rectangular(type, f, a, b, eps) {
    var n = 1
      , h = (b - a) / n
      , result, resultPrevious, coef;

    switch (type) {
      case 'midpoint':
        result = h * f.eval({ x: ((b - a)/2) });
        coef = 1 / 2;
        break;
      case 'left':
        result = h * f.eval({ x: a });
        coef = 0;
        break;
      case 'right':
        result = h * f.eval({ x: b });
        coef = 1;
        break;
      default:
        throw alert('no such rectangular method type');
    }
    
    do {
      n *= 2;
      h /= 2;
      resultPrevious = result;
      result = 0;
      for (var i = 0; i < n; ++i) {
        result += f.eval({ x: (a + (coef + i)*h) });
      }
      result *= h;
    } while (Math.abs(result - resultPrevious) > eps);

    return result;
  }

  static trapezium(f, a, b, eps) {
    var n = 1
      , h = (b - a) / n
      , faPlusB = f.eval({ x: a }) + f.eval({ x: b })
      , result = h * faPlusB / 2
      , resultPrevious;
    
    do {
      n *= 2;
      h /= 2;
      resultPrevious = result;
      result = 0;
      for (var i = 1; i < n; ++i) {
        result += f.eval({ x: (a + i*h) });// * 2;
      }
      result *= 2;
      result = h * (result + faPlusB) / 2;
    } while (Math.abs(result - resultPrevious) > eps);
    
    return result;
  }

  static simpsons(f, a, b, eps) {
    var m = 1
      , n = 2*m
      , h = (b - a) / n
      , faPlusB = f.eval({ x: a }) + f.eval({ x: b })
      , result = h * (faPlusB + 4*f.eval({ x: (a + b)/2 })) / 3
      , resultPrevious;
    
    do {
      n *= 2;
      h /= 2;
      resultPrevious = result;
      result = 0;
      for (var i = 1; i < n; i+=2) {
        result += 4*f.eval({ x: (a + i*h) }) + 2*f.eval({ x: (a + (i+1)*h) });
      }
      result = h * (result + faPlusB) / 3;
    } while (Math.abs(result - resultPrevious) > eps);
    
    return result;
  }

  static gaussianQuadrature(f, a, b, eps) {
    // for n=5 from table 
    // https://en.wikipedia.org/wiki/Gaussian_quadrature#Gauss.E2.80.93Legendre_quadrature
    var z = [-0.9061798, -0.5384693, 0, 0.5384693, 0.9061798],
        A = [0.2369269, 0.4786287, 0.5688889, 0.4786287, 0.2369269];    
    var result = 0, subResults = new Array(5), n = 1, h = b-a, resultPrevious;

    for (var i = 0; i < 5; ++i) {
      result += A[i] * f.eval({ x: (b-a)*z[i]/2 + (a+b)/2 });
    }
    result *= (b - a) / 2;

    do {
      n *= 2;
      h /= 2;
      resultPrevious = result;
      result = 0;
      for (var k = 0; k < n; ++k) {
        for (var i = 0; i < 5; ++i) {
          result += A[i] * f.eval({ x: h*z[i]/2 + a + (k + 1/2)*h });
        }        
      }
      result *= h / 2;
    } while (Math.abs(result - resultPrevious) > eps);   

    return result;
  }

  static chebyshevQuadrature(f, a, b, eps) {
    // http://mathworld.wolfram.com/ChebyshevQuadrature.html
    var x = [-0.8324975, -0.3745414, 0, 0.3745414, 0.8324975];
    var result = 0, n = 1, h = b-a, resultPrevious;

    for (var i = 0; i < 5; ++i) {
        result += f.eval({ x: (b-a)*x[i]/2 + (a+b)/2});
    }
    result *= (b - a) / 2;
    result *= 2 / 5;

    do {
      n *= 2;
      h /= 2;
      resultPrevious = result;
      result = 0;
      for (var k = 0; k < n; ++k) {
        for (var i = 0; i < 5; ++i) {
          result += f.eval({ x: h*x[i]/2 + a + (k + 1/2)*h });
        }        
      }
      result *= h / 2;
      result *= 2 / 5;
    } while (Math.abs(result - resultPrevious) > eps);

    return result;
  }
}
