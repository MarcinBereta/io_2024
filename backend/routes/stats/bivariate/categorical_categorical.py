import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import chi2_contingency
import os
import glob
from time import time


def chi2_test(column1, column2):
    unique_1 = sorted(set(column1))
    unique_2 = sorted(set(column2))
    contigency = []
    for cat_A in unique_1:
        row = []
        for cat_B in unique_2:
            count = sum(1 for a, b in zip(column1, column2) if a == cat_A and b == cat_B)
            row.append(count)
        contigency.append(row)

    chi2_value, p_value, df, _ = chi2_contingency(contigency)
    return chi2_value, p_value, df


def stacked_column_chart(column1, label1, column2, label2, userId, fileId):
    unique_1 = sorted(set(column1))
    unique_2 = sorted(set(column2))
    contingency = np.zeros((len(unique_1), len(unique_2)))
    for i, a in enumerate(unique_1):
        for j, b in enumerate(unique_2):
            contingency[i, j] = sum(1 for x, y in zip(column1, column2) if x == a and y == b)

    fig, ax = plt.subplots(figsize=(8, 6))
    width = 0.35
    bars = []
    for j, b in enumerate(unique_2):
        if j == 0:
            bars.append(ax.bar(unique_1, contingency[:, j], width, label=b))
        else:
            bars.append(
                ax.bar(unique_1, contingency[:, j], width, bottom=np.sum(contingency[:, :j], axis=1), label=b))

    ax.set_xlabel(f'{label1}')
    ax.set_ylabel('Count')
    ax.set_title('Stacked Column Chart')

    ax.legend(loc='upper left', bbox_to_anchor=(1.05, 1), borderaxespad=0., title=label2)

    plt.tight_layout()
    graphs_directory = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'static', userId, fileId, 'graphs')
    existing_histograms = glob.glob(os.path.join(graphs_directory, f"{label1}_{label2}_cat_cat_stacked_*.png"))
    for histogram_path in existing_histograms:
        os.remove(histogram_path)
    os.makedirs(graphs_directory, exist_ok=True)
    file_name = f'{label1}_{label2}_cat_cat_stacked_{time()}.png'
    path = os.path.join(os.path.dirname(__file__), graphs_directory, file_name)
    plt.savefig(path)
    plt.clf()
    g_path = os.path.join(userId, fileId, 'graphs',file_name)
    g_path = g_path.replace("\\", "/")
    return g_path







