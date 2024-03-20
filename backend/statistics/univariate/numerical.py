import statistics as st

import matplotlib.pyplot as plt
from scipy.stats import skew, kurtosis


def get_min(column):
    return min(column)


def get_max(column):
    return max(column)


def get_mean(column):
    return st.mean(column)


def get_median(column):
    return st.median(column)


def get_mode(column):
    return st.mode(column)


def get_range(column):
    return max(column) - min(column)


def get_quantiles(column):
    pass


def get_variance(column):
    return st.variance(column)


def get_std_dev(column):
    return st.stdev(column)


def get_coef_var(column):
    return (get_std_dev(column) / get_mean(column)) * 100


def get_skew(column):
    return skew(column)


def get_kurtosis(column):
    return kurtosis(column)


def box_plot_graph(column):
    plt.boxplot(column)
    plt.show()


def histogram_graph(column):
    plt.hist(column)
    plt.show()


# arr = [1, 1, 1, 20, 30, 31, 31, 22, 22, 12, 30, 49]
# histogram_graph(arr)