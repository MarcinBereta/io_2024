import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import chi2_contingency


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


def stacked_column_chart(column1, label1, column2, label2):
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
    plt.show()


# TODO
def combination_chart(column1, label1, column2, label2):
    unique1 = sorted(set(column1))
    unique_2 = sorted(set(column2))
    count_1 = [column1.count(a) for a in unique1]

    selected_category_percentage = []
    for category in unique1:
        selected_count = sum(1 for a, b in zip(column1, column2) if a == category and b == unique_2[0])
        selected_category_percentage.append(selected_count / count_1[unique1.index(category)] * 100)

    fig, ax1 = plt.subplots(figsize=(10, 6))

    color = 'tab:blue'
    ax1.set_xlabel(f'{label1}')
    ax1.set_ylabel('Count', color=color)
    ax1.bar(unique1, count_1, color=color)
    ax1.tick_params(axis='y', labelcolor=color)

    ax2 = ax1.twinx()
    color = 'tab:red'
    ax2.set_ylabel('Percentage of selected category', color=color)
    ax2.plot(unique1, selected_category_percentage, color=color, marker='o')
    ax2.tick_params(axis='y', labelcolor=color)

    ax2.set_ylim(0, 100)

    plt.title('Combination Chart')

    fig.tight_layout()
    plt.show()


arr1 = ['young', 'young', 'young', 'young', 'young', 'young', 'young', 'young', 'pre-presbyopic', 'pre-presbyopic', 'pre-presbyopic', 'pre-presbyopic', 'pre-presbyopic', 'pre-presbyopic', 'pre-presbyopic', 'pre-presbyopic', 'presbyopic', 'presbyopic', 'presbyopic', 'presbyopic', 'presbyopic', 'presbyopic', 'presbyopic', 'presbyopic']
arr2 = ['none', 'soft', 'none', 'hard', 'none', 'soft', 'none', 'hard', 'none', 'soft', 'none', 'hard', 'none', 'soft', 'none', 'none', 'none', 'none', 'none', 'hard', 'none', 'soft', 'none', 'none']


#stacked_column_chart(arr2, 'test2', arr1, 'test1')
#combination_chart(arr2, 'test2', arr1, 'test1')




