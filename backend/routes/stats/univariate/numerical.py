import glob
import statistics as st
from time import time
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scipy.stats import skew, kurtosis, shapiro
import os


def get_min(column):
    if not column:
        return None
    return min(column)


def get_max(column):
    if not column:
        return None
    return max(column)


def get_mean(column):
    if not column:
        return None
    return st.mean(column)


def get_median(column):
    if not column:
        return None
    return st.median(column)


def get_mode(column):
    if not column:
        return None
    return st.mode(column)


def get_range(column):
    if not column:
        return None
    return max(column) - min(column)


def get_quantile1(column):
    if not column:
        return None
    return np.percentile(column, 25)


def get_quantile3(column):
    if not column:
        return None
    return np.percentile(column, 75)


def get_variance(column):
    try:
        return st.variance(column)
    except:
        return None


def get_std_dev(column):
    try:
        return st.stdev(column)
    except:
        return None


def get_coef_var(column):
    if get_mean(column) == 0:
        return None
    if get_std_dev(column) is None:
        return None
    return (get_std_dev(column) / get_mean(column)) * 100


def get_skew(column):
    cal_skew = skew(column)
    if np.isnan(cal_skew):
        return None
    return cal_skew


def get_kurtosis(column):
    cal_kur = kurtosis(column)
    if np.isnan(cal_kur):
        return None
    return cal_kur


def get_is_normal_distr(column):
    try:
        stat, p_val = shapiro(column)
        alpha = 0.05
        if p_val > alpha:
            return True
        else:
            return False
    except:
        return None


def histogram_graph(column, label, userId, fileId):
    n, bins, patches = plt.hist(column, bins='auto', color='#0504aa',
                                alpha=0.7, rwidth=0.85)
    plt.grid(axis='y', alpha=0.75)
    plt.xlabel(label)
    plt.ylabel('Frequency')
    plt.title(f'Histogram of {label}')
    maxfreq = n.max()
    plt.ylim(ymax=np.ceil(maxfreq / 10) * 10 if maxfreq % 10 else maxfreq + 10)
    plt.tight_layout()
    graphs_directory = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'static', userId, fileId, 'graphs')
    existing_histograms = glob.glob(os.path.join(graphs_directory, f"{label}_num_hist_*.png"))
    for histogram_path in existing_histograms:
        os.remove(histogram_path)
    os.makedirs(graphs_directory, exist_ok=True)
    file_name = f'{label}_num_hist_{time()}.png'
    path = os.path.join(os.path.dirname(__file__), graphs_directory, file_name)
    plt.savefig(path)
    plt.clf()
    g_path = os.path.join(userId, fileId, 'graphs',file_name)
    g_path = g_path.replace("\\", "/")
    return g_path


def box_plot(column, label, userId, fileId):
    fig = plt.figure(figsize =(10, 7))
    plt.boxplot(column, patch_artist = True)
    plt.xlabel(label)
    plt.ylabel('Value')
    plt.title(f'Box plot of {label}')
    plt.tight_layout()
    plt.show()
    graphs_directory = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'static', userId, fileId, 'graphs')
    existing_histograms = glob.glob(os.path.join(graphs_directory, f"{label}_num_box_*.png"))
    for histogram_path in existing_histograms:
        os.remove(histogram_path)
    os.makedirs(graphs_directory, exist_ok=True)
    file_name = f'{label}_num_box_{time()}.png'
    path = os.path.join(os.path.dirname(__file__), graphs_directory, file_name)
    plt.savefig(path)
    plt.clf()
    g_path = os.path.join(userId, fileId, 'graphs', file_name)
    g_path = g_path.replace("\\", "/")
    return g_path

