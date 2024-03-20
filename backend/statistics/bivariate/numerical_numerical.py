import matplotlib.pyplot as plt
import numpy as np


def correlation(column1, column2):
    return np.corrcoef(column1, column2)[0, 1]


def correlation_graph(column1, column2):
    plt.scatter(column1, column2)
    plt.title("Scatter plot")
    plt.xlabel('column1')
    plt.ylabel('column2')
    plt.grid()
    plt.show()

