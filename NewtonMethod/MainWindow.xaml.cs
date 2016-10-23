using MathNet.Symbolics;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace NewtonMethod
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtPrecision.Text = "0.001";
        }

        private void button_Click(object sender, RoutedEventArgs e)
        {
            var f = Infix.ParseOrThrow(txtF.Text);
            var g = Infix.ParseOrThrow(txtG.Text);
            double x0 = Convert.ToDouble(txtX0.Text, CultureInfo.InvariantCulture);
            double y0 = Convert.ToDouble(txtY0.Text, CultureInfo.InvariantCulture);
            double precision = Convert.ToDouble(txtPrecision.Text, CultureInfo.InvariantCulture);
            int iterations;
            var result = IterativeMethods.ModifiedNewtonMethod(
                f, g, x0, y0, precision, out iterations);
            txtResult.Text =
                "x: " + result[0] +
                "\ny: " + result[1] +
                "\niterations: " + iterations;
        }
    }
}
