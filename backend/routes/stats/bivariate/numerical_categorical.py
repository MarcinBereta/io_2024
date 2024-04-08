import numpy as np
from matplotlib import pyplot as plt
from scipy import stats


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


def error_bar_graph(column_cat, column_num):
    data = {}
    for category, value in zip(column_cat, column_num):
        if category not in data:
            data[category] = []
        data[category].append(value)

    categories = []
    means = []
    std_errors = []

    for category, values in data.items():
        mean = np.mean(values)
        std_error = stats.sem(values)

        categories.append(category)
        means.append(mean)
        std_errors.append(std_error)

    plt.errorbar(categories, means, yerr=std_errors, fmt='-o', color='blue', ecolor='red', capsize=5)
    plt.xlabel("Categories")
    plt.ylabel("Values")
    plt.grid()
    plt.show()


categories = ['A', 'B', 'C', 'D', 'E']
column_cat = np.random.choice(categories, 100)

column_num = np.random.normal(0, 1, 100)
#error_bar_graph(column_cat, column_num)
