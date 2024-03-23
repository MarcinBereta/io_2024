import statistics as st
import numpy as np
import matplotlib.pyplot as plt
import scipy.stats
from scipy.stats import skew, kurtosis, shapiro


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


def get_quantile1(column):
    return np.percentile(column, 25)


def get_quantile3(column):
    return np.percentile(column, 75)


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


def get_is_normal_distr(column):
    stat, p_val = shapiro(column)
    alpha = 0.05
    if p_val > alpha:
        return True
    else:
        return False


# TODO
# Globla variable path
def box_plot_graph(column, label):
    plt.boxplot(column)

    plt.grid(axis='y', alpha=0.75)
    plt.xlabel(label[0])
    plt.ylabel('Values')
    plt.title(f'Boxplot of {label[0]}')

    plt.tight_layout()
    plt.savefig('../../graphs/num_boxplot.png')
    plt.show()


def histogram_graph(column, label):
    n, bins, patches = plt.hist(column, bins='auto', color='#0504aa',
                                alpha=0.7, rwidth=0.85)
    plt.grid(axis='y', alpha=0.75)
    plt.xlabel(label[0])
    plt.ylabel('Frequency')
    plt.title(f'Histogram of {label[0]}')

    maxfreq = n.max()
    plt.ylim(ymax=np.ceil(maxfreq / 10) * 10 if maxfreq % 10 else maxfreq + 10)
    plt.tight_layout()
    plt.savefig('../../graphs/num_histogram.png')
    plt.show()


# arr = [1, 1, 1, 20, 30, 31, 31, 22, 22, 12, 30, 49]
# box_plot_graph(arr, 'x')