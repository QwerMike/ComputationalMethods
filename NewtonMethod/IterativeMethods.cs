using MathNet.Symbolics;
using System;
using System.Collections.Generic;

namespace NewtonMethod
{
    static class IterativeMethods
    {
        public static double[] ModifiedNewtonMethod(
           Expression f, Expression g,
           double x0, double y0,
           double precision, out int iterations)
        {
            iterations = 0;
            var x = Expression.Symbol("x");
            var y = Expression.Symbol("y");
            double
                dfx = Calculus.Differentiate(x, f).eval(x0, y0),
                dfy = Calculus.Differentiate(y, f).eval(x0, y0),
                dgx = Calculus.Differentiate(x, g).eval(x0, y0),
                dgy = Calculus.Differentiate(y, g).eval(x0, y0);

            double determinant = dfx * dgy - dfy * dgx;
            double
                m11 = (1 / determinant) * dgy, m21 = (-1 / determinant) * dgx,
                m12 = (-1 / determinant) * dfy, m22 = (1 / determinant) * dfx;

            double xResult, yResult, xPreviuos = x0, yPrevious = y0, difference;


            do
            {
                ++iterations;
                xResult = xPreviuos - m11 * f.eval(xPreviuos, yPrevious)
                    - m12 * g.eval(xPreviuos, yPrevious);
                yResult = yPrevious - m21 * f.eval(xPreviuos, yPrevious)
                    - m22 * g.eval(xPreviuos, yPrevious);
                difference = distance(xPreviuos, yPrevious, xResult, yResult);
                xPreviuos = xResult;
                yPrevious = yResult;
            } while (difference > precision);

            return new double[] { xResult, yResult };
        }

        public static double eval(this Expression expr, double x, double y)
        {
            var variables = new Dictionary<string, FloatingPoint>
                {
                    { "x", x },
                    { "y", y }
                };
            return Evaluate.Evaluate(variables, expr).RealValue;
        }

        private static double distance(
            double x1, double y1,
            double x2, double y2)
        {
            return Math.Sqrt(Math.Pow(x1 - x2, 2) + Math.Pow(y1 - y2, 2));
        }

    }
}
