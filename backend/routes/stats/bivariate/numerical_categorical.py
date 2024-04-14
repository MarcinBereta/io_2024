import numpy as np
from matplotlib import pyplot as plt
from scipy import stats
import os
import glob
from time import time


def param_test(num_column, cat_column):
    no_observations = len(num_column)
    unique_cats = set(cat_column)
    if no_observations > 30 and len(unique_cats) >= 2:
        return _t_test(num_column, cat_column)
    elif no_observations <= 30:
        return _z_test(num_column, cat_column)


def _z_test(num_column, cat_column):
    val, p_val = None, None
    test_name = 'z'
    try:
        val, p_val = stats.ranksums(num_column, cat_column)
    except ValueError:
        pass
    return test_name, val, p_val


def _t_test(num_column, cat_column):
    val, p_val = stats.ttest_ind(num_column, cat_column)
    test_name = 't'
    return test_name, val, p_val


def anova_test(num_column, cat_column):
    no_unique_cats = len(set(cat_column))
    groups = [[] for _ in range(no_unique_cats)]

    for category, value in zip(cat_column, num_column):
        idx = list(set(cat_column)).index(category)
        groups[idx].append(value)

    f_val, p_val = stats.f_oneway(*groups)
    return f_val, p_val


def error_bar_graph(num_column, num_label, cat_column, cat_label, userId, fileId):
    data = {}
    for val, cat in zip(num_column, cat_column):
        if cat not in data:
            data[cat] = []
        data[cat].append(val)

    categories = []
    means = []
    std_errors = []

    for cat, val in data.items():
        mean = np.mean(val)
        std_error = stats.sem(val)

        categories.append(cat)
        means.append(mean)
        std_errors.append(std_error)

    plt.errorbar(categories, means, yerr=std_errors, fmt='-o', color='blue', ecolor='red', capsize=5)
    plt.xlabel(f"{cat_label}")
    plt.ylabel(f"{num_label}")
    plt.title(f"Error bar graph of {num_label} vs {cat_label}")
    plt.grid()
    plt.tight_layout()
    graphs_directory = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'static', userId, fileId, 'graphs')
    existing_histograms = glob.glob(os.path.join(graphs_directory, f"{num_label}_{cat_label}_cat_cat_stacked_*.png"))
    for histogram_path in existing_histograms:
        os.remove(histogram_path)
    os.makedirs(graphs_directory, exist_ok=True)
    file_name = f'{num_label}_{cat_label}_cat_cat_stacked_{time()}.png'
    path = os.path.join(os.path.dirname(__file__), graphs_directory, file_name)
    plt.savefig(path)
    plt.clf()
    g_path = os.path.join(userId, fileId, 'graphs', file_name)
    g_path = g_path.replace("\\", "/")
    return g_path
