import numpy as np
from matplotlib import pyplot as plt


def z_test(column1, column2):
    pass


def t_test(column1, column2):
    pass


def anova(column1, column2):
    pass


def error_bar_graph(column_cat, column_num):
    num_error = np.std(column_num) * np.ones_like(column_num)
    plt.errorbar(column_cat, column_num, yerr=num_error, fmt='-o', color='blue', ecolor='red', capsize=5)
    plt.xlabel("Categories")
    plt.ylabel("Values")
    plt.grid()
    plt.show()

