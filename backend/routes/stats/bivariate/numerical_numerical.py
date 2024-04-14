import matplotlib.pyplot as plt
import numpy as np
import os
import glob
from time import time


def correlation(column1, column2):
    return np.corrcoef(column1, column2)[0, 1]


def correlation_graph(column1, label1, column2, label2, userId, fileId):
    plt.scatter(column1, column2)
    plt.title("Scatter plot")
    plt.xlabel(label1)
    plt.ylabel(label2)
    plt.grid()
    graphs_directory = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'static', userId, fileId, 'graphs')
    existing_histograms = glob.glob(os.path.join(graphs_directory, f"{label1}_{label2}_num_num_corr_*.png"))
    for histogram_path in existing_histograms:
        os.remove(histogram_path)
    os.makedirs(graphs_directory, exist_ok=True)
    file_name = f'{label1}_{label2}_num_num_corr_{time()}.png'
    path = os.path.join(os.path.dirname(__file__), graphs_directory, file_name)
    plt.savefig(path)
    plt.clf()
    g_path = os.path.join(userId, fileId, 'graphs', file_name)
    g_path = g_path.replace("\\", "/")
    return g_path

