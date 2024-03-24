import numpy as np
from matplotlib import pyplot as plt


def chi2_test(column1, column2):
    pass


def stacked_column_chart(column1, column2):
    unique_categories1 = np.unique(column1)
    unique_categories2 = np.unique(column2)

    data_dict = {}
    for cat1 in unique_categories1:
        data_dict[cat1] = []
        for cat2 in unique_categories2:
            count = np.sum((column1 == cat1) & (column2 == cat2))
            data_dict[cat1].append(count)

    fig, ax = plt.subplots(figsize=(10, 6))
    width = 0.35
    ind = np.arange(len(unique_categories2))

    bars = []
    bottom = np.zeros(len(unique_categories2))
    for cat1 in unique_categories1:
        bars.append(ax.bar(ind, data_dict[cat1], width, bottom=bottom))
        bottom += data_dict[cat1]

    ax.set_xticks(ind)
    ax.set_xticklabels(unique_categories2)
    ax.legend(bars, unique_categories1)

    plt.tight_layout()
    plt.savefig('../../graphs/catcat_stacked_column_chart.png')
    plt.show()

#TODO
def combination_chart(columnn1, column2):
    pass


column1 = np.array(['Male', 'Male', 'Female', 'Male', 'Male', 'Female', 'Female', 'Female'])
column2 = np.array(['Red', 'Red', ' Blue', 'Blue', 'Purple', 'Orange', 'Red', 'Blue'])

#combination_chart(column1, column2)

stacked_column_chart(column1, column2)