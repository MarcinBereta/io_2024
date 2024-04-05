import numpy as np
from matplotlib import pyplot as plt
from scipy import stats


def z_test(column1, column2):
    val, p_val = None, None
    try:
        val, p_val = stats.ranksums(column1, column2)
    except ValueError:
        pass
    return val, p_val


def t_test(column1, column2):
    val, p_val = stats.ttest_ind(column1, column2)
    return val, p_val


def anova(num_column, cat_column):
    unique_cats = sorted(set(cat_column))
    no_unique_cats = len(unique_cats)
    groups = [[] for _ in range(no_unique_cats)]


#TODO
def error_bar_graph(column_cat, column_num):
    num_error = np.std(column_num) * np.ones_like(column_num)
    plt.errorbar(column_cat, column_num, yerr=num_error, fmt='-o', color='blue', ecolor='red', capsize=5)
    plt.xlabel("Categories")
    plt.ylabel("Values")
    plt.grid()
    plt.show()


column1 = np.array(['Male', 'Male', 'Female', 'Male', 'Male', 'Female', 'Female', 'Female', 'Unknown'])
column2 = np.array([2, 3, 3, 5, 5, 1, 2, 6, 0])
error_bar_graph(column1, column2)