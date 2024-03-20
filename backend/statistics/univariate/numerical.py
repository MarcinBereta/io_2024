import statistics as st

import matplotlib.pyplot as plt
from scipy.stats import skew, kurtosis


def min(column):
    return min(column)


def max(column):
    return max(column)


def mean(column):
    return st.mean(column)


def median(column):
    return st.median(column)


def mode(column):
    return st.mode(column)


def range(column):
    return max(column) - min(column)


def quantiles(column):
    pass


def variance(column):
    return st.variance(column)


def std_dev(column):
    return st.stdev(column)


def coef_var(column):
    return (std_dev(column) / mean(column)) * 100


def skew(column):
    return skew(column)


def kurtosis(column):
    return kurtosis(column)


def box_plot_graph(column):
    plt.boxplot(column)
    plt.show()


def histogram_graph(column):
    plt.hist(column)
    plt.show()


arr = [1, 1, 1, 20, 30, 31, 31, 22, 22, 12, 30, 49]
histogram_graph(arr)
